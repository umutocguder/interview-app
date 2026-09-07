import Foundation

public enum AppLanguage: String, Codable, CaseIterable {
    case tr = "tr"
    case en = "en"
    
    public var displayName: String {
        switch self {
        case .tr: return "🇹🇷 Türkçe"
        case .en: return "🇬🇧 English"
        }
    }
    
    public var shortCode: String {
        switch self {
        case .tr: return "TR"
        case .en: return "EN"
        }
    }
    
    public var bcp47: String {
        switch self {
        case .tr: return "tr-TR"
        case .en: return "en-US"
        }
    }
}

public enum DifficultyLevel: String, Codable, CaseIterable {
    case junior = "junior"
    case mid = "mid"
    case senior = "senior"
    
    public func localizedTitle(for lang: AppLanguage) -> String {
        switch (self, lang) {
        case (.junior, _): return "Junior"
        case (.mid, .tr): return "Mid-Level"
        case (.mid, .en): return "Mid-Level"
        case (.senior, .tr): return "Senior"
        case (.senior, .en): return "Senior"
        }
    }
    
    public var colorName: String {
        switch self {
        case .junior: return "green"
        case .mid: return "orange"
        case .senior: return "purple"
        }
    }
}

public enum QuestionType: String, Codable {
    case technical = "technical"
    case systemDesign = "system_design"
    case behavioral = "behavioral"
    case coding = "coding"
}

public struct LocalizedQuestionContent: Codable, Hashable {
    public let title: String
    public let questionText: String
    public let idealAnswer: String
    public let hints: [String]
    public let keyPoints: [String]
    
    public init(
        title: String,
        questionText: String,
        idealAnswer: String,
        hints: [String] = [],
        keyPoints: [String] = []
    ) {
        self.title = title
        self.questionText = questionText
        self.idealAnswer = idealAnswer
        self.hints = hints
        self.keyPoints = keyPoints
    }
}

public struct Question: Identifiable, Codable, Hashable {
    public let id: String
    public let categoryId: String?
    public let difficulty: DifficultyLevel
    public let qType: QuestionType
    public let tags: [String]
    public let tr: LocalizedQuestionContent
    public let en: LocalizedQuestionContent
    public var isBookmarked: Bool = false
    
    public init(
        id: String,
        categoryId: String? = nil,
        difficulty: DifficultyLevel,
        qType: QuestionType = .technical,
        tags: [String],
        tr: LocalizedQuestionContent,
        en: LocalizedQuestionContent,
        isBookmarked: Bool = false
    ) {
        self.id = id
        self.categoryId = categoryId
        self.difficulty = difficulty
        self.qType = qType
        self.tags = tags
        self.tr = tr
        self.en = en
        self.isBookmarked = isBookmarked
    }
    
    public func content(for lang: AppLanguage) -> LocalizedQuestionContent {
        return lang == .en ? en : tr
    }
}
