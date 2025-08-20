import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);

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
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <AuthContext.Provider
      value={{ session, signUpNewUser, signOut, loginUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
