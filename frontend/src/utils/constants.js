export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const SYSTEM_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  PARENT: 'parent',
  ADMIN: 'admin'
};

export const ACADEMIC_STATUS = {
  EXCELLENT: { label: 'Optimal Progress', icon: '✅', color: 'text-edu-emerald bg-emerald-50 border-emerald-200' },
  NEEDS_ATTENTION: { label: 'Attention Required', icon: '⚠️', color: 'text-edu-amber bg-amber-50 border-amber-200' },
  AT_RISK: { label: 'High Risk Alert', icon: '🚨', color: 'text-edu-crimson bg-red-50 border-red-200' }
};
