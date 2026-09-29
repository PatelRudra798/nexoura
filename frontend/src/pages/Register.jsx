import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CreditCard,
  Building,
  BookOpen,
  Phone,
  Briefcase,
  AlertCircle,
  UserCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export function Register() {
  const { registerStudent, registerTeacher, registerParent } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Common Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    college: 'NEXOURA Institute of Technology',
    custom_college: '',
    is_custom_college: false,
    // Student fields
    student_id: '',
    department: '',
    course: '',
    semester: '1',
    // Teacher fields
    employee_id: '',
    designation: 'Assistant Professor',
    // Parent fields
    contact_number: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    const activeCollege = formData.is_custom_college
      ? (formData.custom_college.trim() || 'Custom Institute')
      : formData.college;

    setLoading(true);
    let res;

    if (selectedRole === 'student') {
      res = await registerStudent({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        college: activeCollege,
        student_id: formData.student_id,
        department: formData.department,
        course: formData.course,
        semester: parseInt(formData.semester, 10)
      });
    } else if (selectedRole === 'teacher') {
      res = await registerTeacher({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        college: activeCollege,
        employee_id: formData.employee_id,
        department: formData.department,
        designation: formData.designation
      });
    } else if (selectedRole === 'parent') {
      res = await registerParent({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        college: activeCollege,
        contact_number: formData.contact_number || undefined
      });
    }

    setLoading(false);

    if (res && res.success) {
      navigate(`/${res.user.role}/dashboard`, { replace: true });
    } else {
      setErrorMessage(res?.error || 'Registration failed. Please try again.');
    }
  };

  const roleDescriptions = {
    student: {
      title: 'Student Account',
      quote: 'Track your learning, build your skills and plan your engineering future.',
      icon: GraduationCap,
      color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
    },
    teacher: {
      title: 'Teacher Account',
      quote: 'Understand student progress and deploy targeted academic interventions.',
      icon: Briefcase,
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    },
    parent: {
      title: 'Parent Account',
      quote: "Stay transparently connected with your student's verified milestones.",
      icon: UserCheck,
      color: 'border-amber-500/30 bg-amber-500/10 text-amber-300'
    }
  };

  return (
    <MainLayout hideSidebar={true}>
      <div className="max-w-xl mx-auto my-10">
        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Top ambient glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-56 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center relative z-10 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-glow-indigo">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
              Join the NEXOURA Ecosystem
            </h1>
            <p className="text-xs text-zinc-400">
              Create your institutional account to access intelligent guidance services
            </p>
          </div>

          {/* Role Selection Matrix */}
          <div className="relative z-10">
            <label className="block text-xs font-semibold text-zinc-300 mb-2">Select Your Role</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'student', label: 'Student', icon: GraduationCap },
                { id: 'teacher', label: 'Teacher', icon: Briefcase },
                { id: 'parent', label: 'Parent', icon: UserCheck }
              ].map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setErrorMessage('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-indigo-400/50 shadow-glow-indigo'
                        : 'bg-zinc-900/60 text-zinc-400 border-white/10 hover:bg-zinc-800/60 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Role Explanatory Callout */}
          <div className={`p-4 rounded-2xl border text-xs ${roleDescriptions[selectedRole].color} flex items-start gap-3 relative z-10`}>
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">{roleDescriptions[selectedRole].title}</span>
              <p className="mt-0.5 opacity-90 italic">"{roleDescriptions[selectedRole].quote}"</p>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in relative z-10">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Full Legal Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Alex Student or Prof. Sarah Jenkins"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Institutional Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="student@nexoura.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Affiliated College / Institution (Tenant Scoping) */}
            <div>
              <label htmlFor="college" className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>College / Institution <span className="text-rose-400">*</span></span>
                <span className="text-[10px] text-indigo-400 font-normal">Campus Tenant Scoping</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <select
                  id="college"
                  name="college"
                  value={formData.is_custom_college ? 'CUSTOM' : formData.college}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setFormData({ ...formData, is_custom_college: true });
                    } else {
                      setFormData({ ...formData, college: e.target.value, is_custom_college: false });
                    }
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value="NEXOURA Institute of Technology">NEXOURA Institute of Technology (Main Campus)</option>
                  <option value="Apex Engineering College">Apex Engineering College</option>
                  <option value="Global Technical University">Global Technical University</option>
                  <option value="Indian Institute of Technology">Indian Institute of Technology (IIT)</option>
                  <option value="National Institute of Technology">National Institute of Technology (NIT)</option>
                  <option value="CUSTOM">➕ Other / Custom Institution...</option>
                </select>
              </div>

              {formData.is_custom_college && (
                <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                  <input
                    type="text"
                    name="custom_college"
                    required
                    placeholder="Enter your university or college name..."
                    value={formData.custom_college}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950 border border-indigo-500/50 text-white placeholder-zinc-500 focus:border-indigo-500 outline-none"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">
                    All students and teachers registered under this institution will share an isolated campus workspace.
                  </p>
                </div>
              )}
            </div>

            {/* Role Specific Fields */}
            {selectedRole === 'student' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="student_id" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Student ID Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                      <input
                        id="student_id"
                        name="student_id"
                        type="text"
                        required
                        placeholder="STU-2026-001"
                        value={formData.student_id}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="semester" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Current Semester
                    </label>
                    <select
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white outline-none focus:border-indigo-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s} className="bg-zinc-900 text-white">Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="department" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Department <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                      <input
                        id="department"
                        name="department"
                        type="text"
                        required
                        placeholder="Computer Science"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="course" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Degree Course <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                      <input
                        id="course"
                        name="course"
                        type="text"
                        required
                        placeholder="B.Tech Computer Science"
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'teacher' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="employee_id" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Employee ID <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      id="employee_id"
                      name="employee_id"
                      type="text"
                      required
                      placeholder="EMP-8801"
                      value={formData.employee_id}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Department <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      id="department"
                      name="department"
                      type="text"
                      required
                      placeholder="Computer Science"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'parent' && (
              <div>
                <label htmlFor="contact_number" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    id="contact_number"
                    name="contact_number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Security Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 outline-none"
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

              <div>
                <label htmlFor="confirm_password" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              disabled={loading}
              className="w-full py-3 text-xs font-bold shadow-glow-indigo rounded-xl mt-3"
            >
              {loading ? 'Creating NEXOURA Account...' : `Register as ${selectedRole.toUpperCase()}`}
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center pt-4 border-t border-white/5 text-xs text-zinc-400 relative z-10">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
              Sign In to NEXOURA
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
