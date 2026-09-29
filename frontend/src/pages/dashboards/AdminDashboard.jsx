import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { apiService } from '../../services/api';
import { Layers, Users, ShieldCheck, UserCheck, RefreshCw, Key, AlertOctagon } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await apiService.getAdminUsersList();
    if (res.success) {
      setUsersList(res.data);
      setError(null);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        
        {/* Workspace Shell Banner */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold border border-purple-500/30">
                  <Layers className="w-4 h-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
                  Administrator Workspace — {user?.name}
                </h1>
              </div>
              <p className="text-xs text-zinc-400">
                NEXOURA Governance Portal • Institution-Wide Role & Access Control
              </p>
            </div>
            <Badge variant="academic" icon={ShieldCheck}>
              ROLE: ADMINISTRATOR
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/5 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Administrator Email</span>
              <span className="font-bold text-white font-mono truncate block">{user?.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Total System Users</span>
              <span className="font-bold text-purple-400 font-mono">{usersList.length} Accounts</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">RBAC Security Mode</span>
              <span className="font-semibold text-emerald-400 font-mono">STRICT ENFORCEMENT</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Admin Registration</span>
              <span className="font-semibold text-zinc-400 font-mono">CLI SEED ONLY</span>
            </div>
          </div>
        </div>

        {/* User Governance Table */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Users className="w-5 h-5 text-purple-400" />
              Registered Institution User Accounts (RBAC Directory)
            </h3>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Users
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
              Error fetching users list: {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-white/10 text-zinc-400 font-semibold font-mono uppercase text-[10px]">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Profile Identifier</th>
                  <th className="py-3 px-4 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-zinc-500 italic">
                      {loading ? 'Loading system users...' : 'No users found in database.'}
                    </td>
                  </tr>
                ) : (
                  usersList.map((u) => {
                    const profileId =
                      u.student_profile?.student_id ||
                      u.teacher_profile?.employee_id ||
                      u.parent_profile?.parent_id ||
                      'SYSTEM_SUPERADMIN';

                    return (
                      <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-zinc-500">{u.id}</td>
                        <td className="py-3 px-4 font-semibold text-white font-heading">{u.name}</td>
                        <td className="py-3 px-4 font-mono text-zinc-400">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono border ${
                            u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : u.role === 'teacher'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : u.role === 'parent'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-300">{profileId}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
