import { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile, supabase } from '../lib/supabase';
import { setServers } from 'dns';
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setIsLoading] = useState(true);
  //signup
  const signUpNewUser = async (email, password) => {
    console.log('email:', email, 'password:', password);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.error('errore nella registrazione', error);
      return { sucess: false, error };
    }
  };
  /* login */
  const loginUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error('errore nel login', error);
        return { succes: false, error: error.message };
      }
      if (data.user) {
        await loadUserProfile(data.user.id);
      }
      console.log('succeso nel login', data);
      return { success: true, data: data };
    } catch (error) {
      console.error('errore nel login ', error);
    }
  };

  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error('errore signing out', error);
      return { sucess: false, error };
    }
    setServers(null);
    setUserProfile(null);
  };

  const loadUserProfile = async (authId) => {
    try {
      const profile = await getUserProfile(authId);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('errore caricemanto profiel', error);
      setUserProfile(null);
      return null;
    }
  };

  const updateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };
  const hasCompletedProfile = () => {
    return (
      userProfile &&
      userProfile.first_name &&
      userProfile.last_name &&
      userProfile.username
    );
  };

  useEffect(() => {
    /* inizia la sessione */
    const getInitialSession = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Errore recupero sessione:', error);
        } else {
          setSession(initialSession);
          /* se è già presente carica il profile */
          if (initialSession?.user) {
            await loadUserProfile(initialSession.user.id);
          }
        }
      } catch (error) {
        console.error('Errore inizializzazione auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      /* handle del prifilo quando c'è login o logout */
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }

      if (event === 'INITIAL_SESSION') {
        setIsLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  const value = {
    session,
    userProfile,
    loading,
    loginUser,
    signUpNewUser,
    signOut,
    loadUserProfile,
    updateProfile,
    hasCompletedProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
