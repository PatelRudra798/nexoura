import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { InsightCard } from '../components/ui/InsightCard';
import { Timeline } from '../components/ui/Timeline';
import { RecommendationCard } from '../components/ui/RecommendationCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { useHealthCheck } from '../hooks/useHealthCheck';
import {
  GraduationCap,
  Activity,
  Compass,
  Briefcase,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Clock,
  Award,
  Layers
} from 'lucide-react';

export function Dashboard() {
  const { healthData, loading, refresh } = useHealthCheck();
  const [activeTab, setActiveTab] = useState('guidance');

  const tabs = [
    { id: 'guidance', label: 'Academic Guidance', icon: Compass },
    { id: 'journey', label: 'Visual Learning Journey', icon: Activity },
    { id: 'career', label: 'Career Trajectory Roadmap', icon: Briefcase },
    { id: 'system', label: 'Architecture & System Health', icon: Layers }
  ];

  // "What Should I Do Next?" Tasks
  const dailyFocusTasks = [
    {
      title: 'Revise Graph Traversal Algorithms',
      description: 'Focus on Depth-First Search vs Breadth-First Search time complexity bottlenecks.',
      subject: 'Data Structures & Algorithms',
      estimatedTime: '20 mins'
    },
    {
      title: 'Complete 10 SQL Subquery MCQs',
      description: 'Practice nested subqueries and correlated inner join optimizations.',
      subject: 'Database Systems',
      estimatedTime: '15 mins'
    },
    {
      title: 'Review Operating System Deadlock Conditions',
      description: 'Analyze Bankers Algorithm resource allocation matrix sample problem.',
      subject: 'Operating Systems',
      estimatedTime: '15 mins'
    }
  ];

  // Visual Learning Journey Steps
  const learningJourneySteps = [
    { title: 'Foundation', subtitle: 'Core Data Structures', status: 'completed' },
    { title: 'Practice', subtitle: 'Linear Searching & Sorting', status: 'completed' },
    { title: 'Weak Area Detected', subtitle: 'Graph Algorithms Bottleneck', status: 'warning' },
    { title: 'Targeted Practice', subtitle: 'Adjacency List Exercises', status: 'current' },
    { title: 'Reassessment', subtitle: 'Adaptive Benchmark Test', status: 'upcoming' },
    { title: 'Mastery', subtitle: 'Advanced Graph Theory', status: 'upcoming' },
    { title: 'Next Challenge', subtitle: 'Dynamic Programming', status: 'upcoming' }
  ];

  // Subject Performance Diagnostics
  const subjectDiagnostics = [
    {
      subject: 'Mathematics (Graph Theory)',
      performance: 75,
      trend: 'improving',
      focusArea: 'Graph Algorithms & Trees',
      recommendedAction: 'Complete 15 practice questions on BFS/DFS traversal'
    },
    {
      subject: 'Database Management Systems',
      performance: 64,
      trend: 'declining',
      focusArea: 'Index Optimization & Joins',
      recommendedAction: 'Review Execution Plan analysis & B-Tree indexes'
    },
    {
      subject: 'Object-Oriented Architecture',
      performance: 88,
      trend: 'stable',
      focusArea: 'Design Patterns & SOLID',
      recommendedAction: 'Maintain current revision cadence with case studies'
    }
  ];

  // Career Roadmap Progression Steps
  const careerSteps = [
    { title: 'Current Position', label: '2nd Year Computer Science Student', status: 'done' },
    { title: 'Core Competencies', label: 'Python, SQL, Data Structures', status: 'done' },
    { title: 'Target Skill Gaps', label: 'FastAPI, Docker & Async Architecture', status: 'active' },
    { title: 'Capstone Projects', label: 'Full-Stack EdTech Architecture Platform', status: 'upcoming' },
    { title: 'Industry Certification', label: 'Cloud Architecture Associate', status: 'upcoming' },
    { title: 'Industry Internship', label: 'Software Engineering Trainee', status: 'upcoming' },
    { title: 'Technical Interview', label: 'System Design & Problem Solving', status: 'upcoming' },
    { title: 'Career Goal', label: 'Full-Stack Software Architect', status: 'goal' }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        
        {/* Dashboard Academic Header */}
        <div className="bg-white rounded-xl border border-edu-border p-6 shadow-edu-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-5 h-5 text-edu-blue" />
                <h1 className="text-xl font-bold text-edu-navy tracking-tight">
                  Smart Education & Student Guidance Platform
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs text-edu-subtle">
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Project foundation successfully connected.
                </span>
                <span>Student ID: EDU-2026-8801</span>
                <span>Semester IV — Computer Engineering</span>
              </div>
            </div>

            <button
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-edu-border text-xs font-semibold text-edu-navy bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer self-start md:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Polling API...' : 'Refresh Health'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: Academic Guidance (Main Dashboard View) */}
        {activeTab === 'guidance' && (
          <div className="space-y-6">
            
            {/* Major Feature 1: "What Should I Do Next?" Priority Focus Engine */}
            <RecommendationCard tasks={dailyFocusTasks} />

            {/* Information Design: Diagnostics Matrix */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-edu-navy flex items-center gap-2">
                  <Activity className="w-4 h-4 text-edu-blue" />
                  Subject Academic Performance & Action Matrix
                </h3>
                <span className="text-xs text-edu-subtle">Updated real-time from academic records</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {subjectDiagnostics.map((item, idx) => (
                  <InsightCard key={idx} {...item} />
                ))}
              </div>
            </div>

            {/* Academic Risk Alert Banner */}
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-900">Academic Risk Alert Indicator ⚠️</h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Database Management Systems shows a declining trend in B-Tree index optimization. Completing the recommended action will prevent midterm performance drop.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Visual Learning Journey */}
        {activeTab === 'journey' && (
          <div className="space-y-6">
            <Timeline steps={learningJourneySteps} />

            <div className="bg-white rounded-lg border border-edu-border p-6 shadow-edu-sm">
              <h3 className="text-base font-semibold text-edu-navy mb-3">Active Pathway Analysis</h3>
              <p className="text-xs text-edu-subtle leading-relaxed mb-4">
                The Visual Learning Journey engine tracks your progression across foundational concepts, practice milestones, detected weak areas, and reassessments.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-edu-subtle font-medium block">Completed Foundations</span>
                  <span className="text-lg font-bold text-edu-navy">4 Concepts</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-edu-subtle font-medium block">Current Focus Milestone</span>
                  <span className="text-lg font-bold text-edu-blue">Adjacency Lists</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-edu-subtle font-medium block">Target Mastery Score</span>
                  <span className="text-lg font-bold text-emerald-700">85%+</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Career Trajectory Roadmap */}
        {activeTab === 'career' && (
          <div className="bg-white rounded-lg border border-edu-border p-6 shadow-edu-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-edu-navy">Career Trajectory Roadmap</h3>
              <p className="text-xs text-edu-subtle mt-0.5">
                Visual alignment linking current academic performance directly to industry software engineering milestones
              </p>
            </div>

            <div className="space-y-3">
              {careerSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3.5 rounded border transition-colors ${
                    step.status === 'done'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : step.status === 'active'
                      ? 'bg-blue-50/80 border-blue-300 text-edu-navy ring-1 ring-blue-200'
                      : step.status === 'goal'
                      ? 'bg-slate-900 text-white border-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                      step.status === 'done'
                        ? 'bg-emerald-600 text-white'
                        : step.status === 'active'
                        ? 'bg-edu-blue text-white'
                        : step.status === 'goal'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-semibold block">{step.title}</span>
                      <span className="text-xs opacity-90">{step.label}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-current opacity-80">
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Architecture & Backend Health Check Status */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-lg border border-edu-border p-6 shadow-edu-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-edu-navy flex items-center gap-2">
                <Layers className="w-5 h-5 text-edu-blue" />
                Backend Endpoint & Database Connectivity Diagnostics
              </h3>
              <p className="text-xs text-edu-subtle mt-0.5">
                Real-time API response data fetched directly from <code>GET /api/health</code>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatusIndicator
                status={healthData?.status || 'offline'}
                label="FastAPI Backend Service"
                details={healthData?.message || 'Attempting connection to backend service'}
              />

              <StatusIndicator
                status={healthData?.database_status || 'offline'}
                label="PostgreSQL Database Connection"
                details={healthData?.database_details || 'Database connection status check pending'}
              />
            </div>

            {/* Raw JSON Payload Inspector */}
            <div className="bg-slate-900 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400">Response Payload — GET /api/health</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                  {healthData ? '200 OK' : 'FETCHING...'}
                </span>
              </div>
              <pre className="text-xs font-mono text-emerald-300 bg-slate-950 p-3 rounded overflow-x-auto border border-slate-800">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
