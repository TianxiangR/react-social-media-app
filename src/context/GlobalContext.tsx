import { Dialog, Drawer } from '@mui/material';
import { InfiniteData, UseInfiniteQueryResult, type UseQueryResult } from '@tanstack/react-query';
import React, { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { set } from 'zod';

import PostDialogContent from '@/components/shared/CreatePostDialogContent';
import CustomDialog from '@/components/shared/CustomDialog';
import FullScreenImageView from '@/components/shared/FullScreenImageView';
import LeftDrawer from '@/components/shared/LeftDrawer';
import useIsPhoneScreen from '@/hooks/useIsPhoneScreen';
import { runMicroTask } from '@/lib/utils';
import { useGetFollowingPosts, useGetTopRatedPosts } from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview, DialogType, GlobalState, HomeTab, IPostPreview, Page, ProfileTab } from '@/types';

const INITIAL_GLOBAL_STATE: GlobalState = {
  home: {
    currentTab: 'for-you',
    setCurrentTab: () => {},
    for_you: {
      queryResults: {} as UseInfiniteQueryResult<InfiniteData<Page<AugmentedPostPreview>, unknown>, Error>,
    },
    following: {
      queryResults: {} as UseInfiniteQueryResult<InfiniteData<Page<AugmentedPostPreview>, unknown>, Error>,
    }
  },
  profile: {
    currentTab: 'posts',
    setCurrentTab: () => {},
  },
  dialog: {
    openDialog: () => {},
    closeDialog: () => {},
  },
  drawer: {
    openDrawer: () => {},
    closeDrawer: () => {},
  }
};

const GlobalContext = createContext(INITIAL_GLOBAL_STATE);

function GlobalContextProvider({children}: {children: ReactNode}) {
  const [homeTab, setHomeTab] = useState<HomeTab>('for-you');
  const [profileTab, setProfileTab] = useState<ProfileTab>('posts');
  const [openDialog, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const emptyRenderer = () => <></>;
  const [dialogRenderer, setDialogRenderer] = useState<() => ReactNode>(() => emptyRenderer);
  const [fullScreen, setFullScreen] = useState(false);
  // const following_query_results = useGetFollowingPosts();
  // const for_you_query_results = useGetTopRatedPosts();
  const context = {...INITIAL_GLOBAL_STATE};
  const responsiveFullScreen = useIsPhoneScreen();
  context.home.currentTab = homeTab;
  context.home.setCurrentTab = setHomeTab;
  // context.home.following.queryResults = following_query_results;
  // context.home.for_you.queryResults = for_you_query_results;
  context.profile.currentTab = profileTab;
  context.profile.setCurrentTab = setProfileTab;
  context.dialog.openDialog = (renderer: () => ReactNode, options) => {
    setDialogRenderer(() => renderer);
    setOpen(true);
    setFullScreen(!!options?.fullScreen);
  };
  context.dialog.closeDialog = () => {
    setOpen(false);
    setDialogRenderer(() => emptyRenderer);
  };
  context.drawer.openDrawer = () => setOpenDrawer(true);
  context.drawer.closeDrawer = () => setOpenDrawer(false);

  return (
    <GlobalContext.Provider value={context}>
      {children}
      <Dialog open={openDialog} fullScreen={fullScreen || responsiveFullScreen}>
        {dialogRenderer()}
      </Dialog>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <LeftDrawer />
      </Drawer>
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalContextProvider;