import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function ProtectedRoute({ pageKey, children }) {
  const { loading, role, canAccessPage } = useAuth();

  if (loading) {
    return <div style={{ padding: '1rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!role || !canAccessPage(pageKey)) {
    // Redirect to dashboard if user doesn't have access
    return <Navigate to="/" replace />;
  }

  return children;
}
