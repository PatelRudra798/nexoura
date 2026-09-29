import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { GraduationCap, ShieldCheck, Database, Layers, UserCheck, BookOpen, ChevronRight, Menu, X, Sparkles, Terminal, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function MainLayout({ children, hideSidebar = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const roleTypes = [
    { id: 'student', label: 'Student View', path: '/student/dashboard', icon: GraduationCap, color: 'text-indigo-400' },
    { id: 'teacher', label: 'Teacher View', path: '/teacher/dashboard', icon: BookOpen, color: 'text-emerald-400' },
    { id: 'parent', label: 'Parent View', path: '/parent/dashboard', icon: UserCheck, color: 'text-amber-400' },
    { id: 'admin', label: 'Admin View', path: '/admin/dashboard', icon: Layers, color: 'text-rose-400' }
  ];

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col relative selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[28rem] h-[28rem] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-80 h-80 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Grid overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />

      <Navbar />

      {/* Main Container */}
      <div className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 ${isLandingPage || hideSidebar ? 'max-w-7xl' : 'max-w-7xl flex flex-col md:flex-row gap-6'}`}>
        
        {/* Optional Sidebar for Dashboards */}
        {!isLandingPage && !hideSidebar && (
          <>
            {/* Mobile Sidebar Toggle Bar */}
            <div className="md:hidden flex items-center justify-between glass-panel p-3.5 rounded-xl border border-white/10 mb-4">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" /> Platform Navigation
              </span>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg bg-white/5 text-zinc-300 hover:text-white focus:outline-none"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            <aside
              className={`${
                sidebarOpen ? 'block' : 'hidden'
              } md:block w-full md:w-64 shrink-0 space-y-5`}
            >
              {/* Role Perspectives Matrix */}
              <div className="glass-panel rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                    Role Workspaces
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10 font-mono">
                    RBAC
                  </span>
                </div>
                <div className="space-y-1.5">
                  {roleTypes.map((role) => {
                    const Icon = role.icon;
                    const isActive = location.pathname.startsWith(`/${role.id}`);
                    const isUserRole = user?.role === role.id;

                    return (
                      <Link
                        key={role.id}
                        to={role.path}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-white font-semibold border border-indigo-500/40 shadow-glow-indigo'
                            : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${role.color}`} />
                          {role.label}
                        </span>
                        {isUserRole ? (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500 text-white shadow-sm">
                            YOU
                          </span>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Architectural Telemetry Box */}
              <div className="glass-panel rounded-2xl p-4 border border-white/10 text-xs space-y-3">
                <div className="font-semibold text-white flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" /> Platform Engine
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Decoupled asynchronous architecture powered by FastAPI REST services, SQLAlchemy ORM, and high-frequency React hydration.
                </p>
                <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5 text-[10px] font-mono text-zinc-400">
                  <div className="flex justify-between">
                    <span>STACK:</span>
                    <span className="text-zinc-200">Vite • React 18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BACKEND:</span>
                    <span className="text-zinc-200">FastAPI 0.136</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LATENCY:</span>
                    <span className="text-emerald-400">&lt; 15ms local</span>
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Hubbl-inspired Footer */}
      <footer className="border-t border-white/10 bg-[#06070a]/90 backdrop-blur-xl py-12 mt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-8 border-b border-white/5">
            {/* Column 1: Brand */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-glow-indigo">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-white font-heading">
                  NEXOURA
                </span>
                <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-0.5 rounded-full">
                  CAMPUS INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
                An intelligent student learning & academic guidance operating system. Diagnosing curriculum friction, charting personalized skill roadmaps, and providing autonomous clarity for future engineers.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> All Systems Operational
                </span>
                <span>•</span>
                <span>Version 3.0-MVP</span>
              </div>
            </div>

            {/* Column 2: Platform Roles */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-heading">
                Role Ecosystems
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li><Link to="/student/dashboard" className="hover:text-indigo-400 transition-colors">Student Guidance Portal</Link></li>
                <li><Link to="/teacher/dashboard" className="hover:text-indigo-400 transition-colors">Teacher Analytics Console</Link></li>
                <li><Link to="/parent/dashboard" className="hover:text-indigo-400 transition-colors">Parent Overview Portal</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-indigo-400 transition-colors">Administrator RBAC Suite</Link></li>
              </ul>
            </div>

            {/* Column 3: Engineering */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-heading">
                Developer & Docs
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li><a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">FastAPI Interactive Swagger</a></li>
                <li><a href="http://127.0.0.1:8000/api/health" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">Live Health Telemetry</a></li>
                <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Institutional Sign In</Link></li>
                <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Register Account</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div>
              © 2026 NEXOURA — College PBL Smart Education Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Security: Bcrypt + PyJWT</span>
              <span>•</span>
              <span>Architecture: Role-Based RBAC</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

