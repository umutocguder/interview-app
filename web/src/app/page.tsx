"use client";

import { useState, useMemo } from "react";
import { 
  Terminal, 
  Smartphone, 
  Globe, 
  Database, 
  Layers, 
  Play, 
  CheckCircle2, 
  Eye, 
  Bookmark, 
  Sparkles, 
  User, 
  LogOut, 
  LogIn, 
  Search, 
  Star, 
  Filter, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Box, 
  Zap,
  Volume2
} from "lucide-react";
import { Category, Question, Language, getQuestionContent } from "@/lib/types";
import { getTranslation } from "@/lib/i18n";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import InterviewSimulator from "@/components/InterviewSimulator";
import { SWIFT_MASTER_QUESTIONS } from "@/data/swift-questions";

const BASE_OTHER_QUESTIONS: Question[] = [
  {
    id: "and-1",
    difficulty: "mid",
    q_type: "technical",
    tags: ["Android", "Kotlin", "Compose"],
    tr: {
      title: "Jetpack Compose: Recomposition ve State Hoisting",
      question_text: "Compose'da Recomposition nedir? State Hoisting prensibi neden uygulanmalıdır ve performansa etkisi nedir?",
      ideal_answer: "Recomposition, state değiştiğinde composable fonksiyonun yeniden çalışmasıdır. State Hoisting ile bileşen stateless yapılır; bu da test edilebilirliği, tekrar kullanımı ve önizleme kolaylığını maksimize eder.",
      hints: ["Stateless bileşenlerin avantajlarını düşünün."],
      key_points: ["Stateless bileşenler", "Tek yönlü veri akışı (UDF)", "Test edilebilirlik"],
    },
    en: {
      title: "Jetpack Compose: Recomposition and State Hoisting",
      question_text: "What is Recomposition in Jetpack Compose? Why should State Hoisting be strictly applied, and what is its performance impact?",
      ideal_answer: "Recomposition is the execution cycle where composable functions re-run when state changes. State hoisting separates state ownership from presentation, creating stateless components that maximize testability and avoid redundant recompositions.",
      hints: ["Consider the benefits of stateless composables."],
      key_points: ["Stateless composables", "Unidirectional Data Flow (UDF)", "Testability & Reusability"],
    }
  },
  {
    id: "web-1",
    difficulty: "mid",
    q_type: "technical",
    tags: ["Next.js", "React", "TypeScript"],
    tr: {
      title: "Next.js 15: Server Components vs Client Components",
      question_text: "Server Components (RSC) ile Client Components arasındaki farklar nelerdir? 'use client' ne zaman gereklidir?",
      ideal_answer: "Server Components istemciye sıfır JS bundle boyutu gönderir ve doğrudan sunucu kaynaklarına erişir. Client Components ise tarayıcı etkileşimi (onClick, useState vb.) gerektiğinde kullanılır.",
      hints: ["Sıfır bundle boyutunu ve sunucu erişimini vurgulayın."],
      key_points: ["Sıfır JS bundle katkısı", "use client ile etkileşim ayrıştırma", "SEO avantajı"],
    },
    en: {
      title: "Next.js 15: Server Components vs Client Components",
      question_text: "What are the core architectural differences between React Server Components (RSC) and Client Components in Next.js 15? When is 'use client' mandatory?",
      ideal_answer: "Server Components produce zero client JavaScript bundle overhead and have direct backend access. Client Components introduce browser interactivity (hooks, state, listeners) via the explicit 'use client' boundary.",
      hints: ["Highlight zero bundle size and server resource locality."],
      key_points: ["Zero client JS bundle overhead", "Client boundary separation with 'use client'", "SEO and streaming SSR"],
    }
  },
  {
    id: "db-1",
    difficulty: "senior",
    q_type: "technical",
    tags: ["PostgreSQL", "Supabase", "RLS"],
    tr: {
      title: "PostgreSQL: İndeksleme ve Row Level Security (RLS) Performansı",
      question_text: "Supabase ve PostgreSQL üzerinde RLS politikaları uygularken sorguların yavaşlamasını engellemek için nelere dikkat edilmelidir?",
      ideal_answer: "auth.uid() gibi fonksiyon çağrıları SELECT sorgularında tekrarlanmamalıdır (STABLE / IMMUTABLE sarmalama veya alt sorgu kullanımı). İlgili yabancı anahtar ve kullanıcı ID sütunlarına B-Tree indeksler eklenmelidir.",
      hints: ["auth.uid() sarmalaması", "Indexleme stratejisi"],
      key_points: ["B-Tree indeksleme", "Subquery optimizasyonu", "Cache mekanizmaları"],
    },
    en: {
      title: "PostgreSQL: Indexing and Row Level Security (RLS) Performance",
      question_text: "When implementing Row Level Security (RLS) policies in PostgreSQL and Supabase, what indexing and query architecture practices prevent severe slowdowns?",
      ideal_answer: "Avoid per-row scalar execution of auth.uid() by caching it via `(select auth.uid())` subqueries or STABLE functions, and create B-Tree indexes on user foreign key columns referenced in RLS filter conditions.",
      hints: ["Subquery evaluation of auth.uid()", "Index strategy on tenant columns"],
      key_points: ["B-Tree indexing on tenant keys", "Subquery evaluation cache", "Avoiding full table scans in RLS"],
    }
  }
];

const ALL_QUESTIONS: Question[] = [...SWIFT_MASTER_QUESTIONS, ...BASE_OTHER_QUESTIONS];

interface CategoryFilterItem {
  id: string;
  trName: string;
  enName: string;
  icon: any;
  badge?: string;
  trDesc: string;
  enDesc: string;
}

const CATEGORY_TABS: CategoryFilterItem[] = [
  { id: "all", trName: "Tüm Sorular", enName: "All Questions", icon: Layers, trDesc: "Tüm platformlar ve diller", enDesc: "All platforms and categories" },
  { id: "swift-all", trName: "🍏 Swift & iOS Master", enName: "🍏 Swift & iOS Master", icon: AppleIcon, badge: "Master", trDesc: "Umut'un Özel Mülakat Notları", enDesc: "Umut's Master Apple Notes" },
  { id: "swift-ui", trName: "SwiftUI & State", enName: "SwiftUI & State", icon: Box, trDesc: "StateObject, ViewTree, Render", enDesc: "StateObject, ViewTree, Render cycle" },
  { id: "swift-concurrency", trName: "Concurrency & GCD", enName: "Concurrency & GCD", icon: Cpu, trDesc: "Async/await, Actors, Queues, Semaphore", enDesc: "Async/await, Actors, Queues, Semaphore" },
  { id: "swift-arc", trName: "ARC & Bellek", enName: "ARC & Memory", icon: Zap, trDesc: "Stack/Heap, Weak/Unowned, COW", enDesc: "Stack/Heap, Weak/Unowned, COW" },
  { id: "swift-arch", trName: "Mimari & VIPER", enName: "Architecture & VIPER", icon: BookOpen, trDesc: "VIPER, MVVM, Coordinator, DI", enDesc: "VIPER, MVVM, Coordinator, DI" },
  { id: "swift-uikit", trName: "UIKit & Lifecycle", enName: "UIKit & Lifecycle", icon: Smartphone, trDesc: "ViewController Lifecycle, AutoLayout", enDesc: "ViewController Lifecycle, AutoLayout" },
  { id: "swift-sec", trName: "Güvenlik & APNs", enName: "Security & APNs", icon: ShieldCheck, trDesc: "Keychain, SSL Pinning, Push", enDesc: "Keychain, SSL Pinning, Push" },
  { id: "swift-test", trName: "Test & Instruments", enName: "Testing & Instruments", icon: Activity, trDesc: "XCTest, Scroll Jank, Leaks", enDesc: "XCTest, Scroll Jank, Leaks" },
  { id: "android", trName: "Android & Kotlin", enName: "Android & Kotlin", icon: Smartphone, trDesc: "Compose & Coroutines", enDesc: "Compose & Coroutines" },
  { id: "web", trName: "Web & Next.js", enName: "Web & Next.js", icon: Globe, trDesc: "Next.js 15 & React 19", enDesc: "Next.js 15 & React 19" },
  { id: "backend", trName: "Backend & DB", enName: "Backend & DB", icon: Database, trDesc: "Supabase & Postgres", enDesc: "Supabase & Postgres" },
];

function AppleIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-.99 1.73-.87 2.76.99.08 2.01-.51 2.6-1.26z"/>
    </svg>
  );
}

export default function Home() {
  const { user, signOut, isDemoUser } = useAuth();
  const [lang, setLang] = useState<Language>("tr");
  const t = getTranslation(lang);
  const [selectedCategory, setSelectedCategory] = useState<string>("swift-all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});
  const [showSimulator, setShowSimulator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Dinamik Filtreleme
  const filteredQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter(q => {
      // 1. Kategori Filtresi
      if (selectedCategory === "swift-all") {
        const isSwift = q.tags.some(t => ["Swift", "SwiftUI", "UIKit", "iOS", "Concurrency", "ARC", "VIPER", "GCD", "Memory", "Keychain", "XCTest", "Instruments"].includes(t));
        if (!isSwift) return false;
      } else if (selectedCategory === "swift-ui") {
        if (!q.tags.includes("SwiftUI")) return false;
      } else if (selectedCategory === "swift-concurrency") {
        if (!q.tags.some(t => ["Concurrency", "GCD", "Actors", "Threading", "Strict Concurrency"].includes(t))) return false;
      } else if (selectedCategory === "swift-arc") {
        if (!q.tags.some(t => ["ARC", "Memory", "Stack", "Heap", "COW", "Retain"].includes(t))) return false;
      } else if (selectedCategory === "swift-arch") {
        if (!q.tags.some(t => ["Architecture", "VIPER", "Coordinator", "DesignPatterns", "DependencyInjection", "SOLID"].includes(t))) return false;
      } else if (selectedCategory === "swift-uikit") {
        if (!q.tags.some(t => ["UIKit", "AutoLayout", "Lifecycle", "Frame", "Bounds"].includes(t))) return false;
      } else if (selectedCategory === "swift-sec") {
        if (!q.tags.some(t => ["Security", "Keychain", "SSLPinning", "Networking"].includes(t))) return false;
      } else if (selectedCategory === "swift-test") {
        if (!q.tags.some(t => ["Testing", "XCTest", "Instruments", "Performance"].includes(t))) return false;
      } else if (selectedCategory === "android") {
        if (!q.tags.includes("Android")) return false;
      } else if (selectedCategory === "web") {
        if (!q.tags.includes("Next.js") && !q.tags.includes("React")) return false;
      } else if (selectedCategory === "backend") {
        if (!q.tags.includes("PostgreSQL") && !q.tags.includes("Supabase")) return false;
      }

      // 2. Zorluk Seviyesi Filtresi
      if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter) {
        return false;
      }

      // 3. Sadece Yıldızlılar
      if (onlyBookmarks && !bookmarkedIds[q.id]) {
        return false;
      }

      // 4. Arama Sorgusu (İki dilde de aranabilir)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const content = getQuestionContent(q, lang);
        const inTitle = content.title.toLowerCase().includes(query) || q.tr.title.toLowerCase().includes(query) || q.en.title.toLowerCase().includes(query);
        const inText = content.question_text.toLowerCase().includes(query) || q.tr.question_text.toLowerCase().includes(query) || q.en.question_text.toLowerCase().includes(query);
        const inTags = q.tags.some(t => t.toLowerCase().includes(query));
        const inKeys = content.key_points.some(k => k.toLowerCase().includes(query));
        if (!inTitle && !inText && !inTags && !inKeys) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, difficultyFilter, onlyBookmarks, bookmarkedIds, searchQuery, lang]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white p-2 rounded-xl">
              <Terminal className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t.appName}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                {t.appTagline}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* TR / EN Dil Seçici */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setLang("tr")}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                lang === "tr" 
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              🇹🇷 TR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                lang === "en" 
                  ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-1.5 px-3 rounded-xl shadow-xs">
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                  {user.email?.[0].toUpperCase() || "U"}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isDemoUser ? t.demoAccountBadge : t.activeUserBadge}
                  </div>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title={t.signOut}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {t.loginSignUp}
            </button>
          )}

          <button 
            onClick={() => setShowSimulator(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all text-xs"
          >
            <Play className="w-4 h-4 fill-white" />
            {t.startSimulationWithSelected(filteredQuestions.length)}
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="mt-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> {lang === "en" ? "Umut's Master Swift & iOS Notes" : "Umut'un Özel Swift & iOS Notları"}
            </span>
            <span className="bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 text-xs px-2.5 py-0.5 rounded-full font-medium">
              {lang === "en" ? "35+ Deep Technical Questions" : "35+ Derin Teknik Soru"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {t.masterPoolTitle}
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed mb-5">
            {t.masterPoolDesc}
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                setSelectedCategory("swift-all");
                setShowSimulator(true);
              }}
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl font-bold shadow transition-colors text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-blue-700" />
              {t.startSwiftSim}
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm text-xs font-medium">
              <Volume2 className="w-3.5 h-3.5" /> {t.speechEnabled}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <section className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Arama Çubuğu */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Zorluk ve Yıldızlı Filtresi */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setOnlyBookmarks(!onlyBookmarks)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                onlyBookmarks
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyBookmarks ? "fill-amber-500 text-amber-500" : ""}`} />
              {t.onlyBookmarks}
            </button>

            {/* Zorluk Düzeyi */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs">
              {(["all", "junior", "mid", "senior"] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setDifficultyFilter(lvl)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                    difficultyFilter === lvl
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
                  }`}
                >
                  {lvl === "all" ? t.allDifficulties : lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-2">
          {CATEGORY_TABS.map(tab => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            const name = lang === "en" ? tab.enName : tab.trName;
            const desc = lang === "en" ? tab.enDesc : tab.trDesc;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-500"}`} />
                  {tab.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-600 text-white font-bold uppercase">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs truncate">{name}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Questions List */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t.allQuestions}
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
              {t.questionsCount(filteredQuestions.length)}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {selectedCategory === "swift-all" 
              ? (lang === "en" ? "🍏 Swift & iOS Master Pool" : "🍏 Swift & iOS Master Havuzu") 
              : t.categoryFilterNotice}
          </span>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.noQuestionsFound}</div>
            <p className="text-xs text-slate-400 mt-1">{t.noQuestionsDesc}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map(q => {
              const content = getQuestionContent(q, lang);
              const isRevealed = revealedAnswers[q.id];
              const isBookmarked = bookmarkedIds[q.id];
              return (
                <div 
                  key={q.id}
                  className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        q.difficulty === 'senior' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' 
                          : q.difficulty === 'mid'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {q.difficulty}
                      </span>
                      {q.tags.map(tag => (
                        <span key={tag} className="text-[11px] text-slate-500 dark:text-slate-400 font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => toggleBookmark(q.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40" : "text-slate-400 hover:text-amber-500"
                      }`}
                      title={isBookmarked ? "Unstar" : "Star"}
                    >
                      <Star className={`w-4 h-4 ${isBookmarked ? "fill-amber-500" : ""}`} />
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {content.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                    {content.question_text}
                  </p>

                  {isRevealed ? (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
                      <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200/70 dark:border-blue-900/40">
                        <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> {t.idealAnswerTitle}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                          {content.ideal_answer}
                        </p>
                      </div>

                      {content.key_points && content.key_points.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            📌 {t.keyPointsTitle}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {content.key_points.map((pt, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => toggleAnswer(q.id)}
                          className="text-xs text-slate-500 hover:text-slate-700 underline"
                        >
                          {t.hideAnswer}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t.showAnswer}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Live Gemini Interview Simulator Modal */}
      <InterviewSimulator
        questions={filteredQuestions}
        isOpen={showSimulator}
        onClose={() => setShowSimulator(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>
          Created by{" "}
          <a
            href="https://11hopem.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 underline transition-colors"
          >
            11Hopem
          </a>
        </p>
      </footer>
    </main>
  );
}
