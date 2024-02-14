import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCurrentUser } from '@/apis';
import { TOKEN_STORAGE_KEY } from '@/constants';
import { User } from '@/types';

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User|null>(null);

  const checkAuth = async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
        return;
      }
    } 
    navigate('/');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return <AuthContext.Provider value={{user, setUser}}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);