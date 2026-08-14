'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

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
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        unsubscribeDoc = onSnapshot(userDocRef, async (userSnap) => {
          let accountType = 'individual';
          let name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';

          if (userSnap.exists()) {
            const data = userSnap.data();
            accountType = data.role || data.accountType || 'individual';
            name = data.displayName || name;
          } else {
            try {
              await setDoc(userDocRef, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: name,
                role: accountType,
                accountType: accountType,
                createdAt: new Date().toISOString()
              });
            } catch (e) {
              console.warn("Initial user doc creation notice:", e);
            }
          }

          let primaryColor = 'sky-500';
          if (accountType === 'police') primaryColor = 'rose-500';
          else if (accountType === 'burs') primaryColor = 'orange-500';

          setUser({
            id: firebaseUser.uid,
            name,
            email: firebaseUser.email || '',
            accountType,
            color: {
              text: `text-${primaryColor}`,
              bg: `bg-${primaryColor}/10`,
              border: `border-${primaryColor}/20`,
              primary: primaryColor.split('-')[0],
            }
          });
          setLoading(false);
        }, (err) => {
          console.warn("User doc listener notice:", err);
          // Fallback basic user
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            accountType: 'individual',
            color: {
              text: 'text-sky-500',
              bg: 'bg-sky-500/10',
              border: 'border-sky-500/20',
              primary: 'sky',
            }
          });
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      unsubscribeAuth();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
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
