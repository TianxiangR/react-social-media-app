import { Alert, Slide, type SlideProps } from '@mui/material';
import { InfiniteData, QueryFunction, QueryFunctionContext, QueryKey, useInfiniteQuery,useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { addBookmarkByPostId, createPost, createUser, deletePostById, followUser, getBookmarkedPosts,  getCurrentUser, getNotifications, getPostById, getPosts, getTopRatedPosts, likePost, queryLikesByUsername, queryMediaByUsername, queryPostsByUsername, queryUserByUsername, removeBookmarkByPostId,replyPostById, repostPostById, searchLatest, searchMedia,searchPeople, searchTop, signInUser, unfollowUser, unlikePost, updateProfile } from '@/apis';
import { TOKEN_STORAGE_KEY } from '@/constants';
import { useSnackbarContext } from '@/context/SnackbarContext';
import { AugmentedPostPreview, IPost, NewPost, Notification,Page, User, UserProfile } from '@/types';

import { QUERY_KEYS } from './queryKeys';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
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
      queryClient.resetQueries();
    },
  });
}

export function useCreatePost () {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: createPost,
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

      queryClient.setQueriesData({
        queryKey: [QUERY_KEYS.QUERY_POST_LIST],
      },
      (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
        if (!oldData) return;
        
        const newData = {...oldData};
        if (oldData.pages[0]) {
          newData.pages[0].results = [data, ...oldData.pages[0].results];
        }

        return newData;
      });

      queryClient.setQueryData([QUERY_KEYS.GET_USER_MEDIA], (oldData: string[] | undefined) => {
        if (!oldData) return;

        return [...data.images, ...oldData];
      });
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

export function useGetPosts () {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<AugmentedPostPreview>, Error, InfiniteData<Page<AugmentedPostPreview>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: ({pageParam}) => getPosts(pageParam, timestamp),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }

      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useLikePost (postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        },
        (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
          if (!oldData) return;

          const newData = {...oldData};

          newData.pages.map((page) => {
            page.results = page.results.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  liked: true,
                  like_count: post.like_count + 1,
                };
              }

              return post;
            });

            return page;
          });

          return newData;
        });

      queryClient.setQueryData([QUERY_KEYS.GET_POST_BY_ID, postId], (oldData: IPost | undefined) => {
        if (!oldData) return;

        return {
          ...oldData,
          liked: true,
          like_count: oldData.like_count + 1,
        };
      });

      queryClient.setQueryData([QUERY_KEYS.GET_NOTIFICATIONS], (oldData: Notification[] | undefined): Notification[] | undefined => {
        if (!oldData) return;

        return oldData.map((notification) => {
          if (notification.type === 'repost' || notification.type === 'reply') {
            return {
              ...notification,
              data: {
                ...notification.data,
                liked: true,
              }
            };
          }

          return notification;
        });
      });
    },
  });
}

export function useUnlikePost (postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unlikePost(postId),
    onSuccess: () => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        },
        (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
          if (!oldData) return;

          const newData = {...oldData};

          newData.pages.map((page) => {
            page.results = page.results.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  liked: false,
                  like_count: post.like_count - 1,
                };
              }

              return post;
            });

            return page;
          });

          return newData;
        });

      queryClient.setQueryData([QUERY_KEYS.GET_POST_BY_ID, postId], (oldData: IPost | undefined) => {
        if (!oldData) return;

        return {
          ...oldData,
          liked: false,
          like_count: oldData.like_count - 1,
        };
      });

      queryClient.setQueryData([QUERY_KEYS.GET_NOTIFICATIONS], (oldData: Notification[] | undefined): Notification[] | undefined => {
        if (!oldData) return;

        return oldData.map((notification) => {
          if (notification.type === 'repost' || notification.type === 'reply') {
            return {
              ...notification,
              data: {
                ...notification.data,
                liked: false,
              }
            };
          }

          return notification;
        });
      });
    },
  });
}

export function useGetPostById (postId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
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

      queryClient.setQueriesData({
        queryKey: [QUERY_KEYS.QUERY_POST_LIST],
      }, (oldData:InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
        if (!oldData) return;

        const newData = {...oldData};

        newData.pages.map((page) => {
          page.results = page.results.filter((post) => post.id !== postId);
          return page;
        });

        return newData;
      });

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        }
      );
    },
  });
}

export function useReplyPostById(postId: string) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: (post: NewPost) => replyPostById(postId, post),
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

      queryClient.setQueriesData({
        queryKey: [QUERY_KEYS.QUERY_POST_LIST],
      },
      (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
        if (!oldData) return;
        
        const newData = {...oldData};
        if (oldData.pages[0]) {
          newData.pages[0].results = [data, ...oldData.pages[0].results];
        }

        return newData;
      });
      
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        },
        (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
          if (!oldData) return;

          const newData = {...oldData};

          newData.pages.map((page) => {
            page.results = page.results.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  comment_count: post.comment_count + 1,
                };
              }

              return post;
            });

            return page;
          });

          return newData;
        });

      queryClient.setQueryData([QUERY_KEYS.GET_POST_BY_ID, postId], (oldData: IPost | undefined): IPost | undefined => {
        if (!oldData) return;

        return {
          ...oldData,
          comment_count: oldData.comment_count + 1,
          replies: [data, ...oldData.replies],
        };
      });

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        }
      );

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_USER_POSTS, postId],
        }
      );
    },
  });
}

export function useRepostPostById(postId: string) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: (post: Partial<NewPost>) => repostPostById(postId, post),
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

      queryClient.setQueriesData({
        queryKey: [QUERY_KEYS.QUERY_POST_LIST],
      },
      (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
        if (!oldData) return;
        
        const newData = {...oldData};
        if (oldData.pages[0]) {
          newData.pages[0].results = [data, ...oldData.pages[0].results];
        }

        return newData;
      });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        },
        (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
          if (!oldData) return;

          const newData = {...oldData};

          newData.pages.map((page) => {
            page.results = page.results.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  repost_count: post.repost_count + 1,
                };
              }

              return post;
            });

            return page;
          });

          return newData;
        });

      queryClient.setQueryData([QUERY_KEYS.GET_POST_BY_ID, postId], (oldData: IPost | undefined): IPost | undefined => {
        if (!oldData) return;

        return {
          ...oldData,
          repost_count: oldData.repost_count + 1,
        };
      });

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        }
      );

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_USER_POSTS],
        }
      );
    },
  });
}

export function useGetUserProfile(username: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_PROFILE, username],
    queryFn: () => queryUserByUsername(username),
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
  return useMutation({
    mutationFn: followUser,
    onSuccess: (data) => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.SEARCH_PEOPLE],
        },
        (oldData: InfiniteData<Page<User>> | undefined) => {
          if (!oldData) return;

          const newData = {...oldData};

          newData.pages.forEach((page) => {
            page.results = page.results.map((user) => {
              if (user.id === data.id) {
                return data;
              }

              return user;
            });
          });

          return newData;
        });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        },
        (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
          if (!oldData) return;

          const newData = {...oldData};

          newData.pages.forEach((page) => {
            page.results.forEach((post) => {
              if (post.author.id === data.id) {
                post.author = data;
              }
            });
          });

          console.log(newData);
          return newData;
        });

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_USER_PROFILE],
        }
      );
      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        }
      );
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: (data) => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.SEARCH_PEOPLE],
        },
        (oldData: InfiniteData<Page<User>> | undefined) => {
          if (!oldData) return;

          const newData = {...oldData};

          newData.pages.forEach((page) => {
            page.results = page.results.map((user) => {
              if (user.id === data.id) {
                return data;
              }

              return user;
            });
          });

          return newData;
        });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        },
        (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
          if (!oldData) return;

          const newData = {...oldData};

          newData.pages.forEach((page) => {
            page.results.forEach((post) => {
              if (post.author.id === data.id) {
                post.author = data;
              }
            });
          });
          return newData;
        });

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_USER_PROFILE],
        }
      );
      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        }
      );
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
  });
}

export function useSearchPeople(query: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<User>, Error, InfiniteData<Page<User>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.SEARCH_PEOPLE, query],
    queryFn: ({pageParam}) => searchPeople(query, timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
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
  });
}

export function useAddBookmark(postId: string) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: () => addBookmarkByPostId(postId),
    onSuccess: () => {
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

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        }
        , (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
          if (!oldData) return;

          const newData = {...oldData};

          newData.pages.forEach((page) => {
            page.results.forEach((post) => {
              if (post.id === postId) {
                post.bookmarked = true;
                post.bookmark_count += 1;
              }
            });
          });

          return newData;
        });

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_BOOKMARKS],
        }
      );

      queryClient.setQueryData([QUERY_KEYS.GET_POST_BY_ID, postId], (oldData: IPost | undefined) => {
        if (!oldData) return;

        return {
          ...oldData,
          bookmarked: true,
          bookmark_count: oldData.bookmark_count + 1,
        };
      });

      queryClient.setQueryData([QUERY_KEYS.GET_NOTIFICATIONS], (oldData: Notification[] | undefined): Notification[] | undefined => {
        if (!oldData) return;

        return oldData.map((notification) => {
          if (notification.type === 'repost' || notification.type === 'reply') {
            return {
              ...notification,
              data: {
                ...notification.data,
                bookmarked: true,
                bookmark_count: notification.data.bookmark_count + 1,
              }
            };
          }

          return notification;
        });
      });
    }
  });
}

export function useRemoveBookmark(postId: string) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: () => removeBookmarkByPostId(postId),
    onSuccess: () => {
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

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        }
        , (oldData: InfiniteData<Page<AugmentedPostPreview>> | undefined) => {
          if (!oldData) return;
  
          const newData = {...oldData};
  
          newData.pages.forEach((page) => {
            page.results.forEach((post) => {
              if (post.id === postId) {
                post.bookmarked = false;
                post.bookmark_count -= 1;
              }
            });
          });
  
          return newData;
        });

      queryClient.setQueryData([QUERY_KEYS.GET_POST_BY_ID, postId], (oldData: IPost | undefined) => {
        if (!oldData) return;

        return {
          ...oldData,
          bookmarked: false,
          bookmark_count: oldData.bookmark_count - 1,
        };
      });

      queryClient.setQueryData([QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_BOOKMARKS],
        (oldData: AugmentedPostPreview[] | undefined) => {
          if (!oldData) return;

          return oldData.filter((post) => post.id !== postId);
        });

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_BOOKMARKS],
        }
      );

      queryClient.setQueryData([QUERY_KEYS.GET_NOTIFICATIONS], (oldData: Notification[] | undefined): Notification[] | undefined => {
        if (!oldData) return;

        return oldData.map((notification) => {
          if (notification.type === 'repost' || notification.type === 'reply') {
            return {
              ...notification,
              data: {
                ...notification.data,
                bookmarked: false,
                bookmark_count: notification.data.bookmark_count - 1,
              }
            };
          }

          return notification;
        });
      });
    }
  });
}


export function useGetBookmarkedPosts() {
  const timestamp = Math.floor(Date.now() / 1000);
  return useInfiniteQuery<Page<AugmentedPostPreview>, Error, InfiniteData<Page<AugmentedPostPreview>>, QueryKey, number>({
    queryKey: [QUERY_KEYS.GET_BOOKMARKS],
    queryFn: ({pageParam}) => getBookmarkedPosts(timestamp, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next || undefined;
      }
      return undefined;
    },
  });
}

export function useGetNotifications() {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_NOTIFICATIONS],
    queryFn: getNotifications,
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
  });
}