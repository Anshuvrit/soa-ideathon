import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setStatus('unauthenticated');
      return;
    }
    try {
      const res = await client.get('/auth/me');
      setUser(res.data.user);
      setStatus('authenticated');
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function sendOtp(email) {
    await client.post('/auth/send-otp', { email });
  }

  async function verifyOtp(email, otp) {
    const res = await client.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    setStatus('authenticated');
    return res.data.user;
  }

  function signOut() {
    localStorage.removeItem('token');
    setUser(null);
    setStatus('unauthenticated');
  }

  // Call after profile save / team changes that affect req.user-derived fields
  function refreshUser() {
    return loadUser();
  }

  return (
    <AuthContext.Provider value={{ user, status, sendOtp, verifyOtp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
