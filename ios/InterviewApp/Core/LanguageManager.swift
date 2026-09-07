import Foundation
import Observation
import SwiftUI

@Observable
@MainActor
public final class LanguageManager {
    public static let shared = LanguageManager()
    
    private let userDefaultsKey = "user_selected_app_language"
    
    public var currentLanguage: AppLanguage {
        didSet {
            UserDefaults.standard.set(currentLanguage.rawValue, forKey: userDefaultsKey)
        }
    }
    
    public init() {
        if let saved = UserDefaults.standard.string(forKey: userDefaultsKey),
           let lang = AppLanguage(rawValue: saved) {
            self.currentLanguage = lang
        } else {
            self.currentLanguage = .tr
        }
    }
    
    public func setLanguage(_ language: AppLanguage) {
        self.currentLanguage = language
    }
    
    public func toggleLanguage() {
        self.currentLanguage = currentLanguage == .tr ? .en : .tr
    }
    
    // UI Strings
    public var appName: String { "Interview Master" }
    
    public var appTagline: String {
        currentLanguage == .en
            ? "Personalized Swift, iOS & Multi-Platform Interview Hub"
            : "Kişiselleştirilmiş Swift, iOS & Çok Platformlu Mülakat Hazırlık Platformu"
    }
    
    public var startSimulationBannerTitle: String {
        currentLanguage == .en
            ? "🎯 Ready for Today's Interview?"
            : "🎯 Bugün Mülakata Hazır mısın?"
    }
    
    public var startSimulationBannerDesc: String {
        currentLanguage == .en
            ? "Test your skills with real interview questions and strict timer."
            : "Gerçek mülakat soruları ve zamanlayıcı eşliğinde seviyeni test et."
    }
    
    public var startSimulationButton: String {
        currentLanguage == .en ? "Start Interview Simulation" : "Mülakat Simülasyonu Başlat"
    }
    
    public var categoriesTitle: String {
        currentLanguage == .en ? "Categories" : "Kategoriler"
    }
    
    public var questionsTitle: String {
        currentLanguage == .en ? "Interview Questions" : "Mülakat Soruları"
    }
    
    public var searchPlaceholder: String {
        currentLanguage == .en
            ? "Search questions... (e.g. actor, weak self, hugging, viper)"
            : "Sorularda ara... (örn: semaphore, actor, weak self, hugging)"
    }
    
    public var starredFilter: String {
        currentLanguage == .en ? "Starred" : "Yıldızlılar"
    }
    
    public var allDifficulties: String {
        currentLanguage == .en ? "All" : "Tümü"
    }
    
    public var showAnswer: String {
        currentLanguage == .en ? "Explore Ideal Answer & Key Points" : "İdeal Cevabı ve Kritik Başlıkları İncele"
    }
    
    public var hideAnswer: String {
        currentLanguage == .en ? "Hide Answer" : "Cevabı Gizle"
    }
    
    public var idealAnswerTitle: String {
        currentLanguage == .en ? "Ideal Senior Architecture Answer" : "İdeal Kıdemli Yanıt & Mimari Çözüm"
    }
    
    public var keyPointsTitle: String {
        currentLanguage == .en ? "Key Architectural Points" : "Mülakatçının Beklediği Kritik Noktalar"
    }
    
    public var interviewerQuestion: String {
        currentLanguage == .en ? "Interviewer's Question" : "Mülakatçı Sorusu"
    }
    
    public var yourAnswer: String {
        currentLanguage == .en ? "Your Answer / Notes" : "Cevabınız / Notlarınız"
    }
    
    public var evaluateWithAI: String {
        currentLanguage == .en ? "Evaluate with AI" : "Yapay Zeka ile Değerlendir"
    }
    
    public var evaluatingAI: String {
        currentLanguage == .en ? "Gemini AI is analyzing..." : "Gemini Analiz Ediyor..."
    }
    
    public var nextQuestion: String {
        currentLanguage == .en ? "Next Question" : "Sıradaki Soruya Geç"
    }
    
    public var completeInterview: String {
        currentLanguage == .en ? "Complete Interview" : "Mülakatı Tamamla"
    }
    
    public var scoreTitle: String {
        currentLanguage == .en ? "Evaluation Score" : "Değerlendirme Skoru"
    }
    
    public var strengthsTitle: String {
        currentLanguage == .en ? "Strengths" : "Güçlü Yönler"
    }
    
    public var improvementsTitle: String {
        currentLanguage == .en ? "Areas for Improvement" : "Geliştirilmesi Gereken Yönler"
    }
    
    public var followUpTitle: String {
        currentLanguage == .en ? "Interviewer Follow-up Question" : "Mülakatçı Derinleşme Sorusu"
    }
}
