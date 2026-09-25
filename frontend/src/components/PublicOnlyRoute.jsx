// src/components/PublicOnlyRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function PublicOnlyRoute() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  if (isAuthenticated) {
    const home = user.role === 'Admin' ? '/admin' : '/dashboard';
    return <Navigate to={home} replace />;
  }
  return <Outlet />;
}