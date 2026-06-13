import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
  verifyAdmin: (password: string) => Promise<boolean>;
  exitAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Actually, we could have a /me endpoint but refresh token logic in api.ts 
          // already handles the persistence. For now let's assume if token exists we are logged in 
          // or we just try to fetch a dummy protected route.
          // In a real app, I'd fetch user info here.
          setUser(JSON.parse(localStorage.getItem('user') || 'null'));
        } catch (error) {
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };
    checkAuth();
    
    // Check admin session from local storage? Requirement says password check.
    const adminSession = sessionStorage.getItem('isAdmin');
    if (adminSession === 'true') setIsAdmin(true);
  }, []);

  const login = async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify({ _id: data._id, username: data.username }));
    setUser({ _id: data._id, username: data.username });
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isAdmin');
    setUser(null);
    setIsAdmin(false);
  };

  const verifyAdmin = async (password: string) => {
    try {
      const { data } = await api.post('/auth/verify-admin', { password });
      if (data.success) {
        setIsAdmin(true);
        sessionStorage.setItem('isAdmin', 'true');
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const exitAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, verifyAdmin, exitAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
