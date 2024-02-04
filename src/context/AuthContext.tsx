import React, {createContext, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';

export const INITIAL_USER = {
  id: '',
  username: '',
  email: '',
  name: '',
  imageUrl: '',
  bio: '',
};

export const INITIAL_AUTH_STATE = {
  isAuthenticated: false,
  isLoading: false,
  user: INITIAL_USER,
  setIsAuthenticated: () => {},
  setUser: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_AUTH_STATE);

function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser();

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          username: currentAccount.name,
          email: currentAccount.email,
          name: currentAccount.name,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('checkAuthUser', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    setIsAuthenticated,
    setUser,
    checkAuthUser,
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem('cookieFallback');
    // || cookieFallback === null || cookieFallback === undefined
    if (cookieFallback === '[]' || cookieFallback === null || cookieFallback === undefined) {
      navigate('/sign-in');
    }
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);