'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACCOUNT_TYPES } from '@/lib/account-types';

interface User {
  id: string;
  name: string;
  email: string;
  accountType: string;
  color: {
    text: string;
    bg: string;
    border: string;
    primary: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a logged in user with a random account type for demonstration
    // In a real app, this would come from Firebase or an API
    
    const initializeAuth = () => {
      const savedType = localStorage.getItem('mock_account_type') || 'individual';
      const type = ACCOUNT_TYPES.find(t => t.id === savedType) || ACCOUNT_TYPES[0];
      
      const colorParts = type.color.split(' ');
      const textClass = colorParts.find(p => p.startsWith('text-')) || 'text-sky-500';
      const bgClass = colorParts.find(p => p.startsWith('bg-')) || 'bg-sky-500/10';
      const borderClass = colorParts.find(p => p.startsWith('border-')) || 'border-sky-500/20';
      
      const primaryColor = textClass.split('-')[1];

      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        accountType: type.id,
        color: {
          text: textClass,
          bg: bgClass,
          border: borderClass,
          primary: primaryColor,
        }
      });
      setLoading(false);
    };

    // Use a small timeout to avoid synchronous setState in effect warning
    const timer = setTimeout(initializeAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_account_type');
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
