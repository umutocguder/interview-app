import { Question } from "@/lib/types";

export const SWIFT_MASTER_QUESTIONS: Question[] = [
  // MARK: - SwiftUI & State
  {
    id: "sw-1",
    difficulty: "mid",
    q_type: "technical",
    tags: ["SwiftUI", "State", "Architecture", "iOS 14+"],
    tr: {
      title: "SwiftUI State Hiyerarşisi: @State, @StateObject, @ObservedObject ve @EnvironmentObject",
      question_text: "@State, @StateObject, @ObservedObject ve @EnvironmentObject property wrapper'ları arasındaki farklar nelerdir? Hangisi ne zaman ve nerede oluşturulmalıdır?",
      ideal_answer: "@State: Yalnızca tanımlandığı View'a ait basit değer türleri (struct, Int, String vb.) için kullanılır ve View'ın lokal state'ini yönetir.\n@StateObject: ViewModel gibi ObservableObject referans tiplerinin View yaşam döngüsü boyunca ilk kez oluşturulduğu (instantiate edildiği) yerde kullanılır. View yeniden render edildiğinde nesne yok edilmez ve baştan başlatılmaz.\n@ObservedObject: Dışarıdan veya üst View'dan parametre olarak aktarılan ObservableObject nesnelerini izlemek için kullanılır; nesnenin sahipliğini (ownership) üstlenmez.\n@EnvironmentObject: View ağacında (View Tree) derin hiyerarşilerde veriyi elle katman katman paslamak yerine (Explicit DI), enjekte edildiği View'ın tüm alt çocuklarına dolaylı (Implicit DI) olarak aktaran paylaşımlı state aracıdır.",
      hints: [
        "ViewModel'in nerede oluşturulduğuna (ownership) dikkat edin.",
        "@EnvironmentObject'in View Tree boyunca nasıl aktarıldığını düşünün.",
        "View yeniden çizildiğinde @ObservedObject'in re-initialize olma riskini hatırlayın."
      ],
      key_points: [
        "@State lokal basit değerler içindir",
        "@StateObject ViewModel'i baştan oluşturur ve yaşam döngüsünü korur",
        "@ObservedObject dışarıdan gelen nesneyi izler",
        "@EnvironmentObject view tree boyunca implicit DI sağlar"
      ]
    },
    en: {
      title: "SwiftUI State Hierarchy: @State, @StateObject, @ObservedObject and @EnvironmentObject",
      question_text: "What are the core differences between @State, @StateObject, @ObservedObject, and @EnvironmentObject? When and where should each be instantiated?",
      ideal_answer: "@State: Dedicated to local value types (structs, primitives) owned directly by the view.\n@StateObject: Used to instantiate an ObservableObject (like a ViewModel) for the first time. It guarantees that the instance persists across view re-renders without being recreated.\n@ObservedObject: Used when receiving a pre-existing ObservableObject passed down from an ancestor. It does NOT own the lifecycle, meaning creating it inside the view risks re-initialization on every render.\n@EnvironmentObject: Provides ambient dependency injection (Implicit DI) across the View Tree. Once injected into a parent view, all descendants can access the shared object without manual parameter drilling.",
      hints: [
        "Focus on lifecycle ownership between @StateObject and @ObservedObject.",
        "Highlight parameter drilling vs ambient dependency injection.",
        "Consider view body re-evaluations."
      ],
      key_points: [
        "@State manages local ephemeral value types",
        "@StateObject owns ViewModel instantiation across view lifecycles",
        "@ObservedObject observes externally created instances",
        "@EnvironmentObject provides implicit DI across the view hierarchy"
      ]
    }
  },
  {
    id: "sw-2",
    difficulty: "senior",
    q_type: "technical",
    tags: ["SwiftUI", "ViewTree", "ViewBuilder", "Render"],
    tr: {
      title: "SwiftUI ViewTree ve some View Render Döngüsü",
      question_text: "SwiftUI'da 'some View' nedir? ViewTree nasıl render edilir ve @ViewBuilder nasıl çalışır?",
      ideal_answer: "'some View', Swift'in Opaque Return Type özelliğidir. Derleyiciye body'nin 'View protokolüne uyan somut tek bir tip' döndüreceğini garanti eder ancak tipin tam adını gizleyerek API esnekliği sağlar.\n@ViewBuilder, Result Builder sözdizimini kullanarak birden fazla alt görünümü tek bir TupleView veya ConditionalContent yapısına dönüştürür.\nSwiftUI, View struct'larını çok hafif tutar. State veya Published bir özellik değiştiğinde diffing algoritması eski ve yeni ViewTree'yi karşılaştırır ve yalnızca değişen gerçek ekran piksellerini UIKit/Render sunucusuna yansıtır.",
      hints: [
        "Opaque Return Types prensibini açıklayın.",
        "Result Builder mantığını vurgulayın.",
        "Diffing algoritması ve body'nin yeniden çalışması üzerinde durun."
      ],
      key_points: [
        "some View opaque return type sağlar",
        "@ViewBuilder birden fazla bileşeni TupleView/ConditionalContent'e paketler",
        "Diffing algoritması ile sadece değişen pikseller güncellenir",
        "View'lar hafif immutable struct'lardır"
      ]
    },
    en: {
      title: "SwiftUI ViewTree & some View Render Lifecycle",
      question_text: "What does 'some View' represent in SwiftUI? How does the ViewTree render, and how does @ViewBuilder operate behind the scenes?",
      ideal_answer: "'some View' leverages Swift's Opaque Return Types. It tells the compiler that body returns a single concrete type conforming to View, while keeping the complex nested generic type private from the API surface.\n@ViewBuilder is a Result Builder that aggregates child views into a compound type (such as TupleView or _ConditionalContent).\nSwiftUI views are lightweight, immutable structs. When state changes, SwiftUI re-evaluates the view's body, runs a structural diff against the previous ViewTree graph, and commits only the actual dirty nodes to the underlying Core Animation render server.",
      hints: [
        "Explain opaque return types and compiler type inference.",
        "Describe how Result Builders compose views into TupleViews.",
        "Differentiate body re-evaluation from Core Animation drawing."
      ],
      key_points: [
        "some View provides compile-time type safety with opaque types",
        "@ViewBuilder transforms statements into TupleViews or conditional containers",
        "Diffing algorithm ensures only mutated nodes trigger graphics pipeline redraws",
        "Views are lightweight blueprints, not persistent retained objects"
      ]
    }
  },
  {
    id: "sw-3",
    difficulty: "senior",
    q_type: "technical",
    tags: ["SwiftUI", "Performance", "Instruments", "Debugging"],
    tr: {
      title: "SwiftUI Timer & Render Performans Problemini Teşhis Etme",
      question_text: "SwiftUI uygulamasında her saniye tetiklenen bir Timer UI performans sorunlarına ve gereksiz render döngülerine yol açıyor. Bu sorunu nasıl tespit eder ve çözersiniz?",
      ideal_answer: "Teşhis: Xcode Instruments altındaki 'SwiftUI Instruments' ve 'Time Profiler' araçları kullanılarak View body çalışma frekansı incelenir. Kod içinde `let _ = Self._printChanges()` çağrısı yapılarak konsolda hangi state değişkeninin body'yi sürekli tetiklediği görülür.\nÇözüm:\n1. State Izolasyonu: Timer'a bağımlı olan alanı ana View'dan ayırıp ayrı küçük bir alt View (subview) içine izole etmek.\n2. iOS 17 @Observable: Eski ObservableObject tüm View'ı tetiklerken @Observable property-level tracking yapar.\n3. TimelineView: Sık zaman güncellemeleri için TimelineView(.periodic(...)) tercih edilmelidir.",
      hints: [
        "Self._printChanges() debug tekniğini hatırlayın.",
        "State'i küçük bir alt bileşene izole etme yaklaşımını düşünün.",
        "TimelineView bileşenini belirtin."
      ],
      key_points: [
        "Self._printChanges() ile tetikleyici tespiti",
        "Zamanlayıcı state'ini alt bileşene izole etme",
        "iOS 17 @Observable ile property-level tracking",
        "TimelineView periyodik optimizasyonu"
      ]
    },
    en: {
      title: "Diagnosing & Eliminating SwiftUI Timer Render Jank",
      question_text: "A 1-second interval Timer in a SwiftUI screen is causing severe UI stutter and redundant body evaluations. How do you diagnose and eliminate this issue?",
      ideal_answer: "Diagnosis: Inspect body execution count using the SwiftUI Instruments template or insert `let _ = Self._printChanges()` inside the view's body to identify exactly which property triggered invalidation.\nSolutions:\n1. Subview Isolation: Extract the timer text into a dedicated miniature subview so re-evaluating body is constrained to only that label rather than the entire complex view hierarchy.\n2. iOS 17 @Observable: Replaces Combine-based ObservableObject with fine-grained observation, ensuring views re-evaluate only when observed properties mutate.\n3. TimelineView: Replace Foundation Timers with `TimelineView(.periodic(...))` for native scheduler-synchronized cadence.",
      hints: [
        "Mention Self._printChanges() for console diagnostics.",
        "Discuss state isolation into dedicated subviews.",
        "Reference iOS 17 @Observable macro and TimelineView."
      ],
      key_points: [
        "Identify invalidating state via Self._printChanges()",
        "Isolate high-frequency state to leaf views",
        "Leverage iOS 17 @Observable for property-level tracking",
        "Adopt TimelineView for cadence-based temporal updates"
      ]
    }
  },

  // MARK: - Concurrency & GCD
  {
    id: "sw-4",
    difficulty: "senior",
    q_type: "technical",
    tags: ["Concurrency", "Actors", "Reentrancy", "Swift 6"],
    tr: {
      title: "Swift Concurrency: Actor Mimarisi, Data Isolation ve Reentrancy",
      question_text: "Swift Concurrency içindeki Actor tipi ne işe yarar? Class'tan farkı nedir ve Actor Reentrancy tehlikesi nasıl yönetilir?",
      ideal_answer: "Actor, class gibi referans tiplidir ancak dahili mutable state'ini 'Data Isolation' mekanizmasıyla korur. Dışarıdan actor'ün metodlarına erişirken `await` zorunlu tutulur ve işlemler sıralı (serialized) hale getirilerek derleme zamanında data race kesin olarak önlenir.\nActor Reentrancy: Bir actor metodu içinde `await` ile asenkron bir işlem beklenirken, actor kilidi serbest kalır ve araya başka bir görev girerek actor'ün state'ini değiştirebilir. Await sonrasında state'in ilk çağrıldığı andakiyle aynı kalacağı varsayılmamalıdır. Çözüm olarak await sonrası state doğrulanmalı veya kritik state güncellemeleri senkron alt metodlar içinde atomik tutulmalıdır.",
      hints: [
        "Data race'in derleme zamanında önlenmesini belirtin.",
        "await noktasında actor kilidinin serbest kaldığını vurgulayın.",
        "Reentrancy sırasında araya başka task girebileceğini açıklayın."
      ],
      key_points: [
        "Actor mutable state'e erişimi serialize eder",
        "Derleme zamanında data-race safety garantisi",
        "Actor Reentrancy: await sırasında araya başka görev girebilir",
        "Suspension point sonrası state doğrulaması yapılmalıdır"
      ]
    },
    en: {
      title: "Swift Concurrency: Actor Architecture, Data Isolation & Reentrancy",
      question_text: "What is an Actor in Swift? How does it differ from a Class, and how do you handle Actor Reentrancy hazards?",
      ideal_answer: "An Actor is a reference type with automatic data isolation. It guarantees synchronized sequential access to its mutable state across concurrent threads. External calls require `await`, enforcing thread safety at compile time without manual mutexes.\nActor Reentrancy: When an actor method suspends at an `await` point (e.g. network call), the actor is unlocked, permitting other tasks to run on the actor before the original method resumes. As a result, internal state may mutate across the suspension point. To mitigate state drift, re-validate invariants after each `await` or perform state mutations atomically in synchronous helper methods.",
      hints: [
        "Clarify how actors serialize state access.",
        "Explain that await suspension points release the actor lock.",
        "Describe techniques to prevent state corruption across suspension."
      ],
      key_points: [
        "Actors serialize mutable state access preventing data races",
        "Compile-time safety verified through actor isolation",
        "Actor reentrancy permits intermediate task execution during await",
        "State invariants must be re-checked after any suspension point"
      ]
    }
  },
  {
    id: "sw-5",
    difficulty: "mid",
    q_type: "technical",
    tags: ["Concurrency", "MainActor", "nonisolated", "Swift 5.9+"],
    tr: {
      title: "@MainActor ve nonisolated Kullanım Alanları",
      question_text: "Swift Concurrency'de @MainActor ve nonisolated anahtar sözcükleri ne zaman kullanılır? Bir actor içinde nonisolated bir metod ne anlama gelir?",
      ideal_answer: "@MainActor: İlgili sınıfın, fonksiyonun veya özelliğin daima Main Thread üzerinde çalışacağını garanti eden bir Global Actor'dür. Kullanıcı arayüzü güncellemeleri ve ViewModel sınıfları için zorunludur.\nnonisolated: Bir Actor içindeki belirli bir metodun veya immutable özelliğin actor izolasyonundan muaf tutulduğunu belirtir. Bu sayede dışarıdan erişirken `await` kullanmaya gerek kalmaz. Sadece actor'ün mutable state'ine dokunmayan, immutable (let) değerleri okuyan veya protokol uyumluluğu gerektiren yerlerde kullanılır.",
      hints: [
        "UI güncellemeleri için @MainActor zorunluluğunu düşünün.",
        "nonisolated metodların mutable state'e erişemeyeceğini unutmayın."
      ],
      key_points: [
        "@MainActor ana iş parçacığı garantisi verir",
        "UI ve ViewModel bileşenlerinde @MainActor esastır",
        "nonisolated actor kilidine girmeden senkron çağrıya izin verir",
        "nonisolated metodlar mutable state'i değiştiremez"
      ]
    },
    en: {
      title: "@MainActor vs nonisolated in Modern Swift",
      question_text: "When should you apply @MainActor and nonisolated? What are the capabilities and restrictions of a nonisolated method inside an actor?",
      ideal_answer: "@MainActor: A global actor executing all decorated declarations strictly on the Main Thread. It is vital for SwiftUI ViewModels, UIKit view controllers, and UI binding properties.\nnonisolated: Explicitly opts out an actor member from actor isolation, allowing callers to invoke it synchronously without `await`. A nonisolated method cannot access any mutable isolated state; it may only read immutable stored properties (`let`) or conform to synchronous protocols (e.g. CustomStringConvertible, Hashable).",
      hints: [
        "Tie @MainActor to UI thread affinity.",
        "Emphasize that nonisolated functions cannot mutate actor state.",
        "Mention protocol conformance scenarios."
      ],
      key_points: [
        "@MainActor binds execution to the main run loop for UI work",
        "nonisolated bypasses actor scheduling overhead for synchronous callers",
        "nonisolated cannot read or mutate isolated mutable state",
        "Frequently required for protocol conformances like Equatable or Hashable"
      ]
    }
  },
  {
    id: "sw-6",
    difficulty: "senior",
    q_type: "technical",
    tags: ["Swift 6", "Sendable", "Strict Concurrency", "Thread Safety"],
    tr: {
      title: "Swift 6 Strict Concurrency ve Sendable Protokolü",
      question_text: "Swift 6 ile gelen Strict Concurrency Checking nedir? Sendable protokolü neyi garanti eder ve closure'larda @Sendable neden zorunludur?",
      ideal_answer: "Swift 6 Strict Concurrency, eşzamanlı kodlarda veri yarışlarını (data races) derleme zamanında tamamen engellemeyi hedefler.\nSendable: Değerinin veya referansının farklı thread'ler veya actor sınırları arasında güvenle aktarılabileceğini belirten protokoldür. Struct ve Enum gibi Value Type'lar doğal olarak Sendable'dır. Class'lar ise ancak `final` ve tüm alanları `let` ise veya dahili kilit mekanizmasıyla korunuyorsa (`@unchecked Sendable`) Sendable olabilir.\n@Sendable: Farklı bir Task'a aktarılacak closure'ların yakaladığı (capture) değerlerin thread-safe olmasını zorunlu kılar; mutable referans yakalanmasını derleme hatasıyla engeller.",
      hints: [
        "Actor sınırları arasında veri aktarımını düşünün.",
        "Class'ların neden varsayılan olarak Sendable olmadığını açıklayın.",
        "Mutable capture tehlikesini ve @Sendable korumasını belirtin."
      ],
      key_points: [
        "Derleme zamanında data race kesin engelleme",
        "Sendable: thread'ler arası güvenle aktarılabilen tipler",
        "Value type'lar doğal Sendable, class'lar immutable veya kilitli olmalı",
        "@Sendable mutable closure capture durumlarını önler"
      ]
    },
    en: {
      title: "Swift 6 Strict Concurrency & Sendable Contract",
      question_text: "What does Swift 6 Strict Concurrency enforce? What guarantees does Sendable provide, and why is @Sendable required for concurrency closures?",
      ideal_answer: "Swift 6 guarantees complete compile-time data race elimination.\nSendable: A marker protocol verifying that a type can safely cross isolation domains (threads/actors). Value types composed of Sendable properties are implicitly Sendable. Reference types must be `final` with immutable (`let`) stored properties, or explicitly synchronize state using locks under `@unchecked Sendable`.\n@Sendable: Applied to closures executed concurrently (such as Task initializers). It mandates that all captured state conforms to Sendable and forbids capturing mutable `var` references.",
      hints: [
        "Explain isolation domain boundaries.",
        "Clarify reference type constraints for Sendable.",
        "Explain why mutable captures inside concurrent closures trigger compiler errors."
      ],
      key_points: [
        "Guarantees compile-time data race safety under Swift 6",
        "Sendable types can be safely shared across concurrent domains",
        "Classes require final + immutable let or thread synchronization",
        "@Sendable prevents capturing mutable variables in async closures"
      ]
    }
  },
  {
    id: "sw-7",
    difficulty: "mid",
    q_type: "technical",
    tags: ["GCD", "DispatchQueue", "Threading", "Concurrency"],
    tr: {
      title: "Grand Central Dispatch: Serial vs Concurrent Queue ve Main Queue",
      question_text: "Grand Central Dispatch'te (GCD) Serial ve Concurrent kuyruk farkları nelerdir? Main queue neden özeldir ve yeni kuyruk açıldığında yeni thread açılır mı?",
      ideal_answer: "Serial Queue: Görevleri FIFO sırasıyla teker teker çalıştırır. Bir önceki görev bitmeden diğeri başlamaz. Thread safety sağlamak için idealdir.\nConcurrent Queue: Görevleri FIFO sırasıyla başlatır ancak bitmelerini beklemeden birden fazla görevi aynı anda paralel iş parçacıklarında yürütebilir.\nMain Queue: UI işlemlerinin çalıştığı özel bir Serial Queue'dur ve daima Main Thread'e bağlıdır.\nYeni kuyruk açıldığında otomatik yeni thread açılmaz: Kuyruk bir iş listesidir; Thread işletim sistemi kaynağıdır. GCD, sistem durumuna göre Thread Pool içindeki uygun boş thread'i atar veya gerekirse yeni thread oluşturur.",
      hints: [
        "Kuyruk (Queue) ile İş Parçacığı (Thread) ayrımına dikkat edin.",
        "Thread Pool mantığını açıklayın.",
        "Main Queue'nun serial olduğunu belirtin."
      ],
      key_points: [
        "Serial queue görevleri sırayla tekil yürütür (FIFO)",
        "Concurrent queue görevleri paralel başlatabilir",
        "Main queue özel bir serial kuyruktur (Main Thread)",
        "Kuyruk açmak doğrudan yeni thread açmaz, Thread Pool yönetir"
      ]
    },
    en: {
      title: "GCD: Serial vs Concurrent Queues & Thread Pool Management",
      question_text: "Contrast Serial and Concurrent dispatch queues. What makes the Main Queue unique, and does creating a new queue spin up a new OS thread?",
      ideal_answer: "Serial Queue: Executes tasks sequentially one at a time in strict FIFO order. Only one task runs at any given moment, making it an excellent lightweight synchronization primitive.\nConcurrent Queue: Dispatches tasks in FIFO order but executes them concurrently across available threads without waiting for prior tasks to complete.\nMain Queue: A dedicated serial queue bound exclusively to the application's Main Thread for UI rendering.\nThread Allocation: Creating a queue does NOT directly instantiate a kernel thread. GCD maintains an adaptive Thread Pool. The runtime dynamically maps tasks to threads based on system load, QoS, and core availability.",
      hints: [
        "Decouple the concept of a work queue from OS threads.",
        "Explain thread pool recycling and saturation prevention.",
        "Highlight the serial nature of the main thread."
      ],
      key_points: [
        "Serial queues execute one task at a time (FIFO)",
        "Concurrent queues execute multiple tasks simultaneously",
        "Main queue is a dedicated serial queue on thread 1",
        "GCD maps queues to an OS-managed thread pool dynamically"
      ]
    }
  },
  {
    id: "sw-8",
    difficulty: "mid",
    q_type: "technical",
    tags: ["GCD", "DispatchWorkItem", "Debounce", "Concurrency"],
    tr: {
      title: "DispatchWorkItem: İptal ve Bildirim Mekanizmaları",
      question_text: "DispatchWorkItem nedir? Hangi senaryolarda tercih edilir ve cancel(), notify(), wait() metodları ne işe yarar?",
      ideal_answer: "DispatchWorkItem, GCD üzerinde çalıştırılacak bir kod bloğunu nesne olarak kapsülleyen yapıdır. Normal closure'lardan farklı olarak iptal edilebilme, bağımlılık oluşturma ve tamamlanma bildirimi dinleme yeteneği sunar.\nKullanım: Arama çubuğunda kullanıcının her harf yazışında önceki istekleri iptal eden 'Debouncing' mekanizmaları için idealdir.\nMetodlar:\n- cancel(): Başlamamış işi kuyruktan siler; çalışan işin isCancelled bayrağını true yapar.\n- notify(queue:execute:): İş bittiğinde başka bir kuyrukta callback tetikler.\n- wait(): İş tamamlanana kadar çağıran thread'i bloke eder.",
      hints: [
        "SearchBar debouncing örneğini aklınıza getirin.",
        "cancel() metodunun çalışan işi anında öldürmeyeceğini, bayrak set ettiğini belirtin."
      ],
      key_points: [
        "Görevleri nesne olarak kapsülleyip yönetme imkanı",
        "Debounce ve arama optimizasyonlarında yaygın kullanım",
        "cancel() başlamamış işi iptal eder veya isCancelled bayrağını işaretler",
        "notify() işlem bitiminde başka bir kuyrukta tetiklenir"
      ]
    },
    en: {
      title: "DispatchWorkItem: Cancellation, Chaining & Debouncing",
      question_text: "What is DispatchWorkItem? In which real-world scenarios is it ideal, and how do cancel(), notify(), and wait() behave?",
      ideal_answer: "A DispatchWorkItem encapsulates a block of work into an inspectable object. Unlike raw closures, it provides explicit cancellation, state tracking, and completion signaling.\nUse-Case: Search bar debouncing—canceling in-flight work items when the user types consecutive keystrokes before network dispatch.\nMethods:\n- `cancel()`: If pending in queue, removes execution. If already running, sets `isCancelled = true`.\n- `notify(queue:execute:)`: Fires a completion closure on a target queue (e.g. main) once finished.\n- `wait()`: Synchronously blocks the caller until the work item completes.",
      hints: [
        "Walk through a search bar debouncing implementation.",
        "Emphasize that cancel() sets an isCancelled flag for active tasks.",
        "Contrast notify() with callback closures."
      ],
      key_points: [
        "Encapsulates tasks with cancellation and dependency features",
        "Industry standard for search debouncing and throttling",
        "cancel() flags isCancelled or removes pending queue items",
        "notify() schedules a downstream task upon completion"
      ]
    }
  },
  {
    id: "sw-9",
    difficulty: "senior",
    q_type: "technical",
    tags: ["GCD", "DispatchSemaphore", "Throttling", "Concurrency"],
    tr: {
      title: "DispatchSemaphore ile Eşzamanlı İstek Sınırlama",
      question_text: "DispatchSemaphore nedir? signal() ve wait() metodları nasıl çalışır ve hangi gerçek hayat senaryosunda kullanılır?",
      ideal_answer: "DispatchSemaphore, paylaşılan bir kaynağa aynı anda erişebilecek maksimum görev sayısını kontrol etmek için sayaç (counter) mekanizması kullanan senkronizasyon aracıdır.\nNasıl Çalışır:\n- Başlangıç değeri verilir (örn. `DispatchSemaphore(value: 3)`).\n- `wait()`: Sayacı 1 azaltır. Sayaç < 0 ise thread bloke olur.\n- `signal()`: Sayacı 1 artırır. Bekleyen thread varsa uyandırılır.\nGerçek Hayat Örneği: 50 adet görsel indirilirken sunucuyu ve belleği boğmamak için aynı anda en fazla 3 indirme yapılmasına izin veren Throttling mekanizması.",
      hints: [
        "Sayaç mantığını (value) net ifade edin.",
        "wait() sayacı düşürür, signal() sayacı artırır.",
        "Görsel indirme havuzu örneğini verin."
      ],
      key_points: [
        "Sayaç tabanlı eşzamanlı işlem sınırlayıcı",
        "wait() sayacı 1 azaltır ve gerekirse bekletir",
        "signal() sayacı 1 artırır ve bekleyen thread'i serbest bırakır",
        "Aynı anda maksimum N adet ağ isteği çalıştırmak için kullanılır"
      ]
    },
    en: {
      title: "Concurrency Throttling with DispatchSemaphore",
      question_text: "How does DispatchSemaphore control concurrent access? How do wait() and signal() manage resource permits, and what is a production use-case?",
      ideal_answer: "DispatchSemaphore regulates concurrent access to limited resources using an atomic counting mechanism.\nHow it works:\n- Initialized with an integer permit count (e.g. `DispatchSemaphore(value: 3)`).\n- `wait()`: Decrements the permit counter. If counter < 0, the thread halts execution and blocks until a permit is freed.\n- `signal()`: Increments the counter and awakens the highest-priority blocked thread.\nProduction Scenario: Limiting concurrent batch photo uploads to 3 simultaneous connections, avoiding socket exhaustion and memory pressure.",
      hints: [
        "Explain the internal counting permit system.",
        "Detail the blocking behavior of wait().",
        "Give the batch network download throttling example."
      ],
      key_points: [
        "Provides counting-based resource concurrency limits",
        "wait() decrements permit count and blocks when depleted",
        "signal() increments counter and releases waiting threads",
        "Prevents memory spikes and socket saturation during batch jobs"
      ]
    }
  },
  {
    id: "sw-10",
    difficulty: "mid",
    q_type: "technical",
    tags: ["GCD", "DispatchGroup", "Networking", "Concurrency"],
    tr: {
      title: "DispatchGroup ile Çoklu Asenkron İstekleri Birleştirme",
      question_text: "DispatchGroup nedir? enter(), leave(), notify() ve wait() metodları asenkron ağ isteklerinde nasıl koordine edilir?",
      ideal_answer: "DispatchGroup, birden fazla bağımsız asenkron görevin tamamlanmasını tek bir çatı altında izlemek için kullanılır.\nMetodlar:\n- `enter()`: Gruba yeni bir asenkron görevin başladığını bildirir (+1).\n- `leave()`: Görevin bittiğini bildirir (-1). Her enter çağrısına tam bir leave karşılık gelmelidir.\n- `notify(queue:execute:)`: Gruptaki tüm görevler bittiğinde belirtilen kuyrukta asenkron olarak tetiklenir.\n- `wait(timeout:)`: Görevler bitene kadar çağıran thread'i senkron olarak bekletir.\nSenaryo: Dashboard açılırken profil, bildirim ve bakiye servislerine aynı anda paralel istek atıp, tümü bittiğinde tek seferde loader'ı kaldırmak.",
      hints: [
        "enter() ve leave() çiftlerinin dengeli olmasını vurgulayın.",
        "notify() metodunun UI thread'de çalıştırılma kolaylığını belirtin."
      ],
      key_points: [
        "Birden fazla paralel asenkron görevin bitişini senkronize eder",
        "enter() sayacı artırır, leave() azaltır (çiftler eşit olmalı)",
        "notify() tüm işler bittiğinde UI'ı tetikler",
        "wait() senkron bekleme sağlar"
      ]
    },
    en: {
      title: "Synchronizing Async Tasks via DispatchGroup",
      question_text: "What is DispatchGroup? How do enter(), leave(), notify(), and wait() coordinate multi-service network fetches?",
      ideal_answer: "DispatchGroup aggregates multiple disjoint asynchronous tasks into a unified monitoring context.\nOperations:\n- `enter()`: Explicitly registers that a task has joined the group (increments counter).\n- `leave()`: Signals that an asynchronous task has concluded (decrements counter). Balanced pairings are mandatory to avoid deadlocks.\n- `notify(queue:execute:)`: Dispatches a completion handler on a destination queue when the group counter hits zero.\n- `wait(timeout:)`: Synchronously blocks caller until all tasks complete or timeout expires.\nProduction Use-Case: Initializing a home screen that requires fetching Profile, Notifications, and Settings concurrently, dismissing the skeleton loader only when all three resolve.",
      hints: [
        "Stress balanced enter/leave invocations.",
        "Explain non-blocking UI completion with notify().",
        "Highlight parallel multi-endpoint data loading."
      ],
      key_points: [
        "Tracks completion of multiple concurrent async operations",
        "enter() and leave() must maintain exact 1:1 balance",
        "notify() delivers non-blocking callback when all tasks resolve",
        "Ideal for composite dashboard and feed bootstrap fetches"
      ]
    }
  },
  {
    id: "sw-11",
    difficulty: "junior",
    q_type: "technical",
    tags: ["GCD", "QoS", "Performance", "Energy"],
    tr: {
      title: "Quality of Service (QoS) Seviyeleri ve Öncelik Yönetimi",
      question_text: "GCD ve NSOperation'da Quality of Service (QoS) nedir? Dört ana QoS seviyesini ve kullanım senaryolarını açıklayın.",
      ideal_answer: "Quality of Service (QoS), bir görevin kullanıcı deneyimi ve sistem kaynakları (CPU, pil, enerji) açısından önemini belirleyen öncelik sınıflamasıdır.\n1. userInteractive: UI çizimi, animasyonlar. Hemen çalışır, en yüksek önceliktir.\n2. userInitiated: Kullanıcının pull-to-refresh gibi anlık beklediği işlemler.\n3. utility: Arka plan hesaplamaları, önbellekleme, veri aktarımı.\n4. background: Kullanıcının farkında olmadığı yedekleme, veritabanı temizliği; pil tasarrufuna odaklanır.",
      hints: [
        "userInteractive, userInitiated, utility, background sıralamasını hatırlayın.",
        "Pil tüketimi ve CPU önceliği ilişkisini belirtin."
      ],
      key_points: [
        "userInteractive: UI ve animasyonlar (en yüksek öncelik)",
        "userInitiated: Kullanıcının sonucunu beklediği anlık işlemler",
        "utility: Arka plan hesaplamaları ve dosya indirmeleri",
        "background: Düşük öncelikli bakım, loglama ve yedekleme"
      ]
    },
    en: {
      title: "Quality of Service (QoS) Priority Classification",
      question_text: "What is Quality of Service (QoS) in Apple platforms? Detail the four primary QoS classes and their workload profiles.",
      ideal_answer: "QoS communicates the user-perceived intent and priority of execution to the operating system, which dynamically adjusts CPU frequency, thread scheduling, and I/O throughput.\n1. userInteractive: High-priority, zero-latency work essential for rendering UI and interactive gesture animations.\n2. userInitiated: Operations invoked by the user requiring immediate results (e.g. loading a screen's primary detail feed).\n3. utility: Long-running computational or data tasks where user progress is optional (e.g. continuous data import, caching).\n4. background: Non-time-sensitive background maintenance (e.g. database indexing, analytic batching). Energy efficiency is maximized.",
      hints: [
        "List the four tiers in decreasing priority order.",
        "Connect QoS to battery efficiency and CPU scheduling.",
        "Give specific examples for each tier."
      ],
      key_points: [
        "userInteractive: Real-time UI rendering and touch response",
        "userInitiated: User-blocked operations needing quick completion",
        "utility: Background downloads, computations, and cache writing",
        "background: Power-optimized maintenance and telemetry uploads"
      ]
    }
  },
  {
    id: "sw-12",
    difficulty: "senior",
    q_type: "technical",
    tags: ["Concurrency", "Deadlock", "RaceCondition", "ThreadSafety"],
    tr: {
      title: "Deadlock ve Race Condition Farkları ve Çözüm Stratejileri",
      question_text: "Deadlock ve Race Condition nedir? Swift ve iOS'ta bu iki kritik eşzamanlılık hatası nasıl oluşur ve nasıl engellenir?",
      ideal_answer: "Deadlock: İki veya daha fazla thread'in birbirinin elindeki kaynağı beklemesi sonucu kilitlenmesidir. En yaygın örneği: Main Queue üzerinde `DispatchQueue.main.sync { ... }` çağırmaktır (ana thread kendini bekler ve kilitlenir).\nRace Condition: Birden fazla thread'in aynı anda paylaşılan mutable bir veriye senkronizasyonsuz erişip yazması sonucu verinin bozulmasıdır (Data Race).\nÇözüm: Swift 6 Actors ile derleme zamanı güvenliği, Serial Queue veya Reader-Writer Lock (`concurrent queue + barrier flag`).",
      hints: [
        "DispatchQueue.main.sync çağrısının klasik deadlock örneği olduğunu hatırlayın.",
        "Actor ve Barrier flag çözümlerini vurgulayın."
      ],
      key_points: [
        "Deadlock: Thread'lerin birbirini sonsuza dek beklemesi",
        "Main thread'de main.sync çağrısı anında deadlock yaratır",
        "Race Condition: Eşzamanlı yazma sonucu veri bozulması",
        "Actor, Serial Queue veya GCD Barrier flag ile çözülür"
      ]
    },
    en: {
      title: "Deadlock vs Race Condition: Diagnostics & Prevention",
      question_text: "Define Deadlock and Race Condition in iOS development. How does each manifest in Swift, and how do you engineer safeguards against both?",
      ideal_answer: "Deadlock: Occurs when two or more execution threads remain perpetually blocked, each awaiting a resource held by the other. The classic iOS blunder is calling `DispatchQueue.main.sync` on the main thread, causing the main run loop to block waiting for its own task to finish.\nRace Condition (Data Race): Arises when concurrent threads access the same memory location simultaneously, with at least one write operation, producing non-deterministic bugs.\nPrevention:\n- Deadlock: Avoid nested synchronous dispatches and circular lock acquisition.\n- Data Race: Adopt Swift 6 Actors for isolated compile-time validation, or apply a Reader-Writer lock using `DispatchQueue(attributes: .concurrent)` with `queue.async(flags: .barrier)` for mutations.",
      hints: [
        "Highlight main.sync as the textbook deadlock trap.",
        "Contrast thread blocking vs memory corruption.",
        "Detail GCD barrier and Swift 6 actor solutions."
      ],
      key_points: [
        "Deadlock halts progress when threads await each other's locks",
        "Calling DispatchQueue.main.sync on main thread crashes in deadlock",
        "Race condition corrupts shared mutable memory under unsynchronized writes",
        "Prevented via Swift Concurrency actors or concurrent barrier locks"
      ]
    }
  },

  // MARK: - ARC & Memory Management
  {
    id: "sw-13",
    difficulty: "senior",
    q_type: "technical",
    tags: ["Memory", "Stack", "Heap", "ARC", "ValueTypes"],
    tr: {
      title: "Stack Memory (Value Type) vs Heap Memory (Reference Type)",
      question_text: "Stack ve Heap bellek bölgeleri arasındaki mimari farklar nelerdir? Value Type ve Reference Type bellek yönetimini nasıl etkiler?",
      ideal_answer: "Stack (Yığın): Fonksiyon çağrıları ve yerel değişkenler için kullanılan hızlı bellek bölgesidir (LIFO). Boyutları derleme zamanında bilinir, tahsis ve serbest bırakma (push/pop) CPU düzeyinde mikro saniyelerde gerçekleşir. Struct ve Enum gibi Value Type'lar kural olarak Stack üzerindedir.\nHeap (Öbek): Dinamik boyutlanan bellek alanıdır. Class, Closure ve Actor gibi Reference Type'lar Heap üzerinde yaşar. Tahsis ve çöp toplama (ARC) ek maliyet taşır.\nNot: Bir struct içinde class varsa veya struct bir protokole (Existential Container) sarmalanıyorsa Heap tahsisi olabilir.",
      hints: [
        "Stack'in LIFO yapısını ve hız avantajını vurgulayın.",
        "Heap'in dinamik tahsis ve ARC maliyetlerini açıklayın."
      ],
      key_points: [
        "Stack: LIFO, hızlı, otomatik tahsis, Value Type'lar",
        "Heap: Dinamik, esnek, ARC takibi, Reference Type'lar",
        "Heap tahsisi kilitleme ve arama nedeniyle Stack'ten yavaştır",
        "Existential container'lar value type'ları da heap'e taşıyabilir"
      ]
    },
    en: {
      title: "Stack vs Heap Architecture in Swift Memory Model",
      question_text: "What are the structural differences between Stack and Heap memory? How do Value Types and Reference Types interact with each?",
      ideal_answer: "Stack: A strict LIFO execution memory structure managed via hardware stack pointers. Allocations/deallocations take single CPU instructions (push/pop). Primitives and value types (struct, enum) without heap references reside here with zero dynamic allocation overhead.\nHeap: Dynamic memory pool used when object lifetimes outlive execution scopes or sizes vary at runtime. Reference types (classes, actors, closures) allocate here, incurring thread synchronization, memory search, and ARC reference count bookkeeping.\nCaveat: Value types containing reference types (like Arrays of Classes) or large types exceeding inline existential containers (>3 words) also allocate backing stores on the Heap.",
      hints: [
        "Contrast allocation mechanics (pointer increment vs heap scan).",
        "Explain reference counting overhead only applying to heap objects.",
        "Mention existential containers for protocols."
      ],
      key_points: [
        "Stack provides instantaneous LIFO allocation for value types",
        "Heap supports variable lifetime reference types via dynamic allocation",
        "Heap incurs synchronization and ARC reference counting overhead",
        "Existential protocol containers can push value types into heap buffers"
      ]
    }
  },
  {
    id: "sw-14",
    difficulty: "mid",
    q_type: "technical",
    tags: ["ARC", "MemoryLeak", "WeakSelf", "Unowned"],
    tr: {
      title: "ARC Retain Cycle: [weak self] vs [unowned self] ve guard let Kalıbı",
      question_text: "ARC'de Retain Cycle nasıl oluşur? [weak self] ve [unowned self] arasındaki fark nedir ve neden guard let kalıbı kullanılır?",
      ideal_answer: "Retain Cycle: İki nesnenin birbirine strong referans tutması sonucu referans sayacının hiçbir zaman 0'a inmemesi ve belleğin serbest bırakılamaması durumudur (Memory Leak).\nweak vs unowned:\n- weak: Referans sayısını artırmaz, nesne deallocate olduğunda otomatik nil olur; bu yüzden daima Optional'dır.\n- unowned: Referans sayısını artırmaz ancak nesnenin yaşam süresinin onu tutandan uzun olacağını varsayar. Optional değildir. Nesne silindikten sonra erişilirse uygulama crash olur.\n[weak self] in guard let self else { return } Kalıbı: Closure içinde retain cycle'ı önlemek için weak alınır; ardından işlem süresince self'in ara aşamada silinmesini önlemek için lokal güçlü referansa dönüştürülür.",
      hints: [
        "weak her zaman optional'dır, nesne ölünce nil olur.",
        "unowned nil olmaz, nesne ölünce erişilirse çöker."
      ],
      key_points: [
        "Retain cycle nesnelerin bellekte asılı kalmasına (leak) yol açar",
        "weak referans Optional'dır ve otomatik nil olur",
        "unowned referans Optional değildir ve nesne ölürse crash olur",
        "guard let self closure süresince güvenli lokal erişim sağlar"
      ]
    },
    en: {
      title: "ARC Retain Cycles: [weak self] vs [unowned self]",
      question_text: "How do Retain Cycles form in ARC? Differentiate [weak self] and [unowned self], and explain the rationale behind `guard let self = self`.",
      ideal_answer: "Retain Cycle: Two or more objects maintain strong references to each other, preventing ARC reference counts from reaching zero and causing a permanent memory leak.\nweak vs unowned:\n- `weak`: Does not increment reference count. Automatically zeroes to `nil` when the target deallocates, requiring an Optional type (`weak var delegate: Delegate?`).\n- `unowned`: Does not increment reference count but assumes the referenced instance will outlive the holder. It is non-optional; accessing it after deallocation causes an immediate memory crash.\n`guard let self = self else { return }`: Binds a temporary strong reference for the scope of the closure execution, preventing mid-flight deallocation and avoiding repetitive optional chaining (`self?.`).",
      hints: [
        "Explain zeroing weak references.",
        "Point out dangling pointer crashes with unowned.",
        "Detail why temporary strong references safeguard closure completion."
      ],
      key_points: [
        "Retain cycles prevent ARC from deallocating unreferenced instances",
        "weak references zero to nil automatically and must be optional",
        "unowned references crash on access if the target has deallocated",
        "guard let self secures a temporary strong scope during closure runtime"
      ]
    }
  },
  {
    id: "sw-15",
    difficulty: "senior",
    q_type: "technical",
    tags: ["Swift", "COW", "Memory", "Optimization"],
    tr: {
      title: "Copy-on-Write (COW) Mekanizması ve İspatlanması",
      question_text: "Swift'te Copy-on-Write (COW) nedir? Hangi veri yapılarında uygulanır ve isKnownUniquelyReferenced ile nasıl doğrulanır?",
      ideal_answer: "Copy-on-Write (COW), Swift'in standart koleksiyonlarında (Array, Dictionary, Set, String) bellek optimizasyonu sağlayan tekniktir.\nNasıl Çalışır: Bir dizi başka bir değişkene atandığında veriler hemen kopyalanmaz; her iki değişken aynı buffer'ı işaret eder. Kopyalama işlemi sadece değişkenlerden biri mutating bir işlem (örn. append) yaptığı anda gerçekleşir.\nÖzel Tiplerde: `isKnownUniquelyReferenced(&ref)` fonksiyonu ile referans sayacının 1 olup olmadığı kontrol edilir; 1 ise aynı bellek üzerinde yazılır, 1'den fazla ise yeni kopya oluşturulur.",
      hints: [
        "Atama anında değil, ilk değişiklik (mutating) anında kopyalandığını vurgulayın.",
        "isKnownUniquelyReferenced fonksiyonunu belirtin."
      ],
      key_points: [
        "Atama anında kopyalama maliyetini sıfıra indirir",
        "Sadece değer değiştirildiğinde (mutating) gerçek kopyalama yapılır",
        "Array, Dictionary, Set ve String yapılarında mevcuttur",
        "isKnownUniquelyReferenced ile özel COW struct'ları tasarlanabilir"
      ]
    },
    en: {
      title: "Copy-on-Write (COW) Semantics & Custom Implementation",
      question_text: "Explain Copy-on-Write (COW) in Swift. Which standard types feature it, and how do you implement COW on custom structs using isKnownUniquelyReferenced?",
      ideal_answer: "Copy-on-Write (COW) is a performance optimization for value types wrapping heap buffers (Array, Dictionary, Set, String).\nSemantics: Assigning a collection (`var b = a`) merely copies the struct header pointing to the same backing heap storage. Deep copying is deferred until one of the copies initiates a mutating modification.\nCustom Implementation: Encapsulate reference storage inside a struct. Before mutating internal buffer properties, invoke `isKnownUniquelyReferenced(&storage)`. If true (retain count == 1), mutate in place; if false (shared with other struct copies), clone the buffer before writing.",
      hints: [
        "Explain deferred allocation on mutation.",
        "Identify standard collection types benefiting from COW.",
        "Detail isKnownUniquelyReferenced for custom data structures."
      ],
      key_points: [
        "Eliminates deep copying costs during value assignments",
        "Mutating operations trigger buffer duplication only when shared",
        "Native to Swift Array, Dictionary, Set, and String",
        "isKnownUniquelyReferenced enables custom COW struct implementations"
      ]
    }
  },

  // MARK: - Swift Core Language
  {
    id: "sw-16",
    difficulty: "junior",
    q_type: "technical",
    tags: ["Swift", "LanguageCore", "Protocols", "TypeSafety"],
    tr: {
      title: "self vs Self Ayrımı ve Protokollerdeki Önemi",
      question_text: "Swift'te küçük harfli 'self' ile büyük harfli 'Self' arasındaki fark nedir? Protokollerde ve Factory metotlarında Self neden kritiktir?",
      ideal_answer: "'self' (küçük harf): Mevcut nesnenin (instance) kendisini temsil eder. İsim çakışmalarını çözmek (self.name = name) için kullanılır.\n'Self' (büyük harf): İlgili instance'ın ait olduğu 'Tipi (Type)' temsil eder.\nProtokollerdeki Önemi: Örneğin `func copy() -> Self` tanımlandığında, bu protokolü uygulayan alt sınıf (örneğin Car) kendi somut tipi olan Car'ı döndürmek zorunda kalır; typecasting ihtiyacını ortadan kaldırarak type safety sağlar.",
      hints: [
        "self = instance, Self = Type kuralını hatırlayın.",
        "Protokol dönüş tiplerinde dinamik tip güvenliğini açıklayın."
      ],
      key_points: [
        "self mevcut örneği (instance) temsil eder",
        "Self o anki tipi (type) temsil eder",
        "Protokollerde doğru return type ve type safety sağlar",
        "Alt sınıflarda dinamik tip garantisi sunar"
      ]
    },
    en: {
      title: "self vs Self: Instance vs Type in Protocol Design",
      question_text: "Differentiate between lowercase 'self' and capitalized 'Self' in Swift. Why is 'Self' critical in protocol declarations and factory methods?",
      ideal_answer: "'self' (lowercase): References the specific runtime instance of an object or value type (e.g. `self.username = username`).\n'Self' (capitalized): References the concrete Type of the instance within its own declaration.\nProtocol Design: When declaring methods like `func clone() -> Self`, adopting classes are compelled to return their own dynamic sub-type rather than a base protocol existential, eliminating force casting (`as! SubClass`) and preserving compile-time type safety.",
      hints: [
        "Lowercase = instance pointer; Uppercase = dynamic type.",
        "Demonstrate with a Copyable or Factory protocol example.",
        "Discuss avoiding unsafe force casting."
      ],
      key_points: [
        "self represents the current object instance",
        "Self represents the dynamic conforming type",
        "Enables fluent API chaining and exact return types in protocols",
        "Eliminates downstream typecasting requirements"
      ]
    }
  },
  {
    id: "sw-17",
    difficulty: "senior",
    q_type: "technical",
    tags: ["Swift", "MethodDispatch", "Performance", "Compiler"],
    tr: {
      title: "final Anahtar Kelimesi ve Static vs Dynamic Dispatch",
      question_text: "Swift'te bir sınıfa veya metoda 'final' eklemenin getirdiği mimari ve performans avantajları nelerdir? Method Dispatch mekanizmasını nasıl etkiler?",
      ideal_answer: "Mimari Avantaj: Sınıfın miras alınmasını (inheritance) veya metodun override edilmesini engeller.\nPerformans & Method Dispatch: Sınıflar varsayılan olarak çalışma zamanında 'Table Dispatch' (vtable) kullanır. Bir metot veya sınıf `final` yapıldığında, derleyici bu metodun asla override edilemeyeceğini bilir ve 'Direct Dispatch' (Static Dispatch) uygular. Hatta derleyici metodu satır içine gömebilir (Method Inlining). Bu da CPU düzeyinde vtable arama maliyetini sıfıra indirir.",
      hints: [
        "Kalıtımın kapatılmasını belirtin.",
        "Table Dispatch vs Direct Dispatch farkını açıklayın.",
        "Method Inlining optimizasyonunu ekleyin."
      ],
      key_points: [
        "Kalıtım yoluyla genişletilmeyi engeller",
        "Table (Dynamic) Dispatch yerine Static (Direct) Dispatch sağlar",
        "Derleyicinin Method Inlining yapmasına olanak tanır",
        "Çalışma zamanı performansını ve güvenliği artırır"
      ]
    },
    en: {
      title: "Impact of 'final' on Method Dispatch & Compiler Inlining",
      question_text: "What architectural and performance advantages does 'final' introduce in Swift? How does it alter method dispatch under the compiler?",
      ideal_answer: "Architecture: Forbids subclassing and prevents method overriding, locking domain contracts.\nPerformance: Standard class methods resolve via Table Dispatch (vtable lookup at runtime). Marking a class or method `final` proves to the LLVM compiler that no override can exist. The compiler switches dispatch from dynamic vtable jumps to Direct (Static) Dispatch and frequently applies Method Inlining (inserting the function body directly at call sites), eliminating call stack overhead entirely.",
      hints: [
        "Compare vtable lookup overhead with direct jumps.",
        "Highlight LLVM method inlining opportunities.",
        "Emphasize contract stability in framework code."
      ],
      key_points: [
        "Prevents inheritance and accidental method overrides",
        "Bypasses vtable lookup in favor of Direct (Static) Dispatch",
        "Enables aggressive LLVM compiler function inlining",
        "Reduces binary indirection and accelerates execution"
      ]
    }
  },
  {
    id: "sw-18",
    difficulty: "junior",
    q_type: "technical",
    tags: ["Swift", "ValueTypes", "Structs", "Mutating"],
    tr: {
      title: "mutating Fonksiyonlar ve Value Semantics",
      question_text: "Swift'te struct ve enum metotlarında 'mutating' anahtar sözcüğü neden zorunludur? Bellek düzeyinde ne gerçekleşir?",
      ideal_answer: "Struct ve enum yapılar Value Type'tır ve varsayılan olarak metotları içindeki özellikleri değiştiremez; self immutable kabul edilir.\n'mutating' anahtar kelimesi, derleyiciye bu metodun nesnenin dahili durumunu değiştireceğini bildirir. Metot çağrıldığında `self` gizli bir `inout` parametresi olarak aktarılır. Metodun sonunda mevcut struct'ın yerine bellekte değiştirilmiş yeni bir kopyası yazılır. Bu nedenle `let` ile tanımlanmış bir struct üzerinde mutating metot çağrılamaz.",
      hints: [
        "Value type'ların varsayılan immutability kuralını belirtin.",
        "self'in inout parametresi gibi davranmasını açıklayın."
      ],
      key_points: [
        "Value type'ların kendi stored property'lerini değiştirmesine izin verir",
        "Arka planda self nesnesi inout parametresi olarak aktarılır",
        "Değişiklik yapıldığında yeni struct örneği yazılır",
        "Sadece var ile tanımlanan değişkenlerde çağrılabilir"
      ]
    },
    en: {
      title: "Mutating Functions and Struct Value Semantics",
      question_text: "Why is the 'mutating' keyword required for modifying struct/enum properties in Swift? What takes place at the memory layer?",
      ideal_answer: "Swift value types enforce immutability by default within their instance methods. An instance method treats `self` as a constant (`let self`).\nDeclaring a method `mutating` permits internal stored property reassignment. Under the hood, `self` is passed as an implicit `inout` reference parameter (`&self`). Upon method return, the mutated value is written back to the calling variable. Consequently, invoking mutating methods on instances declared with `let` triggers a compiler error.",
      hints: [
        "Explain value type immutability by default.",
        "Detail the implicit inout self parameter.",
        "Clarify why constants (let) reject mutating calls."
      ],
      key_points: [
        "Explicitly declares internal state modification for value types",
        "Passes self as an implicit inout reference under the hood",
        "Replaces the caller's storage with the newly computed value",
        "Compiler forbids invoking mutating methods on let constants"
      ]
    }
  },
  {
    id: "sw-19",
    difficulty: "senior",
    q_type: "technical",
    tags: ["Swift", "Enums", "Memory", "DataStructures"],
    tr: {
      title: "indirect enum Nedir ve Neden Gereklidir?",
      question_text: "Swift'te 'indirect enum' nedir? Enum'lar value type olmasına rağmen özyinelemeli (recursive) yapılarda neden indirect kullanılır?",
      ideal_answer: "Enum'lar Value Type'tır ve derleyicinin her enum değişkeninin bellekte kaplayacağı boyutu compile-time'da bilmesi gerekir. Eğer bir enum case'i kendisini parametre olarak alırsa sonsuz bir boyut döngüsü oluşur.\n'indirect' anahtar kelimesi, derleyiciye ilgili enum değerini doğrudan Stack'te tutmak yerine Heap üzerinde bir pointer (referans kutusu) olarak saklamasını söyler. Pointer boyutu sabit (64-bit) olduğu için sonsuz boyut problemi çözülür ve Linked List veya Binary Tree gibi ağaç yapıları kurulabilir.",
      hints: [
        "Derleyicinin enum boyutunu önceden bilmesi gerektiğini açıklayın.",
        "Binary Tree ve Linked List örneklerini aklınıza getirin."
      ],
      key_points: [
        "Özyinelemeli (recursive) enum yapılarını mümkün kılar",
        "Derleyicinin bellek boyutunu sabit pointer ile hesaplamasını sağlar",
        "Değeri Heap üzerinde saklayarak sonsuz boyut problemini çözer",
        "Ağaç (Tree) ve Liste gibi veri yapılarında kullanılır"
      ]
    },
    en: {
      title: "Recursive Enums via the 'indirect' Keyword",
      question_text: "What is an 'indirect enum' in Swift? Why is indirection strictly required when designing recursive data structures with enums?",
      ideal_answer: "Swift enums are value types allocated inline. The compiler must compute the exact byte size of an enum at compile-time by determining its largest payload case. If an enum case references itself recursively (e.g. `case node(Tree, Tree)`), its size would be infinitely recursive.\nThe `indirect` modifier introduces a layer of indirection: instead of storing the payload inline on the stack, the compiler boxes the recursive case on the Heap and stores a fixed 8-byte reference pointer, allowing recursive structures like Linked Lists and Binary Trees to compile safely.",
      hints: [
        "Address compile-time memory layout determination.",
        "Explain the infinite size paradox of recursive value types.",
        "Demonstrate pointer boxing on the heap."
      ],
      key_points: [
        "Enables recursive enum definitions for tree and graph data types",
        "Boxes nested cases on the heap with a fixed 8-byte pointer",
        "Resolves compile-time infinite memory allocation calculations",
        "Preserves value semantics while utilizing managed heap references"
      ]
    }
  },
  {
    id: "sw-20",
    difficulty: "junior",
    q_type: "technical",
    tags: ["Swift", "FunctionalProgramming", "HigherOrderFunctions"],
    tr: {
      title: "Higher Order Functions: map, compactMap, flatMap, reduce, filter",
      question_text: "Swift'te map, compactMap ve flatMap arasındaki farklar nelerdir? Hangi senaryoda hangisi tercih edilir?",
      ideal_answer: "1. map: Koleksiyondaki her elemana dönüşüm uygular ([1, 2].map { $0 * 2 } -> [2, 4]).\n2. compactMap: Elemanları dönüştürür ve nil olanları filtreleyerek eler (unwrapping yapar).\n3. flatMap: İç içe dizileri (2D array) tek bir düz diziye indirger ([[1, 2], [3, 4]].flatMap { $0 } -> [1, 2, 3, 4]).\nreduce tüm elemanları tek bir değere indirger, filter ise koşula uyanları seçer.",
      hints: [
        "compactMap'in nil'leri elediğini unutmayın.",
        "flatMap'in çok boyutlu dizileri tek boyuta düzleştirdiğini belirtin."
      ],
      key_points: [
        "map her elemanı birebir dönüştürür",
        "compactMap nil olan sonuçları otomatik filtreler ve unwrapping yapar",
        "flatMap iç içe dizileri tek boyuta indirger (flatten)",
        "reduce tüm koleksiyonu tek bir kümülatif sonuca indirger"
      ]
    },
    en: {
      title: "Functional Swift: map, compactMap, flatMap & Transformations",
      question_text: "Compare map, compactMap, and flatMap in Swift. Provide clear guidelines on when to select each transformation method.",
      ideal_answer: "1. `map`: Applies a 1-to-1 transform on every element, returning a collection of equal cardinality.\n2. `compactMap`: Transforms elements and automatically discards `nil` results, unwrapping optionals into non-optional values (e.g. parsing `[String]` to `[Int]`).\n3. `flatMap`: Flattens nested collections by one level of depth (e.g. flattening a 2D matrix `[[Int]]` into `[Int]`). Prior to Swift 4.1, flatMap was also used for nil-stripping, which is now strictly handled by compactMap.",
      hints: [
        "Explain nil filtering and optional unwrapping for compactMap.",
        "Highlight dimension flattening for flatMap.",
        "Contrast 1-to-1 cardinality in map."
      ],
      key_points: [
        "map performs 1-to-1 transformations maintaining count",
        "compactMap filters out nil values and unwraps optionals",
        "flatMap flattens multi-dimensional nested collections",
        "reduce condenses an entire sequence into a single scalar value"
      ]
    }
  },

  // MARK: - Architecture & Patterns
  {
    id: "sw-21",
    difficulty: "senior",
    q_type: "system_design",
    tags: ["Architecture", "VIPER", "CleanArchitecture", "DesignPatterns"],
    tr: {
      title: "VIPER Mimarisi: 5 Temel Bileşen ve Sorumluluk Ayrımı",
      question_text: "VIPER mimarisinin 5 bileşeni (V-I-P-E-R) nelerdir? Hangi durumlarda VIPER tercih edilir ve dezavantajları nelerdir?",
      ideal_answer: "Bileşenler:\n1. View: UI gösterimi ve kullanıcı etkileşimlerini Presenter'a iletme.\n2. Interactor: Saf iş mantığı (business logic), ağ ve veritabanı operasyonları.\n3. Presenter: View ile Interactor arasındaki köprü; veriyi UI formatına dönüştürme ve Router'ı tetikleme.\n4. Entity: Interactor tarafından kullanılan veri modelleri.\n5. Router (Wireframe): Ekran geçişleri ve navigasyon mantığı.\nTercih Edildiği Durumlar: Çok büyük ekipler, katı sorumluluk ayrımı ve %100 izole birim test gerektiren kurumsal projeler.\nDezavantajları: Çok sayıda dosya (boilerplate) oluşturur ve küçük projelerde karmaşıklık yaratır.",
      hints: [
        "View, Interactor, Presenter, Entity, Router sıralamasını açıklayın.",
        "Boilerplate kod fazlalığı dezavantajına değinin."
      ],
      key_points: [
        "View: Pasif UI gösterimi",
        "Interactor: İş mantığı ve veri yönetimi",
        "Presenter: View-Interactor veri köprüsü",
        "Entity: Saf veri modelleri",
        "Router: Sayfa geçişleri ve navigasyon mantığı"
      ]
    },
    en: {
      title: "VIPER Clean Architecture: Roles, Boundaries & Trade-offs",
      question_text: "Outline the five core layers of VIPER architecture. When is VIPER justified over MVVM, and what are its prominent liabilities?",
      ideal_answer: "VIPER decomposes modules into five isolated responsibilities:\n1. View: Passive rendering layer displaying formatted UI models and forwarding touch events to Presenter.\n2. Interactor: Core business logic, data persistence, and networking queries.\n3. Presenter: Orchestrator receiving raw entities from Interactor, transforming them into ViewModels, and directing the Router.\n4. Entity: Plain data models consumed by the Interactor.\n5. Router (Wireframe): Handles UIKit/SwiftUI navigation and screen transitions.\nJustification: Massive engineering organizations with dedicated feature teams requiring parallel development, zero merge friction, and isolated unit testability.\nLiabilities: High boilerplate overhead, numerous protocol bridges, and steep learning curve.",
      hints: [
        "Walk through V-I-P-E-R data flows.",
        "Emphasize single responsibility per layer.",
        "Discuss boilerplate friction for small projects."
      ],
      key_points: [
        "Strict separation of concern across 5 distinct protocolized layers",
        "Interactor encapsulates 100% of business and API logic",
        "Router isolates all routing and screen presentation",
        "High boilerplate cost counterbalanced by unmatched unit test isolation"
      ]
    }
  },
  {
    id: "sw-22",
    difficulty: "senior",
    q_type: "system_design",
    tags: ["Architecture", "Coordinator", "Navigation", "DesignPatterns"],
    tr: {
      title: "Coordinator Pattern: Ekran Navigasyonunun Ayrıştırılması",
      question_text: "Coordinator Pattern nedir? UIViewController'ların doğrudan birbirinden haberdar olmasını engellemek neden önemlidir ve veri akışı nasıl yönetilir?",
      ideal_answer: "Coordinator Pattern, ekran navigasyon mantığını (push, present) ViewController'ların içinden alıp bağımsız Coordinator nesnelerine devreden mimari desendir.\nNeden Önemlidir: ViewController'lar birbirini doğrudan açtığında sıkı sıkıya bağımlı (tightly coupled) hale gelir; tekrar kullanımı ve izole testi imkansızlaşır.\nNasıl Çalışır: ViewController kullanıcı eylemini bir delegate ile Coordinator'a bildirir. Coordinator hedef ekranı oluşturur, bağımlılıkları enjekte eder ve navigasyonu gerçekleştirir. Hiyerarşik yapılar (AppCoordinator -> AuthCoordinator) kurulabilir.",
      hints: [
        "Tightly coupled ekranlar sorununu anlatın.",
        "ViewController'ın navigasyondan sorumlu olmaması gerektiğini vurgulayın."
      ],
      key_points: [
        "Ekran navigasyonunu ViewController'dan izole eder",
        "ViewController'ların tekrar kullanılabilirliğini ve test edilebilirliğini artırır",
        "Ekranlar arası bağımlılıkları (coupling) ortadan kaldırır",
        "Hiyerarşik coordinator yapısı (AppCoordinator -> FeatureCoordinator)"
      ]
    },
    en: {
      title: "Decoupling Flow with the Coordinator Pattern",
      question_text: "What problem does the Coordinator Pattern solve in iOS? How does it decouple ViewControllers and handle sub-flow state propagation?",
      ideal_answer: "Problem: Standard UIKit push/present calls tightly couple ViewControllers to downstream classes, generating Massive View Controllers that cannot be tested or repurposed in alternative user journeys.\nMechanism: A dedicated Coordinator manages a `UINavigationController` stack. ViewControllers emit delegate/closure signals (e.g. `didSelectProduct(id:)`). The Coordinator receives the event, instantiates the destination controller, injects its ViewModel dependencies, and executes the transition.\nTree Structure: Root AppCoordinator spawns and retains Child Coordinators (e.g. AuthCoordinator, CheckoutCoordinator), releasing them upon sub-flow completion.",
      hints: [
        "Explain coupling when ViewController A pushes ViewController B directly.",
        "Describe delegate communication between Controller and Coordinator.",
        "Detail child coordinator lifecycle cleanup."
      ],
      key_points: [
        "Extracts routing logic out of ViewControllers completely",
        "Promotes high ViewController reusability across varied user flows",
        "Child coordinators manage bounded workflows (Auth, Checkout)",
        "Child coordinators must be deallocated when their flow terminates"
      ]
    }
  },
  {
    id: "sw-23",
    difficulty: "mid",
    q_type: "technical",
    tags: ["Architecture", "DependencyInjection", "UnitTesting", "SOLID"],
    tr: {
      title: "Dependency Injection (DI) ve Unit Test Edilebilirlik",
      question_text: "Dependency Injection nedir? Initializer Injection neden en çok tercih edilen yöntemdir ve Unit Test yazmayı nasıl kolaylaştırır?",
      ideal_answer: "Dependency Injection, bir sınıfın bağımlılıklarını kendi içinde doğrudan oluşturması yerine dışarıdan alması prensibidir (Inversion of Control).\nInitializer Injection: Bağımlılıklar sınıfın `init` metodunda protokol olarak istenir (`init(service: ServiceProtocol)`). Sınıfın çalışması için nelere ihtiyaç duyduğu derleme zamanında açıkça belgelenir.\nUnit Test Kolaylığı: Test sırasında gerçek servis yerine aynı protokolü uygulayan 'Mock' nesneler enjekte edilir; böylece gerçek ağa çıkmadan milisaniyeler içinde deterministik testler koşulabilir.",
      hints: [
        "Sınıfın bağımlılığını kendi üretmemesi gerektiğini vurgulayın.",
        "Protokoller üzerinden mock nesne enjeksiyonunu açıklayın."
      ],
      key_points: [
        "Bağımlılıkların dışarıdan sağlanması prensibidir",
        "Initializer injection bağımlılıkları açık ve zorunlu kılar",
        "Protokoller sayesinde Mock servislerle kolay test imkanı sunar",
        "Loosely coupled ve esnek bir mimari oluşturur"
      ]
    },
    en: {
      title: "Dependency Injection Strategies & Unit Test Ergonomics",
      question_text: "What is Dependency Injection? Why is Initializer Injection favored over Property Injection, and how does it empower deterministic testing?",
      ideal_answer: "Dependency Injection (DI) adheres to Inversion of Control: components receive collaborators externally rather than instantiating them internally (e.g. avoiding `NetworkManager.shared`).\nInitializer Injection: Dependencies are passed during initialization backed by protocol abstractions (`init(client: NetworkClientProtocol)`). This makes class dependencies explicit, guarantees non-optional immutability, and prevents half-initialized object states.\nTesting Advantage: In test suites, engineers inject lightweight Mock/Stub implementations that return canned JSON or errors instantaneously without executing live network or disk I/O.",
      hints: [
        "Explain Inversion of Control principles.",
        "Differentiate compile-time safety in Initializer vs Property injection.",
        "Explain how protocol mocks yield deterministic unit tests."
      ],
      key_points: [
        "Adheres to Dependency Inversion Principle (DIP)",
        "Initializer injection guarantees non-optional, immutable dependencies",
        "Enables instant, deterministic testing using Protocol Mocks",
        "Eliminates hidden singletons and tightly coupled object graphs"
      ]
    }
  },

  // MARK: - UIKit & Layout
  {
    id: "sw-24",
    difficulty: "junior",
    q_type: "technical",
    tags: ["UIKit", "Lifecycle", "UIViewController", "iOS"],
    tr: {
      title: "UIViewController Yaşam Döngüsü (Lifecycle)",
      question_text: "Bir UIViewController ekrana gelirken ve kapanırken hangi yaşam döngüsü metotları hangi sırayla tetiklenir?",
      ideal_answer: "Sıralama:\n1. loadView(): View hiyerarşisi oluşturulur (özel kodla view yazılacaksa override edilir).\n2. viewDidLoad(): Belleğe yüklendiğinde 1 kez tetiklenir; ilk veri yüklemeleri yapılır.\n3. viewWillAppear(): Ekran her görünmek üzere olduğunda çalışır.\n4. viewWillLayoutSubviews() / viewDidLayoutSubviews(): Auto Layout sonrası frame boyutlarının kesinleştiği andır.\n5. viewDidAppear(): Ekran kullanıcıya tamamen göründüğü an; analitik logları atılır.\n6. viewWillDisappear() / viewDidDisappear(): Ekran kapanırken observer ve timer temizliği yapılır.\n7. deinit: Controller bellekten silinirken çalışır.",
      hints: [
        "viewDidLoad 1 kez, viewWillAppear her gelişte çalışır.",
        "Frame'lerin viewDidLayoutSubviews içinde kesinleştiğini belirtin."
      ],
      key_points: [
        "loadView -> viewDidLoad -> viewWillAppear -> viewDidLayoutSubviews -> viewDidAppear",
        "viewDidLoad sadece 1 kez ilk kurulumda çalışır",
        "viewDidLayoutSubviews içinde frame boyutları kesinleşir",
        "viewWillDisappear ve deinit kaynakları temizlemek içindir"
      ]
    },
    en: {
      title: "UIViewController Lifecycle Sequence & Execution Points",
      question_text: "Enumerate the UIViewController lifecycle methods in their exact invocation sequence from instantiation to destruction.",
      ideal_answer: "Sequence:\n1. `loadView()`: Instantiates the root view. Override only when constructing the view hierarchy programmatically without XIBs (never call super).\n2. `viewDidLoad()`: Invoked once when root view loads into memory. Configure bindings, delegates, and one-time state.\n3. `viewWillAppear()`: Invoked prior to entering the screen. Ideal for refreshing dynamic state and subscribing to notifications.\n4. `viewWillLayoutSubviews()` / `viewDidLayoutSubviews()`: Bounds updates are calculated; frames are finalized here (optimal for CAShapeLayer paths or gradients).\n5. `viewDidAppear()`: View is visible on screen. Trigger analytics and launch keyboard focus.\n6. `viewWillDisappear()` / `viewDidDisappear()`: Tear down timers, commit pending edits, and unsubscribe.\n7. `deinit`: Invoked when reference count hits zero upon dismissal.",
      hints: [
        "Trace from allocation to deallocation.",
        "Emphasize when subview frames are reliably calculated.",
        "Identify one-time vs recurring lifecycle events."
      ],
      key_points: [
        "loadView -> viewDidLoad -> viewWillAppear -> viewDidLayoutSubviews -> viewDidAppear",
        "viewDidLoad executes exactly once per instance lifecycle",
        "viewDidLayoutSubviews guarantees calculated geometry frames",
        "viewWillDisappear and deinit release observers and active tasks"
      ]
    }
  },
  {
    id: "sw-25",
    difficulty: "mid",
    q_type: "technical",
    tags: ["UIKit", "AutoLayout", "Frame", "Bounds", "UIScrollView"],
    tr: {
      title: "Frame vs Bounds Farkı ve UIScrollView Mantığı",
      question_text: "iOS'ta UIView frame ve bounds özellikleri arasındaki temel fark nedir? UIScrollView kaydırıldığında hangisi değişir?",
      ideal_answer: "Frame: Görünümün 'üst görünümünün (superview)' koordinat sistemine göre konumu ve kapladığı alandır.\nBounds: Görünümün 'kendi yerel (local)' koordinat sistemine göre konumu ve boyutudur (varsayılan origin: 0, 0).\nFarklar:\n- Döndürme (Rotation): View döndürüldüğünde bounds boyutu sabit kalırken, frame onu çevreleyen bounding box haline gelerek genişler.\n- UIScrollView: Bir scroll view kaydırıldığında aslında `bounds.origin` değeri değişir; böylece içeriğin farklı bir penceresi ekrana yansıtılır.",
      hints: [
        "Frame superview'a göre, bounds kendi içine göredir.",
        "ScrollView kaydırıldığında bounds.origin'in değiştiğini hatırlayın."
      ],
      key_points: [
        "Frame superview koordinat sistemindeki yer ve boyuttur",
        "Bounds kendi yerel koordinat sistemindeki yer ve boyuttur",
        "Döndürmede frame genişler (bounding box), bounds sabit kalır",
        "ScrollView kaydırma mekanizması bounds.origin ile çalışır"
      ]
    },
    en: {
      title: "Frame vs Bounds Geometry & UIScrollView Mechanics",
      question_text: "Differentiate UIView frame and bounds in iOS. Which property mutates when scrolling a UIScrollView?",
      ideal_answer: "Frame: The view's location and dimensions expressed relative to its Superview's coordinate system.\nBounds: The view's location and dimensions expressed relative to its own Local coordinate system (default origin is (0,0)).\nRotation: Rotating a view 45° alters its `frame` to enclose the enlarged bounding box, whereas its `bounds` dimensions remain unchanged.\nUIScrollView: When a user scrolls, the scroll view modifies its own `bounds.origin` coordinate, sliding its viewport across the underlying canvas content without moving the superview frame.",
      hints: [
        "Frame relates to superview; Bounds relates to self.",
        "Describe what happens to bounding boxes under rotation.",
        "Explain the viewport shift mechanics of UIScrollView."
      ],
      key_points: [
        "Frame defines position/size within the superview coordinate space",
        "Bounds defines size and viewport origin within the local coordinate space",
        "Rotation resizes the frame bounding box while keeping bounds invariant",
        "Scrolling operates by mutating bounds.origin over the content area"
      ]
    }
  },
  {
    id: "sw-26",
    difficulty: "mid",
    q_type: "technical",
    tags: ["UIKit", "AutoLayout", "Constraints", "UI"],
    tr: {
      title: "Auto Layout: Content Hugging ve Compression Resistance Öncelikleri",
      question_text: "Auto Layout'ta Content Hugging ve Compression Resistance öncelikleri ne anlama gelir? İki Label yan yana geldiğinde metin kesilmesini nasıl önlersiniz?",
      ideal_answer: "1. Content Hugging Priority (İçeriğe Sarılma): 'Beni içeriğimden daha büyük yapma' direnci. Önceliği yüksek olan eleman genişlemez, içeriğine sarılır; düşük olan ise boşluğu doldurmak için gerilir.\n2. Compression Resistance Priority (Sıkıştırma Direnci): 'Beni içeriğimden daha küçük yapma, metnimi kesme' direnci. Önceliği yüksek olan eleman asla kırpılmaz; düşük olanın metni kesilir (... olur).\nÖrnek: Yan yana İsim ve Fiyat etiketinde, Fiyat'ın asla kesilmemesi için Fiyat'ın Compression Resistance önceliği (751) İsim'den (750) yüksek tutulur.",
      hints: [
        "Hugging: Büyümeme direnci.",
        "Compression Resistance: Kesilmeme direnci.",
        "Önceliği yüksek olan kazanır."
      ],
      key_points: [
        "Content Hugging: Elemanın büyümesini engeller (içeriğe sarılır)",
        "Compression Resistance: Elemanın küçülüp metninin kesilmesini engeller",
        "Önceliği yüksek olan boyutunu korur",
        "Yan yana dinamik etiketlerde layout çakışmasını çözer"
      ]
    },
    en: {
      title: "Auto Layout: Content Hugging vs Compression Resistance",
      question_text: "Define Content Hugging and Compression Resistance in Auto Layout. How do you prevent text truncation when two dynamic UILabels sit horizontally?",
      ideal_answer: "Based on Intrinsict Content Size:\n1. Content Hugging Priority (Resist Stretching): Dictates how strongly a view resists being expanded beyond its intrinsic size. The view with the higher hugging priority hugs its text tightly, forcing the lower-priority sibling to stretch and consume excess whitespace.\n2. Compression Resistance Priority (Resist Clipping): Dictates how strongly a view resists being compressed smaller than its intrinsic size. The view with the higher compression priority preserves its full text, while the lower-priority view gets truncated with an ellipsis.\nSolution: In a Title-Price horizontal stack, assign Price a higher Compression Resistance (e.g. 751 vs 750) to guarantee currency values never truncate.",
      hints: [
        "Hugging = Don't make me larger than my content.",
        "Compression = Don't clip or shrink my content.",
        "Show priority resolution (751 vs 750)."
      ],
      key_points: [
        "Content Hugging prevents views from stretching beyond intrinsic content",
        "Compression Resistance prevents views from clipping below intrinsic content",
        "Higher numeric priority constraint wins auto layout arbitration",
        "Protects dynamic labels (Name/Price) in horizontal UI stacks"
      ]
    }
  },

  // MARK: - Security & Networking
  {
    id: "sw-27",
    difficulty: "mid",
    q_type: "technical",
    tags: ["Security", "Keychain", "UserDefaults", "Tokens"],
    tr: {
      title: "iOS Güvenlik: Keychain vs UserDefaults ve Keychain Access Groups",
      question_text: "Hassas kullanıcı verilerini (OAuth token, şifre) saklarken Keychain neden UserDefaults yerine zorunludur? Keychain Access Groups nedir?",
      ideal_answer: "UserDefaults: Verileri şifrelemeden düz metin (.plist) olarak saklar. Jailbreak veya dosya yedeğinde kolayca okunur; kesinlikle token saklanmamalıdır.\nKeychain: Donanım hızlandırmalı, AES-256 ile şifrelenen güvenli sistem veritabanıdır. Biyometrik doğrulama (Face ID/Touch ID) şartı koşulabilir.\nKeychain Access Groups: Aynı geliştirici hesabına (Team ID) ait farklı uygulamaların veya App Extension'ların (ana app ile Widget/Watch app) ortak güvenli veri paylaşmasını sağlayan mekanizmadır.",
      hints: [
        "UserDefaults'un şifresiz plist olduğunu vurgulayın.",
        "Keychain'in donanım şifrelemesi ve biyometrik koruma avantajını belirtin.",
        "Access Groups ile app ve widget arası token paylaşımını açıklayın."
      ],
      key_points: [
        "UserDefaults şifresizdir ve hassas veriler için güvensizdir",
        "Keychain donanım düzeyinde şifreli ve güvenlidir",
        "Face ID / Biyometri gereksinimli erişim kuralları tanımlanabilir",
        "Keychain Access Groups aynı şirketin uygulamaları arasında veri paylaşır"
      ]
    },
    en: {
      title: "iOS Security: Keychain Services vs UserDefaults",
      question_text: "Why is Keychain mandatory over UserDefaults for auth tokens? How do Keychain Access Groups enable secure cross-extension credential sharing?",
      ideal_answer: "UserDefaults: Serializes data as unencrypted plain-text XML plists inside the application sandbox. Any jailbroken device or unencrypted backup exposes keys and tokens immediately.\nKeychain Services: Stores data inside a hardware-accelerated, SQLite-backed vault encrypted with AES-256 keys protected by the Secure Enclave. Access control lists can enforce biometric validation (FaceID/Passcode) before read access.\nKeychain Access Groups: By configuring a shared Keychain entitlement group under the same Apple Developer Team ID, primary applications and secondary targets (Widget Extensions, Watch apps, Share sheets) share decrypted credentials seamlessly.",
      hints: [
        "Contrast plain-text plists with hardware-backed encryption.",
        "Mention Secure Enclave biometric access policies.",
        "Explain app-to-widget authentication sharing."
      ],
      key_points: [
        "UserDefaults stores unencrypted sandbox files vulnerable to extraction",
        "Keychain encrypts data with Secure Enclave hardware backing",
        "Supports biometric authentication policies (kSecAccessControlBiometryAny)",
        "Keychain Access Groups share credentials between App and Extensions"
      ]
    }
  },
  {
    id: "sw-28",
    difficulty: "senior",
    q_type: "technical",
    tags: ["Security", "SSLPinning", "Networking", "URLSession"],
    tr: {
      title: "SSL / Certificate Pinning ve Man-in-the-Middle (MitM) Koruması",
      question_text: "SSL / Certificate Pinning nedir? Nasıl uygulanır ve sertifika yenileme döngülerinde uygulamanın çökmemesi için nelere dikkat edilmelidir?",
      ideal_answer: "SSL Pinning: Uygulamanın yalnızca sunucunun bilinen belirli bir sertifikasına veya Public Key'ine güvenmesini sağlayan güvenlik önlemidir. Sahte sertifika yüklenerek yapılan Man-in-the-Middle (MitM) saldırılarını engeller.\nUygulama: `URLSessionDelegate`'in `didReceive challenge` metodu içinde sunucunun sunduğu sertifika veya public key hash'i doğrulanır.\nRiskler & Çözüm: Sertifika süresi dolduğunda uygulamanın ağ erişiminin kesilmemesi için 'Public Key Pinning' tercih edilmeli ve gelecekteki yedek anahtar (backup pin) önceden uygulamaya gömülmelidir.",
      hints: [
        "MitM saldırısını engelleme amacını belirtin.",
        "Sertifika yerine Public Key sabitlemenin avantajını açıklayın.",
        "Yedek anahtar (backup pin) bırakılmasının önemini vurgulayın."
      ],
      key_points: [
        "Man-in-the-Middle saldırılarını kesin olarak engeller",
        "Sadece izin verilen sertifika/public key ile iletişime izin verir",
        "URLSessionDelegate authentication challenge üzerinden uygulanır",
        "Sertifika değişiminde yedek pin (backup key) olmalıdır"
      ]
    },
    en: {
      title: "SSL / Public Key Pinning & MitM Attack Mitigation",
      question_text: "Explain SSL / Public Key Pinning. How is it implemented via URLSessionDelegate, and how do you prevent bricking apps during certificate rotation?",
      ideal_answer: "SSL Pinning bypasses default operating system trust store chains by validating the server's X.509 certificate or Subject Public Key Info (SPKI) directly against pinned hashes bundled inside the app. It neutralizes Man-in-the-Middle (MitM) attacks utilizing rogue proxies (Charles, Proxyman) or compromised root CAs.\nImplementation: Intercept authentication challenges inside `URLSessionDelegate.urlSession(_:didReceive:completionHandler:)` and compare the public key hash of `challenge.protectionSpace.serverTrust`.\nRotation Safeguards: Pin the Subject Public Key (Public Key Pinning) rather than the leaf certificate, since public keys survive renewals. Crucially, always embed a secondary backup pin to avoid bricking client networking when unexpected key rotations occur.",
      hints: [
        "Explain rogue root CA and proxy interception risks.",
        "Contrast Certificate Pinning with Public Key Pinning.",
        "Detail backup pin strategies to prevent network lockouts."
      ],
      key_points: [
        "Neutralizes Man-in-the-Middle (MitM) packet inspection attacks",
        "Validates server public keys directly within URLSession authentication challenges",
        "Public Key Pinning survives standard certificate renewals",
        "Requires embedding a backup pin to prevent outage during emergency rotations"
      ]
    }
  },

  // MARK: - Testing & Instruments
  {
    id: "sw-29",
    difficulty: "mid",
    q_type: "technical",
    tags: ["Testing", "XCTest", "AsyncTesting", "Quality"],
    tr: {
      title: "XCTest: Asenkron Testler ve XCTestExpectation Kullanımı",
      question_text: "XCTest çerçevesinde asenkron metodlar nasıl test edilir? XCTestExpectation ve modern async/await testlerinin farkı nedir?",
      ideal_answer: "Geleneksel XCTest: Asenkron işlemin sonucunu beklemek için `expectation(description:)` oluşturulur. İşlem tamamlandığında `expectation.fulfill()` çağrılır; metodun sonunda `waitForExpectations(timeout: 5)` ile runner bekletilir.\nModern Swift Concurrency ile Test: Test metodları doğrudan `async` olarak tanımlanabilir (`func testFetch() async throws`). Expectation kurmaya gerek kalmadan doğrudan `let data = try await service.fetch()` çağrılır ve `XCTAssertEqual` ile doğrulanır.",
      hints: [
        "expectation, fulfill ve wait döngüsünü anlatın.",
        "Modern async test metodlarının expectation ihtiyacını azalttığını belirtin."
      ],
      key_points: [
        "XCTestExpectation asenkron çağrıları senkronize bekletir",
        "fulfill() işlemin başarıyla tamamlandığını haber verir",
        "waitForExpectations timeout süresini yönetir",
        "Modern Swift ile test metodları doğrudan async yazılabilir"
      ]
    },
    en: {
      title: "Asynchronous Unit Testing with XCTest & Swift Concurrency",
      question_text: "How do you test asynchronous code in XCTest? Contrast legacy XCTestExpectation workflows with native async test functions.",
      ideal_answer: "Legacy XCTest: Utilizes `expectation(description:)` counters. Upon async callback completion, callers invoke `expectation.fulfill()`. The test harness is held via `waitForExpectations(timeout:)`—failing if the timeout lapses.\nModern Swift Concurrency: XCTest test methods natively support `async throws` (`func testFetchData() async throws`). Callers invoke `try await sut.fetchData()` linearly without expectation boilerplate. Timeouts and failure propagation occur automatically via Swift runtime structured concurrency error handling.",
      hints: [
        "Explain expectation creation, fulfillment, and timeout assertions.",
        "Demonstrate modern linear execution with async throws test methods.",
        "Highlight readability and deterministic test execution."
      ],
      key_points: [
        "XCTestExpectation pauses the test runner until fulfilled or timed out",
        "Legacy callback APIs require manual fulfill() dispatching",
        "Modern test methods support async throws for linear execution",
        "Eliminates expectation boilerplate and improves stack trace clarity"
      ]
    }
  },
  {
    id: "sw-30",
    difficulty: "senior",
    q_type: "technical",
    tags: ["Instruments", "Performance", "ScrollJank", "MemoryLeaks"],
    tr: {
      title: "Instruments: Scroll Jank ve Bellek Sızıntısı (Leak) Teşhisi",
      question_text: "Bir iOS uygulamasında liste kaydırırken oluşan takılmalar (Scroll Jank) ve bellek sızıntıları Xcode Instruments ile adım adım nasıl teşhis edilir?",
      ideal_answer: "1. Scroll Jank (Arayüz Takılması): Time Profiler başlatılır. Main Thread üzerinde 16.6ms (60 FPS) veya 8.3ms (120 FPS ProMotion) sınırını aşan ağır işlemler incelenir. Call Tree'de 'Separate by Thread', 'Invert Call Tree' ve 'Hide System Libraries' işaretlenerek ana thread'i bloke eden ağır JSON parse veya görsel decode fonksiyonu bulunur.\n2. Bellek Sızıntısı (Leak): Leaks ve Allocations şablonu seçilir. Kırmızı bayraklı sızıntılar yakalanır; Xcode Memory Graph Debugger ile nesneler arasındaki retain cycle'lar görsel incelenerek [weak self] eksikliği giderilir.",
      hints: [
        "Hide System Libraries ve Invert Call Tree filtrelerini belirtin.",
        "16.6ms frame bütçesini açıklayın.",
        "Memory Graph Debugger ile retain cycle yakalamayı anlatın."
      ],
      key_points: [
        "Time Profiler ile Main Thread'i tıkayan metotlar bulunur",
        "Invert Call Tree ve Hide System Libraries analizi kolaylaştırır",
        "Görselleri arka planda downsample ederek jank önlenir",
        "Memory Graph Debugger ile retain cycle görsel olarak tespit edilir"
      ]
    },
    en: {
      title: "Performance Profiling: Scroll Jank & Memory Leaks via Instruments",
      question_text: "How do you systematically investigate 60/120fps Scroll Jank and Memory Leaks using Xcode Instruments and the Memory Graph Debugger?",
      ideal_answer: "1. Scroll Jank: Run the Time Profiler and Core Animation instruments. Look for main thread frame drops exceeding the 16.6ms (60fps) or 8.3ms (120fps ProMotion) budget. Under Call Tree, activate 'Separate by Thread', 'Invert Call Tree', and 'Hide System Libraries'. This isolates your app's heavy operations blocking the main run loop (such as synchronous image decompression or main-thread JSON mapping).\n2. Memory Leaks: Profile with Leaks and Allocations to record persistent heap allocations. In Xcode, pause the running app and launch the Memory Graph Debugger to trace retain cycles visually, identifying missing `[weak self]` references between view models, closures, and delegate targets.",
      hints: [
        "Mention the 16.6ms/8.3ms frame budget limit.",
        "Explain Invert Call Tree and Hide System Libraries.",
        "Detail Memory Graph Debugger for cyclic references."
      ],
      key_points: [
        "Time Profiler identifies main-thread functions exceeding the 16.6ms frame budget",
        "Call Tree filters (Invert, Hide System Libraries) zero in on culpable app code",
        "Background image downsampling and pre-decoding eliminates scroll hitches",
        "Memory Graph Debugger pinpoints circular retain cycles visually"
      ]
    }
  }
];

export const OTHER_PLATFORM_QUESTIONS: Question[] = [
  {
    id: "and-1",
    difficulty: "mid",
    q_type: "technical",
    tags: ["Android", "Kotlin", "Compose"],
    tr: {
      title: "Jetpack Compose: Recomposition ve State Hoisting",
      question_text: "Compose'da Recomposition nedir? State Hoisting prensibi neden uygulanmalıdır ve performansa etkisi nedir?",
      ideal_answer: "Recomposition, state değiştiğinde composable fonksiyonun yeniden çalışmasıdır. State Hoisting ile bileşen stateless yapılır; bu da test edilebilirliği, tekrar kullanımı ve önizleme kolaylığını maksimize eder.",
      hints: ["Stateless bileşenlerin avantajlarını düşünün."],
      key_points: ["Stateless bileşenler", "Tek yönlü veri akışı (UDF)", "Test edilebilirlik"]
    },
    en: {
      title: "Jetpack Compose: Recomposition & State Hoisting",
      question_text: "What is Recomposition in Jetpack Compose? Why should State Hoisting be applied, and how does it influence UI performance?",
      ideal_answer: "Recomposition is the execution cycle where composable functions re-run in response to state mutations. State Hoisting lifts state management up to callers, making composables stateless, pure, highly reusable, and easily testable without side-effects.",
      hints: ["Consider the benefits of stateless pure composables.", "Unidirectional Data Flow."],
      key_points: ["Stateless pure composables", "Unidirectional Data Flow (UDF)", "High testability and preview support"]
    }
  },
  {
    id: "web-1",
    difficulty: "mid",
    q_type: "technical",
    tags: ["Next.js", "React", "TypeScript"],
    tr: {
      title: "Next.js 15: Server Components vs Client Components",
      question_text: "Server Components (RSC) ile Client Components arasındaki farklar nelerdir? 'use client' ne zaman gereklidir?",
      ideal_answer: "Server Components istemciye sıfır JS bundle boyutu gönderir ve doğrudan sunucu kaynaklarına erişir. Client Components ise tarayıcı etkileşimi (onClick, useState vb.) gerektiğinde kullanılır.",
      hints: ["Sıfır bundle boyutunu ve sunucu erişimini vurgulayın."],
      key_points: ["Sıfır JS bundle katkısı", "use client ile etkileşim ayrıştırma", "SEO avantajı"]
    },
    en: {
      title: "Next.js 15: Server Components vs Client Components",
      question_text: "Contrast React Server Components (RSC) with Client Components in Next.js 15. When is the 'use client' directive mandatory?",
      ideal_answer: "Server Components execute solely on the server, streaming zero JavaScript bundle overhead to the client with direct database and file system access. Client Components ('use client') are reserved for browser interactivity, event listeners, state hooks, and browser APIs.",
      hints: ["Highlight zero-bundle client footprint.", "Event listeners and state require use client."],
      key_points: ["Zero client JS bundle overhead", "Direct server resources access", "Selective hydration for interactive leaves", "Enhanced initial page load and SEO"]
    }
  },
  {
    id: "db-1",
    difficulty: "senior",
    q_type: "technical",
    tags: ["PostgreSQL", "Supabase", "RLS"],
    tr: {
      title: "PostgreSQL: İndeksleme ve Row Level Security (RLS) Performansı",
      question_text: "Supabase ve PostgreSQL üzerinde RLS politikaları uygularken sorguların yavaşlamasını engellemek için nelere dikkat edilmelidir?",
      ideal_answer: "auth.uid() gibi fonksiyon çağrıları SELECT sorgularında tekrarlanmamalıdır (alt sorgu kullanımı veya STABLE sarmalama). İlgili yabancı anahtar ve kullanıcı ID sütunlarına B-Tree indeksler eklenmelidir.",
      hints: ["auth.uid() sarmalaması", "Indexleme stratejisi"],
      key_points: ["B-Tree indeksleme", "Subquery optimizasyonu", "Cache mekanizmaları"]
    },
    en: {
      title: "PostgreSQL & Supabase: Optimizing Row Level Security (RLS)",
      question_text: "What performance indexing practices prevent severe query degradation when executing Row Level Security (RLS) policies in PostgreSQL?",
      ideal_answer: "Avoid evaluating expensive volatile functions like `auth.uid()` repeatedly across large table scans; wrap calls inside subqueries `(select auth.uid())` so Postgres caches the result once per statement. Always maintain explicit B-Tree indexes on user ID and foreign key columns evaluated in RLS policies.",
      hints: ["Wrap auth.uid() in subqueries to avoid per-row execution.", "Index foreign key columns."],
      key_points: ["Subquery scalar caching for auth.uid()", "B-Tree indexing on RLS filter columns", "Avoid join loops within policy definitions"]
    }
  }
];

export const ALL_BILINGUAL_QUESTIONS: Question[] = [
  ...SWIFT_MASTER_QUESTIONS,
  ...OTHER_PLATFORM_QUESTIONS
];
