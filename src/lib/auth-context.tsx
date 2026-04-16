'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import type { UserProfile, Supplier } from '@/lib/types';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  supplier: Supplier | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string, role: string, username: string, supplierProfile?: UserProfile['supplierProfile']) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  const { users, suppliers, addUser, getUserByEmail } = useAppStore();

  const loadProfile = useCallback((userId: string) => {
    const foundProfile = users.find(u => u.email === userId || u.id === userId) || null;
    setProfile(foundProfile);
    if (foundProfile && foundProfile.role === 'supplier') {
      const foundSupplier = suppliers.find(s => s.userId === foundProfile.id) || null;
      setSupplier(foundSupplier);
    } else {
      setSupplier(null);
    }
  }, [users, suppliers]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        loadProfile(initialSession.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        loadProfile(newSession.user.id);
      } else {
        setProfile(null);
        setSupplier(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message === 'Invalid login credentials'
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        : error.message };
    }
    return { error: null };
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: string,
    username: string,
    supplierProfile?: UserProfile['supplierProfile']
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      if (error.message.includes('already registered')) {
        return { error: 'هذا البريد الإلكتروني مسجل بالفعل' };
      }
      return { error: error.message };
    }

    // Create profile in local store
    const newUser: UserProfile = {
      id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
      username,
      displayName,
      email,
      role: role as 'admin' | 'supplier' | 'user',
      supplierStatus: role === 'supplier' ? 'pending' : undefined,
      createdAt: new Date().toISOString(),
      supplierProfile: role === 'supplier' ? supplierProfile : undefined,
    };

    addUser(newUser);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSupplier(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, supplier, loading, signIn, signUp, signOut }}>
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
