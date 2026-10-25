"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, Mail, User, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithPassword, signUp, signInDemo } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      setIsLoading(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        onClose();
      }
    } else {
      const { error } = await signInWithPassword(email, password);
      setIsLoading(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        onClose();
      }
    }
  };

  const handleDemoLogin = () => {
    signInDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400 mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {isSignUp ? "Yeni Hesap Oluştur" : "11 Interview'a Giriş Yap"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isSignUp
              ? "Mülakat simülasyonlarınızı ve yapay zeka analizlerinizi kaydedin."
              : "Kişisel çalışma geçmişinize ve performans istatistiklerinize erişin."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              E-posta
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@domain.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Şifre
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? "İşleniyor..." : isSignUp ? "Kayıt Ol" : "Giriş Yap"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-medium">veya</span>
          </div>
        </div>

        {/* Demo Girişi */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Hızlı Demo Hesabı ile Devam Et
        </button>

        <div className="text-center mt-5 text-xs text-slate-500 dark:text-slate-400">
          {isSignUp ? "Zaten hesabınız var mı?" : "Henüz bir hesabınız yok mu?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
            }}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            {isSignUp ? "Giriş Yapın" : "Hemen Kaydolun"}
          </button>
        </div>
      </div>
    </div>
  );
}
