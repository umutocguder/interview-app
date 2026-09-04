-- KATEGORİLER
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES
('c0000001-0000-0000-0000-000000000001', 'iOS & Swift', 'ios-swift', 'apple', 'Swift, SwiftUI, UIKit, Concurrency, Memory Management (ARC) ve iOS Mimarisi.', 1),
('c0000002-0000-0000-0000-000000000002', 'Android & Kotlin', 'android-kotlin', 'android', 'Kotlin, Jetpack Compose, Coroutines, Flow, Dagger/Hilt ve Clean Architecture.', 2),
('c0000003-0000-0000-0000-000000000003', 'Web & Frontend', 'web-frontend', 'globe', 'React 19, Next.js, TypeScript, State Management, DOM optimizasyonları ve SSR/SSG.', 3),
('c0000004-0000-0000-0000-000000000004', 'Backend & Database', 'backend-database', 'database', 'Node.js, PostgreSQL, Supabase, RESTful API, RLS ve Cache stratejileri.', 4),
('c0000005-0000-0000-0000-000000000005', 'System Design & Architecture', 'system-design', 'layers', 'Ölçeklenebilirlik, Microservices, Caching, Yük dengeleme ve Veri modelleme.', 5),
('c0000006-0000-0000-0000-000000000006', 'Behavioral & Leadership', 'behavioral', 'users', 'STAR tekniği, çatışma yönetimi, liderlik ve kültür uyumu soruları.', 6)
ON CONFLICT (id) DO NOTHING;

-- ÖRNEK MÜLAKAT SORULARI (Gerçekçi & Teknik)
INSERT INTO questions (category_id, title, question_text, ideal_answer, hints, key_points, difficulty, q_type, tags) VALUES
-- iOS & Swift
(
    'c0000001-0000-0000-0000-000000000001',
    'SwiftUI Observation vs ObservableObject',
    'iOS 17 ile gelen @Observable makrosu ile eski ObservableObject protokolü arasındaki temel farklar ve performans avantajları nelerdir?',
    '@Observable makrosu Swift 5.9 ve iOS 17 ile tanıtılmıştır. Eski ObservableObject protokolünde @Published property her değiştiğinde nesneyi dinleyen tüm View yeniden çizilir (re-render). @Observable makrosu ise property-level tracking (özellik düzeyinde izleme) yapar. Yalnızca o anki View gövdesinde (body) fiilen okunan property değiştiğinde o View tetiklenir. Ayrıca @StateObject / @ObservedObject gibi birden fazla wrapper yerine doğrudan @State veya düz let/var ile çalışarak bellek ve kod karmaşasını ciddi oranda azaltır.',
    ARRAY['Property-level tracking mekanizmasını düşünün.', 'View body içinde okunmayan değerlerin durumunu göz önüne alın.'],
    ARRAY['Gereksiz render''ları önler', 'Property düzeyinde izleme', 'Combine kütüphanesine olan bağımlılığı kaldırır', 'Daha temiz sözdizimi'],
    'mid',
    'technical',
    ARRAY['Swift', 'SwiftUI', 'iOS 17', 'Observation']
),
(
    'c0000001-0000-0000-0000-000000000001',
    'Swift Concurrency: Actor ve Data Race Koruması',
    'Swift Concurrency içindeki Actor tipi ne işe yarar? Class ile farkı nedir ve data race durumlarını nasıl engeller?',
    'Actor, referans tipli (reference type) bir yapıdır ancak class''lardan farklı olarak mutable state''e (değişken durumuna) eşzamanlı erişimi serialize (sıralı) hale getirir. Actor izolasyonu sayesinde bir Actor''ın durumuna aynı anda yalnızca tek bir thread/task erişebilir. Dışarıdan bir actor özelliğine veya metoduna erişirken `await` anahtar kelimesi kullanılması zorunludur; bu sayede derleme zamanında (compile-time) data race oluşması engellenir.',
    ARRAY['Isolation ve synchronization kavramlarını hatırlayın.', 'async/await gereksinimini vurgulayın.'],
    ARRAY['Referans tipidir (Class benzeri)', 'State senkronizasyonunu otomatik sağlar', 'Derleme zamanı güvenlik garantisi', 'Reentrancy durumuna dikkat edilmelidir'],
    'senior',
    'technical',
    ARRAY['Swift', 'Concurrency', 'Actors', 'Thread Safety']
),
-- Android & Kotlin
(
    'c0000002-0000-0000-0000-000000000002',
    'Jetpack Compose: Recomposition Döngüsü ve State Hoisting',
    'Jetpack Compose''da Recomposition nedir? State Hoisting prensibi neden uygulanmalıdır ve performansa etkisi nedir?',
    'Recomposition, bir composable fonksiyonun durumunda (State) değişiklik olduğunda Compose çalışma zamanının fonksiyonu yeni parametrelerle tekrar çağırmasıdır. State Hoisting, durumu (state) composable bileşenin dışına, çağıran üst bileşene (caller) taşımaktır. Bu sayede composable bileşen "stateless" hale gelir. Stateless bileşenler test edilmesi, yeniden kullanılması ve önizlenmesi çok daha kolay olan, yan etkisi (side effect) bulunmayan saf (pure) UI elemanlarına dönüşür. Ayrıca `remember` ve `derivedStateOf` ile gereksiz recomposition önlenir.',
    ARRAY['Bileşenin stateless hale gelmesinin avantajları nelerdir?', 'remember anahtar kelimesinin rolü nedir?'],
    ARRAY['Stateless ve Reusable UI', 'Tek yönlü veri akışı (UDF)', 'derivedStateOf ile gereksiz çizimleri önleme'],
    'mid',
    'technical',
    ARRAY['Android', 'Kotlin', 'Jetpack Compose', 'Architecture']
),
-- Web & Next.js
(
    'c0000003-0000-0000-0000-000000000003',
    'Next.js 15: Server Components vs Client Components',
    'Next.js App Router mimarisinde Server Components ile Client Components arasındaki farklar nelerdir? Ne zaman "use client" direktifi kullanılmalıdır?',
    'Server Components (RSC), sunucuda çalışır ve istemciye sıfır JavaScript bundle boyutu ile yalnızca statik HTML ve RSC Payload iletir. Doğrudan veri tabanına, dosya sistemine veya hassas API anahtarlarına erişebilir. Client Components ise tarayıcıda etkileşim (onClick, onChange gibi event listener''lar), React hook''ları (useState, useEffect) veya tarayıcı API''leri (window, localStorage) gerektiğinde dosya başına `"use client"` yazılarak tanımlanır. Mümkün olduğunca ağaç yapraklarına (leaves) Client Component koyup gövdeyi Server Component tutmak en iyi performansı sağlar.',
    ARRAY['Bundle size optimizasyonunu düşünün.', 'Interactivity ve browser API ihtiyacı olan yerleri belirleyin.'],
    ARRAY['Sıfır client bundle katkısı (RSC)', 'Doğrudan sunucu kaynaklarına erişim', 'use client ile etkileşim sınırlandırması', 'Gelişmiş SEO ve ilk yükleme hızı'],
    'mid',
    'technical',
    ARRAY['Next.js', 'React', 'RSC', 'TypeScript']
),
-- Backend & Supabase
(
    'c0000004-0000-0000-0000-000000000004',
    'Supabase Row Level Security (RLS) ve Güvenlik',
    'Supabase üzerinde veritabanı güvenliği için Row Level Security (RLS) nasıl çalışır? Geleneksel API katmanı güvenliğine göre avantajı nedir?',
    'Row Level Security (RLS), PostgreSQL çekirdeğinde satır düzeyinde erişim kontrolü sağlayan bir güvenlik mekanizmasıdır. Geleneksel yapılarda güvenlik genellikle API sunucu katmanında (Node.js, Python vb.) kodla denetlenirken, RLS sayesinde doğrudan veri tabanı motoru her sorguda (SELECT, INSERT, UPDATE, DELETE) kullanıcının JWT kimliğini (`auth.uid()`) kontrol eder. İstemci (iOS, Android, Web) doğrudan Supabase API''sine sorgu atsa bile, RLS politikalarını aşamaz; bu da istemci doğrudan DB ile konuşsa dahi tam güvenlik sağlar.',
    ARRAY['auth.uid() fonksiyonunun nasıl çalıştığını açıklayın.', 'Doğrudan istemci erişiminin güvenliğini vurgulayın.'],
    ARRAY['Veritabanı seviyesinde güvenlik', 'İstemciden doğrudan güvenli sorgu', 'auth.uid() entegrasyonu', 'Gereksiz backend katmanı yazma yükünü kaldırır'],
    'senior',
    'technical',
    ARRAY['Supabase', 'PostgreSQL', 'Security', 'Database']
);
