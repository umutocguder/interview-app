import { Language } from "./types";

export interface Translations {
  appName: string;
  appTagline: string;
  searchPlaceholder: string;
  startSimulation: string;
  startSimulationWithSelected: (count: number) => string;
  allQuestions: string;
  questionsCount: (count: number) => string;
  categoryFilterNotice: string;
  masterPoolBadge: string;
  masterPoolTitle: string;
  masterPoolDesc: string;
  startSwiftSim: string;
  speechEnabled: string;
  onlyBookmarks: string;
  allDifficulties: string;
  noQuestionsFound: string;
  noQuestionsDesc: string;
  showAnswer: string;
  hideAnswer: string;
  idealAnswerTitle: string;
  keyPointsTitle: string;
  interviewerQuestion: string;
  yourAnswer: string;
  stopListening: string;
  voiceAnswer: string;
  stopSpeaking: string;
  listenQuestion: string;
  evaluateWithAI: string;
  aiEvaluating: string;
  nextQuestion: string;
  finishSimulation: string;
  closeSimulation: string;
  evalScoreTitle: string;
  strengthsTitle: string;
  improvementsTitle: string;
  followUpTitle: string;
  rateLimitNoticeTitle: string;
  quotaRemainingNotice: (remaining: number, limit: number) => string;
  loginSignUp: string;
  demoAccountBadge: string;
  activeUserBadge: string;
  signOut: string;
  questionNumber: (current: number, total: number) => string;
}

export const translations: Record<Language, Translations> = {
  tr: {
    appName: "Interview Master",
    appTagline: "Kişiselleştirilmiş Swift, iOS & Çok Platformlu Mülakat Hazırlık Platformu",
    searchPlaceholder: "Sorularda ara... (örn: semaphore, actor, weak self, hugging, keychain, viper)",
    startSimulation: "Canlı Simülasyon Başlat",
    startSimulationWithSelected: (count: number) => `Seçili Sorularla Simülasyon (${count})`,
    allQuestions: "Tüm Sorular",
    questionsCount: (count: number) => `${count} soru`,
    categoryFilterNotice: "Kategoriye Göre Filtreleniyor",
    masterPoolBadge: "Master Havuz",
    masterPoolTitle: "Kıdemli iOS Mülakatlarına Eksiksiz Hazırlık",
    masterPoolDesc: "SwiftUI State & ViewTree, Swift 6 Actors & Concurrency, GCD (Semaphore/WorkItem), ARC & Memory Graph, VIPER/Coordinator Mimarileri, AutoLayout ve Instruments pratiklerini tek merkezden çalışın.",
    startSwiftSim: "Swift Mülakat Simülasyonunu Başlat",
    speechEnabled: "Sesli Soru & Mikrofon Yanıtı Aktif",
    onlyBookmarks: "Yıldızlılar",
    allDifficulties: "Tümü",
    noQuestionsFound: "Aradığınız kriterlere uygun soru bulunamadı.",
    noQuestionsDesc: "Filtreleri veya arama kelimenizi değiştirerek tekrar deneyin.",
    showAnswer: "İdeal Cevabı ve Kritik Başlıkları İncele",
    hideAnswer: "Cevabı Gizle",
    idealAnswerTitle: "İdeal Kıdemli Yanıt & Mimari Çözüm",
    keyPointsTitle: "Mülakatçının Beklediği Kritik Noktalar (Key Points)",
    interviewerQuestion: "Mülakatçı Sorusu",
    yourAnswer: "Yanıtınız",
    stopListening: "Dinlemeyi Durdur",
    voiceAnswer: "Sesli Yanıtla",
    stopSpeaking: "Durdur",
    listenQuestion: "Soruyu Dinle",
    evaluateWithAI: "Yapay Zeka ile Değerlendir",
    aiEvaluating: "Gemini AI Analiz Ediyor...",
    nextQuestion: "Sıradaki Soruya Geç",
    finishSimulation: "Mülakatı Tamamla",
    closeSimulation: "Simülasyonu Kapat",
    evalScoreTitle: "Mülakat Değerlendirme Skoru",
    strengthsTitle: "Güçlü Yönler",
    improvementsTitle: "Geliştirilmesi Gereken Yönler",
    followUpTitle: "Mülakatçı Derinleşme Sorusu (Follow-up)",
    rateLimitNoticeTitle: "AI Kotası Sınırlandırıldı",
    quotaRemainingNotice: (remaining: number, limit: number) => `Kalan Günlük AI Hakkı: ${remaining}/${limit}`,
    loginSignUp: "Giriş Yap / Kaydol",
    demoAccountBadge: "Demo Hesabı",
    activeUserBadge: "Aktif Kullanıcı",
    signOut: "Çıkış Yap",
    questionNumber: (current: number, total: number) => `Soru ${current}/${total}`,
  },
  en: {
    appName: "Interview Master",
    appTagline: "Personalized Swift, iOS & Multi-Platform Interview Preparation Platform",
    searchPlaceholder: "Search questions... (e.g. semaphore, actor, weak self, hugging, keychain, viper)",
    startSimulation: "Start Live Simulation",
    startSimulationWithSelected: (count: number) => `Simulate Selected Questions (${count})`,
    allQuestions: "All Questions",
    questionsCount: (count: number) => `${count} questions`,
    categoryFilterNotice: "Filtered by Category",
    masterPoolBadge: "Master Pool",
    masterPoolTitle: "Complete Preparation for Senior iOS Interviews",
    masterPoolDesc: "Master SwiftUI State & ViewTree, Swift 6 Actors & Concurrency, GCD (Semaphore/WorkItem), ARC & Memory Graph, VIPER/Coordinator Architectures, AutoLayout, and Instruments in one unified hub.",
    startSwiftSim: "Start Swift Interview Simulation",
    speechEnabled: "Voice Readout & Mic Input Active",
    onlyBookmarks: "Starred",
    allDifficulties: "All",
    noQuestionsFound: "No questions match your criteria.",
    noQuestionsDesc: "Try adjusting your filters or search keywords.",
    showAnswer: "Explore Ideal Answer & Key Architectural Points",
    hideAnswer: "Hide Answer",
    idealAnswerTitle: "Ideal Senior Answer & Architectural Solution",
    keyPointsTitle: "Key Architectural Points Expected by the Interviewer",
    interviewerQuestion: "Interviewer's Question",
    yourAnswer: "Your Answer",
    stopListening: "Stop Listening",
    voiceAnswer: "Answer with Voice",
    stopSpeaking: "Stop Audio",
    listenQuestion: "Listen Question",
    evaluateWithAI: "Evaluate with Gemini AI",
    aiEvaluating: "Gemini AI is analyzing...",
    nextQuestion: "Next Question",
    finishSimulation: "Complete Interview",
    closeSimulation: "Close Simulator",
    evalScoreTitle: "Interview Evaluation Score",
    strengthsTitle: "Identified Strengths",
    improvementsTitle: "Areas for Improvement",
    followUpTitle: "Interviewer Follow-up Question",
    rateLimitNoticeTitle: "AI Quota Rate Limited",
    quotaRemainingNotice: (remaining: number, limit: number) => `Remaining Daily AI Credits: ${remaining}/${limit}`,
    loginSignUp: "Sign In / Register",
    demoAccountBadge: "Demo Account",
    activeUserBadge: "Active User",
    signOut: "Sign Out",
    questionNumber: (current: number, total: number) => `Question ${current}/${total}`,
  },
};

export function getTranslation(lang: Language): Translations {
  return translations[lang] || translations.tr;
}
