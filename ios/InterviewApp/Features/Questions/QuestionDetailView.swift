import SwiftUI

public struct QuestionDetailView: View {
    public let question: Question
    @State private var languageManager = LanguageManager.shared
    @State private var isAnswerRevealed = false
    @State private var showHint = false
    @State private var isBookmarked = false
    
    public init(question: Question) {
        self.question = question
        _isBookmarked = State(initialValue: question.isBookmarked)
    }
    
    private var content: LocalizedQuestionContent {
        question.content(for: languageManager.currentLanguage)
    }
    
    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header & Badges
                HStack {
                    Text(question.difficulty.localizedTitle(for: languageManager.currentLanguage))
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
                        Image(systemName: isBookmarked ? "star.fill" : "star")
                            .foregroundStyle(isBookmarked ? .orange : .secondary)
                    }
                }
                
                // Question Text
                Text(content.title)
                    .font(.title2.bold())
                
                Text(content.questionText)
                    .font(.body)
                    .foregroundStyle(.primary)
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                
                // Hints
                if !content.hints.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Button {
                            withAnimation { showHint.toggle() }
                        } label: {
                            HStack {
                                Image(systemName: "lightbulb.fill")
                                    .foregroundStyle(.yellow)
                                Text(showHint ? "Hide Hint" : "Show Hint")
                                    .font(.subheadline.bold())
                            }
                        }
                        
                        if showHint {
                            ForEach(content.hints, id: \.self) { hint in
                                Text("💡 \(hint)")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                    .padding(.vertical, 4)
                }
                
                Divider()
                
                // Ideal Answer and Key points
                VStack(alignment: .leading, spacing: 12) {
                    if isAnswerRevealed {
                        Text("🎯 \(languageManager.idealAnswerTitle)")
                            .font(.headline)
                        
                        Text(content.idealAnswer)
                            .font(.body)
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.blue.opacity(0.08))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        
                        if !content.keyPoints.isEmpty {
                            Text("📌 \(languageManager.keyPointsTitle):")
                                .font(.subheadline.bold())
                                .padding(.top, 6)
                            
                            ForEach(content.keyPoints, id: \.self) { point in
                                HStack(alignment: .top) {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundStyle(.green)
                                    Text(point)
                                        .font(.subheadline)
                                }
                            }
                        }
                        
                        Button {
                            isAnswerRevealed = false
                        } label: {
                            Text(languageManager.hideAnswer)
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        }
                        .padding(.top, 4)
                    } else {
                        Button {
                            isAnswerRevealed = true
                        } label: {
                            HStack {
                                Image(systemName: "eye.fill")
                                Text(languageManager.showAnswer)
                            }
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                    }
                }
            }
            .padding()
        }
        .navigationTitle(languageManager.appName)
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
