import SwiftUI

public struct DashboardView: View {
    @State private var viewModel = DashboardViewModel()
    @State private var showSimulator = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Header Banner: Canlı Simülasyon Başlat
                    VStack(alignment: .leading, spacing: 10) {
                        Text("🎯 Bugün Mülakata Hazır mısın?")
                            .font(.title2.bold())
                            .foregroundStyle(.white)
                        
                        Text("Gerçek mülakat soruları ve zamanlayıcı eşliğinde seviyeni test et.")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.9))
                        
                        Button {
                            showSimulator = true
                        } label: {
                            HStack {
                                Image(systemName: "play.circle.fill")
                                Text("Mülakat Simülasyonu Başlat")
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
                        LinearGradient(colors: [.blue, .indigo], startPoint: .topLeading, endPoint: .bottomTrailing)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    
                    // Kategoriler Grid
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Kategoriler")
                            .font(.title3.bold())
                        
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                            ForEach(viewModel.categories) { category in
                                VStack(alignment: .leading, spacing: 8) {
                                    Image(systemName: category.icon)
                                        .font(.title2)
                                        .foregroundStyle(.blue)
                                    
                                    Text(category.name)
                                        .font(.headline)
                                    
                                    Text(category.description ?? "")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                        .lineLimit(2)
                                }
                                .padding()
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                            }
                        }
                    }
                    
                    // Günün Teknik Soruları
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Günün Soruları")
                            .font(.title3.bold())
                        
                        ForEach(viewModel.dailyQuestions) { question in
                            NavigationLink {
                                QuestionDetailView(question: question)
                            } label: {
                                HStack(spacing: 14) {
                                    VStack(alignment: .leading, spacing: 6) {
                                        HStack {
                                            Text(question.difficulty.title)
                                                .font(.caption2.bold())
                                                .padding(.horizontal, 8)
                                                .padding(.vertical, 3)
                                                .background(Color.orange.opacity(0.15))
                                                .foregroundStyle(.orange)
                                                .clipShape(Capsule())
                                            
                                            Text(question.tags.first ?? "")
                                                .font(.caption2)
                                                .foregroundStyle(.secondary)
                                        }
                                        
                                        Text(question.title)
                                            .font(.subheadline.bold())
                                            .foregroundStyle(.primary)
                                            .multilineTextAlignment(.leading)
                                    }
                                    
                                    Spacer()
                                    
                                    Image(systemName: "chevron.right")
                                        .foregroundStyle(.secondary)
                                }
                                .padding()
                                .background(Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                            }
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Mülakat Hazırlık")
            .sheet(isPresented: $showSimulator) {
                InterviewSimulatorView()
            }
            .task {
                await viewModel.loadData()
            }
        }
    }
}
