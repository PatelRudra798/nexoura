import { API_BASE_URL } from '../utils/constants';

/**
 * NEXOURA API Service
 * Centralized HTTP client supporting JWT Authentication & Role Operations.
 */
export const apiService = {
  /**
   * Helper to perform authenticated HTTP requests
   */
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('nexoura_token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        let errorMsg = data.detail || data.message;
        if (!errorMsg) {
          if (response.status === 500) {
            errorMsg = 'Internal Server Error (500). Please ensure the backend API server is running and database is reachable.';
          } else if (response.status === 404) {
            errorMsg = 'Service endpoint not found (Status 404).';
          } else {
            errorMsg = `Request failed with status ${response.status}`;
          }
        }
        throw new Error(errorMsg);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Network request failed' };
    }
  },

  // System Health
  async getHealthStatus() {
    return this.request('/health', { method: 'GET' });
  },

  // Authentication Endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async registerStudent(studentData) {
    return this.request('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  async registerTeacher(teacherData) {
    return this.request('/auth/register/teacher', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  },

  async registerParent(parentData) {
    return this.request('/auth/register/parent', {
      method: 'POST',
      body: JSON.stringify(parentData),
    });
  },

  async getMe() {
    return this.request('/auth/me', { method: 'GET' });
  },

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  },

  // Role Protected Endpoints
  async getStudentProfile() {
    return this.request('/students/me', { method: 'GET' });
  },

  async getTeacherProfile() {
    return this.request('/teachers/me', { method: 'GET' });
  },

  async getParentProfile() {
    return this.request('/parents/me', { method: 'GET' });
  },

  async getParentLinkedStudent() {
    return this.request('/parents/my-student', { method: 'GET' });
  },

  async linkStudent(student_id) {
    return this.request('/parents/link-student', {
      method: 'POST',
      body: JSON.stringify({ student_id }),
    });
  },

  async getAdminProfile() {
    return this.request('/admin/me', { method: 'GET' });
  },

  async getAdminUsersList() {
    return this.request('/admin/users', { method: 'GET' });
  },

  // Academic & Learning Intelligence Endpoints
  async getSubjects() {
    return this.request('/academic/subjects', { method: 'GET' });
  },

  async getAssessments() {
    return this.request('/academic/tests', { method: 'GET' });
  },

  async getAssessmentDetail(id) {
    return this.request(`/academic/tests/${id}`, { method: 'GET' });
  },

  async submitAssessment(id, answers) {
    return this.request(`/academic/tests/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  async getTopicPerformance() {
    return this.request('/academic/student/performance', { method: 'GET' });
  },

  async getRecommendations() {
    return this.request('/academic/student/recommendations', { method: 'GET' });
  },

  async completeRecommendation(id) {
    return this.request(`/academic/student/recommendations/${id}/complete`, { method: 'POST' });
  },

  async getAcademicRisk() {
    return this.request('/academic/student/risk', { method: 'GET' });
  },

  async getTeacherClassOverview() {
    return this.request('/academic/teacher/overview', { method: 'GET' });
  },

  async createTeacherAssessment(assessmentData) {
    return this.request('/academic/teacher/tests', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  }
};
