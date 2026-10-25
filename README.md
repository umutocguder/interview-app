<!-- Created by 11Hopem -->
# 🎙️ 11Interview — Multi-Platform Tech Interview Preparation Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15%20(App%20Router)-black.svg?logo=next.js)](https://nextjs.org)
[![SwiftUI](https://img.shields.io/badge/iOS-SwiftUI%20(iOS%2017+)-orange.svg?logo=swift)](https://developer.apple.com/xcode/swiftui/)
[![Jetpack Compose](https://img.shields.io/badge/Android-Jetpack%20Compose-green.svg?logo=android)](https://developer.android.com/jetpack/compose)
[![Backend](https://img.shields.io/badge/backend-Supabase%20Postgres-emerald.svg?logo=supabase)](https://supabase.com)
[![Created by 11Hopem](https://img.shields.io/badge/created%20by-11Hopem-orange.svg)](https://11hopem.com)

A production-grade, multi-platform technical interview preparation and mock simulation platform. Features native clients for **iOS (SwiftUI)**, **Android (Jetpack Compose)**, and **Web (Next.js 15 App Router)**, all synchronized via a single **Supabase** cloud backend with PostgreSQL, Row Level Security, and automated scoring heuristics.

---

## 🏗️ Architecture & Tech Stack

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│     Web App      │    │     iOS App      │    │   Android App    │
│ Next.js 15 / TS  │    │  SwiftUI 17+ /   │    │ Jetpack Compose  │
│  Tailwind CSS    │    │   Concurrency    │    │   Material 3     │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │ HTTPS / WebSockets
                                 ▼
                     ┌───────────────────────┐
                     │   Supabase Backend    │
                     │  • PostgreSQL + RLS   │
                     │  • Auth & User States │
                     │  • Dynamic Question   │
                     │    Bank & Heuristics  │
                     └───────────────────────┘
```

---

## 🌟 Key Features

- **Categorized Question Bank**: Deep technical questions covering iOS (Swift/SwiftUI), Android (Kotlin/Compose), Frontend (React/TypeScript), Backend (Go, Python, Node.js), System Design, and Algorithms.
- **Timed Mock Interview Mode**: Realistic mock sessions with countdown timers, answer recording, instant feedback, and scoring analytics.
- **Adaptive Difficulty**: Questions adjust dynamically across Junior, Mid, and Senior tiers based on user progression.
- **Unified Progress Tracking**: Seamless cross-device synchronization of solved questions, favorite bookmarks, and performance radar charts.
- **Offline Mode Support**: Local SQLite/SwiftData caching ensures uninterrupted study even without network connectivity.

---

## 📁 Repository Structure

```
interview-app/
├── backend/            # Supabase database schema, migrations, seed questions & RLS policies
├── ios/                # Native iOS application (SwiftUI, Clean Architecture, @Observable)
├── android/            # Native Android application (Kotlin, Jetpack Compose, Coroutines/StateFlow)
├── web/                # Next.js 15 (App Router, React 19, TypeScript, Tailwind CSS)
└── tests/              # Multi-tier automated test suite
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Xcode 15+](https://developer.apple.com/xcode/) (for iOS client)
- [Android Studio Iguana+](https://developer.android.com/studio) (for Android client)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 1. Clone Repository

```bash
git clone https://github.com/umutocguder/interview-app.git
cd interview-app
```

### 2. Configure Backend

```bash
cd backend
supabase start
supabase db reset # Applies migrations and seeds initial interview questions
```

### 3. Run Web Client

```bash
cd web
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run iOS Client

Open `ios/InterviewApp.xcodeproj` in Xcode and hit `Cmd + R`.

### 5. Run Android Client

Open the `android/` folder in Android Studio and run on your emulator or physical device.

---

## 🛡️ License & Attribution

Created by [11Hopem](https://11hopem.com).  
Copyright © 2026 11Hopem. All rights reserved.  
Official website: [https://11hopem.com](https://11hopem.com)
