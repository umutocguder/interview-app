import SwiftUI

@Observable
public final class AuthViewModel {
    public var email: String = ""
    public var password: String = ""
    public var fullName: String = ""
    public var isSignUp: Bool = false
    public var isLoading: Bool = false
    public var errorMessage: String?
    public var isAuthenticated: Bool = false
    
    public init() {}
    
    @MainActor
    public func authenticate() async {
        guard !email.isEmpty, !password.isEmpty else {
            errorMessage = "Lütfen e-posta ve şifrenizi girin."
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        do {
            if isSignUp {
                try await SupabaseService.shared.signUp(email: email, password: password, fullName: fullName)
            } else {
                try await SupabaseService.shared.signIn(email: email, password: password)
            }
            isAuthenticated = true
        } catch {
            errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
    
    @MainActor
    public func loginAsDemo() {
        Task {
            await SupabaseService.shared.signInDemo()
            isAuthenticated = true
        }
    }
}

public struct AuthView: View {
    @State private var viewModel = AuthViewModel()
    @Environment(\.dismiss) private var dismiss
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header Icon & Title
                    VStack(spacing: 12) {
                        Image(systemName: "lock.shield.fill")
                            .font(.system(size: 48))
                            .foregroundStyle(.blue)
                            .padding(.top, 20)
                        
                        Text(viewModel.isSignUp ? "Hesap Oluştur" : "Interview App'e Giriş")
                            .font(.title2.bold())
                        
                        Text(viewModel.isSignUp 
                             ? "Mülakat simülasyonlarınızı ve yapay zeka analizlerinizi kaydedin."
                             : "Kişisel çalışma geçmişinize ve performans skorlarınıza erişin.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                    
                    // Error Banner
                    if let error = viewModel.errorMessage {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundStyle(.red)
                            Text(error)
                                .font(.footnote)
                                .foregroundStyle(.red)
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.red.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    
                    // Form Fields
                    VStack(spacing: 16) {
                        if viewModel.isSignUp {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Ad Soyad")
                                    .font(.caption.bold())
                                    .foregroundStyle(.secondary)
                                TextField("Örn: Umut Öçgüder", text: $viewModel.fullName)
                                    .textContentType(.name)
                                    .padding()
                                    .background(Color(.secondarySystemBackground))
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                            }
                        }
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("E-posta")
                                .font(.caption.bold())
                                .foregroundStyle(.secondary)
                            TextField("ornek@domain.com", text: $viewModel.email)
                                .textContentType(.emailAddress)
                                .textInputAutocapitalization(.never)
                                .autocorrectionDisabled()
                                .padding()
                                .background(Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Şifre")
                                .font(.caption.bold())
                                .foregroundStyle(.secondary)
                            SecureField("••••••••", text: $viewModel.password)
                                .textContentType(viewModel.isSignUp ? .newPassword : .password)
                                .padding()
                                .background(Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                    
                    // Submit Button
                    Button {
                        Task {
                            await viewModel.authenticate()
                            if viewModel.isAuthenticated {
                                dismiss()
                            }
                        }
                    } label: {
                        HStack {
                            if viewModel.isLoading {
                                ProgressView()
                                    .tint(.white)
                            } else {
                                Text(viewModel.isSignUp ? "Kayıt Ol" : "Giriş Yap")
                                    .fontWeight(.semibold)
                                Image(systemName: "arrow.right")
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(.blue)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                    .disabled(viewModel.isLoading)
                    
                    // Divider
                    HStack {
                        Rectangle().frame(height: 1).foregroundStyle(Color(.separator))
                        Text("veya").font(.caption).foregroundStyle(.secondary).padding(.horizontal, 8)
                        Rectangle().frame(height: 1).foregroundStyle(Color(.separator))
                    }
                    
                    // Demo Login
                    Button {
                        viewModel.loginAsDemo()
                        dismiss()
                    } label: {
                        HStack {
                            Image(systemName: "sparkles")
                            Text("Hızlı Demo Hesabı ile Devam Et")
                                .font(.subheadline.bold())
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue.opacity(0.1))
                        .foregroundStyle(.blue)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                    
                    // Switch Auth Mode
                    Button {
                        withAnimation {
                            viewModel.isSignUp.toggle()
                            viewModel.errorMessage = nil
                        }
                    } label: {
                        Text(viewModel.isSignUp ? "Zaten bir hesabınız var mı? Giriş Yapın" : "Hesabınız yok mu? Hemen Kaydolun")
                            .font(.footnote)
                            .foregroundStyle(.blue)
                    }
                    .padding(.top, 8)
                }
                .padding(24)
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Kapat") {
                        dismiss()
                    }
                }
            }
        }
    }
}
