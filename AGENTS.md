# Interview App (Mülakat Hazırlık ve Simülasyon) Mimarisi ve Kuralları

Bu proje; iOS, Android ve Web platformlarında çalışan, paylaşılan **Supabase** backend mimarisine sahip modern bir **Mülakat Hazırlık ve Simülasyon** uygulamasıdır.

## 🏗️ Teknoloji Yığını ve Platformlar
- **Ortak Backend (`backend/`):** Supabase (PostgreSQL 15+, Supabase Auth, Row Level Security, RPC functions, Realtime).
- **iOS Platformu (`ios/`):** Swift 5.10+, SwiftUI, iOS 17+ hedefi, `@Observable` Observation framework, Swift Concurrency (`async/await`), Clean Architecture.
- **Android Platformu (`android/`):** Kotlin, Jetpack Compose, Material 3, Coroutines/StateFlow, MVVM mimarisi.
- **Web Platformu (`web/`):** Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS.

## 🔒 Geliştirme ve Otomasyon Prensipleri
1. **Şahsi Proje İzolasyonu:** Bu proje `~/mycodespaces/` altında yer alan kişisel bir projedir. Şirket kodları veya verileri buraya asla dahil edilemez.
2. **Otomatik Commit & Push:** Görevler tamamlandığında `Umut Öçgüder <umutocgdr@gmail.com>` kimliğiyle standart commit mesajıyla (`feat: ...`, `fix: ...`, `chore: ...`) commit atılır ve GitHub Private reposuna (`origin main`) pushlanır.
3. **AI Handoff Ready Loglama:** Her mimari değişiklik ve geliştirme `WORKLOG.md` dosyasına güncel olarak işlenir.
