import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCurrentUser } from '@/apis';
import { TOKEN_STORAGE_KEY } from '@/constants';
import { useGetCurrentUser } from '@/react-query/queriesAndMutations';
import { User } from '@/types';

export type AuthContextType = {
  user: User | undefined;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const {data: user, isError} = useGetCurrentUser();

  useEffect(() => {
    if (isError) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      navigate('/');
    }
  }, [isError, navigate]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);