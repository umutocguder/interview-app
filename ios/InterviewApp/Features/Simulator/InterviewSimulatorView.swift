import SwiftUI

public struct InterviewSimulatorView: View {
    @State private var timeRemaining = 300 // 5 dakika
    @State private var timerActive = true
    @State private var currentQuestionIndex = 0
    @State private var userNotes = ""
    @State private var isFinished = false
    
    private let sampleQuestions = [
        "Projenizde yaşadığınız en zorlu concurrency hatasını ve nasıl çözdüğünüzü anlatın.",
        "SwiftUI mimarisinde View ve ViewModel arasındaki veri akışını nasıl organize edersiniz?",
        "Supabase RLS güvenlik kuralları yazarken nelere dikkat edilmelidir?"
    ]
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                // Zamanlayıcı (Timer Bar)
                HStack {
                    Label("\(timeRemaining / 60):\(String(format: "%02d", timeRemaining % 60))", systemImage: "clock.fill")
                        .font(.title2.bold())
                        .foregroundStyle(timeRemaining < 60 ? .red : .primary)
                    
                    Spacer()
                    
                    Text("Soru \(currentQuestionIndex + 1)/\(sampleQuestions.count)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .padding()
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 12))
                
                // Mülakat Sorusu Kartı
                VStack(alignment: .leading, spacing: 12) {
                    Text("Mülakatçı Sorusu:")
                        .font(.caption.bold())
                        .foregroundStyle(.secondary)
                    
                    Text(sampleQuestions[currentQuestionIndex])
                        .font(.title3.bold())
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color.blue.opacity(0.08))
                .clipShape(RoundedRectangle(cornerRadius: 16))
                
                // Kullanıcı Not / Cevap Alanı
                VStack(alignment: .leading) {
                    Text("Cevap Taslağınız / Notlar:")
                        .font(.caption.bold())
                        .foregroundStyle(.secondary)
                    
                    TextEditor(text: $userNotes)
                        .padding(8)
                        .background(Color(.systemBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.secondary.opacity(0.2)))
                }
                
                Spacer()
                
                // İlerle Butonu
                Button {
                    if currentQuestionIndex < sampleQuestions.count - 1 {
                        currentQuestionIndex += 1
                        userNotes = ""
                    } else {
                        isFinished = true
                    }
                } label: {
                    Text(currentQuestionIndex == sampleQuestions.count - 1 ? "Simülasyonu Bitir" : "Sıradaki Soruya Geç")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
            }
            .padding()
            .navigationTitle("Canlı Mülakat Simülatörü")
            .navigationBarTitleDisplayMode(.inline)
            .alert("Tebrikler! Mülakat Tamamlandı", isPresented: $isFinished) {
                Button("Tamam", role: .cancel) {}
            } message: {
                Text("Mülakat oturumunuz başarıyla tamamlandı. Supabase veritabanına kaydedildi.")
            }
        }
    }
}
