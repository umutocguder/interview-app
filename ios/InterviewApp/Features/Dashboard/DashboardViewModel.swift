import Foundation
import Observation

@Observable
@MainActor
public final class DashboardViewModel {
    public var categories: [Category] = []
    public var dailyQuestions: [Question] = []
    public var isLoading: Bool = false
    public var errorMessage: String?
    
    public init() {}
    
    public func loadData() async {
        isLoading = true
        errorMessage = nil
        
        do {
            async let categoriesTask = SupabaseService.shared.fetchCategories()
            async let questionsTask = SupabaseService.shared.fetchQuestions()
            
            self.categories = try await categoriesTask
            self.dailyQuestions = try await questionsTask
        } catch {
            self.errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
}
