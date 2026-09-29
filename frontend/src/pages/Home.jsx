import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Compass,
  Layers,
  CheckCircle2,
  UserCheck,
  Lock,
  Play,
  Sparkles,
  Activity,
  Clock,
  Zap,
  Star,
  Target,
  ChevronRight,
  BarChart3,
  Code,
  Award,
  Terminal,
  Users,
  BookOpen,
  ArrowUpRight,
  Flame,
  Check
} from 'lucide-react';

export function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [activeRoleTab, setActiveRoleTab] = useState('student');
  const [interactiveQuizAnswer, setInteractiveQuizAnswer] = useState(null);
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);

  const dashboardPath = user ? `/${user.role}/dashboard` : '/login';

  const handleInstantLogin = async (email, password) => {
    setQuickLoginLoading(true);
    const res = await login(email, password);
    setQuickLoginLoading(false);
    if (res.success) {
      navigate(`/${res.user.role}/dashboard`);
    }
  };

  const curriculumHubs = [
    {
      id: 'dsa',
      code: 'CS301',
      title: 'Data Structures & Algorithms',
      category: 'core',
      department: 'Computer Science',
      semester: 'Sem 4',
      enrolled: '342 Students',
      mastery: '84%',
      badge: 'High Priority',
      badgeColor: 'amber',
      topics: ['Graph Traversal (BFS/DFS)', 'AVL & Red-Black Trees', 'Dynamic Programming', 'Dijkstra & Shortest Path'],
      gradient: 'from-indigo-500/20 via-indigo-600/10 to-transparent',
      borderColor: 'group-hover:border-indigo-500/50',
      hoverTextColor: 'group-hover:text-indigo-300',
      hoverBtnColor: 'group-hover:bg-indigo-600 group-hover:border-indigo-500',
      codeColor: 'text-indigo-300'
    },
    {
      id: 'dbms',
      code: 'CS302',
      title: 'Database Management Systems',
      category: 'systems',
      department: 'Computer Science',
      semester: 'Sem 4',
      enrolled: '298 Students',
      mastery: '78%',
      badge: 'Core Foundation',
      badgeColor: 'info',
      topics: ['ACID Transaction Concurrency', 'B+ Tree Index Optimization', '3NF & BCNF Normalization', 'Relational Algebra'],
      gradient: 'from-cyan-500/20 via-cyan-600/10 to-transparent',
      borderColor: 'group-hover:border-cyan-500/50',
      hoverTextColor: 'group-hover:text-cyan-300',
      hoverBtnColor: 'group-hover:bg-cyan-600 group-hover:border-cyan-500',
      codeColor: 'text-cyan-300'
    },
    {
      id: 'os',
      code: 'CS303',
      title: 'Operating Systems & Architecture',
      category: 'systems',
      department: 'Computer Science',
      semester: 'Sem 4',
      enrolled: '315 Students',
      mastery: '72%',
      badge: 'Friction Detected',
      badgeColor: 'warning',
      topics: ['Process Scheduling & Threads', 'Virtual Memory Paging', 'Deadlock Avoidance (Bankers)', 'Linux Virtual FS'],
      gradient: 'from-violet-500/20 via-violet-600/10 to-transparent',
      borderColor: 'group-hover:border-violet-500/50',
      hoverTextColor: 'group-hover:text-violet-300',
      hoverBtnColor: 'group-hover:bg-violet-600 group-hover:border-violet-500',
      codeColor: 'text-violet-300'
    },
    {
      id: 'ml',
      code: 'CS401',
      title: 'Machine Learning & Neural Nets',
      category: 'ai',
      department: 'AI & Data Science',
      semester: 'Sem 6',
      enrolled: '210 Students',
      mastery: '89%',
      badge: 'AI Advanced Track',
      badgeColor: 'ai',
      topics: ['Backpropagation & Loss Gradients', 'CNNs & Vision Models', 'Attention Mechanisms', 'Overfitting Regularization'],
      gradient: 'from-purple-500/25 via-violet-600/15 to-transparent',
      borderColor: 'group-hover:border-purple-500/60 shadow-glow-purple',
      hoverTextColor: 'group-hover:text-purple-300',
      hoverBtnColor: 'group-hover:bg-purple-600 group-hover:border-purple-500 shadow-glow-purple',
      codeColor: 'text-purple-300'
    },
    {
      id: 'sysdesign',
      code: 'CS405',
      title: 'Distributed Systems & Cloud',
      category: 'cloud',
      department: 'Computer Science',
      semester: 'Sem 6',
      enrolled: '185 Students',
      mastery: '81%',
      badge: 'Industry Alignment',
      badgeColor: 'success',
      topics: ['CAP Theorem & Consensus', 'Load Balancing & Caching', 'Microservice Event Brokers', 'Distributed DB Sharding'],
      gradient: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
      borderColor: 'group-hover:border-emerald-500/50',
      hoverTextColor: 'group-hover:text-emerald-300',
      hoverBtnColor: 'group-hover:bg-emerald-600 group-hover:border-emerald-500',
      codeColor: 'text-emerald-300'
    },
    {
      id: 'cyber',
      code: 'CS409',
      title: 'Applied Cryptography & Security',
      category: 'security',
      department: 'Cyber Security',
      semester: 'Sem 5',
      enrolled: '160 Students',
      mastery: '75%',
      badge: 'Specialized Track',
      badgeColor: 'live',
      topics: ['RSA & Elliptic Curve Math', 'JWT & OAuth2 Protocols', 'Memory Injection Vectors', 'Zero-Trust Architecture'],
      gradient: 'from-rose-500/20 via-rose-600/10 to-transparent',
      borderColor: 'group-hover:border-rose-500/50',
      hoverTextColor: 'group-hover:text-rose-300',
      hoverBtnColor: 'group-hover:bg-rose-600 group-hover:border-rose-500',
      codeColor: 'text-rose-300'
    }
  ];

  const filteredHubs = activeTab === 'all' 
    ? curriculumHubs 
    : curriculumHubs.filter(h => h.category === activeTab);

  const rolePreviews = {
    student: {
      title: 'Student Guidance Workspace',
      badge: 'For Undergraduates',
      description: 'Autonomous diagnostic testing, real-time friction point detection, dynamic skill trajectory radar, and automated "What Should I Do Next?" action recommendations.',
      metrics: [
        { label: 'Topic Mastery', value: '82%' },
        { label: 'Weekly Velocity', value: '+14.2%' },
        { label: 'Action Items', value: '3 Pending' },
        { label: 'Academic Risk', value: 'Low (0.12)' }
      ],
      features: [
        'Personalized diagnostic assessments with instant AI explanations',
        'Visual skill progression timeline from baseline to engineering mastery',
        'Targeted practice tasks tied directly to identified weak areas',
        'Direct career trajectory simulation for Tech Roles (SDE, DevOps, AI)'
      ],
      ctaText: 'Access Student Portal',
      loginEmail: 'student@nexoura.edu'
    },
    teacher: {
      title: 'Teacher Analytics & Intervention Console',
      badge: 'For Faculty & Mentors',
      description: 'Institutional-grade classroom intelligence. Detect student struggle patterns, monitor topic-level cohort benchmarks, and assign targeted academic intervention modules.',
      metrics: [
        { label: 'Students Tracked', value: '148 Active' },
        { label: 'Class Average', value: '76.4%' },
        { label: 'Struggle Clusters', value: 'Graph Traversal' },
        { label: 'Interventions Sent', value: '24 Modules' }
      ],
      features: [
        'Classroom-wide topic friction analytics and drop-off alerts',
        'One-click remediation module deployment to struggling clusters',
        'Diagnostic assessment authoring with automated MCQ grading',
        'Direct coordination with parents for at-risk student monitoring'
      ],
      ctaText: 'Access Teacher Console',
      loginEmail: 'teacher@nexoura.edu'
    },
    parent: {
      title: 'Parent Transparency & Guidance Portal',
      badge: 'For Families & Guardians',
      description: 'Real-time verified visibility into student academic progress, attendance indicators, learning velocity, and teacher-recommended milestone tracking.',
      metrics: [
        { label: 'Linked Student', value: 'Alex (CS Sem 4)' },
        { label: 'Term Attendance', value: '94.8%' },
        { label: 'Overall GPA', value: '3.72 / 4.0' },
        { label: 'Faculty Remarks', value: 'On Track' }
      ],
      features: [
        'Administrator-governed parent-to-student verification link',
        'Simple, transparent metric summaries without confusing academic jargon',
        'Direct notifications when personalized milestones are achieved',
        'Proactive alerts if student engagement or test scores drop below threshold'
      ],
      ctaText: 'Access Parent Portal',
      loginEmail: 'parent@nexoura.edu'
    },
    admin: {
      title: 'Administrator RBAC & Governance Suite',
      badge: 'For Dean & System Admins',
      description: 'Centralized institution administration. Enforce strict role-based access control, manage user credentials, inspect audit logs, and oversee curriculum benchmarks.',
      metrics: [
        { label: 'Registered Users', value: '1,420 Users' },
        { label: 'Active Sessions', value: '248 Live' },
        { label: 'DB Integrity', value: 'Optimal (SQLite/PG)' },
        { label: 'Auth Token TTL', value: '1,440 Mins' }
      ],
      features: [
        'Granular Role-Based Access Control (RBAC) policy enforcement',
        'Parent-Student link verification and authorization approval',
        'Comprehensive security audit logging for all authentication attempts',
        'Curriculum and assessment metadata management'
      ],
      ctaText: 'Access Admin Console',
      loginEmail: 'admin@nexoura.edu'
    }
  };

  const currentRoleData = rolePreviews[activeRoleTab];

  return (
    <MainLayout hideSidebar={true}>
      <div className="space-y-24">
        
        {/* ========================================================================= */}
        {/* HERO SECTION — Modern, Ambient, High-Impact (Hubbl-inspired)             */}
        {/* ========================================================================= */}
        <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-20 text-center max-w-5xl mx-auto space-y-8">
          
          {/* Glowing Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-glow-indigo">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
            </span>
            <span>NEXOURA 3.0 • AUTONOMOUS ACADEMIC INTELLIGENCE</span>
            <span className="text-zinc-500">•</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" /> PBL University Platform
            </span>
          </div>

          {/* Punchy Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.1]">
              Empowering Future Engineers with{' '}
              <span className="text-gradient-purple">Intelligent Guidance</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-zinc-400 font-normal leading-relaxed">
              Diagnose learning friction in real time, chart personalized skill trajectories, and synchronize <strong className="text-zinc-200">Students</strong>, <strong className="text-zinc-200">Teachers</strong>, and <strong className="text-zinc-200">Administrators</strong> in one connected ecosystem.
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to={dashboardPath}>
              <Button variant="accent" size="lg" icon={ArrowRight} className="shadow-glow-indigo text-base font-semibold px-6 py-3">
                {user ? `Open ${user.role.toUpperCase()} Workspace` : 'Launch Student Workspace'}
              </Button>
            </Link>

            <a href="#curriculum">
              <Button variant="secondary" size="lg" icon={BookOpen} className="text-base px-6 py-3">
                Explore Curriculum Hubs
              </Button>
            </a>

            {!user && (
              <Link to="/register">
                <Button variant="outline" size="lg" icon={UserCheck} className="text-base px-6 py-3">
                  Register Account
                </Button>
              </Link>
            )}
          </div>

          {/* Quick 1-Click Sandbox Persona Switcher */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="glass-panel rounded-2xl p-3.5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-zinc-300 font-medium">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant Sandbox Demo:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={quickLoginLoading}
                  onClick={() => handleInstantLogin('student@nexoura.edu', 'Password123!')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 transition-all font-semibold cursor-pointer"
                >
                  🎓 Student
                </button>
                <button
                  disabled={quickLoginLoading}
                  onClick={() => handleInstantLogin('teacher@nexoura.edu', 'Password123!')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all font-semibold cursor-pointer"
                >
                  👨‍🏫 Teacher
                </button>
                <button
                  disabled={quickLoginLoading}
                  onClick={() => handleInstantLogin('parent@nexoura.edu', 'Password123!')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all font-semibold cursor-pointer"
                >
                  👪 Parent
                </button>
                <button
                  disabled={quickLoginLoading}
                  onClick={() => handleInstantLogin('admin@nexoura.edu', 'Admin@Nexoura2026')}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition-all font-semibold cursor-pointer"
                >
                  🛡️ Admin
                </button>
              </div>
            </div>
          </div>

          {/* High-Tech Statistics Telemetry Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400">Diagnostic Benchmarks</span>
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">1,250+</div>
              <span className="text-[11px] text-emerald-400 font-medium">Verified MCQs with hints</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400">Learning Precision</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">99.4%</div>
              <span className="text-[11px] text-zinc-400 font-medium">Weak-point isolation</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400">Role Ecosystems</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">4 Roles</div>
              <span className="text-[11px] text-amber-400 font-medium">Student, Faculty, Parent, Admin</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400">Diagnostic Latency</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono">&lt; 15ms</div>
              <span className="text-[11px] text-cyan-400 font-medium">Real-time evaluation engine</span>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* BENTO GRID — Interactive Intelligence Showcase                           */}
        {/* ========================================================================= */}
        <section id="features" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="academic" icon={Sparkles} className="mb-2">
                PLATFORM INTELLIGENCE MATRIX
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                Engineered for Academic Mastery & Career Acceleration
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              Every interaction updates student knowledge graphs, refines risk scores, and delivers adaptive feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Live Assessment Diagnostic Engine (Interactive) */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 md:col-span-2 flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      LIVE INTERACTIVE DIAGNOSTIC PREVIEW
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
                    CS301 • DSA
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-heading">
                    Instant MCQ Assessment & Friction Mapping
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Try solving this diagnostic question right now to see how the system categorizes concept mastery:
                  </p>
                </div>

                {/* Interactive Question Card */}
                <div className="bg-zinc-900/90 rounded-2xl p-5 border border-white/10 space-y-4">
                  <p className="text-sm font-semibold text-zinc-200">
                    Q: Which algorithm achieves the optimal time complexity of <code className="text-indigo-400 font-mono">O((V + E) log V)</code> for finding single-source shortest paths in a non-negative weighted graph?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {[
                      { id: 'A', text: 'Floyd-Warshall Algorithm', correct: false },
                      { id: 'B', text: 'Dijkstra with Min-Heap Priority Queue', correct: true },
                      { id: 'C', text: 'Bellman-Ford Dynamic Programming', correct: false },
                      { id: 'D', text: 'Breadth-First Search (BFS)', correct: false }
                    ].map((opt) => {
                      const isSelected = interactiveQuizAnswer === opt.id;
                      const isCorrect = opt.correct;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setInteractiveQuizAnswer(opt.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between font-medium cursor-pointer ${
                            interactiveQuizAnswer
                              ? isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-glow-indigo'
                                : isSelected
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                                : 'bg-zinc-800/40 text-zinc-500 border-zinc-800'
                              : 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60 hover:bg-zinc-700/60 hover:text-white'
                          }`}
                        >
                          <span><strong>{opt.id}.</strong> {opt.text}</span>
                          {interactiveQuizAnswer && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {interactiveQuizAnswer && (
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-start gap-2 animate-in fade-in">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>
                        {interactiveQuizAnswer === 'B' 
                          ? 'Correct! Min-heap Dijkstra processes each vertex with logarithmic extraction time. System registers: DSA-GRAPH -> Mastered (+15pts).' 
                          : 'Incorrect. Min-heap Dijkstra is optimal. System detects friction in "Graph Traversal & Pathfinding" and generates a targeted revision module.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-zinc-400 border-t border-white/5 mt-4">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Auto-evaluates 40+ syllabus topics
                </span>
                <Link to={dashboardPath} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                  Take Full Diagnostic <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento Card 2: Skill Progression Radar */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-zinc-950 font-bold shadow-glow-orange">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">
                    Continuous Mastery Velocity
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Live dynamic tracker displaying mastery level across core curriculum disciplines:
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { name: 'Data Structures & Algorithms', pct: 88, color: 'bg-indigo-500', status: 'Mastered' },
                    { name: 'Database Architecture (SQL/ACID)', pct: 76, color: 'bg-cyan-500', status: 'Proficient' },
                    { name: 'Operating Systems & Concurrency', pct: 62, color: 'bg-amber-500', status: 'Focus Area' },
                    { name: 'System Design & Distributed Nodes', pct: 91, color: 'bg-emerald-500', status: 'Exemplary' }
                  ].map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-300 font-medium truncate">{skill.name}</span>
                        <span className="text-zinc-400 font-mono font-semibold">{skill.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${skill.color} transition-all duration-1000`}
                          style={{ width: `${skill.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs text-zinc-400">
                <span>Updated via real-time attempts</span>
                <span className="text-emerald-400 font-semibold font-mono">Streak: 7 Days 🔥</span>
              </div>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* CURRICULUM HUBS — Technical Subject & Test Launching (Students/Teachers) */}
        {/* Not applicable for Parents (Guardians do not take assessments)           */}
        {/* ========================================================================= */}
        {user?.role !== 'parent' ? (
          <section id="curriculum" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <Badge variant="academic" icon={BookOpen} className="mb-2">
                  CAMPUS CURRICULUM HUBS
                </Badge>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                  Explore Core Technical Domains
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                  Browse official university subjects, inspect real-time cohort diagnostic benchmarks, and launch focused assessments.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 glass-pill p-1 rounded-2xl border border-white/10 shrink-0">
                {[
                  { id: 'all', label: 'All Disciplines' },
                  { id: 'core', label: 'Algorithms & DSA' },
                  { id: 'systems', label: 'Systems & OS/DB' },
                  { id: 'ai', label: 'AI & Data Science' },
                  { id: 'cloud', label: 'Cloud Architecture' },
                  { id: 'security', label: 'Cybersecurity' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white text-zinc-950 shadow-md font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hubs Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHubs.map((hub) => (
                <div
                  key={hub.id}
                  className={`glass-panel glass-panel-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 ${hub.borderColor}`}
                >
                  {/* Background accent gradient subtle sweep */}
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${hub.gradient} rounded-full blur-3xl pointer-events-none -z-10`} />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 ${hub.codeColor || 'text-indigo-300'}`}>
                        {hub.code} • {hub.semester}
                      </span>
                      <Badge variant={hub.badgeColor} pulse={hub.badgeColor === 'warning'}>
                        {hub.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold text-white transition-colors font-heading ${hub.hoverTextColor || 'group-hover:text-indigo-300'}`}>
                        {hub.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        {hub.department}
                      </p>
                    </div>

                    {/* Syllabus Focus Topics Chips */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                        Curriculum Core Focus
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {hub.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-900/80 text-zinc-300 border border-white/5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-5 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-zinc-500 block text-[10px] font-medium">Cohort Benchmark</span>
                      <span className="font-mono font-bold text-emerald-400">{hub.mastery} Average</span>
                    </div>

                    <Link to={dashboardPath}>
                      <Button variant="secondary" size="sm" icon={ArrowRight} className={`rounded-xl text-xs group-hover:text-white transition-all ${hub.hoverBtnColor || 'group-hover:bg-indigo-600 group-hover:border-indigo-500'}`}>
                        Launch Test
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/20 bg-amber-950/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <Badge variant="warning" icon={UserCheck}>
                  GUARDIAN PORTAL ACTIVE
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  Student Progress & Performance Hub
                </h2>
                <p className="text-xs text-zinc-400 max-w-xl">
                  Subject curriculum tests and assessments are designed for student test-taking. As a parent, you have exclusive access to monitor your student's live attendance, test results, and risk scores in your dedicated workspace.
                </p>
              </div>
              <Link to="/parent/dashboard">
                <Button variant="accent" className="shrink-0 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-glow-amber">
                  Open Parent Workspace
                </Button>
              </Link>
            </div>
          </section>
        )}


        {/* ========================================================================= */}
        {/* ROLE PERSPECTIVES EXPLORER — 4 Institutional Workspaces                  */}
        {/* ========================================================================= */}
        <section className="glass-panel rounded-3xl p-8 border border-white/10 space-y-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="academic" icon={Layers} className="mb-2">
                FOUR INTEGRATED ROLES
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                One Platform. Four Tailored Perspectives.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'student', label: '🎓 Student' },
                { id: 'teacher', label: '👨‍🏫 Teacher' },
                { id: 'parent', label: '👨‍👩‍👧 Parent' },
                { id: 'admin', label: '🛡️ Admin' }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveRoleTab(role.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRoleTab === role.id
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-glow-indigo font-bold'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Role Perspective Preview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 items-center">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono block mb-1">
                  {currentRoleData.badge}
                </span>
                <h3 className="text-2xl font-bold text-white font-heading">
                  {currentRoleData.title}
                </h3>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-2xl">
                  {currentRoleData.description}
                </p>
              </div>

              {/* Capabilities checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentRoleData.features.map((feat, index) => (
                  <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  disabled={quickLoginLoading}
                  onClick={() => handleInstantLogin(currentRoleData.loginEmail, currentRoleData.loginEmail === 'admin@nexoura.edu' ? 'Admin@Nexoura2026' : 'Password123!')}
                  className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold hover:bg-slate-200 transition-all text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-indigo-600" />
                  Instant Preview as {activeRoleTab.toUpperCase()}
                </button>
                <Link to="/login">
                  <Button variant="secondary" size="md">
                    Custom Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Role Live Metrics Box */}
            <div className="bg-zinc-900/90 rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-semibold text-zinc-400">Workspace Telemetry</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE SESSION
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {currentRoleData.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-800/40 border border-white/5">
                    <span className="text-[10px] font-medium text-zinc-500 block">{m.label}</span>
                    <span className="text-base font-bold text-white font-mono mt-0.5 block">{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Protected by JWT & Institutional RBAC</span>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* LEARNING JOURNEY — 5-Stage Trajectory (Hubbl-inspired Journey)           */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="academic" icon={Compass}>
              STUDENT LEARNING LIFECYCLE
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
              From Diagnostic Baseline to Industry Mastery
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              The continuous feedback loop transforming theoretical syllabus study into proven engineering capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Baseline Assessment',
                desc: 'Take rapid diagnostic benchmarks across subject modules to establish individual baseline competencies.',
                icon: Target
              },
              {
                step: '02',
                title: 'Friction Mapping',
                desc: 'Intelligent engines pinpoint topic weaknesses and identify recurring misconception patterns.',
                icon: Cpu
              },
              {
                step: '03',
                title: 'Adaptive Actions',
                desc: 'Receive immediate "What Should I Do Next?" actions with estimated completion durations.',
                icon: Zap
              },
              {
                step: '04',
                title: 'Targeted Remediation',
                desc: 'Complete targeted micro-exercises to reinforce fragile areas and raise overall topic mastery.',
                icon: Sparkles
              },
              {
                step: '05',
                title: 'Career Launchpad',
                desc: 'Map validated skills against real industry job profiles and graduate with verifiable competence.',
                icon: Award
              }
            ].map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/10 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-zinc-700 group-hover:text-indigo-500 transition-colors">
                      {st.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors font-heading">
                    {st.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>


        {/* ========================================================================= */}
        {/* CALL TO ACTION BANNER — Futuristic High-Energy Terminal                  */}
        {/* ========================================================================= */}
        <section className="rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-zinc-950 to-violet-950/60 text-center space-y-6 shadow-glow-indigo">
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">
              JOIN THE ACADEMIC ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight">
              Ready to Accelerate Your Learning Trajectory?
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Sign up today or experience the live system directly in the interactive sandbox.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <Link to="/register">
              <Button variant="accent" size="lg" icon={ArrowRight} className="font-bold px-8 py-3 text-base shadow-glow-indigo">
                Create Free Account
              </Button>
            </Link>
            <button
              onClick={() => handleInstantLogin('student@nexoura.edu', 'Password123!')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Zap className="w-4 h-4 text-amber-400" /> Instant Student Demo
            </button>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
