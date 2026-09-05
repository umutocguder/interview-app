import { Question } from "@/lib/types";

export const SWIFT_MASTER_QUESTIONS: Question[] = [
  // MARK: - SwiftUI & State
  {
    id: "sw-1",
    title: "SwiftUI State Hiyerarşisi: @State, @StateObject, @ObservedObject ve @EnvironmentObject",
    question_text: "@State, @StateObject, @ObservedObject ve @EnvironmentObject property wrapper'ları arasındaki farklar nelerdir? Hangisi ne zaman ve nerede oluşturulmalıdır?",
    ideal_answer: "@State: Yalnızca tanımlandığı View'a ait basit değer türleri (struct, Int, String vb.) için kullanılır ve View'ın lokal state'ini yönetir.\n@StateObject: ViewModel gibi ObservableObject referans tiplerinin View yaşam döngüsü boyunca ilk kez oluşturulduğu (instantiate edildiği) yerde kullanılır. View yeniden render edildiğinde nesne yok edilmez ve yeniden başlatılmaz.\n@ObservedObject: Dışarıdan veya üst View'dan parametre olarak aktarılan ObservableObject nesnelerini izlemek için kullanılır; nesnenin sahipliğini (ownership) üstlenmez.\n@EnvironmentObject: View ağacında (View Tree) derin hiyerarşilerde veriyi elle katman katman paslamak yerine (Explicit DI), enjekte edildiği View'ın tüm alt çocuklarına dolaylı (Implicit DI) olarak aktaran paylaşımlı state aracıdır.",
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
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["SwiftUI", "State", "Architecture", "iOS 14+"]
  },
  {
    id: "sw-2",
    title: "SwiftUI ViewTree ve some View Render Döngüsü",
    question_text: "SwiftUI'da 'some View' nedir? ViewTree nasıl render edilir ve @ViewBuilder nasıl çalışır?",
    ideal_answer: "'some View', Swift'in Opaque Return Type özelliğidir. Derleyiciye body'nin 'View protokolüne uyan somut tek bir tip' döndüreceğini garanti eder ancak tipin tam adını gizleyerek API esnekliği sağlar.\n@ViewBuilder, Result Builder sözdizimini kullanarak birden fazla alt görünümü tek bir TupleView veya ConditionalContent yapısına dönüştürür; böylece süslü parantezler içinde if-else veya sıralı view'lar tanımlanabilir.\nSwiftUI, View struct'larını çok hafif tutar. State veya Published bir özellik değiştiğinde SwiftUI diffing algoritması eski ve yeni ViewTree'yi karşılaştırır (body'yi yeniden değerlendirir) ve yalnızca değişen gerçek ekran piksellerini UIKit/Render sunucusuna yansıtır.",
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
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["SwiftUI", "ViewTree", "ViewBuilder", "Render"]
  },
  {
    id: "sw-3",
    title: "SwiftUI Timer & Render Performans Problemini Teşhis Etme",
    question_text: "SwiftUI uygulamasında her saniye tetiklenen bir Timer UI performans sorunlarına ve gereksiz render döngülerine yol açıyor. Bu sorunu nasıl tespit eder ve çözersiniz?",
    ideal_answer: "Teşhis: Xcode Instruments altındaki 'SwiftUI Instruments' ve 'Time Profiler' araçları kullanılarak View body çalışma frekansı incelenir. Ayrıca kod içinde `let _ = Self._printChanges()` çağrısı yapılarak konsolda hangi state değişkeninin body'yi sürekli tetiklediği görülür.\nÇözüm:\n1. State Izolasyonu: Timer'a bağımlı olan alanı ana View'dan ayırıp ayrı küçük bir alt View (subview) içine izole etmek; böylece tüm sayfa değil sadece o küçük saat/sayaç bileşeni render olur.\n2. iOS 17 @Observable Makrosu: Eski ObservableObject tüm View'ı tetiklerken @Observable property-level tracking yapar; View içinde okunmayan alanlar timer güncellense bile render tetiklemez.\n3. TimelineView kullanımı: Sık zaman güncellemeleri için Timer yerine optimize edilmiş `TimelineView(.periodic(...))` tercih edilmelidir.",
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
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["SwiftUI", "Performance", "Instruments", "Debugging"]
  },

  // MARK: - Concurrency & Threading (Modern + GCD)
  {
    id: "sw-4",
    title: "Swift Concurrency: Actor Mimarisi, Data Isolation ve Reentrancy",
    question_text: "Swift Concurrency içindeki Actor tipi ne işe yarar? Class'tan farkı nedir ve Actor Reentrancy tehlikesi nasıl yönetilir?",
    ideal_answer: "Actor, class gibi referans tiplidir ancak dahili mutable state'ini 'Data Isolation' mekanizmasıyla korur. Dışarıdan actor'ün metodlarına veya değişkenlerine erişirken `await` zorunlu tutulur ve işlemler sıralı (serialized) hale getirilerek derleme zamanında data race kesin olarak önlenir.\nActor Reentrancy: Bir actor metodu içinde `await` ile asenkron bir işlem beklenirken (örneğin ağ isteği), actor kilidi serbest kalır ve araya başka bir görev girerek actor'ün state'ini değiştirebilir. Await sonrasında state'in ilk çağrıldığı andakiyle aynı kalacağı varsayılmamalıdır (Suspension point state drift). Çözüm olarak await öncesi ve sonrası state doğrulanmalı veya kritik state güncellemeleri senkron alt metodlar içinde atomik tutulmalıdır.",
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
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["Concurrency", "Actors", "Reentrancy", "Swift 6"]
  },
  {
    id: "sw-5",
    title: "@MainActor ve nonisolated Kullanım Alanları",
    question_text: "Swift Concurrency'de @MainActor ve nonisolated anahtar sözcükleri ne zaman kullanılır? Bir actor içinde nonisolated bir metod ne anlama gelir?",
    ideal_answer: "@MainActor: İlgili sınıfın, fonksiyonun veya özelliğin daima Main Thread (Ana İş Parçacığı) üzerinde çalışacağını garanti eden bir Global Actor'dür. Kullanıcı arayüzü (UIKit/SwiftUI) güncellemeleri, ViewModel sınıfları ve UI callback'leri için zorunludur.\nnonisolated: Bir Actor veya @MainActor sınıfı içindeki belirli bir metodun veya immutable özelliğin actor izolasyonundan muaf tutulduğunu belirtir. Bu sayede o metoda dışarıdan erişirken `await` kullanmaya gerek kalmaz. Sadece actor'ün mutable state'ine dokunmayan, immutable (let) değerleri okuyan veya protokol uyumluluğu (örneğin Hashable, CustomStringConvertible) gerektiren yerlerde kullanılır.",
    hints: [
      "UI güncellemeleri için @MainActor zorunluluğunu düşünün.",
      "nonisolated metodların mutable state'e erişemeyeceğini unutmayın.",
      "Protokol gereksinimlerini karşılarken nonisolated ihtiyacını hatırlayın."
    ],
    key_points: [
      "@MainActor ana iş parçacığı garantisi verir",
      "UI ve ViewModel bileşenlerinde @MainActor esastır",
      "nonisolated actor kilidine girmeden senkron çağrıya izin verir",
      "nonisolated metodlar mutable state'i değiştiremez"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["Concurrency", "MainActor", "nonisolated", "Swift 5.9+"]
  },
  {
    id: "sw-6",
    title: "Swift 6 Strict Concurrency ve Sendable Protokolü",
    question_text: "Swift 6 ile gelen Strict Concurrency Checking nedir? Sendable protokolü neyi garanti eder ve closure'larda @Sendable neden zorunludur?",
    ideal_answer: "Swift 6 Strict Concurrency, eşzamanlı kodlarda veri yarışlarını (data races) derleme zamanında tamamen ortadan kaldırmayı hedefler.\nSendable: Değerinin veya referansının farklı thread'ler veya actor sınırları (isolation boundaries) arasında güvenle kopyalanıp aktarılabileceğini belirten bir protokoldür. Struct ve Enum gibi value type'lar tüm alanları Sendable ise otomatik olarak Sendable'dır. Class'lar ise ancak `final` ve tüm alanları immutable (let) ise veya dahili kilit mekanizmasıyla thread-safe yapılmışsa (`@unchecked Sendable`) Sendable olabilir.\n@Sendable: Farklı bir thread veya Task'a aktarılacak olan closure'ların yakaladığı (capture ettiği) değerlerin thread-safe ve Sendable olmasını zorunlu tutar; mutable referans yakalanmasını derleme hatasıyla engeller.",
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
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["Swift 6", "Sendable", "Strict Concurrency", "Thread Safety"]
  },
  {
    id: "sw-7",
    title: "Grand Central Dispatch: Serial vs Concurrent Queue ve Main Queue",
    question_text: "Grand Central Dispatch'te (GCD) Serial ve Concurrent kuyruk farkları nelerdir? Main queue neden özeldir ve yeni kuyruk oluşturulduğunda yeni thread açılır mı?",
    ideal_answer: "Serial Queue (Sıralı Kuyruk): Görevleri eklenme sırasına göre (FIFO) teker teker ve sırayla çalıştırır. Bir önceki görev bitmeden diğeri başlamaz. Paylaşılan kaynaklara güvenli erişim sağlamak (thread safety) için idealdir.\nConcurrent Queue (Eşzamanlı Kuyruk): Görevleri FIFO sırasıyla başlatır ancak bitmelerini beklemeden birden fazla görevi aynı anda paralel iş parçacıklarında yürütebilir.\nMain Queue: Kullanıcı arayüzü işlemlerinin çalıştığı özel bir Serial Queue'dur ve daima ana iş parçacığına (Main Thread) bağlıdır.\nYeni kuyruk açıldığında otomatik yeni thread açılmaz: Kuyruk (Queue) bir iş listesidir; Thread ise işletim sistemi kaynağıdır. GCD, sistem kaynak durumuna göre Thread Pool içindeki uygun boş bir thread'i atar veya gerekirse yeni thread oluşturur. Kararı işletim sistemi verir.",
    hints: [
      "Kuyruk (Queue) ile İş Parçacığı (Thread) ayrımına dikkat edin.",
      "Thread Pool mantığını ve OS kaynak yönetimini açıklayın.",
      "Main Queue'nun serial olduğunu ve UI işlemlerini yönettiğini belirtin."
    ],
    key_points: [
      "Serial queue görevleri sırayla tekil yürütür (FIFO)",
      "Concurrent queue görevleri paralel başlatabilir",
      "Main queue özel bir serial kuyruktur (Main Thread)",
      "Kuyruk açmak doğrudan yeni thread açmaz, Thread Pool yönetir"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["GCD", "DispatchQueue", "Threading", "Concurrency"]
  },
  {
    id: "sw-8",
    title: "DispatchWorkItem: İptal ve Bildirim Mekanizmaları",
    question_text: "DispatchWorkItem nedir? Hangi senaryolarda tercih edilir ve cancel(), notify(), wait() metodları ne işe yarar?",
    ideal_answer: "DispatchWorkItem, GCD üzerinde çalıştırılacak bir kod bloğunu nesne olarak kapsülleyen yapıdır. Normal closure'lardan farklı olarak iptal edilebilme, bağımlılık oluşturma ve tamamlanma bildirimi dinleme yeteneği sunar.\nKullanım Alanları: Arama çubuğunda kullanıcının her harf yazışında önceki istekleri iptal eden 'Debouncing' mekanizmaları için idealdir.\nMetodlar:\n- `cancel()`: Eğer iş henüz kuyrukta bekliyorsa ve yürütülmeye başlanmadıysa iptal eder. Eğer iş zaten çalışıyorsa `isCancelled` bayrağını true yapar (işin içinde bu bayrak kontrol edilmelidir).\n- `notify(queue:execute:)`: İş tamamlandığında belirlenen başka bir kuyrukta (örneğin Main Queue) bir callback tetikler.\n- `wait()`: İş tamamlanana kadar çağrıldığı thread'i bloke ederek bekletir (timeout parametresi verilebilir).",
    hints: [
      "SearchBar debouncing örneğini aklınıza getirin.",
      "cancel() metodunun çalışan bir işi anında öldürmeyeceğini, kuyruktakini sildiğini veya isCancelled bayrağını set ettiğini belirtin.",
      "notify ile UI'a haber verme sürecini açıklayın."
    ],
    key_points: [
      "Görevleri nesne olarak kapsülleyip yönetme imkanı",
      "Debounce ve arama optimizasyonlarında yaygın kullanım",
      "cancel() başlamamış işi iptal eder veya isCancelled bayrağını işaretler",
      "notify() işlem bitiminde başka bir kuyrukta tetiklenir"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["GCD", "DispatchWorkItem", "Debounce", "Concurrency"]
  },
  {
    id: "sw-9",
    title: "DispatchSemaphore ile Eşzamanlı İstek Sınırlama",
    question_text: "DispatchSemaphore nedir? signal() ve wait() metodları nasıl çalışır ve hangi gerçek hayat senaryosunda kullanılır?",
    ideal_answer: "DispatchSemaphore, paylaşılan bir kaynağa veya işlem havuzuna aynı anda erişebilecek maksimum görev sayısını kontrol etmek için sayaç (counter) mekanizması kullanan senkronizasyon aracıdır.\nNasıl Çalışır:\n- Başlangıç değeri (count) verilir (örn. `DispatchSemaphore(value: 3)`).\n- `wait()`: Sayacı 1 azaltır. Eğer sayaç sıfırdan küçükse, çağrıyı yapan thread başka bir thread sayacı artırana kadar bloke olur.\n- `signal()`: Sayacı 1 artırır. Eğer bekleyen thread varsa biri uyandırılır ve işlemine devam eder.\nGerçek Hayat Örneği: Kullanıcı 50 adet fotoğraf indirirken sunucuyu ve cihaz belleğini boğmamak için aynı anda en fazla 3 fotoğraf indirilmesini sınırlamak (Concurrent Task Throttling).",
    hints: [
      "Sayaç mantığını (value) net ifade edin.",
      "wait() sayacı düşürür, signal() sayacı artırır.",
      "Görsel indirme havuzu sınırlama örneğini verin."
    ],
    key_points: [
      "Sayaç tabanlı eşzamanlı işlem sınırlayıcı",
      "wait() sayacı 1 azaltır ve gerekirse bekletir",
      "signal() sayacı 1 artırır ve bekleyen thread'i serbest bırakır",
      "Aynı anda maksimum N adet ağ isteği çalıştırmak için kullanılır"
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["GCD", "DispatchSemaphore", "Throttling", "Concurrency"]
  },
  {
    id: "sw-10",
    title: "DispatchGroup ile Çoklu Asenkron İstekleri Birleştirme",
    question_text: "DispatchGroup nedir? enter(), leave(), notify() ve wait() metodları asenkron ağ isteklerinde nasıl koordine edilir?",
    ideal_answer: "DispatchGroup, birden fazla bağımsız asenkron görevin tamamlanmasını tek bir çatı altında izlemek için kullanılır.\nMetodlar:\n- `enter()`: Gruba yeni bir asenkron görevin başladığını bildirir (sayacı 1 artırır).\n- `leave()`: Görevin bittiğini bildirir (sayacı 1 azaltır). Mutlaka her `enter()` çağrısına karşılık tam olarak bir `leave()` çağrılmalıdır, aksi takdirde deadlock veya tamamlanmama yaşanır.\n- `notify(queue:execute:)`: Gruptaki tüm görevler bittiğinde (sayaç sıfıra ulaştığında) belirtilen kuyrukta (örneğin Main Queue) asenkron olarak çalışır.\n- `wait(timeout:)`: Görevler bitene kadar çağıran thread'i senkron olarak bekletir.\nSenaryo: Bir dashboard açılırken profil bilgisi, bildirimler ve bakiye servislerinin üçüne aynı anda paralel istek atıp, üçü de tamamlandığında tek seferde ekran yükleme animasyonunu (loader) kaldırmak.",
    hints: [
      "enter() ve leave() çiftlerinin dengeli olmasının önemini vurgulayın.",
      "notify() metodunun UI thread'de çalıştırılma kolaylığını belirtin.",
      "Dashboard başlangıç istekleri örneğini verin."
    ],
    key_points: [
      "Birden fazla paralel asenkron görevin bitişini senkronize eder",
      "enter() sayacı artırır, leave() azaltır (çiftler eşit olmalı)",
      "notify() tüm işler bittiğinde UI'ı tetikler",
      "wait() senkron bekleme sağlar (Main thread'de önerilmez)"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["GCD", "DispatchGroup", "Networking", "Concurrency"]
  },
  {
    id: "sw-11",
    title: "Quality of Service (QoS) Seviyeleri ve Öncelik Yönetimi",
    question_text: "GCD ve NSOperation'da Quality of Service (QoS) nedir? Dört ana QoS seviyesini ve kullanım senaryolarını açıklayın.",
    ideal_answer: "Quality of Service (QoS), bir görevin kullanıcı deneyimi ve sistem kaynakları (CPU, pil, enerji) açısından önemini ve önceliğini belirleyen sınıflamadır.\n1. userInteractive: Doğrudan kullanıcı etkileşimi, animasyonlar veya UI çizimi için kullanılır. Hemen çalışması gerekir, en yüksek önceliğe sahiptir.\n2. userInitiated: Kullanıcının bir butona basması sonucu anlık olarak beklediği işlemler (örneğin listede pull-to-refresh yapılması veya detay sayfasının verisinin çekilmesi).\n3. utility: Kullanıcının anlık olarak beklemediği, biraz zaman alabilecek arka plan işlemleri (örneğin veri aktarımı, dosya önbellekleme, hesaplama).\n4. background: Kullanıcının farkında olmadığı, saatler sürebilecek en düşük öncelikli işlemler (veritabanı temizliği, analitik log yedekleme, büyük içerik ön-indirmesi). Pil tasarrufuna odaklanır.",
    hints: [
      "userInteractive, userInitiated, utility, background sıralamasını hatırlayın.",
      "Pil tüketimi ve CPU önceliği ilişkisini belirtin."
    ],
    key_points: [
      "userInteractive: UI ve animasyonlar (en yüksek öncelik)",
      "userInitiated: Kullanıcının sonucunu beklediği anlık işlemler",
      "utility: Arka plan hesaplamaları ve dosya indirmeleri",
      "background: Düşük öncelikli bakım, loglama ve yedekleme"
    ],
    difficulty: "junior",
    q_type: "technical",
    tags: ["GCD", "QoS", "Performance", "Energy"]
  },
  {
    id: "sw-12",
    title: "Deadlock ve Race Condition Farkları ve Çözüm Stratejileri",
    question_text: "Deadlock ve Race Condition nedir? Swift ve iOS'ta bu iki kritik eşzamanlılık hatası nasıl oluşur ve nasıl engellenir?",
    ideal_answer: "Deadlock (Karşılıklı Kilitlenme): İki veya daha fazla thread'in birbirinin elinde tuttuğu kaynağı bırakmasını sonsuza kadar beklemesi durumudur; program tamamen kilitlenir ve donar. En yaygın örneği: Main Queue üzerinde `DispatchQueue.main.sync { ... }` çağırmaktır (ana iş parçacığı kendisinin bitmesini bekler ve kilitlenir).\nRace Condition (Yarış Durumu): Birden fazla thread'in aynı anda paylaşılan mutable bir veriye (örneğin bir sayaca veya array'e) senkronizasyonsuz erişip yazması sonucu nihai sonucun belirsiz ve tutarsız çıkmasıdır (Data Race).\nÇözüm Stratejileri:\n1. Swift Concurrency & Actors: Actor izolasyonu ile derleme zamanında race condition kesin olarak engellenir.\n2. Serial Queue ile Senkronizasyon: Yazma işlemlerini tek bir serial kuyruktan geçirmek.\n3. Reader-Writer Lock: `DispatchQueue(attributes: .concurrent)` üzerinde okumaları eşzamanlı, yazmaları ise `queue.async(flags: .barrier)` ile izole etmek.",
    hints: [
      "DispatchQueue.main.sync çağrısının klasik deadlock örneği olduğunu hatırlayın.",
      "Actor ve Barrier flag çözümlerini vurgulayın."
    ],
    key_points: [
      "Deadlock: Thread'lerin birbirini sonsuza dek beklemesi",
      "Main thread'de main.sync çağrısı anında deadlock yaratır",
      "Race Condition: Eşzamanlı yazma sonucu veri bozulması",
      "Actor, Serial Queue veya GCD Barrier flag ile çözülür"
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["Concurrency", "Deadlock", "RaceCondition", "ThreadSafety"]
  },

  // MARK: - ARC & Memory Management
  {
    id: "sw-13",
    title: "Stack Memory (Value Type) vs Heap Memory (Reference Type)",
    question_text: "Stack ve Heap bellek bölgeleri arasındaki mimari farklar nelerdir? Value Type ve Reference Type bellek yönetimini nasıl etkiler?",
    ideal_answer: "Stack (Yığın): Fonksiyon çağrıları ve yerel değişkenler için kullanılan hızlı bellek bölgesidir. LIFO (Last In First Out) prensibiyle çalışır. Değişkenlerin boyutu derleme zamanında bilinir, tahsis ve serbest bırakma (push/pop) CPU düzeyinde mikro saniyelerde gerçekleşir. Struct ve Enum gibi Value Type'lar kural olarak Stack üzerinde saklanır.\nHeap (Öbek): Dinamik olarak boyutlanan ve çalışma zamanında tahsis edilen bellek alanıdır. Class, Closure ve Actor gibi Reference Type'lar Heap üzerinde yaşar. Tahsis ve çöp toplama (ARC) işlemleri ek maliyet (lookup, kilitleme, referans sayımı) taşır ve Stack'e göre daha yavaştır.\nNot: Bir struct içinde reference type (class) varsa veya struct bir protokole (Existential Container) kutulanıyorsa, Heap tahsisi gerçekleşebilir.",
    hints: [
      "Stack'in LIFO yapısını ve hız avantajını vurgulayın.",
      "Heap'in dinamik tahsis ve ARC maliyetlerini açıklayın.",
      "Value Type içinde Reference Type bulunma durumuna değinin."
    ],
    key_points: [
      "Stack: LIFO, hızlı, otomatik tahsis, Value Type'lar",
      "Heap: Dinamik, esnek, ARC takibi, Reference Type'lar",
      "Heap tahsisi kilitleme ve arama nedeniyle Stack'ten yavaştır",
      "Existential container'lar value type'ları da heap'e taşıyabilir"
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["Memory", "Stack", "Heap", "ARC", "ValueTypes"]
  },
  {
    id: "sw-14",
    title: "ARC Retain Cycle: [weak self] vs [unowned self] ve guard let Kalıbı",
    question_text: "ARC'de Retain Cycle (Döngüsel Referans) nasıl oluşur? [weak self] ve [unowned self] arasındaki fark nedir ve neden guard let kalıbı kullanılır?",
    ideal_answer: "Retain Cycle: İki veya daha fazla nesnenin birbirine 'strong' (güçlü) referans ile bağlanması sonucu referans sayacının hiçbir zaman 0'a inmemesi ve belleğin (deinit) serbest bırakılamaması durumudur (Memory Leak).\nweak vs unowned:\n- `weak`: Referans sayacını artırmaz ve hedef nesne deallocate olduğunda referans otomatik olarak `nil` değerini alır. Bu nedenle weak her zaman `Optional` olmak zorundadır (`weak var delegate: MyDelegate?`).\n- `unowned`: Referans sayacını artırmaz ancak nesnenin yaşam döngüsünün en az onu tutan nesne kadar uzun olacağını varsayar. Optional değildir. Eğer hedef nesne deallocate olduktan sonra unowned referansa erişilirse uygulama anında crash olur.\n`[weak self] in guard let self else { return }` Kalıbı:\nClosure içinde retain cycle'ı önlemek için weak self alınır; ardından closure bloğu boyunca self'in ara aşamada deallocate olup nil'e dönmesini engellemek ve kod içinde `self?.` tekrarlarından kaçınmak için geçici olarak lokal strong scope'a (`guard let self`) dönüştürülür.",
    hints: [
      "weak her zaman optional'dır, nesne ölünce nil olur.",
      "unowned nil olmaz, nesne ölünce erişilirse çöker (dangling pointer).",
      "guard let self ile geçici strong reference garantisi sağlanır."
    ],
    key_points: [
      "Retain cycle nesnelerin bellekte asılı kalmasına (leak) yol açar",
      "weak referans Optional'dır ve otomatik nil olur",
      "unowned referans Optional değildir ve nesne ölürse crash olur",
      "guard let self closure süresince güvenli lokal erişim sağlar"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["ARC", "MemoryLeak", "WeakSelf", "Unowned"]
  },
  {
    id: "sw-15",
    title: "Copy-on-Write (COW) Mekanizması ve İspatlanması",
    question_text: "Swift'te Copy-on-Write (COW) nedir? Hangi veri yapılarında uygulanır ve isKnownUniquelyReferenced ile nasıl doğrulanır?",
    ideal_answer: "Copy-on-Write (COW), Swift'in standart koleksiyonlarında (Array, Dictionary, Set, String) bellek ve performans optimizasyonu sağlayan bir tekniktir.\nNasıl Çalışır: Bir dizi başka bir değişkene atandığında (`var b = a`), veriler hemen bellekte kopyalanmaz; her iki değişken de Heap'teki aynı arka plan tamponunu (buffer) işaret eder. Kopyalama işlemi, değişkenlerden biri içeriği üzerinde bir değişiklik (mutating - örneğin `.append()`) yapmaya çalıştığı anda gerçekleşir.\nÖzel Tiplerde Doğrulama: `isKnownUniquelyReferenced(&ref)` fonksiyonu kullanılarak referans sayacının tam olarak 1 olup olmadığı kontrol edilir. Eğer 1 ise doğrudan mevcut buffer üzerinde yazılır; eğer 1'den fazla ise yeni bir bellek alanı tahsis edilerek klonlanır.",
    hints: [
      "Atama anında değil, ilk değişiklik (mutating) anında kopyalandığını vurgulayın.",
      "isKnownUniquelyReferenced fonksiyonunu belirtin."
    ],
    key_points: [
      "Atama anında kopyalama maliyetini sıfıra indirir",
      "Sadece değer değiştirildiğinde (mutating) gerçek kopyalama yapılır",
      "Array, Dictionary, Set ve String yapılarında mevcuttur",
      "isKnownUniquelyReferenced ile özel COW struct'ları tasarlanabilir"
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["Swift", "COW", "Memory", "Optimization"]
  },
  {
    id: "sw-16",
    title: "Retain ve Assign Bellek Atama Stratejileri",
    question_text: "Bellek yönetiminde 'Retain' ve 'Assign' kavramları neyi ifade eder? Float/Int gibi ilkel türlerle nesneler arasındaki atama farkı nedir?",
    ideal_answer: "Retain (Sahiplik & Sayaç Artırma): Referans tipli (Objective-C/Swift nesneleri) değişkenlerde bir nesneye yeni bir referans atandığında, ARC referans sayacını (+1) artırır ve nesnenin yaşam süresini garantiye alır.\nAssign (Doğrudan Değer Atama): Referans sayımına tabi olmayan, Stack üzerinde tutulan ilkel değer türleri (Int, Float, Double, Bool) veya C veri yapıları için kullanılır. Bellekteki değer doğrudan bit düzeyinde kopyalanır, retain/release döngüleri çalıştırılmaz. Referans tiplerinde 'assign' kullanılması durumunda nesne serbest bırakıldığında geride sarkan gösterici (dangling pointer) kalacağı için güvensizdir.",
    hints: [
      "Retain'in referans sayacı artırdığını düşünün.",
      "Assign'in ilkel türlerde doğrudan kopyalama yaptığını açıklayın."
    ],
    key_points: [
      "Retain nesnede referans sayısını (+1) artırarak sahiplik kurar",
      "Assign ilkel türlerde (Float, Int) doğrudan değer ataması yapar",
      "Referans tiplerinde assign kullanılması dangling pointer yaratır"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["Memory", "ARC", "Retain", "Assign"]
  },

  // MARK: - Swift Core Language
  {
    id: "sw-17",
    title: "self vs Self Ayrımı ve Protokollerdeki Önemi",
    question_text: "Swift'te küçük harfli 'self' ile büyük harfli 'Self' arasındaki fark nedir? Protokollerde ve Factory metotlarında Self neden kritiktir?",
    ideal_answer: "'self' (Küçük harf): Mevcut nesnenin (instance) kendisini temsil eder. Bir sınıfın veya struct'ın metodu içindeki değişken isim çakışmalarını çözmek (`self.name = name`) veya mevcut instance'ı parametre olarak geçmek için kullanılır.\n'Self' (Büyük harf): İlgili instance'ın ait olduğu 'Tipi (Type)' temsil eder. Özellikle Protokollerde ve sınıf kalıtımında dinamik dönüş tipleri tanımlamak için vazgeçilmezdir.\nProtokollerdeki Önemi: Örneğin bir `Copyable` protokolü yazıldığında `func copy() -> Self` tanımlanırsa, bu protokolü uygulayan alt sınıf (örneğin `Car`) kendi somut tipi olan `Car`'ı döndürmek zorunda kalır; typecasting (as! Car) gereksinimini ortadan kaldırır ve Type Safety sağlar.",
    hints: [
      "self = instance (örnek), Self = Type (tip) kuralını hatırlayın.",
      "Protokol dönüş tiplerinde dinamik tip güvenliğini açıklayın."
    ],
    key_points: [
      "self mevcut örneği (instance) temsil eder",
      "Self o anki tipi (type) temsil eder",
      "Protokollerde doğru return type ve type safety sağlar",
      "Alt sınıflarda dinamik tip garantisi sunar"
    ],
    difficulty: "junior",
    q_type: "technical",
    tags: ["Swift", "LanguageCore", "Protocols", "TypeSafety"]
  },
  {
    id: "sw-18",
    title: "final Anahtar Kelimesi ve Static vs Dynamic Dispatch",
    question_text: "Swift'te bir sınıfa veya metoda 'final' eklemenin getirdiği mimari ve performans avantajları nelerdir? Method Dispatch mekanizmasını nasıl etkiler?",
    ideal_answer: "Mimari Avantaj: `final` anahtar kelimesi, bir sınıfın alt sınıflar tarafından miras alınmasını (inheritance) veya bir metodun/özelliğin override edilmesini kesin olarak engeller.\nPerformans & Method Dispatch Avantajı:\nSwift'te sınıflar varsayılan olarak çalışma zamanında 'Table Dispatch' (vtable) kullanır; yani hangi metodun çalışacağına çalışma zamanında bir tabloya bakılarak karar verilir (indirection maliyeti).\nBir metot veya sınıf `final` yapıldığında, derleyici bu metodun asla override edilemeyeceğini bilir ve 'Direct Dispatch' (Static Dispatch) uygular. Hatta derleyici metodu satır içine gömebilir (Method Inlining). Bu da CPU düzeyinde vtable arama maliyetini sıfıra indirerek performansı maksimize eder.",
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
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["Swift", "MethodDispatch", "Performance", "Compiler"]
  },
  {
    id: "sw-19",
    title: "mutating Fonksiyonlar ve Value Semantics",
    question_text: "Swift'te struct ve enum metotlarında 'mutating' anahtar sözcüğü neden zorunludur? Bellek düzeyinde ne gerçekleşir?",
    ideal_answer: "Swift'te struct ve enum yapılar 'Value Type'tır ve varsayılan olarak bir value type'ın metotları içindeki özellikleri (stored properties) değiştiremez; self immutable kabul edilir.\n'mutating' anahtar kelimesi eklendiğinde, derleyiciye bu metodun çağrıldığı nesnenin dahili durumunu (state) değiştireceği bildirilir.\nBellek Düzeyinde Ne Olur: Metot çağrıldığında, `self` aslında gizli bir `inout` parametresi olarak geçirilir (`mutating func increment() -> (&self)`). Metodun sonunda mevcut struct'ın yerine bellekte değiştirilmiş yepyeni bir kopyası yazılır. Bu nedenle `let` ile tanımlanmış sabit bir struct değişkeni üzerinde mutating metot çağrılamaz (derleme hatası verir).",
    hints: [
      "Value type'ların varsayılan immutability kuralını belirtin.",
      "self'in inout parametresi gibi davranmasını açıklayın.",
      "let ile tanımlanan nesnelerde neden çağrılamadığını vurgulayın."
    ],
    key_points: [
      "Value type'ların kendi stored property'lerini değiştirmesine izin verir",
      "Arka planda self nesnesi inout parametresi olarak aktarılır",
      "Değişiklik yapıldığında yeni struct örneği yazılır",
      "Sadece var ile tanımlanan değişkenlerde çağrılabilir"
    ],
    difficulty: "junior",
    q_type: "technical",
    tags: ["Swift", "ValueTypes", "Structs", "Mutating"]
  },
  {
    id: "sw-20",
    title: "required init vs convenience init Farkları",
    question_text: "Swift'te 'required init' ve 'convenience init' arasındaki farklar nelerdir? Designated Initializer zinciri nasıl kurulur?",
    ideal_answer: "Designated Initializer (Ana Başlatıcı): Sınıfın tüm stored property'lerini başlatan ve gerekiyorsa doğrudan üst sınıfın (super.init) ana başlatıcısını çağıran temel yapılandırıcıdır.\nconvenience init (Kolaylık Başlatıcısı): İkincil başlatıcıdır. Sık kullanılan varsayılan değerlerle nesne oluşturmayı kolaylaştırır. Kural: Bir convenience init mutlaka aynı sınıf içindeki bir designated initializer'a (`self.init`) delege etmek zorundadır; doğrudan super.init çağıramaz.\nrequired init: Bir üst sınıfta tanımlandığında, o sınıftan türeyen tüm alt sınıfların bu başlatıcıyı mutlaka kendi içlerinde de implement etmesini zorunlu kılar (örneğin UIKit'teki `required init?(coder:)`).",
    hints: [
      "convenience init daima self.init çağırır.",
      "designated init daima super.init çağırır.",
      "required init alt sınıflarda zorunludur."
    ],
    key_points: [
      "Designated init sınıfın tüm alanlarını başlatır ve super.init çağırır",
      "convenience init aynı sınıftaki designated init'e delege eder",
      "required init alt sınıflarda uygulanmayı zorunlu tutar",
      "UIKit UIView ve UIViewController alt sınıflarında yaygındır"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["Swift", "Initializers", "OOP", "Classes"]
  },
  {
    id: "sw-21",
    title: "indirect enum Nedir ve Neden Gereklidir?",
    question_text: "Swift'te 'indirect enum' nedir? Enum'lar value type olmasına rağmen özyinelemeli (recursive) yapılarda neden indirect kullanılır?",
    ideal_answer: "Enum'lar birer Value Type'tır ve Swift derleyicisinin her bir enum değişkeninin bellekte kaplayacağı boyutu derleme zamanında (compile-time) tam olarak hesaplaması gerekir.\nEğer bir enum case'i kendisini parametre olarak referans alırsa (özyinelemeli / recursive veri yapısı - örneğin Linked List veya Binary Tree), sonsuz bir boyut döngüsü oluşur ve derleyici boyut hesaplayamaz.\n'indirect' anahtar kelimesi, derleyiciye ilgili enum case'inin değerini doğrudan Stack'te tutmak yerine Heap üzerinde bir referans kutusu (box/pointer) olarak saklamasını söyler. Pointer'ın boyutu sabit (64-bit) olduğu için sonsuz boyut döngüsü çözülür ve ağaç yapıları kurulabilir.",
    hints: [
      "Derleyicinin enum boyutunu önceden bilmesi gerektiğini açıklayın.",
      "Binary Tree ve Linked List örneklerini aklınıza getirin.",
      "indirect'in bir pointer (indirection) yarattığını belirtin."
    ],
    key_points: [
      "Özyinelemeli (recursive) enum yapılarını mümkün kılar",
      "Derleyicinin bellek boyutunu sabit pointer ile hesaplamasını sağlar",
      "Değeri Heap üzerinde saklayarak sonsuz boyut problemini çözer",
      "Ağaç (Tree) ve Liste gibi veri yapılarında kullanılır"
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["Swift", "Enums", "Memory", "DataStructures"]
  },
  {
    id: "sw-22",
    title: "@autoclosure ve Trailing Closure Kullanımı",
    question_text: "Swift'te @autoclosure nedir? Normal closure parametresinden farkı nedir ve standart kütüphanede (örneğin assert) nasıl kullanılır?",
    ideal_answer: "@autoclosure, bir fonksiyona geçirilen normal bir ifadeyi (expression) otomatik olarak argümansız bir closure'a (`() -> T`) saran bir özniteliktir.\nFarkı: Fonksiyonu çağırırken süslü parantez `{ ... }` açmak gerekmez; normal bir parametre gibi yazılır (`assert(x > 0, 'Hata')`).\nEn Büyük Avantajı (Lazy Evaluation - Tembel Değerlendirme): Fonksiyona aktarılan ifade hemen o anda çalıştırılmaz; fonksiyonun gövdesi içinde ihtiyaç duyulduğunda çalıştırılır. Örneğin `assert(condition, message)` fonksiyonunda condition `true` ise mesaj parametresi hiç evaluate edilmez; böylece ağır string birleştirmeleri veya hesaplamalar gereksiz yere CPU tüketmez.",
    hints: [
      "Süslü parantez açmadan closure aktarma rahatlığını belirtin.",
      "Lazy Evaluation avantajını ve assert örneğini verin."
    ],
    key_points: [
      "İfadeyi süslü parantez olmadan otomatik closure'a sarar",
      "Lazy Evaluation sağlar; ihtiyaç duyulmadıkça çalıştırılmaz",
      "Standart kütüphanede assert ve nil-coalescing (??) operatöründe kullanılır"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["Swift", "Closures", "Autoclosure", "Optimization"]
  },
  {
    id: "sw-23",
    title: "Higher Order Functions: map, compactMap, flatMap, reduce, filter",
    question_text: "Swift'te map, compactMap ve flatMap arasındaki farklar nelerdir? Hangi senaryoda hangisi tercih edilir?",
    ideal_answer: "1. `map`: Koleksiyondaki her elemana bir dönüşüm fonksiyonu uygular ve aynı sayıda elemana sahip yeni bir koleksiyon döndürür (`[1, 2].map { $0 * 2 } -> [2, 4]`).\n2. `compactMap`: Koleksiyondaki her elemanı dönüştürür ve sonuç `nil` olanları filtreleyerek eler (unwrapping yapar). Optional array'leri temizlemek veya başarısız tip dönüşümlerini güvenle elemek için kullanılır (`['1', 'a', '3'].compactMap { Int($0) } -> [1, 3]`).\n3. `flatMap`: İç içe geçmiş koleksiyonları (matris veya 2D array) tek bir düz diziye indirger (flattening). Örneğin `[[1, 2], [3, 4]].flatMap { $0 } -> [1, 2, 3, 4]`.\nNot: `reduce` tüm elemanları tek bir kümülatif değere toplamak, `filter` ise koşula uyan elemanları seçmek için kullanılır.",
    hints: [
      "compactMap'in nil'leri elediğini unutmayın.",
      "flatMap'in çok boyutlu dizileri tek boyuta düzleştirdiğini belirtin."
    ],
    key_points: [
      "map her elemanı birebir dönüştürür",
      "compactMap nil olan sonuçları otomatik filtreler ve unwrapping yapar",
      "flatMap iç içe dizileri tek boyuta indirger (flatten)",
      "reduce tüm koleksiyonu tek bir kümülatif sonuca indirger"
    ],
    difficulty: "junior",
    q_type: "technical",
    tags: ["Swift", "FunctionalProgramming", "HigherOrderFunctions"]
  },

  // MARK: - Architecture & Design Patterns
  {
    id: "sw-24",
    title: "VIPER Mimarisi: 5 Temel Bileşen ve Sorumluluk Ayrımı",
    question_text: "VIPER mimarisinin 5 bileşeni (V-I-P-E-R) nelerdir? Hangi durumlarda VIPER tercih edilir ve dezavantajları nelerdir?",
    ideal_answer: "Bileşenler:\n1. View: Kullanıcı etkileşimlerini alır ve Presenter'a iletir; Presenter'dan gelen veriyi ekranda çizer. İş mantığı içermez.\n2. Interactor: Uygulamanın tüm iş mantığını (business logic), veritabanı ve ağ çağrılarını yönetir. UI'dan tamamen bağımsızdır.\n3. Presenter: View ile Interactor arasındaki köprüdür. Interactor'den gelen ham veriyi UI formatına dönüştürür ve View'a gönderir; navigasyon kararlarını Router'a bildirir.\n4. Entity: Interactor tarafından kullanılan basit veri modelleridir.\n5. Router (Wireframe): Ekranlar arasındaki navigasyon ve geçiş mantığını yönetir.\nTercih Edildiği Durumlar: Çok büyük ekipler, katı sorumluluk ayrımı (Single Responsibility) ve %100 izole birim test gerektiren büyük ölçekli kurumsal projeler.\nDezavantajları: Çok sayıda dosya (boilerplate) oluşturur, küçük projelerde gereksiz karmaşıklık yaratır ve öğrenme eğrisi diktir.",
    hints: [
      "View, Interactor, Presenter, Entity, Router sıralamasını açıklayın.",
      "Interactor'ın sadece iş mantığı içerdiğini, Router'ın navigasyonu yönettiğini belirtin.",
      "Boilerplate kod fazlalığı dezavantajına değinin."
    ],
    key_points: [
      "View: Pasif UI gösterimi",
      "Interactor: İş mantığı ve veri yönetimi",
      "Presenter: View-Interactor veri köprüsü",
      "Entity: Saf veri modelleri",
      "Router: Sayfa geçişleri ve navigasyon mantığı"
    ],
    difficulty: "senior",
    q_type: "system_design",
    tags: ["Architecture", "VIPER", "CleanArchitecture", "DesignPatterns"]
  },
  {
    id: "sw-25",
    title: "Coordinator Pattern: Ekran Navigasyonunun Ayrıştırılması",
    question_text: "Coordinator Pattern nedir? UIViewController'ların doğrudan birbirinden haberdar olmasını engellemek neden önemlidir ve veri akışı nasıl yönetilir?",
    ideal_answer: "Coordinator Pattern, iOS uygulamalarında ekran navigasyon mantığını (push, present, dismiss) UIViewController'ların içinden alıp bağımsız 'Coordinator' nesnelerine devreden bir mimari desendir.\nNeden Önemlidir:\nEğer ViewController A, ViewController B'yi doğrudan `navigationController?.pushViewController(B, ...)` ile açarsa, A ekranı B ekranına sıkı sıkıya bağımlı (tightly coupled) hale gelir; A'nın başka akışlarda tekrar kullanımı ve izole test edilmesi imkansızlaşır (Massive View Controller'a yol açar).\nNasıl Çalışır:\nViewController kullanıcı eylemini (örneğin 'Detaya Git' butonunu) bir delegate veya closure ile Coordinator'a bildirir. Coordinator, hedef ViewController'ı oluşturur, gerekli bağımlılıkları enjekte eder ve navigasyonu gerçekleştirir. Birden fazla alt akış için AppCoordinator, AuthCoordinator, MainCoordinator gibi hiyerarşik yapılar kurulur.",
    hints: [
      "Tightly coupled ekranlar sorununu anlatın.",
      "ViewController'ın navigasyondan sorumlu olmaması gerektiğini vurgulayın.",
      "Delegate veya closure ile Coordinator tetikleme akışını belirtin."
    ],
    key_points: [
      "Ekran navigasyonunu ViewController'dan izole eder",
      "ViewController'ların tekrar kullanılabilirliğini ve test edilebilirliğini artırır",
      "Ekranlar arası bağımlılıkları (coupling) ortadan kaldırır",
      "Hiyerarşik coordinator yapısı (AppCoordinator -> FeatureCoordinator)"
    ],
    difficulty: "senior",
    q_type: "system_design",
    tags: ["Architecture", "Coordinator", "Navigation", "DesignPatterns"]
  },
  {
    id: "sw-26",
    title: "Dependency Injection (DI) ve Unit Test Edilebilirlik",
    question_text: "Dependency Injection nedir? Initializer (Constructor) Injection neden en çok tercih edilen yöntemdir ve Unit Test yazmayı nasıl kolaylaştırır?",
    ideal_answer: "Dependency Injection (Bağımlılık Enjeksiyonu), bir sınıfın ihtiyaç duyduğu servisleri veya nesneleri kendi içinde `NetworkManager.shared` gibi doğrudan oluşturması yerine, bu bağımlılıkların dışarıdan verilmesi prensibidir (Inversion of Control).\nInitializer Injection:\nBağımlılıklar sınıfın `init` metoduna parametre olarak geçirilir (`init(networkService: NetworkProtocol)`). Bu sayede sınıfın çalışması için hangi bağımlılıklara zorunlu olarak ihtiyaç duyduğu derleme zamanında açıkça belgelenir.\nUnit Test Kolaylığı:\nTest yazılırken gerçek ağ servisi veya veritabanı yerine aynı protokolü uygulayan 'Mock' veya 'Stub' nesneler enjekte edilir (`MockNetworkService`). Böylece gerçek ağa çıkmadan, deterministik ve milisaniyeler içinde çalışan güvenilir testler yazılabilir (Loosely coupled kod).",
    hints: [
      "Sınıfın bağımlılığını kendi üretmemesi gerektiğini vurgulayın.",
      "Protokoller üzerinden mock nesne enjeksiyonunu açıklayın.",
      "Loosely coupled yapının test avantajını belirtin."
    ],
    key_points: [
      "Bağımlılıkların dışarıdan sağlanması prensibidir",
      "Initializer injection bağımlılıkları açık ve zorunlu kılar",
      "Protokoller sayesinde Mock/Fake servislerle kolay test imkanı sunar",
      "Loosely coupled ve esnek bir mimari oluşturur"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["Architecture", "DependencyInjection", "UnitTesting", "SOLID"]
  },
  {
    id: "sw-27",
    title: "Singleton Pattern: Avantajları ve Gizli Riskleri",
    question_text: "Singleton tasarım deseni nedir? Hangi senaryolarda mantıklıdır, ne zaman kötü bir pratik (Anti-Pattern) haline gelir?",
    ideal_answer: "Singleton, bir sınıftan tüm uygulama yaşam döngüsü boyunca yalnızca tek bir örneğin (instance) oluşturulmasını garanti eden ve buna global bir erişim noktası sağlayan desendir (`static let shared = MyService()`, `private init()`).\nNe Zaman Mantıklıdır: Donanım veya sistem kaynaklarını temsil eden yapılar (örneğin `URLSession.shared`, `NotificationCenter.default`, `UIApplication.shared`) veya tekil Bluetooth/Konum yöneticileri.\nGizli Riskleri & Neden Anti-Pattern Olabilir:\n1. Global Mutable State: Uygulamanın herhangi bir yerinden değiştirilebilen veriler beklenmedik yan etkilere (side-effects) ve race condition'lara yol açar.\n2. Unit Test Zorluğu: Singleton'lar sınıflar arasına gizli bağımlılıklar sokar; test koşumunda bir testin değiştirdiği singleton state'i bir sonraki testi yanıltabilir (test kirliliği) ve mocklanması zordur.\n3. Sıkı Bağımlılık (Tight Coupling): Kodun modülerliğini bozar.",
    hints: [
      "private init zorunluluğunu hatırlayın.",
      "Test edilebilirlik sorununu ve global state kirliliğini vurgulayın."
    ],
    key_points: [
      "Uygulama boyunca tek bir instance garantisi verir",
      "Donanım ve sistem servislerinde (URLSession vb.) doğaldır",
      "Global mutable state oluşturduğu için yan etkilere açıktır",
      "Mocklanması zor olduğundan Unit Test süreçlerini zorlaştırır"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["DesignPatterns", "Singleton", "AntiPatterns", "Architecture"]
  },

  // MARK: - UIKit & Lifecycle
  {
    id: "sw-28",
    title: "UIViewController Yaşam Döngüsü (Lifecycle)",
    question_text: "Bir UIViewController ekrana gelirken ve kapanırken hangi yaşam döngüsü metotları hangi sırayla tetiklenir? Her birinde ne yapılmalıdır?",
    ideal_answer: "Sıralama:\n1. `init(coder:)` / `init(nibName:bundle:)`: Nesnenin bellekte tahsis edilmesi.\n2. `loadView()`: View hiyerarşisinin oluşturulduğu yerdir. Yalnızca kodla özel bir root UIView atanacaksa override edilir; `super.loadView()` çağrılmaz.\n3. `viewDidLoad()`: View belleğe yüklendiğinde yalnızca 1 kez tetiklenir. Veri yükleme, delegate atamaları ve ilk konfigürasyonlar burada yapılır.\n4. `viewWillAppear()`: Ekran her görünmek üzere olduğunda tetiklenir (arka plandan dönüş, navigasyondan geri geliş). Animasyon başlatma veya güncel veri tazeleme yapılır.\n5. `viewWillLayoutSubviews()` ve `viewDidLayoutSubviews()`: Auto Layout constraint'leri hesaplandıktan sonra frame'lerin kesinleştiği andır. Çerçeveye bağımlı çizimler (gradient, shadow path) burada yapılır.\n6. `viewDidAppear()`: Ekran kullanıcıya tamamen göründüğü an. Analitik logları ve klavye açma burada yapılır.\n7. `viewWillDisappear()` / `viewDidDisappear()`: Ekran kapanırken zamanlayıcıları durdurma veya observer kaldırma.\n8. `deinit`: Controller bellekten silinirken çalışır.",
    hints: [
      "viewDidLoad'un 1 kez, viewWillAppear'ın her gelişte çalıştığını vurgulayın.",
      "Frame'lerin viewDidLayoutSubviews içinde kesinleştiğini belirtin.",
      "loadView metodunda super çağrılmaması kuralını hatırlayın."
    ],
    key_points: [
      "loadView -> viewDidLoad -> viewWillAppear -> viewDidLayoutSubviews -> viewDidAppear",
      "viewDidLoad sadece 1 kez ilk kurulumda çalışır",
      "viewDidLayoutSubviews içinde frame boyutları kesinleşir",
      "viewWillDisappear ve deinit kaynakları temizlemek içindir"
    ],
    difficulty: "junior",
    q_type: "technical",
    tags: ["UIKit", "Lifecycle", "UIViewController", "iOS"]
  },
  {
    id: "sw-29",
    title: "Frame vs Bounds Farkı ve Gerçek Kullanım Senaryoları",
    question_text: "iOS'ta UIView frame ve bounds özellikleri arasındaki temel fark nedir? Bir görünüm rotate edildiğinde veya scroll edildiğinde hangisi değişir?",
    ideal_answer: "Frame: Bir görünümün (view) 'kendi üst görünümünün (superview)' koordinat sistemine göre olan konumunu (origin: x, y) ve kapladığı dikdörtgen boyutunu (size: width, height) belirtir.\nBounds: Bir görünümün 'kendi yerel (local)' koordinat sistemine göre olan konumunu ve boyutunu belirtir. Varsayılan olarak origin (0, 0)'dır.\nKritik Farklar:\n- Döndürme (Rotation): Bir view 45 derece döndürüldüğünde, bounds boyutu sabit kalırken, frame onu çevreleyen yeni sınır kutusu (bounding box) haline geldiği için frame boyutu genişler.\n- ScrollView Mantığı: Bir UIScrollView kaydırıldığında, aslında scrollView'ın `bounds.origin` değeri değişir; böylece içeriğin farklı bir penceresi ekrana yansıtılır.",
    hints: [
      "Frame superview'a göre, bounds kendi içine göredir.",
      "Scrollview kaydırıldığında bounds.origin'in değiştiğini hatırlayın.",
      "Rotation durumunda bounding box etkisini açıklayın."
    ],
    key_points: [
      "Frame superview koordinat sistemindeki yer ve boyuttur",
      "Bounds kendi yerel koordinat sistemindeki yer ve boyuttur",
      "Döndürmede frame genişler (bounding box), bounds sabit kalır",
      "ScrollView kaydırma mekanizması bounds.origin ile çalışır"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["UIKit", "AutoLayout", "Frame", "Bounds", "UIScrollView"]
  },
  {
    id: "sw-30",
    title: "Auto Layout: Content Hugging vs Compression Resistance",
    question_text: "Auto Layout'ta Content Hugging ve Compression Resistance öncelikleri (priority) ne anlama gelir? İki Label yan yana geldiğinde metinlerin kesilmesini nasıl önlersiniz?",
    ideal_answer: "Intrinsict Content Size (Doğal İçerik Boyutu): UILabel gibi bileşenlerin metin uzunluğuna göre kendi boyutunu bilmesidir.\n1. Content Hugging Priority (İçeriğe Sarılma Önceliği):\n'Beni içeriğimden daha büyük yapma, gereksiz genişletme' direnci. Hugging önceliği yüksek olan eleman içeriğine sıkıca sarılır ve genişlemez; önceliği düşük olan eleman ise fazla boşluğu doldurmak için gerilir/genişler.\n2. Compression Resistance Priority (Sıkıştırma Direnci):\n'Beni içeriğimden daha küçük yapma, metnimi kesme (... yapma)' direnci. Sıkıştırma direnci yüksek olan eleman asla kırpılmaz ve tam görünür; direnci düşük olan elemanın metni yer kalmadığında kesilir.\nSenaryo: Yan yana İsim ve Fiyat label'ı varsa, Fiyat'ın asla kesilmemesi için Fiyat'ın Compression Resistance önceliği daha yüksek (örn. 751), İsim'inki daha düşük (750) tutulur.",
    hints: [
      "Hugging: Büyümeye karşı direnç (don't stretch me).",
      "Compression Resistance: Küçülmeye/kesilmeye karşı direnç (don't clip me).",
      "Önceliği (priority 750 vs 751) yüksek olanın kazandığını belirtin."
    ],
    key_points: [
      "Content Hugging: Elemanın büyümesini engeller (içeriğe sarılır)",
      "Compression Resistance: Elemanın küçülüp metninin kesilmesini engeller",
      "Önceliği yüksek olan boyutunu korur",
      "Yan yana dinamik etiketlerde (Name - Price) layout çakışmasını çözer"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["UIKit", "AutoLayout", "Constraints", "UI"]
  },
  {
    id: "sw-31",
    title: "awakeFromNib ve xib vs nib Farkı",
    question_text: "iOS'ta 'xib' ile 'nib' arasındaki fark nedir? 'awakeFromNib' metodu ne zaman tetiklenir ve viewDidLoad'dan farkı nedir?",
    ideal_answer: "xib vs nib:\n- xib: XML tabanlı, geliştiricinin Xcode Interface Builder üzerinde tasarladığı ve düzenlediği kaynak dosyasıdır.\n- nib: Uygulama derlendiğinde (build time) xib dosyasının işletim sisteminin hızlıca okuyabilmesi için derlenmiş, optimize edilmiş ikili (binary) halidir.\nawakeFromNib:\nBir arayüz nesnesi (UIView, UITableViewCell vb.) Interface Builder dosyasından (nib) belleğe tamamen çözüldükten (unarchive/deserialize) ve tüm outlet/action bağlantıları bağlandıktan sonra tetiklenen hazırlık metodudur.\nFarkı: `viewDidLoad` tüm ViewController'ın yaşam döngüsüne aittir ve 1 kez çalışır; `awakeFromNib` ise nib'den yüklenen her bir özel view veya tablo hücresi (cell) için outlet'ler bağlandığı an çalışır.",
    hints: [
      "xib derlenince nib olur kuralını belirtin.",
      "awakeFromNib'un outlet bağlantıları kurulduktan sonra çalıştığını söyleyin."
    ],
    key_points: [
      "xib insan tarafından okunabilir XML, nib derlenmiş binary dosyadır",
      "awakeFromNib nib'den nesne deserialize edilince çalışır",
      "Tüm IBOutlet ve IBAction bağlantılarının hazır olduğunu garanti eder",
      "Özellikle UITableViewCell ve özel UIView sınıflarında kullanılır"
    ],
    difficulty: "junior",
    q_type: "technical",
    tags: ["UIKit", "InterfaceBuilder", "XIB", "NIB"]
  },

  // MARK: - Security & Networking
  {
    id: "sw-32",
    title: "iOS Güvenlik: Keychain vs UserDefaults ve Keychain Access Groups",
    question_text: "Hassas kullanıcı verilerini (OAuth token, şifre) saklarken Keychain neden UserDefaults yerine zorunludur? Keychain Access Groups nedir?",
    ideal_answer: "UserDefaults: Verileri şifrelemeden, cihazın dosya sisteminde düz metin (plain-text .plist) olarak saklar. Jailbreak yapılmış bir cihazda veya dosya sistemi yedeğinde kolayca okunabilir; kesinlikle token veya şifre saklanmamalıdır.\nKeychain:\nDonanım hızlandırmalı, AES-256 ile şifrelenen güvenli bir sistem veritabanıdır. Uygulama silinse bile veriler korunabilir. Biyometrik kimlik doğrulama (Face ID/Touch ID kilidi açılmadan erişilememe) kuralları atanabilir.\nKeychain Access Groups:\nAynı geliştirici hesabına (Team ID) ait birden fazla farklı uygulamanın veya App Extension'ın (örneğin ana app ile Widget veya Watch app) güvenli Keychain verilerini ortaklaşa paylaşabilmesini sağlayan yetkilendirme mekanizmasıdır.",
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
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["Security", "Keychain", "UserDefaults", "Tokens"]
  },
  {
    id: "sw-33",
    title: "SSL / Certificate Pinning ve Man-in-the-Middle (MitM) Koruması",
    question_text: "SSL / Certificate Pinning nedir? Nasıl uygulanır ve sertifika yenileme döngülerinde uygulamanın çökmemesi için nelere dikkat edilmelidir?",
    ideal_answer: "SSL Pinning (Sertifika Sabitleme): Uygulamanın yalnızca sistemin güvendiği herhangi bir sertifika otoritesine (CA) değil, sadece sunucunun bilinen belirli bir sertifikasına veya Public Key'ine (Public Key Pinning) güvenmesini sağlayan güvenlik önlemidir. Sahte sertifika yüklenerek yapılan Man-in-the-Middle (MitM) trafiği dinleme saldırılarını engeller.\nUygulama:\n`URLSessionDelegate`'in `urlSession(_:didReceive:completionHandler:)` metodu içinde sunucunun sunduğu sertifika verisi, uygulama bundle'ına gömülen sertifika veya public key hash'i ile bayt bayt doğrulanır.\nSertifika Yenileme Riskleri:\nSertifikanın süresi dolduğunda veya acil yenilendiğinde, eğer uygulamaya yedek public key gömülmemişse tüm ağ istekleri başarısız olur ve uygulama çalışamaz hale gelir. Bu yüzden 'Public Key Pinning' tercih edilmeli ve gelecekteki yedek anahtar (backup pin) önceden uygulamaya eklenmelidir.",
    hints: [
      "MitM saldırısını engelleme amacını belirtin.",
      "Sertifika yerine Public Key sabitlemenin yenileme kolaylığını açıklayın.",
      "Yedek anahtar (backup pin) bırakılmasının önemini vurgulayın."
    ],
    key_points: [
      "Man-in-the-Middle saldırılarını kesin olarak engeller",
      "Sadece izin verilen sertifika/public key ile iletişime izin verir",
      "URLSessionDelegate authentication challenge üzerinden uygulanır",
      "Sertifika değişiminde yedek pin (backup key) olmalıdır"
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["Security", "SSLPinning", "Networking", "URLSession"]
  },

  // MARK: - Testing & Instruments
  {
    id: "sw-34",
    title: "XCTest: Asenkron Testler ve XCTestExpectation Kullanımı",
    question_text: "XCTest çerçevesinde asenkron metodlar nasıl test edilir? XCTestExpectation, fulfill() ve waitForExpectations metodlarının rolü nedir?",
    ideal_answer: "Geleneksel XCTest:\nAsenkron bir ağ çağrısının veya callback'in sonucunu beklemek için `expectation(description:)` oluşturulur. Asenkron işlem bittiğinde `expectation.fulfill()` çağrılarak görevin tamamlandığı bildirilir. Test metodunun sonunda `waitForExpectations(timeout: 5)` ile belirlenen süre boyunca test runner'ın duraklaması sağlanır. Süre aşılırsa test fail olur.\nModern Swift Concurrency ile Test:\nModern XCTest'te test metodları doğrudan `async` olarak tanımlanabilir (`func testFetchData() async throws`). Bu sayede expectation kurmaya gerek kalmadan doğrudan `let data = try await service.fetch()` çağrılabilir ve ardından `XCTAssertEqual` ile sonuç doğrulanabilir.",
    hints: [
      "expectation, fulfill ve wait döngüsünü anlatın.",
      "Modern async test metodlarının expectation ihtiyacını azalttığını belirtin."
    ],
    key_points: [
      "XCTestExpectation asenkron çağrıları senkronize bekletir",
      "fulfill() işlemin başarıyla tamamlandığını haber verir",
      "waitForExpectations timeout süresini yönetir",
      "Modern Swift ile test metodları doğrudan async yazılabilir"
    ],
    difficulty: "mid",
    q_type: "technical",
    tags: ["Testing", "XCTest", "AsyncTesting", "Quality"]
  },
  {
    id: "sw-35",
    title: "Instruments: Scroll Jank ve Bellek Sızıntısı (Leak) Teşhisi",
    question_text: "Bir iOS uygulamasında liste kaydırırken oluşan takılmalar (Scroll Jank) ve bellek sızıntıları Xcode Instruments ile adım adım nasıl teşhis edilir?",
    ideal_answer: "1. Scroll Jank (Arayüz Takılması) Teşhisi:\n- 'Time Profiler' ve 'Core Animation' şablonu başlatılır.\n- Main Thread üzerinde 16.6ms (60 FPS) veya 8.3ms (120 FPS ProMotion) sınırını aşan ağır işlemler incelenir.\n- Call Tree ayarlarında 'Separate by Thread', 'Invert Call Tree' ve 'Hide System Libraries' işaretlenerek ana thread'i bloke eden ağır JSON parse veya görsel decode fonksiyonu tespit edilir.\n- Çözüm: Ağır işler arka plan kuyruğuna aktarılır, görseller downsample edilir.\n2. Bellek Sızıntısı (Leak) Teşhisi:\n- 'Leaks' ve 'Allocations' şablonu seçilir. Uygulama test edilirken kırmızı bayrakla işaretlenen sızıntılar yakalanır.\n- Xcode'un 'Memory Graph Debugger' aracıyla nesneler arasındaki döngüsel güçlü referanslar (`strong reference cycles`) görsel olarak incelenir ve `[weak self]` eksiklikleri tespit edilir.",
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
    ],
    difficulty: "senior",
    q_type: "technical",
    tags: ["Instruments", "Performance", "ScrollJank", "MemoryLeaks"]
  }
];
