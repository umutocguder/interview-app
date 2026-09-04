export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetInSeconds: number;
  reason?: string;
}

interface IPRecord {
  count: number;
  firstRequestTime: number;
  lastRequestTime: number;
}

// Bellek içi IP bazlı hız sınırlandırma (Serverless instance içinde hızlı ve etkili)
const ipStore = new Map<string, IPRecord>();

const MAX_REQUESTS_PER_WINDOW = 3; // 24 saatte maksimum 3 Gemini AI analizi
const WINDOW_DURATION_MS = 24 * 60 * 60 * 1000; // 24 saat (milisaniye)
const MIN_INTERVAL_MS = 20 * 1000; // İstekler arası minimum 20 saniye

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const record = ipStore.get(ip);

  // Eski kayıtları temizle (Memory leak önleme)
  if (ipStore.size > 10000) {
    for (const [key, val] of ipStore.entries()) {
      if (now - val.firstRequestTime > WINDOW_DURATION_MS) {
        ipStore.delete(key);
      }
    }
  }

  if (!record) {
    ipStore.set(ip, {
      count: 1,
      firstRequestTime: now,
      lastRequestTime: now,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      limit: MAX_REQUESTS_PER_WINDOW,
      resetInSeconds: Math.ceil(WINDOW_DURATION_MS / 1000),
    };
  }

  // 24 saat dolmuşsa pencereyi sıfırla
  if (now - record.firstRequestTime > WINDOW_DURATION_MS) {
    ipStore.set(ip, {
      count: 1,
      firstRequestTime: now,
      lastRequestTime: now,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      limit: MAX_REQUESTS_PER_WINDOW,
      resetInSeconds: Math.ceil(WINDOW_DURATION_MS / 1000),
    };
  }

  // Spam ve ardışık bot isteklerini engelle (20 saniye kuralı)
  if (now - record.lastRequestTime < MIN_INTERVAL_MS) {
    const waitSeconds = Math.ceil((MIN_INTERVAL_MS - (now - record.lastRequestTime)) / 1000);
    return {
      allowed: false,
      remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - record.count),
      limit: MAX_REQUESTS_PER_WINDOW,
      resetInSeconds: waitSeconds,
      reason: `Çok hızlı istek gönderdiniz. Lütfen ${waitSeconds} saniye bekleyin.`,
    };
  }

  // Günlük kota kontrolü
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetTime = Math.ceil((WINDOW_DURATION_MS - (now - record.firstRequestTime)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      limit: MAX_REQUESTS_PER_WINDOW,
      resetInSeconds: resetTime,
      reason: "Günlük ücretsiz yapay zeka analiz kotanız doldu (3/3).",
    };
  }

  // Kotadan düş ve güncelle
  record.count += 1;
  record.lastRequestTime = now;
  ipStore.set(ip, record);

  const resetTime = Math.ceil((WINDOW_DURATION_MS - (now - record.firstRequestTime)) / 1000);
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    limit: MAX_REQUESTS_PER_WINDOW,
    resetInSeconds: resetTime,
  };
}

// İstemci IP adresini güvenli biçimde çıkar
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}
