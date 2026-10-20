import XCTest
@testable import InterviewApp

final class InterviewAppTests: XCTestCase {
    
    func testLanguageManagerToggle() async {
        let manager = await LanguageManager.shared
        await manager.setLanguage(.tr)
        var lang = await manager.currentLanguage
        XCTAssertEqual(lang, .tr)
        
        await manager.toggleLanguage()
        lang = await manager.currentLanguage
        XCTAssertEqual(lang, .en)
        
        let appName = await manager.appName
        XCTAssertEqual(appName, "11 Interview")
        
        let starredLabel = await manager.starredFilter
        XCTAssertEqual(starredLabel, "Starred")
        
        await manager.setLanguage(.tr)
        let starredTr = await manager.starredFilter
        XCTAssertEqual(starredTr, "Yıldızlılar")
    }
    
    func testQuestionBilingualContentCompleteness() {
        let questions = QuestionRepository.shared.questions
        XCTAssertFalse(questions.isEmpty, "Questions repository should not be empty")
        
        for q in questions {
            let tr = q.content(for: .tr)
            XCTAssertFalse(tr.title.isEmpty, "TR title should not be empty for \(q.id)")
            XCTAssertFalse(tr.questionText.isEmpty, "TR questionText should not be empty for \(q.id)")
            XCTAssertFalse(tr.idealAnswer.isEmpty, "TR idealAnswer should not be empty for \(q.id)")
            XCTAssertFalse(tr.keyPoints.isEmpty, "TR keyPoints should not be empty for \(q.id)")
            
            let en = q.content(for: .en)
            XCTAssertFalse(en.title.isEmpty, "EN title should not be empty for \(q.id)")
            XCTAssertFalse(en.questionText.isEmpty, "EN questionText should not be empty for \(q.id)")
            XCTAssertFalse(en.idealAnswer.isEmpty, "EN idealAnswer should not be empty for \(q.id)")
            XCTAssertFalse(en.keyPoints.isEmpty, "EN keyPoints should not be empty for \(q.id)")
            
            XCTAssertNotEqual(tr.title, en.title, "TR and EN titles must be distinct translations for \(q.id)")
        }
    }
    
    func testDashboardFiltering() async {
        let vm = await DashboardViewModel()
        
        // Filter senior only
        await MainActor.run {
            vm.difficultyFilter = "senior"
            let seniorList = vm.filteredQuestions(for: .tr)
            XCTAssertTrue(seniorList.allSatisfy { $0.difficulty == .senior })
            
            // Search filter in English
            vm.difficultyFilter = "all"
            vm.searchQuery = "actor"
            let searchResults = vm.filteredQuestions(for: .en)
            XCTAssertFalse(searchResults.isEmpty)
        }
    }
}
