# Interview App — Çok Platformlu Mülakat Hazırlık & Simülasyon Platformu

Modern yazılım geliştiricileri ve adaylar için tasarlanmış; iOS, Android ve Web üzerinde çalışan, ortak **Supabase** bulut altyapısına bağlı uçtan uca mülakat hazırlık uygulaması.

---

## 📱 Platformlar ve Teknolojiler

- **iOS:** **SwiftUI**, **iOS 17+**, `@Observable`, Swift Concurrency, Clean Architecture.
- **Android:** **Kotlin**, **Jetpack Compose**, **Material 3**, Coroutines, StateFlow, MVVM.
- **Web:** **Next.js 15+ (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**.
- **Backend:** **Supabase** (PostgreSQL, Auth, Row Level Security, RPC functions).

---

## 📁 Dizin Yapısı

```text
interview-app/
├── backend/               <-- Supabase şemaları, migration'lar ve soru tohum verisi
├── ios/                   <-- iOS 17+ SwiftUI yerel projesi
├── android/               <-- Android Jetpack Compose yerel projesi
├── web/                   <-- Next.js 15 App Router web projesi
├── AGENTS.md              <-- Yapay zeka ve geliştirici standartları
├── CLAUDE.md              <-- Claude Code senkronizasyonu
├── WORKLOG.md             <-- AI Handoff Ready gelişim günlüğü
└── README.md
```

---

## 🚀 Başlangıç ve Çalıştırma

### 1. Backend (Supabase)
`backend/supabase/migrations/` altındaki SQL dosyaları Supabase paneline veya yerel Supabase CLI'a uygulanabilir:
```bash
# Soru tohum verilerini yüklemek için:
# backend/supabase/seed.sql dosyasını Supabase SQL Editöründe çalıştırın.
```

### 2. Web Uygulaması (Next.js)
```bash
cd web
npm install
npm run dev
```

### 3. iOS Uygulaması (SwiftUI)
```bash
cd ios
open InterviewApp.xcodeproj
```

### 4. Android Uygulaması (Jetpack Compose)
Android Studio ile `android/` dizinini açıp çalıştırabilirsiniz.
