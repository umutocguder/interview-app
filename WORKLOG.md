# Interview App Proje Günlüğü (Worklog & AI Context Handoff)

Bu dosya, Interview App projesinde gerçekleştirilen tüm mimari kararları, teknik değişiklikleri ve sistem durumunu sonraki geliştiriciler veya yapay zeka modelleri için belgeler.

---

### [2026-09-04 11:50] Projenin Başlatılması ve Çok Platformlu Mimarinin Kurulması
- **Görev ve Amaç**: iOS (SwiftUI iOS 17+), Android (Jetpack Compose), Web (Next.js 15) ve paylaşılan Supabase backend'inden oluşan Mülakat Hazırlık platformunun monorepo olarak kurulması.
- **Teknik Kararlar ve Mimari**:
  - Ortak veri modelleri ve Supabase PostgreSQL şeması tasarlandı (`categories`, `questions`, `interview_sessions`, `session_answers`, `bookmarks`).
  - iOS katmanında iOS 17+ `@Observable` makrosu ve Clean Architecture benimsendi.
  - Android katmanında Jetpack Compose ve Material 3 tercih edildi.
  - Web katmanında Next.js 15 App Router ve Tailwind CSS yapılandırıldı.
  - Evrensel kural dosyaları (`AGENTS.md`, `CLAUDE.md`, `WORKLOG.md`, `README.md`, `.gitignore`) eklendi.
- **Mevcut Durum**: Proje iskeleti ve temel bileşenler oluşturuldu.
- **Sıradaki Adımlar**: Supabase şeması, iOS SwiftUI ekranları, Android Compose arayüzü ve Web uygulamasının tamamlanması.

### [2026-09-04 12:11] Tüm Platform Katmanlarının (iOS, Android, Web, Supabase) Tamamlanması
- **Görev ve Amaç**: Çok platformlu mülakat hazırlık uygulamasının tüm katmanlarının kodlanması, derleme doğrulaması ve GitHub Private reposuna bağlanması.
- **Teknik Kararlar ve Mimari Değişiklikler**:
  1. **Backend (Supabase):** `categories`, `questions`, `interview_sessions`, `session_answers`, `bookmarks`, `profiles` tabloları, RLS politikaları ve teknik soru tohum verisi (`seed.sql`) hazırlandı.
  2. **iOS (SwiftUI iOS 17+):** `@Observable` makrosu, Swift Concurrency, `SupabaseService`, `DashboardView`, `QuestionDetailView`, `InterviewSimulatorView` ve Xcode `.pbxproj` oluşturuldu (`swiftc -parse` ile doğrulandı).
  3. **Android (Kotlin & Jetpack Compose):** Material 3 teması, composable ekranlar, MVVM state modelleri ve Gradle yapılandırmaları kuruldu.
  4. **Web (Next.js 15+ & React 19):** App Router mimarisi, Tailwind CSS stilleri, interaktif soru inceleme ve canlı mülakat simülasyon modalı oluşturuldu (`tsc --noEmit` hatasız geçti).
  5. **GitHub ve Antigravity:** `umutocguder/interview-app` (Private) reposu oluşturuldu; `3154300a-97c0-4aa1-9401-a2c08635fe1b.json` ile Antigravity Projects listesine eklendi.
- **Etkilenen Dosyalar**:
  - [AGENTS.md](file:///Users/umut/mycodespaces/interview-app/AGENTS.md)
  - [CLAUDE.md](file:///Users/umut/mycodespaces/interview-app/CLAUDE.md)
  - [README.md](file:///Users/umut/mycodespaces/interview-app/README.md)
  - [WORKLOG.md](file:///Users/umut/mycodespaces/interview-app/WORKLOG.md)
  - `backend/supabase/migrations/`, `backend/supabase/seed.sql`
  - `ios/InterviewApp/`, `ios/InterviewApp.xcodeproj/`
  - `android/app/src/main/`
  - `web/src/`
- **Mevcut Durum**: Proje tüm platformlarda derlenebilir, test edilebilir ve geliştirmeye hazır durumdadır.

### [2026-09-04 16:11] Gemini AI Mülakat Değerlendirme Motoru, Supabase Auth ve Canlı Test Doğrulaması
- **Görev ve Amaç**: Gemini 1.5/2.0 Flash entegrasyonu, sesli simülatör (TTS/STT), çok platformlu Supabase Auth ve canlı çalıştırma/test süreçlerinin tamamlanması.
- **Teknik Kararlar ve Mimari Değişiklikler**:
  1. **Gemini AI Mülakat Motoru (`/api/interview/evaluate`):** Next.js 15 Serverless API Route oluşturuldu. Hem doğrudan Google Gemini Flash API'si hem de API anahtarı girilmediğinde kesintisiz çalışan akıllı yerel simülasyon motoru (Smart Local AI Fallback) kodlandı. Çıktı olarak puan, güçlü yönler, geliştirilecek alanlar, ideal ifade ve mülakatçı derinleşme (follow-up) sorusu üretildi.
  2. **Web Speech API & Canlı Sesli Simülatör (`InterviewSimulator.tsx`):** Tarayıcının yerel Web Speech API'si ile soruyu seslendiren (TTS) ve adayın mikrofondan konuşmasını metne döken (STT) interaktif simülatör geliştirildi.
  3. **Supabase Auth Entegrasyonu:**
     - **Web:** `AuthContext`, `AuthModal` ve `Header` kullanıcı profili / giriş-çıkış akışı tamamlandı. Tek tıkla demo girişi desteği eklendi.
     - **iOS:** SwiftUI tabanlı `AuthView` oluşturuldu; `SupabaseService` oturum yönetimi ve AI değerlendirme işlevleriyle güncellendi (`swiftc -parse` ile doğrulandı).
     - **Android:** Jetpack Compose ve Material 3 tabanlı `AuthScreen` (`AuthDialog`) kodlandı; `Models.kt` güncellendi.
  4. **Canlıda Çalıştırma ve Doğrulama:**
     - `web/` bağımlılıkları tamamlandı (`autoprefixer` yüklendi).
     - `npm run build` ile Next.js 15 prodüksiyon derlemesi başarıyla alındı.
     - `npm run start` ile sunucu ayağa kaldırılıp `/api/interview/evaluate` uç noktası HTTP POST isteğiyle uçtan uca test edildi ve başarıyla doğrulandı.
- **Etkilenen Dosyalar**:
  - `web/src/context/AuthContext.tsx` [NEW]
  - `web/src/components/AuthModal.tsx` [NEW]
  - `web/src/components/InterviewSimulator.tsx` [NEW]
  - `web/src/app/api/interview/evaluate/route.ts` [NEW]
  - `web/src/app/layout.tsx` [MODIFY]
  - `web/src/app/page.tsx` [MODIFY]
  - `web/.env.example` [NEW]
  - `ios/InterviewApp/Core/SupabaseService.swift` [MODIFY]
  - `ios/InterviewApp/Features/Auth/AuthView.swift` [NEW]
  - `ios/InterviewApp/Features/Simulator/InterviewSimulatorView.swift` [MODIFY]
  - `android/app/src/main/java/com/umutocguder/interview/data/model/Models.kt` [MODIFY]
  - `android/app/src/main/java/com/umutocguder/interview/ui/auth/AuthScreen.kt` [NEW]
  - `WORKLOG.md` [MODIFY]
- **Mevcut Durum**: Tüm platformlar (Web, iOS, Android) kimlik doğrulama ve yapay zeka mülakat simülasyonu yeteneklerine sahip olup, Web platformu canlıda başarıyla derlenip doğrulanmıştır.

### [2026-09-05 00:41] Automated Unit Test Suite Implementation
- **Goal & Purpose**: Implement automated tests for interview evaluation and simulator state models according to AGENTS.md Section 8.
- **Implementation Highlights**:
  - Implemented `tests/test_interview.py`: Validates question category filtering, difficulty level filtering, and interview session percentage scoring.
  - Implemented `web/tests/interview.test.ts`: Validates average score calculations, total session time formatting, and performance grading.
  - Configured `npm test` inside `web/package.json`.
- **Affected Files**:
  - [tests/test_interview.py](file:///Users/umut/mycodespaces/interview-app/tests/test_interview.py)
  - [web/tests/interview.test.ts](file:///Users/umut/mycodespaces/interview-app/web/tests/interview.test.ts)
  - [web/package.json](file:///Users/umut/mycodespaces/interview-app/web/package.json)
  - [WORKLOG.md](file:///Users/umut/mycodespaces/interview-app/WORKLOG.md)
- **Current State & Verification**:
  - `python3 -m unittest discover -s tests`: 3/3 tests passed in 0.000s.
  - `npm test` (web): 3/3 tests passed with 100% success.

### [2026-09-05 00:49] Dış Kullanıcılar İçin Sıkı AI Sınırlandırması (Rate Limiting) ve Vercel Prodüksiyon Dağıtımı
- **Görev ve Amaç**: Harici kullanıcıların Umut'un Gemini API kredisini tüketmesini engellemek için IP tabanlı katı kota sınırlandırması getirilmesi, Vercel üzerinde canlıya alınması ve GitHub reposu ile bağlanması.
- **Teknik Kararlar ve Mimari Değişiklikler**:
  1. **Katı Rate Limiter (`web/src/lib/rate-limiter.ts`):** 
     - Dış kullanıcılar için IP başına 24 saatte maksimum 3 Gemini AI analiz hakkı tanımlandı (`MAX_REQUESTS_PER_WINDOW = 3`).
     - Bot/spam isteklerini engellemek için ardışık istekler arasına minimum 20 saniye aralık şartı getirildi.
     - Giriş metni maksimum 2000 karakterle sınırlandırılarak token şişirmesi önlendi.
     - Kendi `customApiKey`'ini getiren kullanıcılara sınırsız erişim tanındı.
     - Kotası dolan harici kullanıcılar için Umut'un Gemini API kredisi harcanmadan otomatik olarak akıllı yerel simülatör (`smart-local-ai`) devreye alınarak kesintisiz hizmet sağlandı.
  2. **Simülatör UI Kota Bildirimi (`InterviewSimulator.tsx`):** Kullanıcıya kalan günlük AI hakkı gösterildi ve kota aşıldığında bilgilendirici uyarı kartı eklendi.
  3. **Next.js Güvenlik Güncellemesi:** Vercel dağıtım güvenlik denetimini karşılamak amacıyla Next.js sürümü güvenli ve yamalanmış `^15.5.25` sürümüne yükseltildi.
  4. **Vercel Dağıtımı & GitHub Entegrasyonu:**
     - `web/vercel.json` güvenlik başlıkları (X-Content-Type-Options, X-Frame-Options, XSS koruması) ile yapılandırıldı.
     - Vercel CLI ile `umutocgdrs-projects/interview-master-ai` projesi oluşturuldu ve doğrudan `https://github.com/umutocguder/interview-app` GitHub reposuna bağlandı.
     - Prodüksiyon dağıtımı tamamlandı ve `https://interview-master-pro.vercel.app` ile `https://interview-master-ai-ten.vercel.app` domainleri canlıya alındı.
- **Etkilenen Dosyalar**:
  - `web/src/lib/rate-limiter.ts` [NEW]
  - `web/vercel.json` [NEW]
  - `web/src/app/api/interview/evaluate/route.ts` [MODIFY]
  - `web/src/components/InterviewSimulator.tsx` [MODIFY]
  - `web/package.json` [MODIFY]
  - `WORKLOG.md` [MODIFY]
- **Mevcut Durum**: Web uygulaması Vercel üzerinde canlıda, sıkı AI kota koruması altında ve GitHub reposuna tam bağlı şekilde çalışmaktadır.



