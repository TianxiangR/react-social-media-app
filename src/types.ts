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

export type NewPost = {
  content: string;
  images: File[];
};

export type IPost = IPostPreview & {
  replies: IPostPreview[];
};

export type GlobalState = {
  globalScrollY: number;
  setGlobalScrollY: Dispatch<SetStateAction<number>>;
  home: {
    currentTab : 'for-you' | 'following';
    setCurrentTab: Dispatch<SetStateAction<'for-you' | 'following'>>;
    for_you: {
      queryResults : UseQueryResult<IPostPreview[] | undefined, Error>;
      scrollY: number;
      setScrollY: Dispatch<SetStateAction<number>>;
    }
    following: {
      queryResults : UseQueryResult<IPostPreview[] | undefined, Error>;
      scrollY: number;
      setScrollY: Dispatch<SetStateAction<number>>;
    }
  }
};