import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, Home, Server, CheckCircle2, AlertTriangle, UserPlus, Sparkles, BookOpen, Layers, Zap, ChevronDown } from 'lucide-react';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { useAuth } from '../context/AuthContext';
import { UserMenu } from './UserMenu';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { healthData, loading: healthLoading } = useHealthCheck();
  const { user, login } = useAuth();
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const isConnected = healthData?.status === 'ok';
  const dashboardPath = user ? `/${user.role}/dashboard` : '/dashboard';

  const navLinks = [
    { path: '/', label: 'Overview', icon: Home },
    ...(user?.role !== 'parent' ? [{ path: '/#curriculum', label: 'Curriculum Hubs', icon: BookOpen }] : []),
    { path: '/#features', label: 'Platform Matrix', icon: Layers },
    { path: dashboardPath, label: user ? `${user.role.toUpperCase()} Workspace` : 'Student Workspace', icon: LayoutDashboard }
  ];

  const handleQuickLogin = async (roleEmail, rolePassword) => {
    setDemoMenuOpen(false);
    const res = await login(roleEmail, rolePassword);
    if (res.success) {
      navigate(`/${res.user.role}/dashboard`);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07080c]/85 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Platform Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-all shadow-glow-indigo">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-heading">
                  NEXOURA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  v3.0
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 block font-normal">
                Smart Education & Student Guidance
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 glass-pill px-3 py-1.5 rounded-full border border-white/10">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-zinc-950 shadow-md font-bold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Live API Health Monitor Pill */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${
                healthLoading
                  ? 'bg-zinc-900/80 text-zinc-400 border-zinc-800'
                  : isConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              </span>
              <span className="text-zinc-400 font-normal">Engine:</span>
              <span className="font-bold font-mono">
                {healthLoading ? 'CONNECTING...' : isConnected ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            {/* Quick Demo Switcher Dropdown */}
            {!user && (
              <div className="relative">
                <button
                  onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-glow-orange cursor-pointer"
                  title="Instant Sandbox Switcher"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sandbox Demo</span>
                  <ChevronDown className="w-3 h-3 text-amber-400/80" />
                </button>

                {demoMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1 block">
                      Instant 1-Click Role Login
                    </span>
                    <button
                      onClick={() => handleQuickLogin('student@nexoura.edu', 'Password123!')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        🎓 Student View
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Alex</span>
                    </button>
                    <button
                      onClick={() => handleQuickLogin('teacher@nexoura.edu', 'Password123!')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        👨‍🏫 Teacher View
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Prof. Sarah</span>
                    </button>
                    <button
                      onClick={() => handleQuickLogin('admin@nexoura.edu', 'Admin@Nexoura2026')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        🛡️ Admin Console
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">Superadmin</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Authenticated User Menu or Guest Sign In / Register Buttons */}
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 text-zinc-200 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 transition-all shadow-glow-indigo flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

