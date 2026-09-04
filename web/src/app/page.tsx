"use client";

import { useState } from "react";
import { 
  Terminal, 
  Smartphone, 
  Globe, 
  Database, 
  Layers, 
  Play, 
  Clock, 
  CheckCircle2, 
  Lightbulb, 
  Eye, 
  Bookmark,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Category, Question } from "@/lib/types";

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
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorTime, setSimulatorTime] = useState(300);

  const toggleAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
            iOS, Android ve Web için Supabase Destekli Mülakat Platformu
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSimulator(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Mülakat Simülasyonu Başlat
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Çok Platformlu Ortak Altyapı
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            Mülakatlarda Bir Adım Öne Geçin
          </h2>
          <p className="text-blue-100 text-base leading-relaxed mb-6">
            iOS 17+ SwiftUI, Android Jetpack Compose ve Next.js 15 için hazırlanmış en güncel teknik sorular, mimari çözümler ve canlı mülakat simülatörü.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowSimulator(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-bold shadow transition-colors"
            >
              Hemen Başla (5 Soru)
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <section className="mt-10">
        <h3 className="text-lg font-bold mb-4">Kategoriler</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button 
            onClick={() => setSelectedCategory("all")}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedCategory === "all" 
                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 font-semibold" 
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
            }`}
          >
            <div className="font-bold text-sm">Tüm Kategoriler</div>
            <div className="text-xs text-slate-500 mt-1">Teknik & Mimari</div>
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
          <h3 className="text-lg font-bold">Günün Mülakat Soruları</h3>
          <span className="text-xs text-slate-500">{INITIAL_QUESTIONS.length} soru listeleniyor</span>
        </div>

        <div className="space-y-4">
          {INITIAL_QUESTIONS.map(q => {
            const isRevealed = revealedAnswers[q.id];
            return (
              <div 
                key={q.id}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm transition-all"
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
                  <button className="text-slate-400 hover:text-blue-600">
                    <Bookmark className="w-4 h-4" />
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

      {/* Simulator Modal */}
      {showSimulator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-bold">Canlı Mülakat Simülatörü</span>
              </div>
              <button 
                onClick={() => setShowSimulator(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-xl">
                <div className="text-xs text-blue-600 font-bold uppercase mb-1">Mülakatçı Sorusu (Soru 1/5)</div>
                <div className="text-sm font-semibold">
                  "Büyük ölçekli bir mobil veya web uygulamasında state yönetimini nasıl kurgularsınız? Hangi kriterlere göre kütüphane seçersiniz?"
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Cevap Taslağınız / Açıklamanız
                </label>
                <textarea 
                  rows={4}
                  placeholder="Kendi cümlelerinizle yanıtınızı yazın veya ana başlıkları not edin..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSimulator(false)}
                  className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    alert("Tebrikler! Mülakat oturumu tamamlandı. Supabase veritabanına kaydedildi.");
                    setShowSimulator(false);
                  }}
                  className="px-5 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Cevabı Kaydet & İlerle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
