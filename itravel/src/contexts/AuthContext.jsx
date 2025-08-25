import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  const signUpNewUser = async (email, password) => {
    console.log('email:', email, 'password:', password);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.error('errore nella registrazione', error);
      return { success: false, error };
    }
    return { success: true };
  };

  const loginUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error('errore nel login', error);
        return { success: false, error: error.message };
      }

      console.log('succeso nel login', data);
      return { success: true, data: data };
    } catch (error) {
      console.error('errore nel login ', error);
    }
  };

  const logout = async () => {
    console.log('si prova ');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('errore');
    }
    console.log('tutto bene');
    setSession(null);
    setProfile(null);
    localStorage.removeItem('userProfile');
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);

      return { success: true };
    } catch (error) {
      console.error('Errore logout:', error);
      return { success: false, error: error.message };
    }
  };

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    const currentUser = await supabase.auth.getUser();
    setSession(currentSession.data.session);
    setUser(currentUser);
  };

  const fetchProfile = async (userId) => {
    try {
      const newProfile = await getProfile(userId);

      setProfile(newProfile);
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      return newProfile;
    } catch (error) {
      console.error('errore fetching new profile', error);
      throw error;
    }
  };
  const updateUserProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };
  useEffect(() => {
    setLoading(true);
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    fetchSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session != null) {
          fetchProfile(session.user.id);
        } else {
          localStorage.removeItem('userProfile');
          setProfile(null);
        }
      },
    );
    setLoading(false);
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  const value = {
    session,
    user,
    profile,
    logout,
    loading,
    loginUser,
    updateUserProfile,
    signUpNewUser,
    signOut,
    isAuthenticated: !!session,
    userId: session?.user?.id || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
