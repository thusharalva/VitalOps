'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (credentials: { email: string; password: string }) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
    setError('');
    setLoading(true);

    try {
      await api.login(credentials.email, credentials.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-emerald-600 to-teal-700"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Floating Shapes */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Login Card */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          {/* Logo/Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <span className="text-5xl">🏥</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-2xl">VitalOps</h1>
            <p className="text-primary-100 text-lg">Medical Equipment Management</p>
          </div>

          {/* Login Form Card */}
          <div className="glass-card rounded-3xl p-8 shadow-2xl border-2 border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg animate-slide-up">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                  placeholder="admin@vitalops.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary px-6 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign in →'
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/register')}
                  className="text-primary-600 hover:text-primary-700 font-bold hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>

            {/* Quick Login (Dev) */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">Quick Login (Dev)</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin({ email: 'admin@vitalops.com', password: 'admin123' })}
                  className="px-3 py-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin({ email: 'manager@vitalops.com', password: 'manager123' })}
                  className="px-3 py-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  💼 Manager
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin({ email: 'tech@vitalops.com', password: 'tech123' })}
                  className="px-3 py-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  🔧 Tech
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-primary-100 text-sm mt-8 drop-shadow">
            © 2024 VitalOps. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}
