// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Usage:
 *   <Route element={<ProtectedRoute />}>                      // any logged-in user
 *   <Route element={<ProtectedRoute allowed={['Admin']} />}>  // admin only
 */
export default function ProtectedRoute({ allowed }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowed && allowed.length > 0 && !allowed.includes(user.role)) {
    // Redirect to the correct home for their role
    const fallback = user.role === 'Admin' ? '/admin' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}