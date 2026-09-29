import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { RecommendationCard } from '../../components/ui/RecommendationCard';
import { Timeline } from '../../components/ui/Timeline';
import { TestModal } from '../../components/academic/TestModal';
import { apiService } from '../../services/api';
import {
  GraduationCap,
  BookOpen,
  Clock,
  Activity,
  Award,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Play,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const profile = user?.student_profile;

  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [topicPerformance, setTopicPerformance] = useState([]);
  const [riskProfile, setRiskProfile] = useState(null);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [activeTestId, setActiveTestId] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [assRes, recRes, perfRes, riskRes] = await Promise.all([
        apiService.getAssessments(),
        apiService.getRecommendations(),
        apiService.getTopicPerformance(),
        apiService.getAcademicRisk(),
      ]);

      if (assRes.success) setAssessments(assRes.data);
      if (recRes.success) setRecommendations(recRes.data);
      if (perfRes.success) setTopicPerformance(perfRes.data);
      if (riskRes.success) setRiskProfile(riskRes.data);
    } catch (err) {
      console.error('Failed to load student dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCompleteRecommendation = async (recId) => {
    const res = await apiService.completeRecommendation(recId);
    if (res.success) {
      fetchDashboardData();
    }
  };

  const handleOpenTest = (testId) => {
    setActiveTestId(testId);
  };

  const handleAssessmentCompleted = () => {
    fetchDashboardData();
  };

  // Split topics into weak and mastered
  const weakTopics = topicPerformance.filter((t) => t.is_weak);
  const masteredTopics = topicPerformance.filter((t) => t.status === 'mastered');
  const moderateTopics = topicPerformance.filter((t) => t.status === 'moderate');

  // Dynamic Timeline steps based on real activity
  const timelineSteps = [
    { title: 'Curriculum Baseline', subtitle: 'Subjects Enrolled', status: 'completed' },
    {
      title: 'Diagnostic Benchmark',
      subtitle: assessments.some((a) => a.attempts_count > 0) ? 'Completed' : 'Pending',
      status: assessments.some((a) => a.attempts_count > 0) ? 'completed' : 'current'
    },
    {
      title: 'Weak Areas Detection',
      subtitle: weakTopics.length > 0 ? `${weakTopics.length} Focus Area(s)` : 'Optimal',
      status: weakTopics.length > 0 ? 'warning' : 'completed'
    },
    {
      title: 'Targeted Guidance',
      subtitle: recommendations.length > 0 ? `${recommendations.length} Action Items` : 'Clear',
      status: recommendations.length > 0 ? 'current' : 'upcoming'
    },
    {
      title: 'Reassessment & Progress',
      subtitle: assessments.some((a) => a.attempts_count > 1) ? 'Verified' : 'Next Step',
      status: assessments.some((a) => a.attempts_count > 1) ? 'completed' : 'upcoming'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        
        {/* Workspace Shell Banner */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
                  Student Workspace — {user?.name}
                </h1>
              </div>
              <p className="text-xs text-zinc-400">
                {profile?.college || 'NEXOURA Institute of Technology'} • Real-Time Learning Intelligence & Diagnostics
              </p>
            </div>
            
            {/* Risk Indicator Badge & Details Trigger */}
            <div className="flex items-center gap-2.5">
              {riskProfile && (
                <button
                  type="button"
                  onClick={() => setShowRiskModal(true)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    riskProfile.risk_level === 'HIGH'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25 shadow-glow-orange'
                      : riskProfile.risk_level === 'MEDIUM'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>RISK: {riskProfile.risk_level}</span>
                  <Info className="w-3.5 h-3.5 opacity-70" />
                </button>
              )}
              <Badge variant="academic" icon={UserCheck}>
                ROLE: STUDENT
              </Badge>
            </div>
          </div>

          {/* Student Profile Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-white/5 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Student ID</span>
              <span className="font-bold text-white font-mono">{profile?.student_id || 'STU-2026-001'}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-indigo-500/20 bg-indigo-500/5">
              <span className="text-zinc-500 block font-medium">Institution / Campus</span>
              <span className="font-semibold text-indigo-300 truncate block">{profile?.college || 'NEXOURA Institute of Technology'}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Department</span>
              <span className="font-semibold text-white truncate block">{profile?.department || 'Computer Science'}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Attendance Rate</span>
              <span className="font-bold text-emerald-400 font-mono">{riskProfile?.attendance_percentage || 88}%</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block font-medium">Current Semester</span>
              <span className="font-bold text-indigo-400 font-mono">Semester {profile?.semester || 4}</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Assessments Center */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-heading">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Diagnostic & Benchmark Assessments
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Take verified curriculum tests to map your topic strengths and trigger targeted guidance
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
              {assessments.length} Tests Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((test) => {
              const hasTaken = test.attempts_count > 0;
              const passed = test.last_score !== null && test.last_score >= test.passing_percentage;

              return (
                <div
                  key={test.id}
                  className="p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all bg-zinc-900/60 flex flex-col justify-between space-y-4 group hover:bg-zinc-800/50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs gap-1.5 flex-wrap">
                      <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] font-mono">
                        {test.subject_code} • {test.subject_name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {test.college && (
                          <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {test.college}
                          </span>
                        )}
                        {hasTaken && (
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
                            passed
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}>
                            Score: {test.last_score}%
                          </span>
                        )}
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug font-heading">
                      {test.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {test.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> {test.time_limit_minutes} mins
                      </span>
                      <span>•</span>
                      <span>{test.total_questions} Questions</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenTest(test.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                        hasTaken
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                          : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 shadow-glow-indigo'
                      }`}
                    >
                      {hasTaken ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" /> Retake
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" /> Take Test
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature 1: Personalized Action Engine */}
        <RecommendationCard
          tasks={recommendations}
          onCompleteTask={handleCompleteRecommendation}
          onRefresh={fetchDashboardData}
          onStartPractice={(task) => {
            const matchingTest = assessments.find((a) =>
              a.subject_name.toLowerCase().includes(task.subject_name?.toLowerCase() || '')
            );
            if (matchingTest) {
              handleOpenTest(matchingTest.id);
            } else if (assessments.length > 0) {
              handleOpenTest(assessments[0].id);
            }
          }}
        />

        {/* Feature 2: Topic Performance & Weak Area Radar */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-2">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-heading">
                <Activity className="w-4 h-4 text-indigo-400" />
                Topic-Level Mastery & Weak Focus Areas
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Evaluated from your diagnostic submissions (Threshold: &lt;60% triggers remedial recommendation)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Mastered ({masteredTopics.length})
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Weak ({weakTopics.length})
              </span>
            </div>
          </div>

          {topicPerformance.length === 0 ? (
            <div className="py-10 text-center space-y-2 text-zinc-400 text-xs">
              <Info className="w-6 h-6 text-zinc-500 mx-auto" />
              <p className="font-semibold text-white">No topic performance records yet.</p>
              <p>Complete a diagnostic test above to populate your topic mastery matrix.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {topicPerformance.map((topic) => {
                const isWeak = topic.is_weak;
                const isMastered = topic.status === 'mastered';

                return (
                  <div
                    key={topic.id}
                    className={`p-4 rounded-2xl border text-xs flex flex-col justify-between space-y-3 transition-all ${
                      isWeak
                        ? 'border-amber-500/30 bg-amber-500/5'
                        : isMastered
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-white/5 bg-zinc-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] text-zinc-400 uppercase">
                          {topic.topic_code}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isWeak
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : isMastered
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700/50'
                        }`}>
                          {isWeak ? 'WEAK FOCUS' : isMastered ? 'OPTIMAL' : 'MODERATE'}
                        </span>
                      </div>
                      <h5 className="font-bold text-white leading-snug font-heading">
                        {topic.topic_name}
                      </h5>
                      <span className="text-[11px] text-zinc-400">{topic.subject_name}</span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
                        <span>Mastery</span>
                        <span className="font-mono">{topic.mastery_percentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isWeak ? 'bg-amber-500' : isMastered ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${Math.min(100, topic.mastery_percentage)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-500 text-right font-mono">
                        {topic.correct_answers} / {topic.total_questions_attempted} correct
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Feature 3: Visual Learning Journey Progression */}
        <Timeline steps={timelineSteps} />

      </div>

      {/* Interactive Test Modal */}
      {activeTestId && (
        <TestModal
          assessmentId={activeTestId}
          isOpen={Boolean(activeTestId)}
          onClose={() => setActiveTestId(null)}
          onAssessmentCompleted={handleAssessmentCompleted}
        />
      )}

      {/* Explainable Risk Factors Modal */}
      {showRiskModal && riskProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl w-full max-w-lg space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white font-heading">Explainable Academic Risk Assessment</h3>
              </div>
              <button
                onClick={() => setShowRiskModal(false)}
                className="text-zinc-400 hover:text-white font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-zinc-300">
              <p className="text-zinc-400 leading-relaxed">
                NEXOURA continuously evaluates your academic risk using transparent multi-factor indicators. This is a guidance signal designed to support early intervention, not a penalty.
              </p>

              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 grid grid-cols-2 gap-2 text-center">
                <div>
                  <span className="text-zinc-500 block text-[11px]">Current Classification</span>
                  <span className={`text-base font-bold font-mono mt-0.5 block ${
                    riskProfile.risk_level === 'HIGH'
                      ? 'text-rose-400'
                      : riskProfile.risk_level === 'MEDIUM'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {riskProfile.risk_level} RISK
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Risk Score Index</span>
                  <span className="text-base font-bold text-white font-mono mt-0.5 block">{riskProfile.risk_score} / 100</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px] font-heading">
                  Contributing Analytical Factors:
                </h5>
                <ul className="space-y-2">
                  {riskProfile.contributing_factors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-900/60 border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowRiskModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
