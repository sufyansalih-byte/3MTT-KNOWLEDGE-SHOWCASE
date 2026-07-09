import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database';

interface SignUpExtra {
  institution?: string;
  matric_number?: string;
  department?: string;
  industry?: string;
  cac_number?: string;
  contact_name?: string;
  state?: string;
  city?: string;
  description?: string;
  website?: string;
  address?: string;
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: 'student' | 'organization',
    extra?: SignUpExtra
  ) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (userId: string, email: string) => {
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error loading profile:', profileError);
      return;
    }

    if (data) {
      setUser({ id: userId, email });
      setProfile(data as Profile);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email || '');
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUp = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    role: 'student' | 'organization',
    extra?: SignUpExtra
  ): Promise<{ error: string | null }> => {
    setError(null);
    setLoading(true);

    if (!email || !password || !fullName) {
      const msg = 'All fields are required';
      setError(msg);
      setLoading(false);
      return { error: msg };
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters';
      setError(msg);
      setLoading(false);
      return { error: msg };
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return { error: signUpError.message };
    }

    const newUserId = authData.user?.id;
    if (!newUserId) {
      const msg = 'Could not create user. Please try again.';
      setError(msg);
      setLoading(false);
      return { error: msg };
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: newUserId,
      email: email.toLowerCase(),
      full_name: fullName,
      role,
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return { error: profileError.message };
    }

    if (role === 'organization') {
const { error: orgError } = await supabase.from('organizations').insert({
        profile_id: newUserId,
        name: fullName,
        industry: extra?.industry || null,
        cac_number: extra?.cac_number || null,
        contact_name: extra?.contact_name || null,
        state: extra?.state || null,
        city: extra?.city || null,
        description: extra?.description || null,
        website: extra?.website || null,
        address: extra?.address || null,
        is_verified: false,
      });
      if (orgError) {
        setError(orgError.message);
        setLoading(false);
        return { error: orgError.message };
      }
    } else {
      const { error: studentError } = await supabase.from('students').insert({
        profile_id: newUserId,
        institution: extra?.institution || '',
        matric_number: extra?.matric_number || null,
        department: extra?.department || null,
        state: extra?.state || null,
        skills: [],
      });
      if (studentError) {
        setError(studentError.message);
        setLoading(false);
        return { error: studentError.message };
      }
    }

    await loadProfile(newUserId, email.toLowerCase());
    setLoading(false);
    return { error: null };
  }, [loadProfile]);

  const signIn = useCallback(async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    setError(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return { error: signInError.message };
    }

    if (data.user) {
      await loadProfile(data.user.id, data.user.email || '');
    }

    setLoading(false);
    return { error: null };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, error, signUp, signIn, signOut }}
    >
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
