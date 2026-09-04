"use client";

import { useState } from "react";
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
  BrainCircuit,
  Volume2
} from "lucide-react";
import { Category, Question } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import InterviewSimulator from "@/components/InterviewSimulator";

const INITIAL_CATEGORIES: Category[] = [
  { id: "1", name: "iOS & Swift", slug: "ios-swift", icon: "Smartphone", description: "SwiftUI, Concurrency, ARC ve iOS 17+ Mimarisi.", display_order: 1 },
  { id: "2", name: "Android & Kotlin", slug: "android-kotlin", icon: "Smartphone", description: "Jetpack Compose, Coroutines, Flow ve Clean Architecture.", display_order: 2 },
  { id: "3", name: "Web & Frontend", slug: "web-frontend", icon: "Globe", description: "Next.js 15, React 19, TypeScript ve Modern State.", display_order: 3 },
  { id: "4", name: "Backend & Database", slug: "backend-database", icon: "Database", description: "Node.js, PostgreSQL, Supabase, RLS ve Cache.", display_order: 4 },
  { id: "5", name: "System Design", slug: "system-design", icon: "Layers", description: "Ölçeklenebilir mimariler, mikroservisler ve veri akışları.", display_order: 5 },
];

const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "SwiftUI Observation (@Observable) vs ObservableObject",
    question_text: "iOS 17 ile gelen @Observable makrosu ile eski ObservableObject protokolü arasındaki temel farklar ve performans avantajları nelerdir?",
    ideal_answer: "@Observable makrosu property-level tracking yaparak yalnızca View body içinde okunan alanlar değiştiğinde View'ı yeniden çizer. Combine bağımlılığını kaldırır ve gereksiz render döngülerini engeller.",
    hints: ["Property-level tracking mantığını ve render döngüsünü göz önüne alın.", "Combine bağımlılığı kalktı."],
    key_points: ["Gereksiz render önleme", "Property düzeyinde izleme", "Temiz ve yalın sözdizimi"],
    difficulty: "mid",
    q_type: "technical",
    tags: ["Swift", "SwiftUI", "iOS 17"],
  },
  {
    id: "q2",
    title: "Swift Concurrency: Actor ve Data Race Koruması",
    question_text: "Swift Concurrency içindeki Actor tipi ne işe yarar? Class ile farkı nedir ve data race durumlarını derleme zamanında nasıl engeller?",
    ideal_answer: "Actor, mutable state'e eşzamanlı erişimi serialize eder. Dışarıdan erişimde await zorunlu tutularak derleme zamanında data race kesin olarak önlenir.",
    hints: ["Data isolation prensibini açıklayın.", "await zorunluluğunun amacını belirtin."],
    key_points: ["Derleme zamanı güvenlik garantisi", "Otomatik sıralı erişim", "Reentrancy dikkat edilmeli"],
    difficulty: "senior",
    q_type: "technical",
    tags: ["Swift", "Actors", "Concurrency"],
  },
  {
    id: "q3",
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
    id: "q4",
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
    id: "q5",
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

export default function Home() {
  const { user, signOut, isDemoUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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

  // Kategoriye göre filtrele
  const filteredQuestions = selectedCategory === "all" 
    ? INITIAL_QUESTIONS 
    : INITIAL_QUESTIONS.filter(q => {
        if (selectedCategory === "ios-swift") return q.tags.includes("Swift") || q.tags.includes("iOS 17");
        if (selectedCategory === "android-kotlin") return q.tags.includes("Android") || q.tags.includes("Kotlin");
        if (selectedCategory === "web-frontend") return q.tags.includes("Next.js") || q.tags.includes("React");
        if (selectedCategory === "backend-database") return q.tags.includes("PostgreSQL") || q.tags.includes("Supabase");
        return true;
      });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white p-2 rounded-xl">
              <Terminal className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Interview Master</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            iOS, Android ve Web için Supabase & Gemini Destekli Mülakat Platformu
          </p>
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
            Canlı Simülasyon Başlat
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Gemini AI & Ses Destekli Canlı Simülatör
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            Mülakatlarda Bir Adım Öne Geçin
          </h2>
          <p className="text-blue-100 text-base leading-relaxed mb-6">
            iOS 17+ SwiftUI, Android Jetpack Compose ve Next.js 15 için hazırlanmış en güncel teknik sorular, sesli simülasyon ve Gemini 1.5 Flash ile anında yapay zeka geri bildirimi.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowSimulator(true)}
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-bold shadow transition-colors"
            >
              <Play className="w-4 h-4 fill-blue-600" />
              Sesli Simülasyona Başla ({filteredQuestions.length} Soru)
            </button>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-xs font-medium">
              <Volume2 className="w-4 h-4" /> Web Speech TTS & STT Aktif
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <section className="mt-10">
        <h3 className="text-lg font-bold mb-4">Kategoriler</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <button 
            onClick={() => setSelectedCategory("all")}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedCategory === "all" 
                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 font-semibold" 
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
            }`}
          >
            <div className="font-bold text-sm">Tümü</div>
            <div className="text-xs text-slate-500 mt-1">Tüm Sorular</div>
          </button>
          {INITIAL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedCategory === cat.slug 
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 font-semibold" 
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
              }`}
            >
              <div className="font-bold text-sm truncate">{cat.name}</div>
              <div className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.description}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Questions List */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">Teknik Mülakat Soruları</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 font-semibold">
              {filteredQuestions.length}
            </span>
          </div>
          <span className="text-xs text-slate-500">Kategoriye Göre Listeleniyor</span>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map(q => {
            const isRevealed = revealedAnswers[q.id];
            const isBookmarked = bookmarkedIds[q.id];
            return (
              <div 
                key={q.id}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      q.difficulty === 'senior' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' 
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                    }`}>
                      {q.difficulty}
                    </span>
                    {q.tags.map(tag => (
                      <span key={tag} className="text-xs text-slate-500 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => toggleBookmark(q.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked ? "text-blue-600 bg-blue-50 dark:bg-blue-950" : "text-slate-400 hover:text-blue-600"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600" : ""}`} />
                  </button>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {q.title}
                </h4>

                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  {q.question_text}
                </p>

                {isRevealed ? (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="bg-blue-50/70 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50">
                      <div className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">
                        🎯 İdeal Cevap & Mimari Çözüm
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {q.ideal_answer}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        📌 Kritik Başlıklar (Key Points)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.key_points.map((pt, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleAnswer(q.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mt-2"
                  >
                    <Eye className="w-4 h-4" />
                    İdeal Cevabı ve İpuçlarını Göster
                  </button>
                )}
              </div>
            );
          })}
        </div>
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
