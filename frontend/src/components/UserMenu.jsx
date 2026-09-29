import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, ChevronDown, GraduationCap, Briefcase, UserCheck, Layers } from 'lucide-react';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const roleConfig = {
    student: { label: 'STUDENT', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: GraduationCap },
    teacher: { label: 'TEACHER', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: Briefcase },
    parent: { label: 'PARENT', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: UserCheck },
    admin: { label: 'ADMINISTRATOR', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: Layers }
  };

  const currentRole = roleConfig[user.role] || roleConfig.student;
  const RoleIcon = currentRole.icon;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all cursor-pointer"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-glow-indigo">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left hidden md:block">
          <span className="font-semibold block leading-tight text-white">{user.name}</span>
          <span className="text-[10px] text-zinc-400 capitalize block">{user.role}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel border border-white/10 shadow-2xl z-50 text-white p-3.5 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="pb-3 border-b border-white/5">
            <span className="font-bold text-sm block text-white font-heading">{user.name}</span>
            <span className="text-xs text-zinc-400 block truncate font-mono">{user.email}</span>
            
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border font-mono ${currentRole.color}`}>
                <RoleIcon className="w-3 h-3" />
                {currentRole.label}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <button
              onClick={() => {
                setOpen(false);
                navigate(`/${user.role}/dashboard`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer text-left"
            >
              <User className="w-4 h-4 text-indigo-400" />
              Go to {user.role.toUpperCase()} Dashboard
            </button>
          </div>

          <div className="pt-2 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer font-semibold text-xs text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of NEXOURA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
