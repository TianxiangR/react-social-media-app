import { Alert, Slide, type SlideProps } from '@mui/material';
import { InfiniteData,  QueryClient,  QueryKey, useInfiniteQuery,useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Axios, AxiosProgressEvent } from 'axios';
import { cloneDeep, update } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';

import { addBookmarkByPostId, createPost, createUser, deletePostById, followUser, getBookmarkedPosts,  getCurrentUser, getFollowingPosts, getNotifications, getPostById, getPosts, getRepliesById, getTopRatedPosts, getUserFollowers, getUserFollowing, likePost, markNotificationAsRead, queryLikesByUsername, queryMediaByUsername, queryPostsByUsername, queryUserByUsername, removeBookmarkByPostId, replyPostById, repostPostById, searchLatest, searchMedia, searchPeople, searchTop, signInUser, unfollowUser, unlikePost, updateProfile } from '@/apis';
import { TOKEN_STORAGE_KEY } from '@/constants';
import { useSnackbarContext } from '@/context/SnackbarContext';
import { AugmentedPostPreview, IPost, IPostPreview, NewPost, Notification,Page, User, UserProfile } from '@/types';

import { QUERY_KEYS } from './queryKeys';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function getNewPostList(oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined,  newPost: AugmentedPostPreview)  {
  if (!oldData) return;
  
  const newData = cloneDeep(oldData);
  if (oldData.pages[0]) {
    newData.pages[0].results = [newPost, ...oldData.pages[0].results];
  }

  console.log(newData);

  return newData;
}

function addPostToList(queryClient: QueryClient, data: IPostPreview) {
  // queryClient.cancelQueries({ queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_RECENT_POSTS] });
  // queryClient.cancelQueries({ queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_TOP_RATED_POSTS] });
  // queryClient.cancelQueries({ queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_USER_POSTS, data.author.username] });
  // queryClient.cancelQueries({ queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_POST_REPLIES_BY_ID, data.reply_parent?.id]});

  queryClient.setQueriesData({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_FOLLOWING_POSTS],
  }, (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => getNewPostList(oldData, data));
  queryClient.setQueriesData({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_TOP_RATED_POSTS],
  }, (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => getNewPostList(oldData, data));
  queryClient.setQueriesData({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_USER_POSTS, data.author.username],
  }, (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => getNewPostList(oldData, data));
  queryClient.setQueriesData({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_POST_REPLIES_BY_ID, data.reply_parent?.id],
  }, (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => getNewPostList(oldData, data));


  // queryClient.invalidateQueries({queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_RECENT_POSTS]});
  // queryClient.invalidateQueries({queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_TOP_RATED_POSTS]});
  // queryClient.invalidateQueries({queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_USER_POSTS, data.author.username]});
  // queryClient.invalidateQueries({queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_POST_REPLIES_BY_ID, data.reply_parent?.id]});
}

function removePostFromList(queryClient: QueryClient, postId: string) {
  queryClient.cancelQueries({ queryKey: [QUERY_KEYS.QUERY_POST_LIST] });
  queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId] });
  
  queryClient.setQueriesData({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST],
  }, (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
    if (!oldData) return;

    const newData = cloneDeep(oldData);

    newData.pages.map((page) => {
      page.results = page.results.filter((post) => {
        if (post.id === postId) {
          return false;
        }

        let current_post: IPostPreview | undefined | null = post.reply_parent;
        while (current_post) {
          if (current_post.id === postId) {
            return false;
          }
          current_post = current_post.reply_parent;
        }

        current_post = post.repost_parent;
        while (current_post) {
          if (current_post.id === postId) {
            return false;
          }
          current_post = current_post.repost_parent;
        }

        return true;
      });
      return page;
    });

    return newData;
  });


  queryClient.invalidateQueries({queryKey: [QUERY_KEYS.QUERY_POST_LIST]});
  queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId]});
}

/**
 * Copies the attributes from the source object to the receiver object
 * @param receiver 
 * @param source 
 * @param attributes an array of keys to copy from the source object
 */
function copyAttributes<T>(receiver: T, source: Partial<T>, attributes: Array<keyof T>) {
  for (const attribute of attributes) {
    if (source[attribute] !== undefined && source[attribute] !== null) {
      Object.defineProperty(receiver, attribute, {
        value: source[attribute],
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }
}

function updatePostList(queryClient: QueryClient, data: IPostPreview, attributes: Array<keyof IPostPreview>) {
  // cancel ongoing queries
  queryClient.cancelQueries({ queryKey: [QUERY_KEYS.QUERY_POST_LIST] });

  // udpate query cache
  queryClient.setQueriesData(
    {
      queryKey: [QUERY_KEYS.QUERY_POST_LIST],
    },
    (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
      if (!oldData) return;

      const newData = cloneDeep(oldData);

      newData.pages.map((page) => {
        page.results = page.results.map((post) => {
          if (post.id === data.id) {
            copyAttributes(post, data, attributes);
          } 
          else {
            let current_post: IPostPreview | undefined | null = post.reply_parent;
            while (current_post) {
              if (current_post.id === data.id) {
                copyAttributes(current_post, data, attributes);
                break;
              }
              current_post = current_post.reply_parent;
            }

            current_post = post.repost_parent;
            while (current_post) {
              if (current_post.id === data.id) {
                copyAttributes(current_post, data, attributes);
                break;
              }
              current_post = current_post.repost_parent;
            }
          }

          return post;
        });

        return page;
      });

      return newData;
    });

  // invalidate queries to trigger refetch
  queryClient.invalidateQueries({queryKey: [QUERY_KEYS.QUERY_POST_LIST]});
}

function updatePostById(queryClient: QueryClient, data: IPostPreview, attributes: Array<keyof IPostPreview>) {
  queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, data.id] });

  queryClient.setQueryData([QUERY_KEYS.GET_POST_BY_ID, data.id],
    (oldData: IPostPreview | undefined | null) => {
      if (!oldData) return;

      const newData = cloneDeep(oldData);

      if (newData.id === data.id) {
        copyAttributes(newData, data, attributes);
        return newData;
      }

      let current_post: IPostPreview | undefined | null = newData.reply_parent;
      while (current_post) {
        if (current_post.id === data.id) {
          copyAttributes(current_post, data, attributes);
          break;
        }
        current_post = current_post.reply_parent;
      }

      current_post = newData.repost_parent;
      while (current_post) {
        if (current_post.id === data.id) {
          copyAttributes(current_post, data, attributes);
          break;
        }
        current_post = current_post.repost_parent;
      }

      return newData;
    }
  );

  queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_POST_BY_ID, data.id]});
}

function updateNotificationList(queryClient: QueryClient, data: IPostPreview, attributes: Array<keyof IPostPreview>) {
  queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_NOTIFICATIONS] });

  queryClient.setQueryData([QUERY_KEYS.GET_NOTIFICATIONS], (oldData: Notification[] | undefined): Notification[] | undefined => {
    if (!oldData) return;

    return oldData.map((notification) => {
      if (notification.type === 'reply' || notification.type === 'repost') {
        if (notification.data.id === data.id) {
          copyAttributes(notification.data, data, attributes);
        }
        else {
          let current_post: IPostPreview | undefined | null = notification.data.reply_parent;
          while (current_post) {
            if (current_post.id === data.id) {
              copyAttributes(current_post, data, attributes);
              break;
            }
            current_post = current_post.reply_parent;
          }

          current_post = notification.data.repost_parent;
          while (current_post) {
            if (current_post.id === data.id) {
              copyAttributes(current_post, data, attributes);
              break;
            }
            current_post = current_post.repost_parent;
          }
        }
      }

      return notification;
    });
  });

  queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_NOTIFICATIONS]});
}

function updatePost(queryClient: QueryClient, data: IPostPreview, attributes: Array<keyof IPostPreview>) {
  updatePostList(queryClient, data, attributes);
  updatePostById(queryClient, data, attributes);
  updateNotificationList(queryClient, data, attributes);
}

function updatePeople(queryClient: QueryClient, data: User, attributes: Array<keyof User>) {
  queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_PEOPLE_LIST] });
  queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_USER_PROFILE, data.username] });
  queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });

  queryClient.setQueriesData(
    {
      queryKey: [QUERY_KEYS.SEARCH_PEOPLE],
    },
    (oldData: InfiniteData<Page<User>> | undefined) => {
      if (!oldData) return;

      const newData = cloneDeep(oldData);

      newData.pages.forEach((page) => {
        page.results = page.results.map((user) => {
          if (user.id === data.id) {
            copyAttributes(user, data, attributes);
          }

          return user;
        });
      });

      return newData;
    });

  queryClient.setQueriesData(
    {
      queryKey: [QUERY_KEYS.GET_USER_PROFILE, data.username],
    },
    (oldData: User | undefined) => {
      if (!oldData) return;

      const newData = cloneDeep(oldData);
      copyAttributes(newData, data, attributes);
      return newData;
    });

  queryClient.setQueriesData(
    {
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    },
    (oldData: User | undefined) => {
      if (!oldData) return;

      const newData = cloneDeep(oldData);
      copyAttributes(newData, data, attributes);
      return newData;
    });


  const updatePostIds = new Set();
  queryClient.setQueriesData(
    {
      queryKey: [QUERY_KEYS.QUERY_POST_LIST],
    },
    (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
      if (!oldData) return;

      const newData = cloneDeep(oldData);

      newData.pages.forEach((page) => {
        page.results = page.results.map((post) => {
          if (post.author.id === data.id) {
            copyAttributes(post.author, data, attributes);
            updatePostIds.add(post.id);
          }
          else {
            let current_post: IPostPreview | undefined | null = post.reply_parent;
            while (current_post) {
              if (current_post.author.id === data.id) {
                copyAttributes(current_post.author, data, attributes);
                updatePostIds.add(current_post.id);
              }
              current_post = current_post.reply_parent;
            }

            current_post = post.repost_parent;
            while (current_post) {
              if (current_post.author.id === data.id) {
                copyAttributes(current_post.author, data, attributes);
                updatePostIds.add(current_post.id);
              }
              current_post = current_post.repost_parent;
            }
          }

          return post;
        });
      });

      return newData;
    });

  queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_PEOPLE_LIST]});
  queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_USER_PROFILE, data.username]});
  queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_CURRENT_USER]});
  updatePostIds.forEach((id) => {
    queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_POST_BY_ID, id]});
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      const content = (
        <Alert severity="success" sx={{ width: '100%' }}>
          Your account was created.
        </Alert>
      );

      showSnackbar({props: { 
        autoHideDuration: 3000, 
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, content});

      localStorage.setItem(TOKEN_STORAGE_KEY, data.access);
      queryClient.resetQueries();
    },
    onError: () => {
      const content = (
        <Alert severity="error" sx={{ width: '100%' }}>
          There was an error creating your account.
          Please try again.
        </Alert>
      );

      showSnackbar({props: { 
        autoHideDuration: 3000, 
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, content});
    }
  });
}

export function useGetCurrentUser() {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: () => getCurrentUser(),
    refetchOnWindowFocus: false,
  });
}

export function useLoginUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => signInUser(credentials.email, credentials.password),
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.access);
      queryClient.resetQueries();
    },
  });
}

export function useLogoutUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return new Promise((resolve) => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        resolve(true);
      });
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useCreatePost () {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: ({post, onUploadProgress}: {post: NewPost; onUploadProgress?: (e: AxiosProgressEvent) => void}) => createPost(post, onUploadProgress),
    onSuccess: (data) => {
      const content = (
        <Alert severity="success" sx={{ width: '100%' }}>
          Your post was sent. <Link to={`/${data.author.username}/status/${data.id}`} className='hover:underline font-bold'>View</Link>
        </Alert>
      );
  
      showSnackbar({props: { 
        autoHideDuration: 3000, 
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, 
      content});

      addPostToList(queryClient, data);
    },
    onError: () => {
      const content = (
        <Alert severity="error" sx={{ width: '100%' }}>
          There was an error creating your post.
          Please try again.
        </Alert>
      );

      showSnackbar({props: { 
        autoHideDuration: 3000, 
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, content});
    }
  });
}

export function useLikePost (postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: (data: IPostPreview) => {
      updatePost(queryClient, data, ['liked', 'like_count', 'view_count']);
    },
  });
}

export function useUnlikePost (postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unlikePost(postId),
    onSuccess: (data) => {
      updatePost(queryClient, data, ['liked', 'like_count', 'view_count']);
    },
  });
}

export function useGetPostById (postId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    refetchOnWindowFocus: false,
  });
}

export function useDeletePostById (postId: string) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: () => deletePostById(postId),
    onSuccess: () => {

      const content = (
        <Alert severity="success" sx={{ width: '100%' }}>
          Your post was deleted.
        </Alert>
      );

      showSnackbar({props: { 
        autoHideDuration: 3000, 
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, content});

      removePostFromList(queryClient, postId);
    },
  });
}

export function useGetRepliesByPostId(postId: string) {
  const timestamp = Math.floor(Date.now() / 1000);

  return useInfiniteQuery<Page<AugmentedPostPreview>, Error, InfiniteData<Page<AugmentedPostPreview>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_POST_REPLIES_BY_ID, postId],
    queryFn: ({pageParam}) => getRepliesById(postId, pageParam, timestamp),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }

      return undefined;
    },
    refetchOnWindowFocus: false,
  });
}

export function useReplyPostById(postId: string) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: ({post, onUploadProgress}: {post: NewPost; onUploadProgress?: (e: AxiosProgressEvent) => void}) => replyPostById(postId, post, onUploadProgress),
    onSuccess: (data) => {
      const content = (
        <Alert severity="success" sx={{ width: '100%' }}>
          Your post was sent. <Link to={`/${data.author.username}/status/${data.id}`} className='hover:underline font-bold'>View</Link>
        </Alert>
      );

      showSnackbar({props: { 
        autoHideDuration: 3000, 
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, content});

      addPostToList(queryClient, data);
      
      if (data.reply_parent) {
        updatePost(queryClient, data.reply_parent, ['reply_count', 'view_count']);
      }
    },
  });
}

export function useRepostPostById(postId: string) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: ({post, onUploadProgress}: {post: NewPost; onUploadProgress?: (e: AxiosProgressEvent) => void}) => repostPostById(postId, post, onUploadProgress),
    onSuccess: (data) => {
      const content = (
        <Alert severity="success" sx={{ width: '100%' }}>
          Your post was sent. <Link to={`/${data.author.username}/status/${data.id}`} className='hover:underline font-bold'>View</Link>
        </Alert>
      );

      showSnackbar({props: { 
        autoHideDuration: 3000, 
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, content});

      addPostToList(queryClient, data);

      if (data.repost_parent) {
        updatePost(queryClient, data.repost_parent, ['repost_count', 'reposted', 'view_count']);
      }
    },
  });
}

export function useGetUserProfile(username: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_PROFILE, username],
    queryFn: () => queryUserByUsername(username),
    refetchOnWindowFocus: false,
  });
}

export function useGetUserPosts(username: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<AugmentedPostPreview>, Error, InfiniteData<Page<AugmentedPostPreview>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_USER_POSTS, username],
    queryFn: ({pageParam}) => queryPostsByUsername(username, timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }

      return undefined;
    },
    refetchOnWindowFocus: false,
  });
}

export function useGetUserLikes(username: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<AugmentedPostPreview>, Error, InfiniteData<Page<AugmentedPostPreview>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_USER_LIKES, username],
    queryFn: ({pageParam}) => queryLikesByUsername(username, timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }

      return undefined;
    },
    refetchOnWindowFocus: false,
  });
}

export function useGetUserMedia(username: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<string>, Error, InfiniteData<Page<string>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.GET_USER_MEDIA, username],
    queryFn: ({pageParam}) => queryMediaByUsername(username, timestamp, pageParam), 
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }

      return undefined;
    },
    refetchOnWindowFocus: false,
  });
}

export function useUpdateProfile(username: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: Partial<UserProfile>) => updateProfile(username, profile),
    onSuccess: () => {
      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_USER_PROFILE, username],
        }
      );
      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        }
      );
      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_USER_POSTS]
        }
      );
    },
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();
  return useMutation({
    mutationFn: followUser,
    onSuccess: (data) => {
      const content = (
        <Alert severity="success" sx={{ width: '100%' }}>
          You followed @{data.username}
        </Alert>
      );

      showSnackbar({props: {
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, content});

      updatePeople(queryClient, data, ['is_following']);

      const current_user: User | undefined = queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER]);

      if (current_user) {
        const updated_user = cloneDeep(current_user);
        updated_user.following++;
        updatePeople(queryClient, updated_user, ['following']);
      }
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();
  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: (data) => {
      const content = (
        <Alert severity="info" sx={{ width: '100%' }}>
          You unfollowed @{data.username}
        </Alert>
      );

      showSnackbar({props: {
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, content});

      updatePeople(queryClient, data, ['is_following']);

      const current_user: User | undefined = queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER]);

      if (current_user) {
        const updated_user = cloneDeep(current_user);
        updated_user.following--;
        updatePeople(queryClient, updated_user, ['following']);
      }
    },
  });
}

export function useSearchTop(query: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<AugmentedPostPreview>, Error, InfiniteData<Page<AugmentedPostPreview>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.SEARCH_TOP, query],
    queryFn: ({pageParam}) => searchTop(query, timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useSearchLatest(query: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<AugmentedPostPreview>, Error, InfiniteData<Page<AugmentedPostPreview>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.SEARCH_LATEST, query],
    queryFn: ({pageParam}) => searchLatest(query, timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useSearchPeople(query: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<User>, Error, InfiniteData<Page<User>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.GET_PEOPLE_LIST, QUERY_KEYS.SEARCH_PEOPLE, query],
    queryFn: ({pageParam}) => searchPeople(query, timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useSearchMedia(query: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<string>, Error, InfiniteData<Page<string>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.SEARCH_MEDIA, query],
    queryFn: ({pageParam}) => searchMedia(query, timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useAddBookmark(postId: string) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: () => addBookmarkByPostId(postId),
    onSuccess: (data) => {
      const content = (
        <Alert severity="success" sx={{ width: '100%' }}>
          Added to your Bookmarks.
        </Alert>
      );

      showSnackbar({props: { 
        autoHideDuration: 3000, 
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, content});

      updatePost(queryClient, data, ['bookmarked', 'bookmark_count', 'view_count']);
    }
  });
}

export function useRemoveBookmark(postId: string) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: () => removeBookmarkByPostId(postId),
    onSuccess: (data) => {
      const content = (
        <Alert severity="success" sx={{ width: '100%' }}>
          Removed from your Bookmarks.
        </Alert>
      );

      showSnackbar({props: { 
        autoHideDuration: 3000, 
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        TransitionComponent: SlideTransition
      }, content});
      
      updatePost(queryClient, data, ['bookmarked', 'bookmark_count', 'view_count']);
    }
  });
}

export function useGetBookmarkedPosts() {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<AugmentedPostPreview>, Error, InfiniteData<Page<AugmentedPostPreview>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_BOOKMARKS],
    queryFn: ({pageParam}) => getBookmarkedPosts(timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
  });
}

export function useGetNotifications() {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_NOTIFICATIONS],
    queryFn: getNotifications,
    refetchOnWindowFocus: false,
  });
}

export function useGetTopRatedPosts() {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<AugmentedPostPreview>, Error, InfiniteData<Page<AugmentedPostPreview>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_TOP_RATED_POSTS],
    queryFn: ({pageParam}) => getTopRatedPosts(timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
  });
}

export function useGetFollowingPosts() {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<AugmentedPostPreview>, Error, InfiniteData<Page<AugmentedPostPreview>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_FOLLOWING_POSTS],
    queryFn: ({pageParam}) => getFollowingPosts(timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
  });
}

export function useGetUserFollowers(username: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<User>, Error, InfiniteData<Page<User>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.GET_PEOPLE_LIST, QUERY_KEYS.GET_USER_FOLLOWERS, username],
    queryFn: ({pageParam}) => getUserFollowers(username, timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
  });
}

export function useGetUserFollowing(username: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<User>, Error, InfiniteData<Page<User>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.GET_PEOPLE_LIST, QUERY_KEYS.GET_USER_FOLLOWING, username],
    queryFn: ({pageParam}) => getUserFollowing(username, timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (data) => {
      queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_NOTIFICATIONS] });
      queryClient.setQueryData([QUERY_KEYS.GET_NOTIFICATIONS], (oldData: Notification[] | undefined): Notification[] | undefined => {
        if (!oldData) return;

        return oldData.map((notification) => {
          if (notification.id === data.id) {
            return {
              ...notification,
              read: true,
            };
          }

          return notification;
        });
      });
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.GET_NOTIFICATIONS]});
    }
  });
}