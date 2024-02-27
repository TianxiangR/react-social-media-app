import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query';
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
  header_photo: string;
  website: string;
  is_following: boolean;
} & UserPreview;

export type UserProfile = {
  bio: string; 
  name: string;
  profile_image: File;
  header_photo: File;
  website: string;
  location: string;
  date_of_birth: string;
};

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
      queryResults : UseInfiniteQueryResult<InfiniteData<Page<AugmentedPostPreview>, unknown>, Error>
    }
  },
  profile: {
    currentTab: 'posts' | 'replies' | 'media' | 'likes';
    setCurrentTab: Dispatch<SetStateAction<'posts' | 'replies' | 'media' | 'likes'>>;
  },
  dialog: {
    openDialog: (contentRenderer: () => React.ReactNode, options?: {fullScreen?: boolean}) => void;
    closeDialog: () => void;
  }
  drawer: {
    openDrawer: () => void;
    closeDrawer: () => void;
  }
};

export type HomeTab = GlobalState['home']['currentTab'];
export type ProfileTab = GlobalState['profile']['currentTab'];

export type SearchTopResult = {
  users: User[];
  posts: AugmentedPostPreview[];
}

export type SearchLatestResult = {
  posts: AugmentedPostPreview[];
}

export type SearchPeopleResult = {
  users: User[];
}

export type SearchMediaResult = {
  media: string[];
}

export type PostLike = {
  id: string;
  created_at: string;
  user: User;
  post: AugmentedPostPreview;
}


export type LikeNotification = {
  id: string;
  created_at: string;
  type: 'like';
  data: PostLike;
  read: boolean;
}

export type PostNotification = {
  id: string;
  created_at: string;
  type: 'repost' | 'reply';
  data: AugmentedPostPreview;
  read: boolean;
}

export type FollowNotification = {
  id: string;
  created_at: string;
  type: 'follow';
  data: User;
  read: boolean;
}

export type Notification = PostNotification | FollowNotification | LikeNotification;

export type Page<T> = {
  next: number | null;
  previous: number | null;
  results: T[];
  count: number;
  total_pages: number;
}