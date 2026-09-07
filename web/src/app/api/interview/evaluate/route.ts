import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP, RateLimitResult } from "@/lib/rate-limiter";

export interface EvaluationRequest {
  questionTitle: string;
  questionText: string;
  idealAnswer: string;
  keyPoints: string[];
  userAnswer: string;
  customApiKey?: string;
  language?: "tr" | "en";
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
    const { 
      questionTitle, 
      questionText, 
      idealAnswer, 
      keyPoints = [], 
      userAnswer, 
      customApiKey,
      language = "tr" 
    } = body;

    if (!userAnswer || userAnswer.trim().length < 5) {
      const errMsg = language === "en"
        ? "Please provide a meaningful interview answer (at least 5 characters)."
        : "Lütfen değerlendirme için anlamlı bir mülakat cevabı girin (en az 5 karakter).";
      return NextResponse.json(
        { error: errMsg },
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
        language,
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
          language,
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
      language,
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
    language?: "tr" | "en";
  }
): Promise<EvaluationResponse | null> {
  const isEn = data.language === "en";
  const prompt = isEn
    ? `
You are a senior software architect and technical interviewer. Evaluate the candidate's answer to the technical question below.
Question Title: ${data.questionTitle}
Question Text: ${data.questionText}
Reference Ideal Answer: ${data.idealAnswer}
Key Technical Points Expected: ${data.keyPoints.join(", ")}

Candidate's Answer:
"${data.userAnswer}"

Your task:
1. Score the answer from 0 to 100 (score: integer).
2. List strengths accurately covered by the candidate (strengths: array of strings).
3. List missing or improvable points (improvements: array of strings).
4. Provide a refined exemplary answer (suggestedAnswer: string).
5. Generate a deep technical follow-up interview question (followUpQuestion: string).

RESPOND ONLY WITH VALID JSON, without markdown formatting or additional explanation:
{
  "score": 85,
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "suggestedAnswer": "...",
  "followUpQuestion": "..."
}
`
    : `
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
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [isEn ? "Sound technical approach." : "Teknik yaklaşım anlaşılır."],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [isEn ? "Could provide more in-depth edge cases." : "Detaylar artırılabilir."],
    suggestedAnswer: parsed.suggestedAnswer || data.idealAnswer,
    followUpQuestion: parsed.followUpQuestion || (isEn ? "What are the scalability constraints under high concurrency?" : "Bu yaklaşımın yüksek yük altındaki kısıtları neler olurdu?"),
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
  language?: "tr" | "en";
}): EvaluationResponse {
  const isEn = data.language === "en";
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
    ? matchedPoints.map((p) => isEn 
        ? `Accurately touched upon "${p}" and core architectural principles.` 
        : `"${p}" konusuna ve mimari prensiplere doğru şekilde temas edilmiş.`)
    : [
        isEn ? "Clear effort to formulate technical concepts in your own words." : "Temel konsepti kendi cümlelerinizle özetleme çabası başarılı.",
        isEn ? "Fluent delivery suitable for a technical interview environment." : "Soruya verilen yanıt akıcı ve mülakat ortamına uygun.",
      ];

  const improvements = missedPoints.length > 0
    ? missedPoints.map((p) => isEn 
        ? `Could expand deeper into "${p}" with respect to performance and safety trade-offs.` 
        : `"${p}" başlığına ve performans/güvenlik etkilerine daha detaylı değinilebilir.`)
    : [
        isEn ? "Could illustrate edge cases, thread safety, or error recovery strategies." : "Mimarideki uç senaryolar (edge cases) ve hata yakalama stratejileri örneklendirilebilir.",
        isEn ? "Could reinforce the argument with actual production experience lessons." : "Endüstri standardı gerçek bir üretim tecrübesiyle argüman pekiştirilebilir.",
      ];

  const followUpQuestion = data.questionTitle.toLowerCase().includes("swift") || data.questionTitle.toLowerCase().includes("compose")
    ? (isEn ? "Which profiling tools would you utilize to detect retain cycles or memory leaks in this design?" : "Bu mimaride bellek yönetimi ve retain cycle/memory leak risklerini önlemek için hangi araçları kullanırsınız?")
    : (isEn ? "How would you address concurrency boundaries and race conditions when scaling this asynchronously?" : "Bunu dağıtık ve asenkron bir ortamda ölçeklerken yaşanabilecek concurrency kısıtlarını nasıl çözersiniz?");

  return {
    score: finalScore,
    strengths,
    improvements,
    suggestedAnswer: data.idealAnswer,
    followUpQuestion,
    provider: "smart-local-ai",
  };
}
