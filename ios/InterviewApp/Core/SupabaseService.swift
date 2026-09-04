import Foundation

public actor SupabaseService {
    public static let shared = SupabaseService()
    private let baseURL: URL
    private let apiKey: String
    
    private init() {
        self.baseURL = AppConfig.supabaseURL
        self.apiKey = AppConfig.supabaseAnonKey
    }
    
    public func fetchCategories() async throws -> [Category] {
        let endpoint = baseURL.appendingPathComponent("rest/v1/categories")
        var request = URLRequest(url: endpoint)
        request.httpMethod = "GET"
        request.setValue(apiKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            // Mock veriler ile fallback sağla
            return [
                Category(id: UUID(), name: "iOS & Swift", slug: "ios-swift", icon: "apple.logo", description: "SwiftUI, Concurrency ve iOS Mimarisi.", displayOrder: 1),
                Category(id: UUID(), name: "Android & Kotlin", slug: "android-kotlin", icon: "bolt.fill", description: "Jetpack Compose ve Coroutines.", displayOrder: 2),
                Category(id: UUID(), name: "Web & Frontend", slug: "web-frontend", icon: "globe", description: "Next.js 15, React 19 ve TypeScript.", displayOrder: 3),
                Category(id: UUID(), name: "System Design", slug: "system-design", icon: "network", description: "Ölçeklenebilir sistem mimarisi.", displayOrder: 4)
            ]
        }
        
        return try JSONDecoder().decode([Category].self, from: data)
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
