import { type UseQueryResult } from '@tanstack/react-query';
import React, { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

import { useGetPosts } from '@/react-query/queriesAndMutations';
import { GlobalState, IPostPreview } from '@/types';

const INITIAL_GLOBAL_STATE: GlobalState = {
  home: {
    currentTab: 'for-you',
    setCurrentTab: () => {},
    for_you: {
      queryResults: {} as UseQueryResult<IPostPreview[] | undefined, Error>,
      scrollY: 0,
      setScrollY: () => {},
    },
    following: {
      queryResults: {} as UseQueryResult<IPostPreview[] | undefined, Error>,
      scrollY: 0,
      setScrollY: () => {},
    }
  },
  globalScrollY: 0,
  setGlobalScrollY: () => {},
};

const GlobalContext = createContext(INITIAL_GLOBAL_STATE);

function GlobalContextProvider({children}: {children: ReactNode}) {
  const [currentTab, setCurrentTab] = useState<GlobalState['home']['currentTab']>('for-you');
  const [globalScrollY, setGlobalScrollY] = useState(0);
  const [followingScrollY, setFollowingScrollY] = useState(0);
  const following_query_results = useGetPosts();
  const context = {...INITIAL_GLOBAL_STATE};
  context.home.currentTab = currentTab;
  context.home.setCurrentTab = setCurrentTab;
  context.home.following.queryResults = following_query_results;
  context.globalScrollY = globalScrollY;
  context.setGlobalScrollY = setGlobalScrollY;
  context.home.following.scrollY = followingScrollY;
  context.home.following.setScrollY = setFollowingScrollY;

  return (
    <GlobalContext.Provider value={context}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalContextProvider;