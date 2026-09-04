import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP, RateLimitResult } from "@/lib/rate-limiter";

export interface EvaluationRequest {
  questionTitle: string;
  questionText: string;
  idealAnswer: string;
  keyPoints: string[];
  userAnswer: string;
  customApiKey?: string;
}

export interface EvaluationResponse {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
  followUpQuestion: string;
  provider: "gemini-flash" | "smart-local-ai";
  rateLimitInfo?: {
    remaining: number;
    limit: number;
    isLimited: boolean;
    notice?: string;
  };
}

export async function POST(req: Request) {
  try {
    const body: EvaluationRequest = await req.json();
    const { questionTitle, questionText, idealAnswer, keyPoints = [], userAnswer, customApiKey } = body;

    if (!userAnswer || userAnswer.trim().length < 5) {
      return NextResponse.json(
        { error: "Lütfen değerlendirme için anlamlı bir mülakat cevabı girin (en az 5 karakter)." },
        { status: 400 }
      );
    }

    // Güvenlik: Maksimum metin uzunluğu denetimi (Gemini token şişirmesini önleme)
    const sanitizedAnswer = userAnswer.slice(0, 2000).trim();

    const clientIP = getClientIP(req);
    const hasCustomKey = Boolean(customApiKey && customApiKey.trim().length > 10);

    // Kendi API anahtarını getiren kullanıcı sınırsızdır
    let rateLimitResult: RateLimitResult = {
      allowed: true,
      remaining: 999,
      limit: 999,
      resetInSeconds: 0,
    };

    if (!hasCustomKey) {
      rateLimitResult = checkRateLimit(clientIP);
    }

    // Kota aşıldıysa veya spam tespit edildiyse:
    // Umut'un kredisini tüketmemek için doğrudan Akıllı Yerel Simülatör çalıştırılır ve kullanıcı bilgilendirilir.
    if (!rateLimitResult.allowed) {
      const localResult = evaluateLocally({
        questionTitle,
        questionText,
        idealAnswer,
        keyPoints,
        userAnswer: sanitizedAnswer,
      });

      return NextResponse.json({
        ...localResult,
        rateLimitInfo: {
          remaining: 0,
          limit: rateLimitResult.limit,
          isLimited: true,
          notice:
            rateLimitResult.reason ||
            "Günlük ücretsiz yapay zeka analiz kotanız doldu (3/3). Analiz yerel simülatör ile tamamlandı.",
        },
      });
    }

    const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const geminiResult = await evaluateWithGemini(apiKey, {
          questionTitle,
          questionText,
          idealAnswer,
          keyPoints,
          userAnswer: sanitizedAnswer,
        });

        if (geminiResult) {
          return NextResponse.json({
            ...geminiResult,
            rateLimitInfo: {
              remaining: rateLimitResult.remaining,
              limit: rateLimitResult.limit,
              isLimited: false,
            },
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini API çağrısı başarısız oldu, yerel AI motoruna geçiliyor:", geminiErr);
      }
    }

    // Akıllı Yerel Simülasyon Motoru (Fallback)
    const localResult = evaluateLocally({
      questionTitle,
      questionText,
      idealAnswer,
      keyPoints,
      userAnswer: sanitizedAnswer,
    });

    return NextResponse.json({
      ...localResult,
      rateLimitInfo: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
        isLimited: false,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Değerlendirme yapılamadı: " + (error?.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

// 1. Google Gemini Flash API Entegrasyonu
async function evaluateWithGemini(
  apiKey: string,
  data: {
    questionTitle: string;
    questionText: string;
    idealAnswer: string;
    keyPoints: string[];
    userAnswer: string;
  }
): Promise<EvaluationResponse | null> {
  const prompt = `
Sen kıdemli bir yazılım mimarı ve mülakatçısın. Aşağıdaki teknik soruya adayın verdiği cevabı değerlendir.
Soru Başlığı: ${data.questionTitle}
Soru Metni: ${data.questionText}
Referans İdeal Cevap: ${data.idealAnswer}
Kritik Başlıklar (Key Points): ${data.keyPoints.join(", ")}

Adayın Cevabı:
"${data.userAnswer}"

Görevin:
1. Cevabı 100 üzerinden puanla (score: integer).
2. Adayın doğru değindiği güçlü yönleri sırala (strengths: dizi).
3. Eksik bıraktığı veya geliştirmesi gereken noktaları belirt (improvements: dizi).
4. İdeal ifade örneği ver (suggestedAnswer: string).
5. Konuyu bir adım ileriye taşıyan teknik bir devam/derinleşme sorusu üret (followUpQuestion: string).

LÜTFEN SADECE VE SADECE GEÇERLİ BİR JSON YANITI DÖNDÜR, markdown blokları veya ekstra metin olmasın:
{
  "score": 85,
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "suggestedAnswer": "...",
  "followUpQuestion": "..."
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API HTTP Error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(text);
  return {
    score: Math.min(100, Math.max(0, Number(parsed.score) || 75)),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Teknik yaklaşım anlaşılır."],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Detaylar artırılabilir."],
    suggestedAnswer: parsed.suggestedAnswer || data.idealAnswer,
    followUpQuestion: parsed.followUpQuestion || "Bu yaklaşımın yüksek yük altındaki kısıtları neler olurdu?",
    provider: "gemini-flash",
  };
}

// 2. Akıllı Yerel Simülasyon Motoru (Smart Local AI Fallback)
function evaluateLocally(data: {
  questionTitle: string;
  questionText: string;
  idealAnswer: string;
  keyPoints: string[];
  userAnswer: string;
}): EvaluationResponse {
  const answerLower = data.userAnswer.toLowerCase();
  let matchedPoints: string[] = [];
  let missedPoints: string[] = [];

  for (const point of data.keyPoints) {
    const pointWords = point.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const hasMatch = pointWords.some((w) => answerLower.includes(w));
    if (hasMatch) {
      matchedPoints.push(point);
    } else {
      missedPoints.push(point);
    }
  }

  const lengthScore = Math.min(30, Math.floor(data.userAnswer.trim().split(/\s+/).length * 1.5));
  const keywordScore = data.keyPoints.length > 0 
    ? Math.floor((matchedPoints.length / data.keyPoints.length) * 50) 
    : 35;
  const baseScore = 20;
  const finalScore = Math.min(95, Math.max(45, baseScore + lengthScore + keywordScore));

  const strengths = matchedPoints.length > 0
    ? matchedPoints.map((p) => `"${p}" konusuna ve mimari prensiplere doğru şekilde temas edilmiş.`)
    : [
        "Temel konsepti kendi cümlelerinizle özetleme çabası başarılı.",
        "Soruya verilen yanıt akıcı ve mülakat ortamına uygun.",
      ];

  const improvements = missedPoints.length > 0
    ? missedPoints.map((p) => `"${p}" başlığına ve performans/güvenlik etkilerine daha detaylı değinilebilir.`)
    : [
        "Mimarideki uç senaryolar (edge cases) ve hata yakalama stratejileri örneklendirilebilir.",
        "Endüstri standardı gerçek bir üretim tecrübesiyle argüman pekiştirilebilir.",
      ];

  const followUpQuestion = data.questionTitle.toLowerCase().includes("swift") || data.questionTitle.toLowerCase().includes("compose")
    ? "Bu mimaride bellek yönetimi ve retain cycle/memory leak risklerini önlemek için hangi araçları kullanırsınız?"
    : "Bunu dağıtık ve asenkron bir ortamda ölçeklerken yaşanabilecek concurrency kısıtlarını nasıl çözersiniz?";

  return {
    score: finalScore,
    strengths,
    improvements,
    suggestedAnswer: data.idealAnswer,
    followUpQuestion,
    provider: "smart-local-ai",
  };
}
