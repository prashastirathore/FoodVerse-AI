import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'guest_demo_user',
    name: 'Chef Alex',
    email: 'demo_chef@foodverse.ai',
    is_demo: true,
    dietary_preferences: ['Balanced', 'High Protein'],
    daily_calorie_target: 2200,
  });
  const [token, setToken] = useState(localStorage.getItem('foodverse_token') || 'demo-token');
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    gemini_live_ai: false,
    demo_mode_active: true,
    database_mode: 'MongoDB (Native)',
  });

  const checkStatus = async () => {
    try {
      const st = await authApi.getStatus();
      setSystemStatus(st);
    } catch (err) {
      console.warn('Backend status check offline or connecting...', err);
    }
  };

  const loadUser = async () => {
    try {
      const u = await authApi.getMe();
      if (u) setUser(u);
    } catch (err) {
      console.warn('Using demo guest profile:', err);
    }
  };

  useEffect(() => {
    checkStatus();
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setToken(res.access_token);
      localStorage.setItem('foodverse_token', res.access_token);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, target = 2000) => {
    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password, daily_calorie_target: target });
      setToken(res.access_token);
      localStorage.setItem('foodverse_token', res.access_token);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const loginDemoGuest = async () => {
    setLoading(true);
    try {
      const res = await authApi.loginDemoGuest();
      setToken(res.access_token);
      localStorage.setItem('foodverse_token', res.access_token);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('foodverse_token');
    setToken('demo-token');
    setUser({
      id: 'guest_demo_user',
      name: 'Chef Alex',
      email: 'demo_chef@foodverse.ai',
      is_demo: true,
      dietary_preferences: ['Balanced'],
      daily_calorie_target: 2200,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        systemStatus,
        checkStatus,
        login,
        register,
        loginDemoGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
