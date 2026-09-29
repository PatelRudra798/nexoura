import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { apiService } from '../../services/api';
import { CreateAssessmentModal } from '../../components/academic/CreateAssessmentModal';
import {
  Briefcase,
  BookOpen,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Activity,
  PlusCircle,
  FileText,
  Clock,
  Sparkles,
  Info,
  HelpCircle,
  Play
} from 'lucide-react';

export function TeacherDashboard() {
  const { user } = useAuth();
  const profile = user?.teacher_profile;

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchTeacherData = useCallback(async () => {
    try {
      const [overRes, subRes, testRes] = await Promise.all([
        apiService.getTeacherClassOverview(),
        apiService.getSubjects(),
        apiService.getAssessments(),
      ]);

      if (overRes.success) setOverview(overRes.data);
      if (subRes.success) setSubjects(subRes.data);
      if (testRes.success) setAssessments(testRes.data);
    } catch (err) {
      console.error('Failed to load educator data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  return (
    <MainLayout>
      <div className="space-y-6">
        
        {/* Workspace Shell Banner */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
                  Educator Workspace — {user?.name}
                </h1>
              </div>
              <p className="text-xs text-zinc-400">
                {profile?.college || overview?.college || 'NEXOURA Institute of Technology'} • Class Performance Analytics & Learning Friction Monitoring
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Button
                variant="accent"
                size="sm"
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-1.5 shadow-md border-emerald-400/30 font-semibold"
              >
                <PlusCircle className="w-4 h-4" /> Create Test
              </Button>
              <Badge variant="success" icon={ShieldCheck}>
                ROLE: TEACHER
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/5 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Employee ID</span>
              <span className="font-bold text-white font-mono">{profile?.employee_id || 'EMP-8801'}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-emerald-500/20 bg-emerald-500/5">
              <span className="text-zinc-500 block font-medium">Institution / Campus</span>
              <span className="font-semibold text-emerald-300 truncate block">{profile?.college || overview?.college || 'NEXOURA Institute of Technology'}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Department</span>
              <span className="font-semibold text-white">{profile?.department || 'Computer Science'}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Designation</span>
              <span className="font-semibold text-emerald-400">{profile?.designation || 'Associate Professor'}</span>
            </div>
          </div>
        </div>

        {/* Live Academic Performance Metrics (FR-TEA-05) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Total Students
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono block">
              {overview?.total_students || 0}
            </span>
            <span className="text-[11px] text-zinc-500">Active in Department</span>
          </div>

          <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Class Average
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono block">
              {overview?.class_average || 0}%
            </span>
            <span className="text-[11px] text-zinc-500">Across all attempts</span>
          </div>

          <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" /> Tests Completed
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-purple-300 font-mono block">
              {overview?.total_assessments_taken || 0}
            </span>
            <span className="text-[11px] text-zinc-500">Submissions graded</span>
          </div>

          <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Focus / At-Risk
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono block">
              {overview?.at_risk_count || 0} Learners
            </span>
            <span className="text-[11px] text-zinc-500">Require intervention</span>
          </div>
        </div>

        {/* SECTION: Active Diagnostic Tests & Quizzes Management */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white tracking-tight font-heading">
                  Active Curriculum Assessments & Diagnostics
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tests created by faculty with customized questions mapped to syllabus topic benchmarks
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md border border-emerald-400/30 transition-all cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Test</span>
            </button>
          </div>

          {assessments.length === 0 ? (
            <div className="py-10 text-center space-y-3 text-zinc-400 text-xs">
              <BookOpen className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="font-semibold text-white">No active assessments found.</p>
              <p>Click "Create New Test" above to build your first customized assessment with questions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessments.map((test) => (
                <div
                  key={test.id}
                  className="p-5 rounded-2xl border border-white/5 bg-zinc-900/60 hover:bg-zinc-800/50 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] font-mono">
                        {test.subject_code} • {test.subject_name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                        {test.total_questions} Questions
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug font-heading">
                      {test.title}
                    </h4>

                    {test.description && (
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {test.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" /> {test.time_limit_minutes}m
                      </span>
                      <span>•</span>
                      <span className="font-mono">Pass: {test.passing_percentage}%</span>
                    </div>

                    <span className="text-[11px] text-emerald-400 font-semibold font-mono">
                      {test.attempts_count} Attempts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Class-Wide Learning Friction: Top Weak Topics (FR-TEA-05) */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-heading">
                <TrendingDown className="w-4 h-4 text-amber-400" />
                Institutional Learning Friction: Common Weak Topics
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Identified curriculum topics where multiple students demonstrate mastery below 60%
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              Actionable Intelligence
            </span>
          </div>

          {!overview?.top_weak_topics || overview.top_weak_topics.length === 0 ? (
            <div className="py-10 text-center space-y-2 text-zinc-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-semibold text-white">No widespread learning bottlenecks detected.</p>
              <p>As students submit assessments, topics with low average mastery will appear here automatically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {overview.top_weak_topics.map((t, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm font-heading">{t.topic_name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] font-mono border border-amber-500/30">
                      {t.students_struggling_count} Struggling
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">{t.subject_name}</p>
                  <div className="pt-2 border-t border-white/5 flex justify-between text-zinc-300">
                    <span>Average Mastery:</span>
                    <span className="font-bold text-amber-400 font-mono">{t.average_mastery}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Academic Roster & Risk Oversight (FR-TEA-01, FR-TEA-05) */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-heading">
                <Users className="w-4 h-4 text-indigo-400" />
                Student Roster & Early-Warning Risk Classification
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Authorized student list with explainable risk indicators and diagnostic records
              </p>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              {overview?.student_roster?.length || 0} Students Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 font-semibold uppercase text-[10px] bg-zinc-900/60 font-mono">
                  <th className="py-3 px-4">Student Code</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Average Score</th>
                  <th className="py-3 px-4">Weak Topics</th>
                  <th className="py-3 px-4 text-right">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {overview?.student_roster?.map((student) => (
                  <tr key={student.student_id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                      {student.student_code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white font-heading">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono">
                      {student.email}
                    </td>
                    <td className="py-3 px-4 font-bold text-white font-mono">
                      {student.average_score}%
                    </td>
                    <td className="py-3 px-4">
                      {student.weak_topics_count > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30 font-mono">
                          {student.weak_topics_count} weak
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium font-mono">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] font-mono border ${
                        student.risk_level === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : student.risk_level === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {student.risk_level} RISK
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Custom Assessment & Question Creator Modal */}
      <CreateAssessmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchTeacherData}
        subjects={subjects}
      />
    </MainLayout>
  );
}
