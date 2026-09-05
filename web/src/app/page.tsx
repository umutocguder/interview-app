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
import { Category, Question } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import InterviewSimulator from "@/components/InterviewSimulator";
import { SWIFT_MASTER_QUESTIONS } from "@/data/swift-questions";

const BASE_OTHER_QUESTIONS: Question[] = [
  {
    id: "and-1",
    title: "Jetpack Compose: Recomposition ve State Hoisting",
    question_text: "Compose'da Recomposition nedir? State Hoisting prensibi neden uygulanmalıdır ve performansa etkisi nedir?",
    ideal_answer: "Recomposition, state değiştiğinde composable fonksiyonun yeniden çalışmasıdır. State Hoisting ile bileşen stateless yapılır; bu da test edilebilirliği, tekrar kullanımı ve önizleme kolaylığını maksimize eder.",
    hints: ["Stateless bileşenlerin avantajlarını düşünün."],
    key_points: ["Stateless bileşenler", "Tek yönlü veri akışı (UDF)", "Test edilebilirlik"],
    difficulty: "mid",
    q_type: "technical",
    tags: ["Android", "Kotlin", "Compose"],
  },
  {
    id: "web-1",
    title: "Next.js 15: Server Components vs Client Components",
    question_text: "Server Components (RSC) ile Client Components arasındaki farklar nelerdir? 'use client' ne zaman gereklidir?",
    ideal_answer: "Server Components istemciye sıfır JS bundle boyutu gönderir ve doğrudan sunucu kaynaklarına erişir. Client Components ise tarayıcı etkileşimi (onClick, useState vb.) gerektiğinde kullanılır.",
    hints: ["Sıfır bundle boyutunu ve sunucu erişimini vurgulayın."],
    key_points: ["Sıfır JS bundle katkısı", "use client ile etkileşim ayrıştırma", "SEO avantajı"],
    difficulty: "mid",
    q_type: "technical",
    tags: ["Next.js", "React", "TypeScript"],
  },
  {
    id: "db-1",
    title: "PostgreSQL: İndeksleme ve Row Level Security (RLS) Performansı",
    question_text: "Supabase ve PostgreSQL üzerinde RLS politikaları uygularken sorguların yavaşlamasını engellemek için nelere dikkat edilmelidir?",
    ideal_answer: "auth.uid() gibi fonksiyon çağrıları SELECT sorgularında tekrarlanmamalıdır (STABLE / IMMUTABLE sarmalama veya alt sorgu kullanımı). İlgili yabancı anahtar ve kullanıcı ID sütunlarına B-Tree indeksler eklenmelidir.",
    hints: ["auth.uid() sarmalaması", "Indexleme stratejisi"],
    key_points: ["B-Tree indeksleme", "Subquery optimizasyonu", "Cache mekanizmaları"],
    difficulty: "senior",
    q_type: "technical",
    tags: ["PostgreSQL", "Supabase", "RLS"],
  }
];

const ALL_QUESTIONS: Question[] = [...SWIFT_MASTER_QUESTIONS, ...BASE_OTHER_QUESTIONS];

interface CategoryFilterItem {
  id: string;
  name: string;
  icon: any;
  badge?: string;
  description: string;
}

const CATEGORY_TABS: CategoryFilterItem[] = [
  { id: "all", name: "Tüm Sorular", icon: Layers, description: "Tüm platformlar ve diller" },
  { id: "swift-all", name: "🍏 Swift & iOS Master", icon: AppleIcon, badge: "Master", description: "Umut'un Özel Mülakat Notları" },
  { id: "swift-ui", name: "SwiftUI & State", icon: Box, description: "StateObject, ViewTree, Render" },
  { id: "swift-concurrency", name: "Concurrency & GCD", icon: Cpu, description: "Async/await, Actors, Queues, Semaphore" },
  { id: "swift-arc", name: "ARC & Bellek", icon: Zap, description: "Stack/Heap, Weak/Unowned, COW" },
  { id: "swift-arch", name: "Mimari & VIPER", icon: BookOpen, description: "VIPER, MVVM, Coordinator, DI" },
  { id: "swift-uikit", name: "UIKit & Lifecycle", icon: Smartphone, description: "ViewController Lifecycle, AutoLayout" },
  { id: "swift-sec", name: "Güvenlik & APNs", icon: ShieldCheck, description: "Keychain, SSL Pinning, Push" },
  { id: "swift-test", name: "Test & Instruments", icon: Activity, description: "XCTest, Scroll Jank, Leaks" },
  { id: "android", name: "Android & Kotlin", icon: Smartphone, description: "Compose & Coroutines" },
  { id: "web", name: "Web & Next.js", icon: Globe, description: "Next.js 15 & React 19" },
  { id: "backend", name: "Backend & DB", icon: Database, description: "Supabase & Postgres" },
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

      // 4. Arama Sorgusu
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = q.title.toLowerCase().includes(query);
        const inText = q.question_text.toLowerCase().includes(query);
        const inTags = q.tags.some(t => t.toLowerCase().includes(query));
        const inKeys = q.key_points.some(k => k.toLowerCase().includes(query));
        if (!inTitle && !inText && !inTags && !inKeys) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, difficultyFilter, onlyBookmarks, bookmarkedIds, searchQuery]);

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
              <h1 className="text-2xl font-bold tracking-tight">Interview Master</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Kişiselleştirilmiş Swift, iOS & Çok Platformlu Mülakat Hazırlık Platformu
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
                    {isDemoUser ? "Demo Hesabı" : "Aktif Kullanıcı"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Çıkış Yap"
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
              Giriş Yap / Kaydol
            </button>
          )}

          <button 
            onClick={() => setShowSimulator(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Seçili Sorularla Simülasyon ({filteredQuestions.length})
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="mt-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-2xl p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Umut'un Özel Swift & iOS Notları
            </span>
            <span className="bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 text-xs px-2.5 py-0.5 rounded-full font-medium">
              35+ Derin Teknik Soru
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Kıdemli iOS Mülakatlarına Eksiksiz Hazırlık
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed mb-5">
            SwiftUI State & ViewTree, Swift 6 Actors & Concurrency, GCD (Semaphore/WorkItem), ARC & Memory Graph, VIPER/Coordinator Mimarileri, AutoLayout ve Instruments pratiklerini tek merkezden çalışın.
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
              Swift Mülakat Simülasyonunu Başlat
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm text-xs font-medium">
              <Volume2 className="w-3.5 h-3.5" /> Sesli Soru & Mikrofon Yanıtı Aktif
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
              placeholder="Sorularda ara... (örn: semaphore, actor, weak self, hugging, keychain, viper)"
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
              Yıldızlılar
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
                  {lvl === "all" ? "Tümü" : lvl}
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
                <div className="font-bold text-xs truncate">{tab.name}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{tab.description}</div>
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
              Mülakat Soruları
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
              {filteredQuestions.length} soru
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {selectedCategory === "swift-all" ? "🍏 Swift & iOS Master Havuzu" : "Kategoriye Göre Filtreleniyor"}
          </span>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Aradığınız kriterlere uygun soru bulunamadı.</div>
            <p className="text-xs text-slate-400 mt-1">Filtreleri veya arama kelimenizi değiştirerek tekrar deneyin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map(q => {
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
                      title={isBookmarked ? "Yıldızı Kaldır" : "Yıldızla"}
                    >
                      <Star className={`w-4 h-4 ${isBookmarked ? "fill-amber-500" : ""}`} />
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {q.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                    {q.question_text}
                  </p>

                  {isRevealed ? (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
                      <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200/70 dark:border-blue-900/40">
                        <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> İdeal Kıdemli Yanıt & Mimari Çözüm
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                          {q.ideal_answer}
                        </p>
                      </div>

                      {q.key_points && q.key_points.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                            📌 Mülakatçının Beklediği Kritik Noktalar (Key Points)
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {q.key_points.map((pt, i) => (
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
                          Cevabı Gizle
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      İdeal Cevabı ve Kritik Başlıkları İncele
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
      />
    </main>
  );
}
