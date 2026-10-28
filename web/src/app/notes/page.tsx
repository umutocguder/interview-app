"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  Search, 
  FileText, 
  Sparkles, 
  Terminal,
  Type,
  Maximize2
} from "lucide-react";
import { RAW_SWIFT_NOTEBOOK } from "@/data/raw-notebook";

export default function NotesPage() {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState<"xs" | "sm" | "base">("sm");

  const totalLines = useMemo(() => RAW_SWIFT_NOTEBOOK.split("\n").length, []);
  const totalCharacters = RAW_SWIFT_NOTEBOOK.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(RAW_SWIFT_NOTEBOOK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopyalama başarısız:", err);
    }
  };

  const matchCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = RAW_SWIFT_NOTEBOOK.match(regex);
    return matches ? matches.length : 0;
  }, [searchQuery]);

  // Arama vurgulaması (highlight)
  const renderedContent = useMemo(() => {
    if (!searchQuery.trim()) {
      return RAW_SWIFT_NOTEBOOK;
    }
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = RAW_SWIFT_NOTEBOOK.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-white px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }, [searchQuery]);

  const fontSizeClass = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
  }[fontSize];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Ana Sayfa
            </Link>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <h1 className="text-sm font-bold leading-tight">Umut&apos;un Çalışma Not Defteri</h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Swift &amp; iOS Master • Kelimesi kelimesine orijinal ham metin
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/swift-study-notes.txt"
              download="swift-study-notes.txt"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Metni .txt olarak indir"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              İndir (.txt)
            </a>

            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Kopyalandı!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Tümünü Kopyala
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Banner / Info Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-blue-900/10 border border-indigo-200/50 dark:border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Özel Alan • Çalışma Not Defteri
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Tüm mülakat ve çalışma notlarınız kelimesi kelimesine burada düz metin olarak korunmaktadır.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
              {totalLines} satır
            </span>
            <span className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
              {(totalCharacters / 1024).toFixed(1)} KB
            </span>
            <span className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-bold">
              ✓ 100% Verbatim
            </span>
          </div>
        </div>

        {/* Toolbar: Search and Font Size */}
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Not defteri içinde kelime ara (örn: VIPER, Actor, GCD, Keychain)..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {searchQuery.trim() && (
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {matchCount} eşleşme bulundu
              </div>
            )}

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <span className="px-2 text-[10px] text-slate-400 font-bold">Yazı Tipi:</span>
              <button
                onClick={() => setFontSize("xs")}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  fontSize === "xs"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize("sm")}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  fontSize === "sm"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize("base")}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  fontSize === "base"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Notebook Plain Text Area */}
        <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 font-medium">swift-study-notes.txt</span>
            </div>
            <span className="text-[11px]">UTF-8 • Plain Text</span>
          </div>

          <div className="p-6 md:p-8 overflow-x-auto">
            <pre
              className={`font-mono ${fontSizeClass} whitespace-pre-wrap select-text leading-relaxed text-slate-800 dark:text-slate-200 tracking-normal break-words`}
            >
              {renderedContent}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
