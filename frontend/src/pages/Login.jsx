import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GraduationCap, Lock, Mail, Eye, EyeOff, AlertCircle, Sparkles, Zap } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const targetPath = from || `/${res.user.role}/dashboard`;
      navigate(targetPath, { replace: true });
    } else {
      setErrorMessage(res.error || 'Incorrect email or password.');
    }
  };

  const autofill = (em, pw) => {
    setEmail(em);
    setPassword(pw);
    setErrorMessage('');
  };

  return (
    <MainLayout hideSidebar={true}>
      <div className="max-w-md mx-auto my-12">
        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Subtle top ambient glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="text-center space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-glow-indigo">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
                Sign In to NEXOURA
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Your learning journey, intelligently guided.
              </p>
            </div>
          </div>

          {/* Alert Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="student@nexoura.edu or admin@nexoura.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-zinc-300">
                  Security Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('NEXOURA Security Notice: Password resets must be requested via institutional IT administrator.')}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              disabled={loading}
              className="w-full py-3 text-xs font-bold shadow-glow-indigo rounded-xl mt-2"
            >
              {loading ? 'Verifying Credentials...' : 'Sign In to Workspace'}
            </Button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="bg-zinc-900/60 rounded-2xl p-4 border border-white/5 text-xs text-zinc-400 space-y-3 relative z-10">
            <div className="font-semibold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-indigo-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant Sandbox Autofill
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">1-click</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => autofill('student@nexoura.edu', 'Password123!')}
                className="py-2 px-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 font-semibold text-[11px] text-zinc-300 transition-all cursor-pointer text-center"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => autofill('teacher@nexoura.edu', 'Password123!')}
                className="py-2 px-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300 font-semibold text-[11px] text-zinc-300 transition-all cursor-pointer text-center"
              >
                👨‍🏫 Teacher
              </button>
              <button
                type="button"
                onClick={() => autofill('parent@nexoura.edu', 'Password123!')}
                className="py-2 px-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300 font-semibold text-[11px] text-zinc-300 transition-all cursor-pointer text-center"
              >
                👪 Parent
              </button>
              <button
                type="button"
                onClick={() => autofill('admin@nexoura.edu', 'Admin@Nexoura2026')}
                className="py-2 px-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-300 font-semibold text-[11px] text-zinc-300 transition-all cursor-pointer text-center"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="text-center pt-4 border-t border-white/5 text-xs text-zinc-400 relative z-10">
            Don't have an institutional account yet?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
              Register Here
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

