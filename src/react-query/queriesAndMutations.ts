import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addBookmarkByPostId, createPost, deletePostById, followUser, getBookmarkedPosts,  getCurrentUser, getNotifications, getPostById, getPosts, likePost, queryLikesByUsername, queryMediaByUsername, queryPostsByUsername, queryUserByUsername, removeBookmarkByPostId,replyPostById, repostPostById, searchLatest, searchMedia,searchPeople, searchTop, signInUser, unfollowUser, unlikePost, updateProfile } from '@/apis';
import { TOKEN_STORAGE_KEY } from '@/constants';
import { AugmentedPostPreview, IPost, NewPost, Notification,SearchLatestResult, SearchPeopleResult, SearchTopResult, User, UserProfile } from '@/types';

import { QUERY_KEYS } from './queryKeys';

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
  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.setQueriesData({
        queryKey: [QUERY_KEYS.QUERY_POST_LIST],
      },
      (oldData: string[] | undefined) => {
        if (!oldData) return;

        return [data.id, ...oldData];
      });

      queryClient.setQueryData([QUERY_KEYS.GET_USER_MEDIA], (oldData: string[] | undefined) => {
        if (!oldData) return;

        return [...data.images, ...oldData];
      });
    },
  });
}

export function useGetPosts () {
  return useQuery({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getPosts,
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
        (oldData: AugmentedPostPreview[] | undefined) => {
          if (!oldData) return;

          return oldData.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                liked: true,
                like_count: post.like_count + 1,
              };
            }

            return post;
          });
        });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.SEARCH_POST_LIST],
        },
        (oldData: SearchTopResult | SearchLatestResult | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            posts: oldData.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  liked: true,
                  like_count: post.like_count + 1,
                };
              }

              return post;
            }),
          };
        }
      );

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
        (oldData: AugmentedPostPreview[] | undefined) => {
          if (!oldData) return;

          return oldData.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                liked: false,
                like_count: post.like_count - 1,
              };
            }

            return post;
          });
        });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.SEARCH_POST_LIST],
        },
        (oldData: SearchTopResult | SearchLatestResult | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            posts: oldData.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  liked: false,
                  like_count: post.like_count - 1,
                };
              }

              return post;
            }),
          };
        }
      );
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

  return useMutation({
    mutationFn: () => deletePostById(postId),
    onSuccess: () => {
      queryClient.setQueryData([QUERY_KEYS.QUERY_POST_LIST], (oldData: AugmentedPostPreview[] | undefined) => {
        if (!oldData) return;

        return oldData.filter((post) => post.id !== postId);
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

  return useMutation({
    mutationFn: (post: NewPost) => replyPostById(postId, post),
    onSuccess: (data) => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        },
        (oldData: AugmentedPostPreview[] | undefined) => {
          if (!oldData) return;

          return oldData.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comment_count: post.comment_count + 1,
              };
            }
            return post;
          });
        });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.SEARCH_POST_LIST],
        },
        (oldData: SearchTopResult | SearchLatestResult | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            posts: oldData.posts.map((post) => {
              if (post.id === postId) {
                if (post.id === postId) {
                  return {
                    ...post,
                    comment_count: post.comment_count + 1,
                  };
                }
                return post;
              }

              return post;
            }),
          };
        }
      );

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

  return useMutation({
    mutationFn: (post: Partial<NewPost>) => repostPostById(postId, post),
    onSuccess: (data) => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        },
        (oldData: AugmentedPostPreview[] | undefined) => {
          if (!oldData) return;

          return oldData.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                repost_count: post.repost_count + 1,
              };
            }
            return post;
          });
        });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.SEARCH_POST_LIST],
        },
        (oldData: SearchTopResult | SearchLatestResult | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            posts: oldData.posts.map((post) => {
              if (post.id === postId) {
                if (post.id === postId) {
                  return {
                    ...post,
                    repost_count: post.repost_count + 1,
                  };
                }
                return post;
              }

              return post;
            }),
          };
        }
      );

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
  return useQuery({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_USER_POSTS],
    queryFn: () => queryPostsByUsername(username),
  });
}

export function useGetUserLikes(username: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_USER_LIKES],
    queryFn: () => queryLikesByUsername(username),
  });
}

export function useGetUserMedia(username: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_MEDIA, username],
    queryFn: () => queryMediaByUsername(username)
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
          queryKey: [QUERY_KEYS.SEARCH_POST_LIST, QUERY_KEYS.SEARCH_TOP],
        },
        (oldData: SearchTopResult | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            users: oldData.users.map((user) => {
              if (user.id === data.id) {
                return data;
              }

              return user;
            }),
          };
        });

      queryClient.setQueryData([QUERY_KEYS.SEARCH_PEOPLE], (oldData: SearchPeopleResult | undefined) => {
        if (!oldData) return;

        return {
          ...oldData,
          users: oldData.users.map((user) => {
            if (user.username === data.username) {
              return data;
            }

            return user;
          }),
        };
      });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        },
        (oldData: AugmentedPostPreview[] | undefined): AugmentedPostPreview[] | undefined => {
          if (!oldData) return;

          return oldData.map((post) => {
            if (post.author.id === data.id) {
              return {
                ...post,
                author: data,
              };
            }

            return post;
          });
        }
      );

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.SEARCH_POST_LIST],
        },
        (oldData: SearchTopResult | SearchLatestResult | undefined): SearchTopResult | SearchLatestResult | undefined => {
          console.log(oldData);
          if (!oldData) return;

          return {
            ...oldData,
            posts: oldData.posts.map((post) => {
              if (post.author.id === data.id) {
                return {
                  ...post,
                  author: data
                };
              }
              return post;
            }),
          };
        }
      );

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
          queryKey: [QUERY_KEYS.SEARCH_POST_LIST, QUERY_KEYS.SEARCH_TOP],
        },
        (oldData: SearchTopResult | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            users: oldData.users.map((user) => {
              if (user.username === data.username) {
                return data;
              }

              return user;
            }),
          };
        });

      queryClient.setQueryData([QUERY_KEYS.SEARCH_PEOPLE], (oldData: SearchPeopleResult | undefined) => {
        if (!oldData) return;

        return {
          ...oldData,
          users: oldData.users.map((user) => {
            if (user.username === data.username) {
              return data;
            }

            return user;
          }),
        };
      });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        },
        (oldData: AugmentedPostPreview[] | undefined): AugmentedPostPreview[] | undefined => {
          if (!oldData) return;

          return oldData.map((post) => {
            if (post.author.id === data.id) {
              return {
                ...post,
                author: data,
              };
            }

            return post;
          });
        }
      );

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.SEARCH_POST_LIST],
        },
        (oldData: SearchTopResult | SearchLatestResult | undefined): SearchTopResult | SearchLatestResult | undefined => {
          console.log(oldData);
          if (!oldData) return;

          return {
            ...oldData,
            posts: oldData.posts.map((post) => {
              if (post.author.id === data.id) {
                return {
                  ...post,
                  author: data
                };
              }
              return post;
            }),
          };
        }
      );

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
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POST_LIST, QUERY_KEYS.SEARCH_TOP, query],
    queryFn: () => searchTop(query),
    refetchOnWindowFocus: false,
  });
}

export function useSearchLatest(query: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POST_LIST, QUERY_KEYS.SEARCH_LATEST, query],
    queryFn: () => searchLatest(query),
    refetchOnWindowFocus: false,
  });
}

export function useSearchPeople(query: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_PEOPLE, query],
    queryFn: () => searchPeople(query),
    refetchOnWindowFocus: false,
  });
}

export function useSearchMedia(query: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_MEDIA, query],
    queryFn: () => searchMedia(query),
    refetchOnWindowFocus: false,
  });
}

export function useAddBookmark(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => addBookmarkByPostId(postId),
    onSuccess: () => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        }
        , (oldData: AugmentedPostPreview[] | undefined) => {
          if (!oldData) return;

          return oldData.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                bookmarked: true,
              };
            }

            return post;
          });
        });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.SEARCH_POST_LIST],
        }
        , (oldData: SearchTopResult | SearchLatestResult | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            posts: oldData.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  bookmarked: true,
                };
              }

              return post;
            }),
          };
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
  return useMutation({
    mutationFn: () => removeBookmarkByPostId(postId),
    onSuccess: () => {
      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.QUERY_POST_LIST],
        }
        , (oldData: AugmentedPostPreview[] | undefined) => {
          if (!oldData) return;

          return oldData.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                bookmarked: false,
              };
            }

            return post;
          });
        });

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEYS.SEARCH_POST_LIST],
        }
        , (oldData: SearchTopResult | SearchLatestResult | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            posts: oldData.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  bookmarked: false,
                };
              }

              return post;
            }),
          };
        });

      queryClient.setQueryData([QUERY_KEYS.GET_POST_BY_ID, postId], (oldData: IPost | undefined) => {
        if (!oldData) return;

        return {
          ...oldData,
          bookmarked: false,
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
  return useQuery({
    queryKey: [QUERY_KEYS.QUERY_POST_LIST, QUERY_KEYS.GET_BOOKMARKS],
    queryFn: getBookmarkedPosts,
  });
}

export function useGetNotifications() {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_NOTIFICATIONS],
    queryFn: getNotifications,
  });
}