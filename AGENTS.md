# 11 Interview (Mülakat Hazırlık ve Simülasyon) Mimarisi ve Kuralları

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

---

## Git Branch Model — `master` = production, `dev` = UAT  (MANDATORY)

Set by Umut on 2026-10-15. **This overrides any earlier branch or tagging
instruction in this file**, including "auto-bump and tag on every push".

| Branch | Meaning | Rule |
|---|---|---|
| `master` | **Production** — what is live / shipped right now | Never commit directly. Only released code is merged in. |
| `dev` | **UAT** — where development happens; always ahead of or equal to `master` | All work lands here. |

The branch name `main` is not used.

**The agent manages branch switching, commits, merges and tags itself — it does
not ask Umut which branch to work on.**

1. A code change is requested → if on `master`, **switch to `dev` immediately**.
   The change and the commit go to `dev`.
2. Builds and packages are produced from `dev`.
3. The moment it goes live — App Store approval, Vercel production, delivery to
   the client — merge `dev` into `master`.
4. Tag on `master`: `v<version>` (e.g. `v1.0`, `v1.1`). **A tag is only ever
   created for a version that actually shipped.** Never tag on every push.
5. Development continues on `dev`. After the merge, `dev` and `master` are equal.

If a merge conflict appears, stop and tell Umut — do not resolve it alone.

Full rule: `/Users/umut/ai-context/kurallar/git-dal-modeli-master-dev.md`
