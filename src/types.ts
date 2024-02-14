import { UseQueryResult } from '@tanstack/react-query';
import { type Dispatch, type SetStateAction } from 'react';
import * as z from 'zod';

import { signUpSchema } from './validations';

export type NewUser = z.infer<typeof signUpSchema>;

export type TokenResponse = {
  access: string;
  refresh: string;
};

export type UserPreview = {
  id: string;
  username: string;
  profile_image: string;
  name: string;
};

export type User = {
  email: string;
  date_of_birth: string;
  created_at: string;
  bio: string;
  followers: number;
  following: number;
  location: string;
} & UserPreview;

export type IPostPreview = {
  id: string;
  images: string[];
  author: User;
  created_at: string;
  content: string;
  liked: boolean;
  bookmarked: boolean;
  like_count: number;
  repost_count: number;
  comment_count: number;
  view_count: number;
};

export type AugmentedPostPreview = IPostPreview & {
  repost_parent?: IPostPreview;
  reply_parent?: IPostPreview;
};

export type NewPost = {
  content: string;
  images: File[];
};

export type IPost = AugmentedPostPreview & {
  replies: IPostPreview[];
};

export type DialogType = 'create-post' | 'reply-post' | 'edit-post' | 'repost-post' | 'view-image';

export type GlobalState = {
  home: {
    currentTab : 'for-you' | 'following';
    setCurrentTab: Dispatch<SetStateAction<'for-you' | 'following'>>;
    for_you: {
      queryResults : UseQueryResult<IPostPreview[] | undefined, Error>;
    }
    following: {
      queryResults : UseQueryResult<IPostPreview[] | undefined, Error>;
    }
  },
  profile: {
    currentTab: 'posts' | 'replies' | 'media' | 'likes';
    setCurrentTab: Dispatch<SetStateAction<'posts' | 'replies' | 'media' | 'likes'>>;
  },
  dialog: {
    openDialog: (type: DialogType, ...args: unknown[]) => void;
    closeDialog: () => void;
  }
};

export type HomeTab = GlobalState['home']['currentTab'];
export type ProfileTab = GlobalState['profile']['currentTab'];