import SwiftUI

public struct DashboardView: View {
    @State private var viewModel = DashboardViewModel()
    @State private var languageManager = LanguageManager.shared
    @State private var showSimulator = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            let questions = viewModel.filteredQuestions(for: languageManager.currentLanguage)
            
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Header Banner: Canlı Simülasyon Başlat
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            Label("Umut's Master Notes", systemImage: "sparkles")
                                .font(.caption.bold())
                                .padding(.horizontal, 10)
                                .padding(.vertical, 4)
                                .background(.white.opacity(0.2))
                                .clipShape(Capsule())
                                .foregroundStyle(.white)
                            
                            Spacer()
                            
                            Text("\(questions.count) Questions")
                                .font(.caption.bold())
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(.white.opacity(0.2))
                                .clipShape(Capsule())
                                .foregroundStyle(.white)
                        }
                        
                        Text(languageManager.startSimulationBannerTitle)
                            .font(.title2.bold())
                            .foregroundStyle(.white)
                        
                        Text(languageManager.startSimulationBannerDesc)
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.9))
                        
                        Button {
                            showSimulator = true
                        } label: {
                            HStack {
                                Image(systemName: "play.circle.fill")
                                Text(languageManager.startSimulationButton)
                            }
                            .font(.headline)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(.white)
                            .foregroundStyle(.blue)
                            .clipShape(Capsule())
                        }
                        .padding(.top, 4)
                    }
                    .padding(20)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        LinearGradient(colors: [.blue, .indigo, .purple], startPoint: .topLeading, endPoint: .bottomTrailing)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    
                    // Search & Filters Bar
                    VStack(spacing: 12) {
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundStyle(.secondary)
                            TextField(languageManager.searchPlaceholder, text: $viewModel.searchQuery)
                                .textFieldStyle(.plain)
                                .font(.subheadline)
                            
                            if !viewModel.searchQuery.isEmpty {
                                Button {
                                    viewModel.searchQuery = ""
                                } label: {
                                    Image(systemName: "xmark.circle.fill")
                                        .foregroundStyle(.secondary)
                                }
                            }
                        }
                        .padding(12)
                        .background(Color(.secondarySystemBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        
                        // Bookmarks and Difficulty Filters
                        HStack {
                            Button {
                                viewModel.onlyBookmarks.toggle()
                            } label: {
                                HStack(spacing: 6) {
                                    Image(systemName: viewModel.onlyBookmarks ? "star.fill" : "star")
                                    Text(languageManager.starredFilter)
                                }
                                .font(.caption.bold())
                                .padding(.horizontal, 12)
                                .padding(.vertical, 8)
                                .background(viewModel.onlyBookmarks ? Color.orange.opacity(0.15) : Color(.secondarySystemBackground))
                                .foregroundStyle(viewModel.onlyBookmarks ? .orange : .primary)
                                .clipShape(Capsule())
                            }
                            
                            Spacer()
                            
                            // Difficulty segmented buttons
                            HStack(spacing: 4) {
                                ForEach(["all", "junior", "mid", "senior"], id: \.self) { diff in
                                    Button {
                                        viewModel.difficultyFilter = diff
                                    } label: {
                                        Text(diff == "all" ? languageManager.allDifficulties : diff.capitalized)
                                            .font(.caption2.bold())
                                            .padding(.horizontal, 10)
                                            .padding(.vertical, 6)
                                            .background(viewModel.difficultyFilter == diff ? Color.blue : Color(.tertiarySystemBackground))
                                            .foregroundStyle(viewModel.difficultyFilter == diff ? .white : .primary)
                                            .clipShape(Capsule())
                                    }
                                }
                            }
                        }
                    }
                    
                    // Categories Bar (Horizontal Scroll)
                    VStack(alignment: .leading, spacing: 10) {
                        Text(languageManager.categoriesTitle)
                            .font(.headline)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                ForEach(viewModel.categories) { category in
                                    let catContent = category.content(for: languageManager.currentLanguage)
                                    let isSelected = viewModel.selectedCategorySlug == category.slug
                                    
                                    Button {
                                        viewModel.selectedCategorySlug = category.slug
                                    } label: {
                                        HStack(spacing: 6) {
                                            Image(systemName: category.icon)
                                            Text(catContent.name)
                                        }
                                        .font(.caption.bold())
                                        .padding(.horizontal, 14)
                                        .padding(.vertical, 10)
                                        .background(isSelected ? Color.blue : Color(.secondarySystemBackground))
                                        .foregroundStyle(isSelected ? .white : .primary)
                                        .clipShape(RoundedRectangle(cornerRadius: 12))
                                    }
                                }
                            }
                        }
                    }
                    
                    // Question Cards List
                    VStack(alignment: .leading, spacing: 14) {
                        HStack {
                            Text(languageManager.questionsTitle)
                                .font(.headline)
                            
                            Spacer()
                            
                            Text("\(questions.count)")
                                .font(.caption.bold())
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(Color.blue.opacity(0.1))
                                .foregroundStyle(.blue)
                                .clipShape(Capsule())
                        }
                        
                        if questions.isEmpty {
                            VStack(spacing: 8) {
                                Image(systemName: "questionmark.folder")
                                    .font(.largeTitle)
                                    .foregroundStyle(.secondary)
                                Text("No questions found matching criteria.")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 40)
                        } else {
                            ForEach(questions) { question in
                                let content = question.content(for: languageManager.currentLanguage)
                                let isBookmarked = viewModel.isBookmarked(question.id)
                                let isRevealed = viewModel.isAnswerRevealed(question.id)
                                
                                VStack(alignment: .leading, spacing: 10) {
                                    // Tag & Bookmark row
                                    HStack {
                                        Text(question.difficulty.localizedTitle(for: languageManager.currentLanguage))
                                            .font(.caption2.bold())
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 3)
                                            .background(Color.orange.opacity(0.15))
                                            .foregroundStyle(.orange)
                                            .clipShape(Capsule())
                                        
                                        ForEach(question.tags.prefix(2), id: \.self) { tag in
                                            Text("#\(tag)")
                                                .font(.caption2)
                                                .foregroundStyle(.secondary)
                                        }
                                        
                                        Spacer()
                                        
                                        Button {
                                            viewModel.toggleBookmark(for: question.id)
                                        } label: {
                                            Image(systemName: isBookmarked ? "star.fill" : "star")
                                                .foregroundStyle(isBookmarked ? .orange : .secondary)
                                        }
                                    }
                                    
                                    // Question Title
                                    Text(content.title)
                                        .font(.subheadline.bold())
                                        .foregroundStyle(.primary)
                                    
                                    // Question Text
                                    Text(content.questionText)
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                        .lineLimit(isRevealed ? nil : 3)
                                    
                                    // Ideal Answer and Key points (Expandable)
                                    if isRevealed {
                                        VStack(alignment: .leading, spacing: 8) {
                                            Divider()
                                            
                                            Text(languageManager.idealAnswerTitle)
                                                .font(.caption.bold())
                                                .foregroundStyle(.blue)
                                            
                                            Text(content.idealAnswer)
                                                .font(.caption)
                                                .foregroundStyle(.primary)
                                            
                                            if !content.keyPoints.isEmpty {
                                                Text(languageManager.keyPointsTitle)
                                                    .font(.caption.bold())
                                                    .foregroundStyle(.secondary)
                                                    .padding(.top, 4)
                                                
                                                ForEach(content.keyPoints, id: \.self) { pt in
                                                    HStack(alignment: .top, spacing: 6) {
                                                        Image(systemName: "checkmark.circle.fill")
                                                            .font(.caption2)
                                                            .foregroundStyle(.green)
                                                        Text(pt)
                                                            .font(.caption2)
                                                    }
                                                }
                                            }
                                        }
                                        .padding(.top, 4)
                                    }
                                    
                                    // Reveal / Hide Button
                                    Button {
                                        viewModel.toggleRevealAnswer(for: question.id)
                                    } label: {
                                        HStack(spacing: 4) {
                                            Image(systemName: isRevealed ? "chevron.up" : "eye.fill")
                                            Text(isRevealed ? languageManager.hideAnswer : languageManager.showAnswer)
                                        }
                                        .font(.caption.bold())
                                        .foregroundStyle(.blue)
                                    }
                                    .padding(.top, 2)
                                }
                                .padding(16)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 16))
                            }
                        }
                    }
                }
                .padding()
            }
            .navigationTitle(languageManager.appName)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    // Language Switcher
                    Menu {
                        ForEach(AppLanguage.allCases, id: \.self) { lang in
                            Button {
                                languageManager.setLanguage(lang)
                            } label: {
                                HStack {
                                    Text(lang.displayName)
                                    if languageManager.currentLanguage == lang {
                                        Image(systemName: "checkmark")
                                    }
                                }
                            }
                        }
                    } label: {
                        HStack(spacing: 4) {
                            Text(languageManager.currentLanguage.shortCode)
                                .font(.caption.bold())
                            Image(systemName: "globe")
                                .font(.subheadline)
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Color(.tertiarySystemBackground))
                        .clipShape(Capsule())
                    }
                }
            }
            .sheet(isPresented: $showSimulator) {
                InterviewSimulatorView(
                    questions: questions,
                    language: languageManager.currentLanguage
                )
            }
        }
    }
}
