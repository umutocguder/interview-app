import SwiftUI

public struct QuestionDetailView: View {
    public let question: Question
    @State private var isAnswerRevealed = false
    @State private var showHint = false
    @State private var isBookmarked = false
    
    public init(question: Question) {
        self.question = question
        _isBookmarked = State(initialValue: question.isBookmarked ?? false)
    }
    
    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header & Badges
                HStack {
                    Text(question.difficulty.title)
                        .font(.caption.bold())
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(difficultyColor.opacity(0.15))
                        .foregroundStyle(difficultyColor)
                        .clipShape(Capsule())
                    
                    ForEach(question.tags.prefix(2), id: \.self) { tag in
                        Text("#\(tag)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    
                    Spacer()
                    
                    Button {
                        isBookmarked.toggle()
                    } label: {
                        Image(systemName: isBookmarked ? "bookmark.fill" : "bookmark")
                            .foregroundStyle(isBookmarked ? .blue : .secondary)
                    }
                }
                
                // Soru Metni
                Text(question.title)
                    .font(.title2.bold())
                
                Text(question.questionText)
                    .font(.body)
                    .foregroundStyle(.primary)
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                
                // İpuçları (Hints)
                if !question.hints.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Button {
                            withAnimation { showHint.toggle() }
                        } label: {
                            HStack {
                                Image(systemName: "lightbulb.fill")
                                    .foregroundStyle(.yellow)
                                Text(showHint ? "İpucunu Gizle" : "İpucu Göster")
                                    .font(.subheadline.bold())
                            }
                        }
                        
                        if showHint {
                            ForEach(question.hints, id: \.self) { hint in
                                Text("💡 \(hint)")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                    .padding(.vertical, 4)
                }
                
                Divider()
                
                // Cevap Açma Butonu ve İdeal Cevap
                VStack(alignment: .leading, spacing: 12) {
                    if isAnswerRevealed {
                        Text("🎯 İdeal Cevap & Mimari Çözüm")
                            .font(.headline)
                        
                        Text(question.idealAnswer)
                            .font(.body)
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.blue.opacity(0.08))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        
                        Text("📌 Kritik Noktalar (Key Points):")
                            .font(.subheadline.bold())
                            .padding(.top, 6)
                        
                        ForEach(question.keyPoints, id: \.self) { point in
                            HStack(alignment: .top) {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundStyle(.green)
                                    .font(.caption)
                                Text(point)
                                    .font(.subheadline)
                            }
                        }
                    } else {
                        Button {
                            withAnimation(.spring()) {
                                isAnswerRevealed = true
                            }
                        } label: {
                            HStack {
                                Image(systemName: "eye.fill")
                                Text("İdeal Cevabı Görüntüle")
                            }
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                }
            }
            .padding()
        }
        .navigationTitle("Soru Detayı")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private var difficultyColor: Color {
        switch question.difficulty {
        case .junior: return .green
        case .mid: return .orange
        case .senior: return .purple
        }
    }
}
