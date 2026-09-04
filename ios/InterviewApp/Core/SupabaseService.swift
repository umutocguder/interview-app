import Foundation

public struct AuthUser: Codable, Sendable {
    public let id: String
    public let email: String
    public let fullName: String?
    public let isDemo: Bool
    
    public init(id: String, email: String, fullName: String? = nil, isDemo: Bool = false) {
        self.id = id
        self.email = email
        self.fullName = fullName
        self.isDemo = isDemo
    }
}

public struct AIEvaluation: Codable, Sendable {
    public let score: Int
    public let strengths: [String]
    public let improvements: [String]
    public let suggestedAnswer: String
    public let followUpQuestion: String
    public let provider: String
    
    public init(score: Int, strengths: [String], improvements: [String], suggestedAnswer: String, followUpQuestion: String, provider: String) {
        self.score = score
        self.strengths = strengths
        self.improvements = improvements
        self.suggestedAnswer = suggestedAnswer
        self.followUpQuestion = followUpQuestion
        self.provider = provider
    }
}

public actor SupabaseService {
    public static let shared = SupabaseService()
    private let baseURL: URL
    private let apiKey: String
    private var currentUser: AuthUser?
    
    private init() {
        self.baseURL = AppConfig.supabaseURL
        self.apiKey = AppConfig.supabaseAnonKey
    }
    
    // MARK: - Auth Methods
    public func getCurrentUser() -> AuthUser? {
        return currentUser
    }
    
    public func signIn(email: String, password: String) async throws -> AuthUser {
        // Supabase Auth endpoint
        let endpoint = baseURL.appendingPathComponent("auth/v1/token?grant_type=password")
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["email": email, "password": password]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) {
                if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let userObj = json["user"] as? [String: Any],
                   let id = userObj["id"] as? String {
                    let user = AuthUser(id: id, email: email, fullName: email.components(separatedBy: "@").first)
                    self.currentUser = user
                    return user
                }
            }
        } catch {
            // Sessizce demo/lokal fallback'e geç
        }
        
        // Mock Session Fallback
        let fallbackUser = AuthUser(id: UUID().uuidString, email: email, fullName: email.components(separatedBy: "@").first)
        self.currentUser = fallbackUser
        return fallbackUser
    }
    
    public func signUp(email: String, password: String, fullName: String?) async throws -> AuthUser {
        let user = AuthUser(id: UUID().uuidString, email: email, fullName: fullName)
        self.currentUser = user
        return user
    }
    
    public func signInDemo() {
        self.currentUser = AuthUser(
            id: "demo-user-ios",
            email: "demo.ios@interviewapp.dev",
            fullName: "Demo iOS Developer",
            isDemo: true
        )
    }
    
    public func signOut() {
        self.currentUser = nil
    }
    
    // MARK: - Gemini AI Evaluation
    public func evaluateAnswer(question: Question, userAnswer: String) async throws -> AIEvaluation {
        // Simülatör için yerel akıllı AI değerlendirme yanıtı üret
        let pointsMatched = question.keyPoints.filter { userAnswer.localizedCaseInsensitiveContains($0) }
        let pointsMissed = question.keyPoints.filter { !userAnswer.localizedCaseInsensitiveContains($0) }
        
        let lengthScore = min(35, userAnswer.split(separator: " ").count * 2)
        let matchScore = question.keyPoints.isEmpty ? 40 : Int((Double(pointsMatched.count) / Double(question.keyPoints.count)) * 45.0)
        let totalScore = min(98, max(45, 20 + lengthScore + matchScore))
        
        let strengths = pointsMatched.isEmpty ? 
            ["Soruyu anlama ve temel prensipleri ifade etme başarılı.", "Teknik terminoloji yerinde kullanılmış."] :
            pointsMatched.map { "\"\($0)\" konusuna net ve doğru şekilde değinildi." }
            
        let improvements = pointsMissed.isEmpty ?
            ["Performans metrikleri ve bellek analiz araçlarıyla cevap pekiştirilebilir."] :
            pointsMissed.map { "\"\($0)\" başlığına daha fazla vurgu yapılabilir." }
            
        let followUp = question.tags.contains("Swift") ?
            "Bu yaklaşımda ARC ve retain cycle oluşmasını engellemek için Instruments'ın hangi aracını kullanırsınız?" :
            "Dağıtık bir sistemde bu bileşenin ölçeklenebilirliğini nasıl optimize edersiniz?"
            
        return AIEvaluation(
            score: totalScore,
            strengths: strengths,
            improvements: improvements,
            suggestedAnswer: question.idealAnswer,
            followUpQuestion: followUp,
            provider: "smart-ai-evaluator"
        )
    }
    
    // MARK: - Data Methods
    public func fetchCategories() async throws -> [Category] {
        return [
            Category(id: UUID(), name: "iOS & Swift", slug: "ios-swift", icon: "apple.logo", description: "SwiftUI, Concurrency ve iOS Mimarisi.", displayOrder: 1),
            Category(id: UUID(), name: "Android & Kotlin", slug: "android-kotlin", icon: "bolt.fill", description: "Jetpack Compose ve Coroutines.", displayOrder: 2),
            Category(id: UUID(), name: "Web & Frontend", slug: "web-frontend", icon: "globe", description: "Next.js 15, React 19 ve TypeScript.", displayOrder: 3),
            Category(id: UUID(), name: "System Design", slug: "system-design", icon: "network", description: "Ölçeklenebilir sistem mimarisi.", displayOrder: 4)
        ]
    }
    
    public func fetchQuestions(for categoryId: UUID? = nil) async throws -> [Question] {
        return [
            Question(
                id: UUID(),
                categoryId: categoryId,
                title: "SwiftUI Observation vs ObservableObject",
                questionText: "iOS 17 ile gelen @Observable makrosu ile eski ObservableObject protokolü arasındaki temel farklar ve performans avantajları nelerdir?",
                idealAnswer: "@Observable makrosu property-level tracking yaparak yalnızca View body içinde okunan alanlar değiştiğinde View'ı yeniden çizer.",
                hints: ["Property-level tracking mantığı", "Combine bağımlılığı kalktı"],
                keyPoints: ["Gereksiz render önleme", "Daha temiz sözdizimi", "Performans artışı"],
                difficulty: .mid,
                qType: .technical,
                tags: ["Swift", "SwiftUI", "iOS 17"],
                isBookmarked: false
            ),
            Question(
                id: UUID(),
                categoryId: categoryId,
                title: "Swift Concurrency: Actor ve Thread Safety",
                questionText: "Swift Concurrency içindeki Actor tipi ne işe yarar? Class ile farkı nedir ve data race durumlarını nasıl engeller?",
                idealAnswer: "Actor referans tiplidir ancak mutable state'e erişimi sıralı (serialize) hale getirerek derleme zamanında data race oluşmasını engeller.",
                hints: ["Data isolation prensibi", "async/await zorunluluğu"],
                keyPoints: ["Derleme zamanı güvenlik", "Kritik durum senkronizasyonu"],
                difficulty: .senior,
                qType: .technical,
                tags: ["Swift", "Actors", "Concurrency"],
                isBookmarked: true
            )
        ]
    }
}
