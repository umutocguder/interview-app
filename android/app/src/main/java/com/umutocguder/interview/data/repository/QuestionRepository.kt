package com.umutocguder.interview.data.repository

import com.umutocguder.interview.data.model.*

object QuestionRepository {
    val categories = listOf(
        Category(
            id = "cat-all",
            slug = "all",
            icon = "layers",
            displayOrder = 1,
            tr = LocalizedCategoryContent("Tüm Sorular", "Tüm platform ve diller"),
            en = LocalizedCategoryContent("All Questions", "All platforms and categories")
        ),
        Category(
            id = "cat-android",
            slug = "android",
            icon = "android",
            displayOrder = 2,
            tr = LocalizedCategoryContent("Android & Kotlin", "Compose, Coroutines & MVI"),
            en = LocalizedCategoryContent("Android & Kotlin", "Compose, Coroutines & MVI")
        ),
        Category(
            id = "cat-swift",
            slug = "swift-all",
            icon = "apple",
            displayOrder = 3,
            tr = LocalizedCategoryContent("🍏 Swift & iOS Master", "Umut'un Özel Mülakat Notları"),
            en = LocalizedCategoryContent("🍏 Swift & iOS Master", "Umut's Master Apple Notes")
        ),
        Category(
            id = "cat-web",
            slug = "web",
            icon = "globe",
            displayOrder = 4,
            tr = LocalizedCategoryContent("Web & Next.js", "Next.js 15, React 19 & TS"),
            en = LocalizedCategoryContent("Web & Next.js", "Next.js 15, React 19 & TS")
        ),
        Category(
            id = "cat-db",
            slug = "backend",
            icon = "database",
            displayOrder = 5,
            tr = LocalizedCategoryContent("Backend & Supabase", "Postgres, RLS & Edge Functions"),
            en = LocalizedCategoryContent("Backend & Supabase", "Postgres, RLS & Edge Functions")
        )
    )

    val questions = listOf(
        Question(
            id = "and-1",
            difficulty = DifficultyLevel.MID,
            tags = listOf("Android", "Kotlin", "Compose"),
            tr = LocalizedContent(
                title = "Jetpack Compose: Recomposition ve State Hoisting",
                questionText = "Compose'da Recomposition nedir? State Hoisting prensibi neden uygulanmalıdır ve performansa etkisi nedir?",
                idealAnswer = "Recomposition, state değiştiğinde composable fonksiyonun yeniden çalışmasıdır. State Hoisting ile bileşen stateless yapılır; bu da test edilebilirliği, tekrar kullanımı ve önizleme kolaylığını maksimize eder.",
                hints = listOf("Stateless bileşenlerin avantajlarını düşünün."),
                keyPoints = listOf("Stateless bileşenler", "Tek yönlü veri akışı (UDF)", "Test edilebilirlik")
            ),
            en = LocalizedContent(
                title = "Jetpack Compose: Recomposition and State Hoisting",
                questionText = "What is Recomposition in Jetpack Compose? Why should State Hoisting be strictly applied, and what is its performance impact?",
                idealAnswer = "Recomposition is the execution cycle where composable functions re-run when state changes. State hoisting separates state ownership from presentation, creating stateless components that maximize testability and avoid redundant recompositions.",
                hints = listOf("Consider the benefits of stateless composables."),
                keyPoints = listOf("Stateless composables", "Unidirectional Data Flow (UDF)", "Testability & Reusability")
            )
        ),
        Question(
            id = "and-2",
            difficulty = DifficultyLevel.SENIOR,
            tags = listOf("Kotlin", "Coroutines", "Threading"),
            tr = LocalizedContent(
                title = "Kotlin Coroutines vs Threads: Hafiflik ve İptal Mekanizması",
                questionText = "Coroutines neden lightweight threads olarak adlandırılır? Cooperative Cancellation prensibi nasıl işler?",
                idealAnswer = "Coroutines OS seviyesinde değil, kullanıcı alanı (user-space) seviyesinde yönetilir. Milyonlarca coroutine bir avuç OS thread üzerinde suspend/resume edilerek çalıştırılabilir. İptal işlemi işbirlikçidir (cooperative); kod içinde isActive kontrolü veya yield()/delay() çağrıları ile CancellationException yakalanarak güvenli kapatılır.",
                hints = listOf("Suspend ve resume kavramlarına değinin.", "CancellationException mekanizmasını özetleyin."),
                keyPoints = listOf("User-space scheduling (OS thread bloklamaz)", "Cooperative Cancellation ve isActive denetimi", "Düşük bellek ayak izi")
            ),
            en = LocalizedContent(
                title = "Kotlin Coroutines vs Threads: Cooperative Cancellation",
                questionText = "Why are Coroutines termed lightweight threads? How does Cooperative Cancellation function under Structured Concurrency?",
                idealAnswer = "Coroutines execute within user space, suspending and resuming on a small thread pool without kernel thread context switching overhead. Cancellation is cooperative: coroutines check their isActive flag or invoke suspending functions (delay, yield) which throw CancellationException to gracefully unwind resources.",
                hints = listOf("Contrast user space suspension with kernel threads.", "Explain CancellationException handling."),
                keyPoints = listOf("User space suspension without kernel context switches", "Cooperative cancellation via isActive / CancellationException", "Structured Concurrency hierarchy")
            )
        ),
        Question(
            id = "sw-1",
            difficulty = DifficultyLevel.SENIOR,
            tags = listOf("Swift", "SwiftUI", "iOS"),
            tr = LocalizedContent(
                title = "SwiftUI Observation vs ObservableObject: Mimari ve Performans",
                questionText = "iOS 17 ile gelen @Observable makrosu ile eski ObservableObject protokolü arasındaki farklar ve performans avantajları nelerdir?",
                idealAnswer = "@Observable property-level tracking yaparak sadece okunan değişken değiştiğinde View'ı tetikler. Combine ve @Published bağımlılığını kaldırır, gereksiz re-render döngülerini engeller.",
                hints = listOf("Property-level tracking mekanizmasını düşünün."),
                keyPoints = listOf("Property-level dependency tracking", "Gereksiz render döngülerinin engellenmesi", "Combine bağımlılığının kalkması")
            ),
            en = LocalizedContent(
                title = "SwiftUI Observation vs ObservableObject: Architectural Performance",
                questionText = "What are the core differences and performance advantages of the iOS 17 @Observable macro compared to the legacy ObservableObject protocol?",
                idealAnswer = "@Observable introduces fine-grained property-level dependency tracking, re-rendering only views that read the mutated field. It removes the Combine publisher overhead and simplifies state management to plain @State.",
                hints = listOf("Highlight property-level tracking."),
                keyPoints = listOf("Property-level tracking", "Zero Combine dependency", "Elimination of redundant view invalidations")
            )
        ),
        Question(
            id = "sw-2",
            difficulty = DifficultyLevel.SENIOR,
            tags = listOf("Swift", "Concurrency", "Actors"),
            tr = LocalizedContent(
                title = "Swift Concurrency: Actor Reentrancy ve Deadlock Önleme",
                questionText = "Swift Concurrency'de Actor reentrancy nedir? Neden deadlock riskini önlerken unexpected state hatalarına yol açabilir?",
                idealAnswer = "Actor await sırasında kendini serbest bırakır (suspension point) ve araya başka task'ların girmesine izin verir. Bu deadlock'u engeller ancak await sonrasında state tutarsızlığına (inconsistency) yol açabilir.",
                hints = listOf("Await bir suspension point'tir."),
                keyPoints = listOf("Suspension point serbestliği", "Deadlock önleme", "State tutarsızlığı riski")
            ),
            en = LocalizedContent(
                title = "Swift Concurrency: Actor Reentrancy and Race Prevention",
                questionText = "What is Actor Reentrancy in Swift Concurrency? Why does it prevent deadlocks yet risk unexpected state inconsistencies?",
                idealAnswer = "Suspension points (await) permit an actor to execute newly queued messages while awaiting completion, eliminating mutual exclusion deadlocks at the expense of potential state drift across suspension boundaries.",
                hints = listOf("Await suspends and releases the actor."),
                keyPoints = listOf("Actor suspension releasing thread", "Elimination of deadlocks", "State drift across await boundaries")
            )
        )
    )
}
