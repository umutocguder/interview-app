import Foundation

public enum DifficultyLevel: String, Codable, CaseIterable {
    case junior = "junior"
    case mid = "mid"
    case senior = "senior"
    
    public var title: String {
        switch self {
        case .junior: return "Junior"
        case .mid: return "Mid-Level"
        case .senior: return "Senior"
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

public struct Question: Identifiable, Codable, Hashable {
    public let id: UUID
    public let categoryId: UUID?
    public let title: String
    public let questionText: String
    public let idealAnswer: String
    public let hints: [String]
    public let keyPoints: [String]
    public let difficulty: DifficultyLevel
    public let qType: QuestionType
    public let tags: [String]
    public var isBookmarked: Bool? = false
    
    enum CodingKeys: String, CodingKey {
        case id, title, hints, difficulty, tags
        case categoryId = "category_id"
        case questionText = "question_text"
        case idealAnswer = "ideal_answer"
        case keyPoints = "key_points"
        case qType = "q_type"
    }
}
