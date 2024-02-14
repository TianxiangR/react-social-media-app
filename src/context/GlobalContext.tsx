import { type UseQueryResult } from '@tanstack/react-query';
import React, { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { set } from 'zod';

import PostDialogContent from '@/components/shared/CreatePostDialogContent';
import CustomDialog from '@/components/shared/CustomDialog';
import FullScreenImageView from '@/components/shared/FullScreenImageView';
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
  }
};

const GlobalContext = createContext(INITIAL_GLOBAL_STATE);

function GlobalContextProvider({children}: {children: ReactNode}) {
  const [homeTab, setHomeTab] = useState<HomeTab>('for-you');
  const [profileTab, setProfileTab] = useState<ProfileTab>('posts');
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>('create-post');
  const [parentPost, setParentPost] = useState<IPostPreview | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);
  const following_query_results = useGetPosts();
  const context = {...INITIAL_GLOBAL_STATE};
  context.home.currentTab = homeTab;
  context.home.setCurrentTab = setHomeTab;
  context.home.following.queryResults = following_query_results;
  context.profile.currentTab = profileTab;
  context.profile.setCurrentTab = setProfileTab;
  context.dialog.openDialog = (type: DialogType, ...args) => {
    if (type === 'reply-post' || type === 'repost-post') {
      const parentPost = args[0] as IPostPreview;
      setParentPost(parentPost);
    } else if (type === 'view-image') {
      const images = args[0] as string[];
      setImages(images);
    }
    setDialogType(type);
    setOpen(true);
  };
  context.dialog.closeDialog = () => {
    setOpen(false);
  };

  const fullScreen = dialogType === 'view-image';

  let dialogContent = <></>;

  switch (dialogType) {
  case 'create-post':
    dialogContent = <PostDialogContent variant='create' parent_post={undefined}/>;
    break;
  case 'reply-post':
    dialogContent = <PostDialogContent variant='reply' parent_post={parentPost as IPostPreview}/>;
    break;
  case 'repost-post':
    dialogContent = <PostDialogContent variant='repost' parent_post={parentPost as IPostPreview}/>;
    break;
  case 'view-image':
    dialogContent = <FullScreenImageView images={images}/>;
    break;
  }

  return (
    <GlobalContext.Provider value={context}>
      {children}
      <CustomDialog open={open} fullScreen={fullScreen}>
        {dialogContent}
      </CustomDialog>
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalContextProvider;