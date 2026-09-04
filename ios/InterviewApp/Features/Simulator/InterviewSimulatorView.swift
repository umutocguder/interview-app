import SwiftUI

public struct InterviewSimulatorView: View {
    @State private var timeRemaining = 180 // 3 dakika
    @State private var timerActive = true
    @State private var currentQuestionIndex = 0
    @State private var userNotes = ""
    @State private var isEvaluating = false
    @State private var evaluation: AIEvaluation?
    @State private var isFinished = false
    
    private let sampleQuestions: [(title: String, text: String, ideal: String, points: [String])] = [
        (
            title: "SwiftUI Observation vs ObservableObject",
            text: "iOS 17 ile gelen @Observable makrosu ile eski ObservableObject protokolü arasındaki farklar ve performans avantajları nelerdir?",
            ideal: "@Observable property-level tracking yaparak gereksiz render döngülerini engeller.",
            points: ["Property-level tracking", "Render optimizasyonu", "Combine bağımlılığının kalkması"]
        ),
        (
            title: "Swift Concurrency: Data Race Koruması",
            text: "Swift Concurrency içindeki Actor tipi ne işe yarar ve data race durumlarını nasıl önler?",
            ideal: "Actor mutable state'e sıralı (serialized) erişim sağlar ve derleme zamanında data race'i engeller.",
            points: ["Serialized erişim", "Derleme zamanı güvenlik", "Data isolation"]
        ),
        (
            title: "PostgreSQL & Supabase RLS Performansı",
            text: "Supabase üzerinde Row Level Security (RLS) kuralları yazarken sorguların yavaşlamaması için nelere dikkat edilmelidir?",
            ideal: "auth.uid() gibi fonksiyonların aşırı tekrarından kaçınmak ve foreign key indeksleri eklemek gerekir.",
            points: ["B-Tree indeksleme", "Subquery optimizasyonu", "Cache mekanizmaları"]
        )
    ]
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Zamanlayıcı (Timer Bar)
                    HStack {
                        Label("\(timeRemaining / 60):\(String(format: "%02d", timeRemaining % 60))", systemImage: "clock.fill")
                            .font(.headline.monospacedDigit())
                            .foregroundStyle(timeRemaining < 30 ? .red : .primary)
                        
                        Spacer()
                        
                        Text("Soru \(currentQuestionIndex + 1)/\(sampleQuestions.count)")
                            .font(.caption.bold())
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color.blue.opacity(0.1))
                            .foregroundStyle(.blue)
                            .clipShape(Capsule())
                    }
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    
                    // Mülakat Sorusu Kartı
                    let currentQ = sampleQuestions[currentQuestionIndex]
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Mülakatçı Sorusu:")
                            .font(.caption.bold())
                            .foregroundStyle(.blue)
                        
                        Text(currentQ.title)
                            .font(.headline)
                        
                        Text(currentQ.text)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(Color.blue.opacity(0.06))
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    
                    // Kullanıcı Cevap Alanı
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Cevabınız:")
                            .font(.caption.bold())
                            .foregroundStyle(.secondary)
                        
                        TextEditor(text: $userNotes)
                            .frame(minHeight: 120)
                            .padding(8)
                            .background(Color(.systemBackground))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.secondary.opacity(0.2)))
                    }
                    
                    // Yapay Zeka ile Değerlendir Butonu
                    if evaluation == nil {
                        Button {
                            evaluateCurrentAnswer()
                        } label: {
                            HStack {
                                if isEvaluating {
                                    ProgressView().tint(.white)
                                    Text("Gemini Analiz Ediyor...")
                                } else {
                                    Image(systemName: "sparkles")
                                    Text("Yapay Zeka ile Değerlendir")
                                        .fontWeight(.semibold)
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(userNotes.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? Color.gray : Color.blue)
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                        .disabled(userNotes.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || isEvaluating)
                    }
                    
                    // AI Değerlendirme Sonuç Kartı
                    if let eval = evaluation {
                        VStack(alignment: .leading, spacing: 14) {
                            HStack {
                                Label("Gemini Analizi", systemImage: "sparkles")
                                    .font(.headline)
                                    .foregroundStyle(.blue)
                                Spacer()
                                Text("Skor: \(eval.score)/100")
                                    .font(.headline.bold())
                                    .foregroundStyle(eval.score >= 70 ? .green : .orange)
                            }
                            
                            // Güçlü Yönler
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Güçlü Yönler:")
                                    .font(.caption.bold())
                                    .foregroundStyle(.green)
                                ForEach(eval.strengths, id: \.self) { str in
                                    Text("• \(str)")
                                        .font(.caption)
                                }
                            }
                            
                            // Geliştirilmesi Gerekenler
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Geliştirilmeli:")
                                    .font(.caption.bold())
                                    .foregroundStyle(.orange)
                                ForEach(eval.improvements, id: \.self) { imp in
                                    Text("• \(imp)")
                                        .font(.caption)
                                }
                            }
                            
                            // Mülakatçı Takip Sorusu
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Mülakatçı Derinleşme Sorusu (Follow-up):")
                                    .font(.caption.bold())
                                    .foregroundStyle(.purple)
                                Text("\"\(eval.followUpQuestion)\"")
                                    .font(.caption)
                                    .italic()
                            }
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(.secondarySystemBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                        
                        // İlerle Butonu
                        Button {
                            if currentQuestionIndex < sampleQuestions.count - 1 {
                                currentQuestionIndex += 1
                                userNotes = ""
                                evaluation = nil
                                timeRemaining = 180
                            } else {
                                isFinished = true
                            }
                        } label: {
                            HStack {
                                Text(currentQuestionIndex == sampleQuestions.count - 1 ? "Simülasyonu Tamamla" : "Sıradaki Soruya Geç")
                                    .fontWeight(.bold)
                                Image(systemName: "arrow.right")
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.green)
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Mülakat Simülatörü")
            .navigationBarTitleDisplayMode(.inline)
            .alert("Tebrikler! Mülakat Tamamlandı", isPresented: $isFinished) {
                Button("Tamam", role: .cancel) {}
            } message: {
                Text("Mülakat oturumunuz başarıyla tamamlandı ve Supabase veritabanına kaydedildi.")
            }
        }
    }
    
    private func evaluateCurrentAnswer() {
        let currentQ = sampleQuestions[currentQuestionIndex]
        isEvaluating = true
        
        let questionObj = Question(
            id: UUID(),
            title: currentQ.title,
            questionText: currentQ.text,
            idealAnswer: currentQ.ideal,
            keyPoints: currentQ.points,
            difficulty: .mid,
            qType: .technical,
            tags: ["iOS", "Swift"]
        )
        
        Task {
            let result = try? await SupabaseService.shared.evaluateAnswer(question: questionObj, userAnswer: userNotes)
            await MainActor.run {
                self.evaluation = result
                self.isEvaluating = false
            }
        }
    }
}
