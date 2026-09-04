# Interview App Proje Günlüğü (Worklog & AI Context Handoff)

Bu dosya, Interview App projesinde gerçekleştirilen tüm mimari kararları, teknik değişiklikleri ve sistem durumunu sonraki geliştiriciler veya yapay zeka modelleri için belgeler.

---

### [2026-09-04 11:50] Projenin Başlatılması ve Çok Platformlu Mimarinin Kurulması
- **Görev ve Amaç**: iOS (SwiftUI iOS 17+), Android (Jetpack Compose), Web (Next.js 15) ve paylaşılan Supabase backend'inden oluşan Mülakat Hazırlık platformunun monorepo olarak kurulması.
- **Teknik Kararlar ve Mimari**:
  - Ortak veri modelleri ve Supabase PostgreSQL şeması tasarlandı (`categories`, `questions`, `interview_sessions`, `session_answers`, `bookmarks`).
  - iOS katmanında iOS 17+ `@Observable` makrosu ve Clean Architecture benimsendi.
  - Android katmanında Jetpack Compose ve Material 3 tercih edildi.
  - Web katmanında Next.js 15 App Router ve Tailwind CSS yapılandırıldı.
  - Evrensel kural dosyaları (`AGENTS.md`, `CLAUDE.md`, `WORKLOG.md`, `README.md`, `.gitignore`) eklendi.
- **Mevcut Durum**: Proje iskeleti ve temel bileşenler oluşturuldu.
- **Sıradaki Adımlar**: Supabase şeması, iOS SwiftUI ekranları, Android Compose arayüzü ve Web uygulamasının tamamlanması.
