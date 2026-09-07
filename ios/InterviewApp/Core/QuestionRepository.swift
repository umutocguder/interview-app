import Foundation

public final class QuestionRepository {
    public static let shared = QuestionRepository()
    
    public let categories: [Category] = [
        Category(
            id: "cat-all",
            slug: "all",
            icon: "square.stack.3d.up.fill",
            displayOrder: 1,
            tr: LocalizedCategoryContent(name: "Tüm Sorular", description: "Tüm platform ve diller"),
            en: LocalizedCategoryContent(name: "All Questions", description: "All platforms and categories")
        ),
        Category(
            id: "cat-swift-all",
            slug: "swift-all",
            icon: "apple.logo",
            displayOrder: 2,
            tr: LocalizedCategoryContent(name: "🍏 Swift Master", description: "Umut'un Özel Mülakat Notları"),
            en: LocalizedCategoryContent(name: "🍏 Swift Master", description: "Umut's Master Apple Notes")
        ),
        Category(
            id: "cat-swiftui",
            slug: "swift-ui",
            icon: "cube.fill",
            displayOrder: 3,
            tr: LocalizedCategoryContent(name: "SwiftUI & State", description: "StateObject, ViewTree, Render"),
            en: LocalizedCategoryContent(name: "SwiftUI & State", description: "StateObject, ViewTree, Render cycle")
        ),
        Category(
            id: "cat-concurrency",
            slug: "swift-concurrency",
            icon: "cpu.fill",
            displayOrder: 4,
            tr: LocalizedCategoryContent(name: "Concurrency & GCD", description: "Async/await, Actors, Queues, Semaphore"),
            en: LocalizedCategoryContent(name: "Concurrency & GCD", description: "Async/await, Actors, Queues, Semaphore")
        ),
        Category(
            id: "cat-arc",
            slug: "swift-arc",
            icon: "bolt.fill",
            displayOrder: 5,
            tr: LocalizedCategoryContent(name: "ARC & Bellek", description: "Stack/Heap, Weak/Unowned, COW"),
            en: LocalizedCategoryContent(name: "ARC & Memory", description: "Stack/Heap, Weak/Unowned, COW")
        ),
        Category(
            id: "cat-arch",
            slug: "swift-arch",
            icon: "book.fill",
            displayOrder: 6,
            tr: LocalizedCategoryContent(name: "Mimari & VIPER", description: "VIPER, MVVM, Coordinator, DI"),
            en: LocalizedCategoryContent(name: "Architecture & VIPER", description: "VIPER, MVVM, Coordinator, DI")
        ),
        Category(
            id: "cat-uikit",
            slug: "swift-uikit",
            icon: "iphone",
            displayOrder: 7,
            tr: LocalizedCategoryContent(name: "UIKit & Lifecycle", description: "ViewController Lifecycle, AutoLayout"),
            en: LocalizedCategoryContent(name: "UIKit & Lifecycle", description: "ViewController Lifecycle, AutoLayout")
        ),
        Category(
            id: "cat-sec",
            slug: "swift-sec",
            icon: "lock.shield.fill",
            displayOrder: 8,
            tr: LocalizedCategoryContent(name: "Güvenlik & APNs", description: "Keychain, SSL Pinning, Push"),
            en: LocalizedCategoryContent(name: "Security & APNs", description: "Keychain, SSL Pinning, Push")
        ),
        Category(
            id: "cat-test",
            slug: "swift-test",
            icon: "waveform.path.ecg",
            displayOrder: 9,
            tr: LocalizedCategoryContent(name: "Test & Instruments", description: "XCTest, Scroll Jank, Leaks"),
            en: LocalizedCategoryContent(name: "Testing & Instruments", description: "XCTest, Scroll Jank, Leaks")
        ),
        Category(
            id: "cat-android",
            slug: "android",
            icon: "candybarphone",
            displayOrder: 10,
            tr: LocalizedCategoryContent(name: "Android & Kotlin", description: "Compose & Coroutines"),
            en: LocalizedCategoryContent(name: "Android & Kotlin", description: "Compose & Coroutines")
        )
    ]
    
    public let questions: [Question] = [
        Question(
            id: "sw-1",
            difficulty: .senior,
            tags: ["SwiftUI", "Observation", "Performance", "iOS 17"],
            tr: LocalizedQuestionContent(
                title: "SwiftUI Observation vs ObservableObject: Mimari ve Performans",
                questionText: "iOS 17 ile gelen @Observable makrosu ile eski ObservableObject protokolü arasındaki farklar ve performans avantajları nelerdir?",
                idealAnswer: "1. Granular / Property-Level Tracking: ObservableObject içinde @Published değişken değiştiğinde objectWillChange tetiklenir ve o nesneyi dinleyen tüm View gövdesi yeniden hesaplanır (re-render). @Observable ise Observation framework sayesinde View'ın sadece okuduğu spesifik property değiştiğinde tetiklenir.\n2. Sade Kod & Combine Bağımsızlığı: @Observable için @Published, @StateObject veya @ObservedObject property wrapper'larına gerek kalmaz. Standart @State veya doğrudan let/var ile tanımlanır. Combine import etme zorunluluğu kalkar.\n3. Bellek ve Heap İyileştirmesi: SwiftUI dependency graph'ı doğrudan property erişimi sırasında kurar; gereksiz yayıncı (publisher) subscription maliyetleri sıfırlanır.",
                hints: ["Property-level tracking mekanizmasını düşünün.", "Combine bağımlılığına değinin."],
                keyPoints: [
                    "Property-level dependency tracking (sadece okunan property için render)",
                    "ObservableObject'te tüm View'ın gereksiz re-render olma sorununun çözülmesi",
                    "Combine ve @Published bağımlılığının kalkması",
                    "Basitleştirilmiş @State kullanımı"
                ]
            ),
            en: LocalizedQuestionContent(
                title: "SwiftUI Observation vs ObservableObject: Architectural Performance",
                questionText: "What are the core differences and performance advantages of the iOS 17 @Observable macro compared to the legacy ObservableObject protocol?",
                idealAnswer: "1. Property-Level Dependency Tracking: In ObservableObject, mutating any @Published property fires objectWillChange, invalidating and re-evaluating the entire body of any subscribing View. With @Observable, the Observation framework tracks variable reads at the property level; only views accessing the specific mutated field are scheduled for invalidation.\n2. Simplified Syntax & Zero Combine Dependency: Eliminates boilerplates such as @Published, @ObservedObject, and @StateObject. Plain @State or regular reference passing suffices, dropping Combine imports.\n3. Runtime Efficiency: Eliminates Combine publisher/subscriber allocation overhead and streamlines the SwiftUI render graph traversal.",
                hints: ["Focus on property-level dependency tracking.", "Contrast with objectWillChange in Combine."],
                keyPoints: [
                    "Property-level tracking eliminates redundant view re-renders",
                    "Replaces objectWillChange and Combine framework dependency",
                    "Simplifies property wrappers: uses standard @State",
                    "Lower memory overhead and faster diffing"
                ]
            )
        ),
        Question(
            id: "sw-2",
            difficulty: .senior,
            tags: ["Concurrency", "Actors", "DataRace", "Swift 6"],
            tr: LocalizedQuestionContent(
                title: "Swift Concurrency: Actor Reentrancy ve Deadlock Önleme",
                questionText: "Swift Concurrency'de Actor reentrancy nedir? Neden deadlock riskini önlerken unexpected state (beklenmeyen durum) hatalarına yol açabilir?",
                idealAnswer: "Actor'lar iç state'lerini korumak için sıralı (serialized) bir mesaj kuyruğu kullanır. Ancak bir actor metodu içinde 'await' çağrıldığında, actor o iş parçacığının bitmesini beklemez; iş parçacığını askıya alır (suspension point) ve kuyruktaki başka bir görevin araya girmesine (reentrancy) izin verir.\nAvantajı: Geleneksel lock mekanizmalarında yaşanan thread blocking ve deadlock kilitlenmelerini engeller.\nRiski: Bir await çağrısının öncesi ile sonrası arasında actor'ın state'i değişmiş olabilir (State Inconsistency). Await sonrasında state'in ilk baştakiyle aynı olduğu varsayılmamalıdır.",
                hints: ["Await bir suspension point'tir.", "Await arasına başka işlerin girebileceğini düşünün."],
                keyPoints: [
                    "Actor reentrancy: Await sırasında actor'ın serbest kalması ve başka task'ları kabul etmesi",
                    "Deadlock riskini tamamen ortadan kaldırır",
                    "State inconsistency (await öncesi ve sonrası durum farkı) riski doğurur",
                    "Çözüm: Kritik state kontrollerini await sonrasında tekrarlamak veya atomik işleri tek seferde bitirmek"
                ]
            ),
            en: LocalizedQuestionContent(
                title: "Swift Concurrency: Actor Reentrancy and Race Prevention",
                questionText: "What is Actor Reentrancy in Swift Concurrency? Why does it prevent deadlocks yet risk unexpected state inconsistencies across suspension points?",
                idealAnswer: "Actors serialize access to their isolated mutable state. When an actor method encounters an 'await' keyword, it introduces a suspension point. The runtime frees the actor to execute other queued work items while the suspended task awaits completion.\nAdvantage: Prevents mutual exclusion deadlocks common with traditional mutex locks.\nRisk: The actor's state may be mutated by another task during the suspension interval. Assuming state invariants hold post-await without re-checking causes race conditions.",
                hints: ["Await is a suspension point, releasing the actor.", "State may change across await boundaries."],
                keyPoints: [
                    "Actor suspension releases execution thread to handle concurrent messages",
                    "Completely avoids traditional lock-based deadlocks",
                    "Risks state corruption if assumptions span across await boundaries",
                    "Mitigation: Re-verify state preconditions following an await"
                ]
            )
        ),
        Question(
            id: "sw-3",
            difficulty: .senior,
            tags: ["GCD", "Concurrency", "Semaphore", "Threading"],
            tr: LocalizedQuestionContent(
                title: "Grand Central Dispatch: DispatchSemaphore ile Thread İzolasyonu",
                questionText: "DispatchSemaphore nasıl çalışır? Bir arka plan kuyruğunu ana thread'i (Main Thread) kilitlemeden semaforla nasıl senkronize edersiniz?",
                idealAnswer: "DispatchSemaphore, paylaşılan bir kaynağa aynı anda erişebilecek thread sayısını kontrol eden bir sayaçtır.\n- wait(): Sayacı 1 azaltır. Sayaç 0'dan küçükse çağıran thread'i bloke eder.\n- signal(): Sayacı 1 artırır. Bekleyen bir thread varsa uyandırır.\nMain Thread Koruması: Main thread üzerinde ASLA wait() çağrılmamalıdır. Bu durum UI donmalarına (ANR / Hang) ve Watchdog timeout ile uygulamanın çökmesine yol açar. Bunun yerine arka plan kuyruğunda semafor kullanılmalı veya modern Swift Concurrency (Task, AsyncSequence) tercih edilmelidir.",
                hints: ["Sayacın değerini ve wait/signal çalışma mantığını özetleyin.", "Main thread'de wait() çalıştırmanın tehlikesini vurgulayın."],
                keyPoints: [
                    "Sayaç mantığı: wait() azaltır ve bloke eder, signal() artırır ve uyandırır",
                    "Main thread üzerinde asla wait() çağrılmamalıdır (UI Hang / Watchdog crash)",
                    "Thread priority inversion (öncelik terslenmesi) riskine dikkat edilmelidir",
                    "Modern kod tabanlarında async/await ile yer değiştirmelidir"
                ]
            ),
            en: LocalizedQuestionContent(
                title: "Grand Central Dispatch: DispatchSemaphore and Thread Isolation",
                questionText: "How does DispatchSemaphore work internally? How do you synchronize concurrency without blocking the Main Thread?",
                idealAnswer: "DispatchSemaphore maintains an integer counter controlling concurrency:\n- wait(): Decrements the counter. If value < 0, halts and suspends the calling thread.\n- signal(): Increments the counter and wakes the earliest waiting thread.\nMain Thread Safety: Never execute wait() on the Main Thread. Doing so triggers UI jank, thread starvation, and Watchdog terminations (0x8badf00d). Restrict semaphores to background utility queues or replace with async/await structured primitives.",
                hints: ["Explain wait() decrement and signal() increment.", "Explain Watchdog 0x8badf00d crash."],
                keyPoints: [
                    "Counting semaphore mechanics (wait decrements, signal increments)",
                    "Never block the Main Thread with wait()",
                    "Beware of priority inversion and starvation",
                    "Prefer Swift Concurrency primitives in modern codebases"
                ]
            )
        ),
        Question(
            id: "sw-4",
            difficulty: .senior,
            tags: ["ARC", "Memory", "Weak", "Unowned"],
            tr: LocalizedQuestionContent(
                title: "ARC: Weak vs Unowned Referanslar ve Bellek Yönetimi",
                questionText: "Weak ve Unowned referanslar arasındaki farklar nelerdir? Unowned kullanımında yaşanan Safe vs Unsafe ayrımı nedir?",
                idealAnswer: "1. Weak Referans:\n- Referans sayısını artırmaz.\n- Daima Optional (nil olabilir) olmak zorundadır.\n- İşaret ettiği nesne deallocate olduğunda ARC tarafından otomatik olarak 'nil'e set edilir (Zeroing Weak Reference). Bu işlem runtime'da weak table üzerinden takip edilir.\n\n2. Unowned Referans:\n- Referans sayısını artırmaz.\n- Non-optional olarak tanımlanabilir. Yaşam döngüsünün işaret ettiği nesne ile aynı veya daha kısa olduğu durumlarda kullanılır.\n- Nesne deallocate olduğunda 'nil'e çekilmez. Nesne öldükten sonra erişilirse runtime crash (Fatal error: Attempted to read dangling pointer) yaşanır.\n\nUnowned(safe) vs Unowned(unsafe):\n- unowned(safe): Swift'in varsayılanıdır; nesne ölürse runtime kontrolü crash fırlatır.\n- unowned(unsafe): C benzeri ham işaretçidir (assign); bellek kontrolü yapmaz, undefined behavior ve memory corruption yaratabilir.",
                hints: ["Zeroing weak reference kavramından bahsedin.", "Non-optional ve yaşam döngüsü bağına değinin."],
                keyPoints: [
                    "Weak: Daima optional'dır, ARC otomatik olarak nil'e çeker (side table / weak table)",
                    "Unowned: Non-optional olabilir, nil'e çekilmez, nesne öldüğünde erişilirse crash olur",
                    "Unowned(safe) runtime'da kontrol yapar, unowned(unsafe) ham bellek adresine bakar",
                    "Closure'larda retain cycle kırmada [weak self] genellikle en güvenli yaklaşımdır"
                ]
            ),
            en: LocalizedQuestionContent(
                title: "ARC: Weak vs Unowned References and Memory Mechanics",
                questionText: "Differentiate Weak vs Unowned in Swift ARC. What distinguishes unowned(safe) from unowned(unsafe)?",
                idealAnswer: "1. Weak Reference:\n- Non-owning pointer, does not increment strong reference count.\n- Must always be optional (var weak).\n- Automatically zeroed out (set to nil) by runtime side tables when target deallocates.\n\n2. Unowned Reference:\n- Non-owning pointer, non-optional semantics.\n- Assumes lifetime of pointee exceeds or matches the referent.\n- Does not zero out. Accessing a deallocated pointee produces an immediate runtime crash.\n\nSafe vs Unsafe:\n- unowned(safe): Default Swift behavior; performs runtime validity check before dereferencing, raising a clean trap upon access to dead instances.\n- unowned(unsafe): Disables runtime checks (analogous to assign in Obj-C). Accessing dead memory leads to undefined behavior and heap corruption.",
                hints: ["Mention side table / weak table zeroing.", "Explain lifetime relationship expectations."],
                keyPoints: [
                    "Weak is always optional and automatically zeroed out",
                    "Unowned is non-optional and crashes if accessed after deallocation",
                    "unowned(safe) performs trap checks; unowned(unsafe) risks heap corruption",
                    "[weak self] guard-let is the industry standard for asynchronous closures"
                ]
            )
        ),
        Question(
            id: "sw-5",
            difficulty: .senior,
            tags: ["Architecture", "VIPER", "CleanArchitecture"],
            tr: LocalizedQuestionContent(
                title: "VIPER Mimarisi: Sorumluluk Dağılımı ve Clean Architecture",
                questionText: "VIPER mimarisini oluşturan 5 ana bileşen nedir? VIPER'ı MVVM veya MVC'ye göre ne zaman tercih etmelisiniz?",
                idealAnswer: "VIPER (Single Responsibility prensibinin en uç uygulaması):\n1. View: UI gösterimi ve kullanıcı etkileşimlerini Presenter'a bildirme.\n2. Interactor: Saf iş mantığı (business logic), API çağrıları ve veri tabanı sorguları. UI'dan tamamen bağımsızdır.\n3. Presenter: View ile Interactor arasındaki köprü. Veriyi formatlar, View'a ne çizeceğini söyler.\n4. Entity: Basit veri modelleri (structs/codable).\n5. Router (Wireframe): Ekran geçişleri (navigation) ve dependency injection.\n\nNe Zaman Tercih Edilmeli:\n- Çok geniş ekiplerin aynı modül üzerinde çakışmadan çalışması gerektiğinde.\n- Test coverage'ın (%90+) kritik olduğu kurumsal finans/bankacılık uygulamalarında.\n- Küçük veya orta ölçekli projelerde gereksiz 'boilerplate' kod maliyeti getirdiği için MVVM-C daha uygundur.",
                hints: ["5 bileşenin baş harflerini ve görevlerini sayın.", "Büyük ekiplerde ve test edilebilirlikteki avantajını belirtin."],
                keyPoints: [
                    "View, Interactor, Presenter, Entity, Router ayrımı",
                    "Interactor saf iş mantığıdır, UI kütüphanelerinden (UIKit/SwiftUI) bağımsızdır",
                    "Router ekran geçişlerini ve modül oluşturmayı yönetir",
                    "Büyük ekiplerde merge conflict'leri azaltır, küçük projelerde boilerplate fazladır"
                ]
            ),
            en: LocalizedQuestionContent(
                title: "VIPER Architecture: Clean Separation of Concerns",
                questionText: "Name and delineate the 5 core VIPER components. Under which enterprise circumstances does VIPER outweigh MVVM?",
                idealAnswer: "VIPER Components:\n1. View: Passive rendering and user input redirection to the Presenter.\n2. Interactor: Pure business logic, network requests, persistence. Zero UI imports.\n3. Presenter: Orchestrates presentation state; transforms domain entities into display models.\n4. Entity: Plain data models / DTOs.\n5. Router (Wireframe): Handles navigation, module creation, and dependency injection.\n\nWhen to Choose:\n- Large multi-team enterprise environments (e.g. banking/fintech) where modular parallel development and >90% unit test coverage are hard requirements.\n- For small/medium apps, MVVM-Coordinator offers identical testability with significantly less boilerplate.",
                hints: ["List the 5 letters in VIPER.", "Discuss testability and team collaboration overhead."],
                keyPoints: [
                    "Strict single-responsibility separation across 5 distinct layers",
                    "Interactor contains zero UI framework references",
                    "Router decouples presentation from navigation stack",
                    "Reduces git merge conflicts in large teams at the expense of boilerplate"
                ]
            )
        ),
        Question(
            id: "and-1",
            difficulty: .mid,
            tags: ["Android", "Kotlin", "Compose"],
            tr: LocalizedQuestionContent(
                title: "Jetpack Compose: Recomposition ve State Hoisting",
                questionText: "Compose'da Recomposition nedir? State Hoisting prensibi neden uygulanmalıdır ve performansa etkisi nedir?",
                idealAnswer: "Recomposition, state değiştiğinde composable fonksiyonun yeniden çalışmasıdır. State Hoisting ile bileşen stateless yapılır; bu da test edilebilirliği, tekrar kullanımı ve önizleme kolaylığını maksimize eder.",
                hints: ["Stateless bileşenlerin avantajlarını düşünün."],
                keyPoints: ["Stateless bileşenler", "Tek yönlü veri akışı (UDF)", "Test edilebilirlik"]
            ),
            en: LocalizedQuestionContent(
                title: "Jetpack Compose: Recomposition and State Hoisting",
                questionText: "What is Recomposition in Jetpack Compose? Why should State Hoisting be strictly applied, and what is its performance impact?",
                idealAnswer: "Recomposition is the execution cycle where composable functions re-run when state changes. State hoisting separates state ownership from presentation, creating stateless components that maximize testability and avoid redundant recompositions.",
                hints: ["Consider the benefits of stateless composables."],
                keyPoints: ["Stateless composables", "Unidirectional Data Flow (UDF)", "Testability & Reusability"]
            )
        )
    ]
}
