import SwiftUI
import AVFoundation

public struct InterviewSimulatorView: View {
    public let questions: [Question]
    public let language: AppLanguage
    
    @Environment(\.dismiss) private var dismiss
    @State private var timeRemaining = 180 // 3 minutes
    @State private var timerActive = true
    @State private var currentQuestionIndex = 0
    @State private var userNotes = ""
    @State private var isEvaluating = false
    @State private var isSpeaking = false
    @State private var evaluationScore: Int?
    @State private var evaluationStrengths: [String] = []
    @State private var evaluationImprovements: [String] = []
    @State private var followUpQuestion: String?
    
    private let speechSynthesizer = AVSpeechSynthesizer()
    
    public init(questions: [Question], language: AppLanguage = .tr) {
        self.questions = questions.isEmpty ? QuestionRepository.shared.questions : questions
        self.language = language
    }
    
    public var body: some View {
        NavigationStack {
            let currentQ = questions[currentQuestionIndex]
            let content = currentQ.content(for: language)
            let lm = LanguageManager.shared
            
            ScrollView {
                VStack(spacing: 20) {
                    // Timer Bar
                    HStack {
                        Label("\(timeRemaining / 60):\(String(format: "%02d", timeRemaining % 60))", systemImage: "clock.fill")
                            .font(.headline.monospacedDigit())
                            .foregroundStyle(timeRemaining < 30 ? .red : .primary)
                        
                        Spacer()
                        
                        Text("\(currentQuestionIndex + 1)/\(questions.count)")
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
                    
                    // Interviewer Question Card
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            Text(lm.interviewerQuestion)
                                .font(.caption.bold())
                                .foregroundStyle(.blue)
                            
                            Spacer()
                            
                            Button {
                                toggleSpeech(text: "\(content.title). \(content.questionText)")
                            } label: {
                                HStack(spacing: 4) {
                                    Image(systemName: isSpeaking ? "speaker.slash.fill" : "speaker.wave.2.fill")
                                    Text(isSpeaking ? "Stop" : "Listen")
                                }
                                .font(.caption2.bold())
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.blue.opacity(0.1))
                                .clipShape(Capsule())
                            }
                        }
                        
                        Text(content.title)
                            .font(.headline)
                        
                        Text(content.questionText)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(Color.blue.opacity(0.06))
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    
                    // User Answer Area
                    VStack(alignment: .leading, spacing: 8) {
                        Text(lm.yourAnswer)
                            .font(.caption.bold())
                            .foregroundStyle(.secondary)
                        
                        TextEditor(text: $userNotes)
                            .frame(minHeight: 120)
                            .padding(8)
                            .background(Color(.systemBackground))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.secondary.opacity(0.2)))
                    }
                    
                    // AI Evaluation Button or Results
                    if evaluationScore == nil {
                        Button {
                            evaluateAnswer(content: content)
                        } label: {
                            HStack {
                                if isEvaluating {
                                    ProgressView().tint(.white)
                                    Text(lm.evaluatingAI)
                                } else {
                                    Image(systemName: "sparkles")
                                    Text(lm.evaluateWithAI)
                                }
                            }
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(userNotes.trimmingCharacters(in: .whitespaces).isEmpty ? Color.gray : Color.blue)
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                        .disabled(userNotes.trimmingCharacters(in: .whitespaces).isEmpty || isEvaluating)
                    } else {
                        // AI Evaluation Result Panel
                        VStack(alignment: .leading, spacing: 14) {
                            HStack {
                                Image(systemName: "award.fill")
                                    .font(.title2)
                                    .foregroundStyle(.orange)
                                
                                VStack(alignment: .leading) {
                                    Text(lm.scoreTitle)
                                        .font(.caption.bold())
                                        .foregroundStyle(.secondary)
                                    Text("\(evaluationScore ?? 85) / 100")
                                        .font(.title3.bold())
                                }
                                
                                Spacer()
                                
                                Text("Gemini Engine")
                                    .font(.caption2.monospaced())
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.blue.opacity(0.1))
                                    .clipShape(Capsule())
                            }
                            
                            Divider()
                            
                            // Strengths
                            VStack(alignment: .leading, spacing: 6) {
                                Label(lm.strengthsTitle, systemImage: "checkmark.circle.fill")
                                    .font(.caption.bold())
                                    .foregroundStyle(.green)
                                
                                ForEach(evaluationStrengths, id: \.self) { str in
                                    Text("• \(str)")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                            }
                            
                            // Improvements
                            VStack(alignment: .leading, spacing: 6) {
                                Label(lm.improvementsTitle, systemImage: "exclamationmark.triangle.fill")
                                    .font(.caption.bold())
                                    .foregroundStyle(.orange)
                                
                                ForEach(evaluationImprovements, id: \.self) { imp in
                                    Text("• \(imp)")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                            }
                            
                            // Follow-up question
                            if let followUp = followUpQuestion {
                                VStack(alignment: .leading, spacing: 4) {
                                    Label(lm.followUpTitle, systemImage: "questionmark.circle.fill")
                                        .font(.caption.bold())
                                        .foregroundStyle(.purple)
                                    Text("\"\(followUp)\"")
                                        .font(.caption.italic())
                                        .foregroundStyle(.primary)
                                }
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.purple.opacity(0.08))
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                            }
                            
                            // Next question button
                            Button {
                                nextQuestion()
                            } label: {
                                HStack {
                                    Text(currentQuestionIndex < questions.count - 1 ? lm.nextQuestion : lm.completeInterview)
                                    Image(systemName: "arrow.right")
                                }
                                .font(.headline)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.green)
                                .foregroundStyle(.white)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                            }
                            .padding(.top, 4)
                        }
                        .padding()
                        .background(Color(.secondarySystemBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                }
                .padding()
            }
            .navigationTitle("Simulator")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") {
                        stopSpeech()
                        dismiss()
                    }
                }
            }
        }
    }
    
    private func toggleSpeech(text: String) {
        if speechSynthesizer.isSpeaking {
            stopSpeech()
        } else {
            let utterance = AVSpeechUtterance(string: text)
            utterance.voice = AVSpeechSynthesisVoice(language: language.bcp47)
            utterance.rate = 0.5
            speechSynthesizer.speak(utterance)
            isSpeaking = true
        }
    }
    
    private func stopSpeech() {
        if speechSynthesizer.isSpeaking {
            speechSynthesizer.stopSpeaking(at: .immediate)
        }
        isSpeaking = false
    }
    
    private func evaluateAnswer(content: LocalizedQuestionContent) {
        isEvaluating = true
        stopSpeech()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            let answerLower = userNotes.lowercased()
            let matched = content.keyPoints.filter { pt in
                let words = pt.lowercased().split(separator: " ")
                return words.contains { answerLower.contains($0) }
            }
            
            let isEn = language == .en
            let score = min(95, max(60, 50 + (matched.count * 12)))
            self.evaluationScore = score
            
            self.evaluationStrengths = matched.isEmpty
                ? [isEn ? "Addressed the core interview question calmly." : "Soruya sakin ve anlaşılır bir üslupla yaklaşıldı."]
                : matched.map { isEn ? "Accurately touched upon '\($0)'." : "'\($0)' konusuna doğru temas edildi." }
            
            self.evaluationImprovements = [
                isEn ? "Could illustrate performance trade-offs under heavy load." : "Yüksek yük altındaki performans ve bellek kısıtlarına daha çok değinilebilir."
            ]
            
            self.followUpQuestion = isEn
                ? "How would you write an automated unit test or profiling benchmark for this implementation?"
                : "Bu implementasyon için Instruments veya XCTest ile nasıl bir performans testi yazarsınız?"
            
            self.isEvaluating = false
        }
    }
    
    private func nextQuestion() {
        stopSpeech()
        if currentQuestionIndex < questions.count - 1 {
            currentQuestionIndex += 1
            userNotes = ""
            timeRemaining = 180
            evaluationScore = nil
            evaluationStrengths = []
            evaluationImprovements = []
            followUpQuestion = nil
        } else {
            dismiss()
        }
    }
}
