// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/auth';
import { STORAGE_KEYS, ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!storedToken) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const { user: me } = await authApi.me();
        if (!cancelled) {
          setUser(me);
          setToken(storedToken);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    bootstrap();
    return () => { cancelled = true; };
  }, []);

  const persist = (newToken, newUser) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = useCallback(async (email, password) => {
    const { token: t, user: u } = await authApi.login(email, password);
    persist(t, u);
    return u;
  }, []);

  const register = useCallback(async (payload) => {
    const { token: t, user: u } = await authApi.register(payload);
    persist(t, u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const { user: me } = await authApi.me();
    setUser(me);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(me));
    return me;
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === ROLES.ADMIN,
    isMother: user?.role === ROLES.PREGNANT_MOTHER,
    isCaregiver: user?.role === ROLES.CAREGIVER,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}