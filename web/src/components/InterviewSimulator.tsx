"use client";

import React, { useState, useEffect, useRef } from "react";
import { Question } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { 
  X, 
  Clock, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  HelpCircle,
  RefreshCw,
  Award
} from "lucide-react";

interface EvaluationResult {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
  followUpQuestion: string;
  provider: "gemini-flash" | "smart-local-ai";
}

interface InterviewSimulatorProps {
  questions: Question[];
  isOpen: boolean;
  onClose: () => void;
}

export default function InterviewSimulator({ questions, isOpen, onClose }: InterviewSimulatorProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 dakika
  const [timerActive, setTimerActive] = useState(true);
  
  // Web Speech API States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [customKey, setCustomKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const recognitionRef = useRef<any>(null);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Timer effect
  useEffect(() => {
    if (!isOpen || !timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timerActive, timeLeft]);

  // Reset when index changes
  useEffect(() => {
    setUserAnswer("");
    setEvaluation(null);
    setTimeLeft(180);
    setTimerActive(true);
    stopSpeaking();
    stopListening();
  }, [currentIndex]);

  // Speech Recognition (STT) setup
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tarayıcınız ses tanıma özelliğini (Web Speech API) desteklemiyor. Lütfen klavye ile yazarak devam edin.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "tr-TR";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        setUserAnswer((prev) => (transcript.trim() ? transcript : prev));
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Text-to-Speech (TTS)
  const speakQuestion = () => {
    if (!("speechSynthesis" in window)) {
      alert("Tarayıcınız metin seslendirmeyi desteklemiyor.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${currentQuestion.title}. ${currentQuestion.question_text}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "tr-TR";
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Evaluate Answer with Gemini AI
  const handleEvaluate = async () => {
    if (!userAnswer.trim()) {
      alert("Lütfen değerlendirmeden önce bir yanıt yazın veya mikrofonla seslendirin.");
      return;
    }

    setIsEvaluating(true);
    setTimerActive(false);

    try {
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionTitle: currentQuestion.title,
          questionText: currentQuestion.question_text,
          idealAnswer: currentQuestion.ideal_answer,
          keyPoints: currentQuestion.key_points || [],
          userAnswer: userAnswer.trim(),
          customApiKey: customKey.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Değerlendirme başarısız");
      }

      setEvaluation(data);
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      alert("Tebrikler! Mülakat simülasyon oturumu tamamlandı.");
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 dark:bg-blue-950/70 text-blue-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Canlı Mülakat Simülatörü
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                  Soru {currentIndex + 1}/{questions.length}
                </span>
              </div>
              <p className="text-xs text-slate-500">Gemini AI & Ses Destekli Değerlendirme Motoru</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Süre */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
              timeLeft < 30 
                ? "bg-red-50 text-red-600 dark:bg-red-950/50" 
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                onClose();
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Soru Kartı */}
          <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Mülakatçı Sorusu
              </span>
              <button
                onClick={speakQuestion}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-blue-200/50 shadow-xs font-medium transition-all"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                {isSpeaking ? "Durdur" : "Soruyu Dinle"}
              </button>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
              {currentQuestion.title}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentQuestion.question_text}
            </p>
          </div>

          {/* Cevap Giriş Alanı ve Mikrofon */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Yanıtınız
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  className="text-[11px] text-slate-400 hover:text-blue-600 underline"
                >
                  {showKeyInput ? "API Key Kapat" : "Gemini API Key Gir (Opsiyonel)"}
                </button>
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-blue-600" />}
                  {isListening ? "Dinlemeyi Durdur" : "Sesli Yanıtla"}
                </button>
              </div>
            </div>

            {showKeyInput && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-500">
                  Kişisel Google Gemini API anahtarınızı girerseniz doğrudan kendi kotanızla en güncel model çalıştırılır. Boş bırakılırsa akıllı simülasyon motoru kullanılır.
                </div>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            )}

            <textarea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Cevabınızı kendi cümlelerinizle yazın veya 'Sesli Yanıtla' butonuna tıklayarak mikrofona konuşun..."
              className="w-full p-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* AI Değerlendirme Sonuç Paneli */}
          {evaluation && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 border-t border-slate-100 dark:border-slate-800 pt-4">
              {/* Skor Banner */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Gemini Değerlendirme Skoru</div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      {evaluation.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {evaluation.provider === "gemini-flash" ? "⚡ Gemini 1.5 Flash" : "🧠 Smart Evaluator"}
                </span>
              </div>

              {/* Güçlü Yönler */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Güçlü Yönler
                </div>
                <div className="space-y-1.5">
                  {evaluation.strengths.map((str, i) => (
                    <div key={i} className="text-xs text-slate-700 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 p-2.5 rounded-lg">
                      • {str}
                    </div>
                  ))}
                </div>
              </div>

              {/* Geliştirilmesi Gereken Noktalar */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Geliştirilmesi Gereken Yönler
                </div>
                <div className="space-y-1.5">
                  {evaluation.improvements.map((imp, i) => (
                    <div key={i} className="text-xs text-slate-700 dark:text-slate-300 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 p-2.5 rounded-lg">
                      • {imp}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mülakatçının Takip Sorusu */}
              {evaluation.followUpQuestion && (
                <div className="p-3.5 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 rounded-xl">
                  <div className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Mülakatçı Derinleşme Sorusu (Follow-up)
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 italic">
                    "{evaluation.followUpQuestion}"
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              stopSpeaking();
              stopListening();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            Simülasyonu Kapat
          </button>

          <div className="flex items-center gap-3">
            {!evaluation ? (
              <button
                onClick={handleEvaluate}
                disabled={isEvaluating || !userAnswer.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Gemini AI Analiz Ediyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Yapay Zeka ile Değerlendir
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                {currentIndex < questions.length - 1 ? "Sıradaki Soruya Geç" : "Mülakatı Tamamla"}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
