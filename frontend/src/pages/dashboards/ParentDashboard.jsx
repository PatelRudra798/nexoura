import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { apiService } from '../../services/api';
import {
  UserCheck,
  HeartHandshake,
  Shield,
  AlertCircle,
  CheckCircle2,
  Lock,
  GraduationCap,
  BookOpen,
  Award,
  AlertTriangle,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

export function ParentDashboard() {
  const { user } = useAuth();
  const profile = user?.parent_profile;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkFeedback, setLinkFeedback] = useState(null);

  const fetchStudentData = async () => {
    setLoading(true);
    const res = await apiService.getParentLinkedStudent();
    setLoading(false);
    if (res.success) {
      setData(res.data);
    } else {
      setData(null);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleLinkStudent = async (e) => {
    e.preventDefault();
    if (!studentIdInput.trim()) return;

    setLinkLoading(true);
    setLinkFeedback(null);
    const res = await apiService.linkStudent(studentIdInput.trim());
    setLinkLoading(false);

    if (res.success) {
      setLinkFeedback({ type: 'success', message: res.data.message });
      setStudentIdInput('');
      fetchStudentData();
    } else {
      setLinkFeedback({ type: 'error', message: res.error || 'Failed to match student ID.' });
    }
  };

  const student = data?.student;

  return (
    <MainLayout>
      <div className="space-y-6">
        
        {/* Workspace Shell Banner */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
                  Parent Workspace — {user?.name}
                </h1>
              </div>
              <p className="text-xs text-zinc-400">
                NEXOURA Parent Portal • Guardian Connection & Isolated Academic Trajectory
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchStudentData}
                disabled={loading}
                title="Refresh student records"
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              </button>
              <Badge variant="warning" icon={HeartHandshake}>
                ROLE: PARENT
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/5 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Guardian ID</span>
              <span className="font-bold text-white font-mono">{profile?.parent_id || 'PRT-9001'}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Contact Phone</span>
              <span className="font-semibold text-white font-mono">{profile?.contact_number || '+91 98765 43210'}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Linked Status</span>
              <span className={`font-semibold ${data?.linked ? 'text-emerald-400' : 'text-amber-400'}`}>
                {data?.linked ? '1 Student Linked' : 'No Student Linked'}
              </span>
            </div>
          </div>
        </div>

        {/* Strict Data Isolation & Privacy Guarantee Card */}
        <div className="glass-panel rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block text-sm">
                Role-Based Student Isolation Enforced
              </span>
              <p className="text-zinc-300 text-xs mt-0.5 leading-relaxed">
                By architectural design, this portal strictly matches your account to{' '}
                <strong className="text-indigo-300 font-mono">
                  {student ? student.student_id : 'your verified child'}
                </strong>
                . You only have permission to view this specific student's details—all other students' records are inaccessible.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono shrink-0">
            <Lock className="w-3 h-3 text-emerald-400" /> STRICT PRIVACY LOCK
          </div>
        </div>

        {/* Linked Student Performance Panel */}
        {loading ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs text-zinc-400">Loading student academic telemetry...</p>
          </div>
        ) : student ? (
          <div className="space-y-6">
            
            {/* Student Profile Overview Card */}
            <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white font-heading">
                        {student.name}
                      </h2>
                      <p className="text-xs text-zinc-400">
                        {student.department} • {student.course} • Semester {student.semester}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-zinc-900/80 border border-white/10 font-mono text-xs text-amber-300 font-bold">
                    ID: {student.student_id}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 font-semibold text-xs text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                </div>
              </div>

              {/* 4 Academic KPI Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 block text-[11px] font-medium">Average Score</span>
                  <span className="font-bold text-white font-mono text-lg mt-1 block">
                    {student.average_score}%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 block text-[11px] font-medium">Assessments Taken</span>
                  <span className="font-bold text-indigo-400 font-mono text-lg mt-1 block">
                    {student.assessments_taken} Tests
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 block text-[11px] font-medium">Weak Topics</span>
                  <span className="font-bold text-amber-400 font-mono text-lg mt-1 block">
                    {student.weak_topics_count} Areas
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 block text-[11px] font-medium">Academic Risk Level</span>
                  <span className={`font-bold font-mono text-sm mt-1.5 block ${
                    student.risk_level === 'high'
                      ? 'text-rose-400'
                      : student.risk_level === 'medium'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {student.risk_level.toUpperCase()} RISK
                  </span>
                </div>
              </div>

              {/* Risk Explanations if any */}
              {student.risk_reasons && student.risk_reasons.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Academic Intervention Insights:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {student.risk_reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recent Assessment Attempts */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" /> Recent Assessment Submissions
                </h3>
                {student.recent_attempts && student.recent_attempts.length > 0 ? (
                  <div className="divide-y divide-white/5 border border-white/5 rounded-2xl overflow-hidden bg-zinc-900/40">
                    {student.recent_attempts.map((attempt) => (
                      <div key={attempt.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-white/[0.02]">
                        <div>
                          <span className="font-semibold text-white block">{attempt.assessment_title}</span>
                          <span className="text-[11px] text-zinc-500">
                            {new Date(attempt.completed_at).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold font-mono text-white block">{attempt.percentage}%</span>
                          <span className={`text-[10px] font-semibold ${attempt.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {attempt.passed ? 'Passed' : 'Needs Review'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic p-3 bg-zinc-900/40 rounded-xl border border-white/5">
                    No assessments taken yet by this student.
                  </p>
                )}
              </div>

            </div>
          </div>
        ) : (
          /* Unlinked State Prompt */
          <div className="glass-panel rounded-3xl border border-white/10 p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <Search className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">No Student Linked Yet</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your student's institutional Student ID (e.g. <strong className="text-amber-300 font-mono">STU-DEMO-001</strong>) to match and securely view only their progress.
              </p>
            </div>
          </div>
        )}

        {/* Link / Switch Student ID Tool */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-amber-400" /> Match Student by Institutional ID
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Connect your guardian profile with your student's unique ID to unlock transparent academic visibility.
            </p>
          </div>

          {linkFeedback && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              linkFeedback.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}>
              {linkFeedback.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{linkFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleLinkStudent} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="e.g. STU-DEMO-001"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none uppercase font-mono"
            />
            <button
              type="submit"
              disabled={linkLoading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-glow-amber"
            >
              {linkLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Verify & Match Student</span>
            </button>
          </form>
        </div>

      </div>
    </MainLayout>
  );
}

function LinkIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}
