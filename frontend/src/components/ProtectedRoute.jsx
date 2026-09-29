import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RefreshCw } from 'lucide-react';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-edu-bg flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-lg border border-edu-border shadow-edu-sm">
          <RefreshCw className="w-5 h-5 text-edu-blue animate-spin" />
          <span className="text-sm font-semibold text-edu-navy">Authenticating NEXOURA Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated user to login while saving target path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect user to their assigned role dashboard if attempting unauthorized URL
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
}
