import Foundation
import Observation

@Observable
@MainActor
public final class DashboardViewModel {
    public var categories: [Category] = []
    public var allQuestions: [Question] = []
    public var selectedCategorySlug: String = "swift-all"
    public var searchQuery: String = ""
    public var difficultyFilter: String = "all"
    public var onlyBookmarks: Bool = false
    public var bookmarkedIds: Set<String> = []
    public var revealedAnswerIds: Set<String> = []
    public var isLoading: Bool = false
    public var errorMessage: String?
    
    public init() {
        self.categories = QuestionRepository.shared.categories
        self.allQuestions = QuestionRepository.shared.questions
    }
    
    public func loadData() async {
        isLoading = true
        errorMessage = nil
        
        // Ensure local master dataset is populated
        self.categories = QuestionRepository.shared.categories
        self.allQuestions = QuestionRepository.shared.questions
        
        isLoading = false
    }
    
    public func toggleBookmark(for questionId: String) {
        if bookmarkedIds.contains(questionId) {
            bookmarkedIds.remove(questionId)
        } else {
            bookmarkedIds.insert(questionId)
        }
    }
    
    public func isBookmarked(_ questionId: String) -> Bool {
        bookmarkedIds.contains(questionId)
    }
    
    public func toggleRevealAnswer(for questionId: String) {
        if revealedAnswerIds.contains(questionId) {
            revealedAnswerIds.remove(questionId)
        } else {
            revealedAnswerIds.insert(questionId)
        }
    }
    
    public func isAnswerRevealed(_ questionId: String) -> Bool {
        revealedAnswerIds.contains(questionId)
    }
    
    public func filteredQuestions(for language: AppLanguage) -> [Question] {
        allQuestions.filter { q in
            // Category filter
            if selectedCategorySlug == "swift-all" {
                let isSwift = q.tags.contains { ["Swift", "SwiftUI", "UIKit", "iOS", "Concurrency", "ARC", "VIPER", "GCD"].contains($0) }
                if !isSwift { return false }
            } else if selectedCategorySlug == "swift-ui" {
                if !q.tags.contains("SwiftUI") { return false }
            } else if selectedCategorySlug == "swift-concurrency" {
                if !q.tags.contains(where: { ["Concurrency", "GCD", "Actors", "Threading"].contains($0) }) { return false }
            } else if selectedCategorySlug == "swift-arc" {
                if !q.tags.contains(where: { ["ARC", "Memory", "Weak", "Unowned"].contains($0) }) { return false }
            } else if selectedCategorySlug == "swift-arch" {
                if !q.tags.contains(where: { ["Architecture", "VIPER", "CleanArchitecture"].contains($0) }) { return false }
            } else if selectedCategorySlug == "android" {
                if !q.tags.contains("Android") { return false }
            }
            
            // Difficulty filter
            if difficultyFilter != "all" && q.difficulty.rawValue != difficultyFilter {
                return false
            }
            
            // Bookmark filter
            if onlyBookmarks && !bookmarkedIds.contains(q.id) {
                return false
            }
            
            // Search query filter (search across localized and both languages)
            let trimmed = searchQuery.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
            if !trimmed.isEmpty {
                let c = q.content(for: language)
                let inTitle = c.title.lowercased().contains(trimmed) || q.tr.title.lowercased().contains(trimmed) || q.en.title.lowercased().contains(trimmed)
                let inText = c.questionText.lowercased().contains(trimmed) || q.tr.questionText.lowercased().contains(trimmed) || q.en.questionText.lowercased().contains(trimmed)
                let inTags = q.tags.contains { $0.lowercased().contains(trimmed) }
                let inKeys = c.keyPoints.contains { $0.lowercased().contains(trimmed) }
                if !inTitle && !inText && !inTags && !inKeys {
                    return false
                }
            }
            
            return true
        }
    }
}
