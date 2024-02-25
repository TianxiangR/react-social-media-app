import { Dialog, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { type UseQueryResult } from '@tanstack/react-query';
import React, { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { set } from 'zod';

import PostDialogContent from '@/components/shared/CreatePostDialogContent';
import CustomDialog from '@/components/shared/CustomDialog';
import FullScreenImageView from '@/components/shared/FullScreenImageView';
import LeftDrawer from '@/components/shared/LeftDrawer';
import { runMicroTask } from '@/lib/utils';
import { useGetPosts } from '@/react-query/queriesAndMutations';
import { DialogType, GlobalState, HomeTab, IPostPreview, ProfileTab } from '@/types';

const INITIAL_GLOBAL_STATE: GlobalState = {
  home: {
    currentTab: 'for-you',
    setCurrentTab: () => {},
    for_you: {
      queryResults: {} as UseQueryResult<IPostPreview[] | undefined, Error>,
    },
    following: {
      queryResults: {} as UseQueryResult<IPostPreview[] | undefined, Error>,
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
  const following_query_results = useGetPosts();
  const context = {...INITIAL_GLOBAL_STATE};
  const responsiveFullScreen = useMediaQuery('@media (max-width:768px)');
  context.home.currentTab = homeTab;
  context.home.setCurrentTab = setHomeTab;
  context.home.following.queryResults = following_query_results;
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