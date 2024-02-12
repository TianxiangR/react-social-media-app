import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPost, deletePostById, getPostById, getPosts, likePost, replyPostById, unlikePost } from '@/apis';
import { NewPost } from '@/types';

import { QUERY_KEYS } from './queryKeys';

export function useCreatePost () {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
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

export function useGetPosts () {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getPosts,
  });
}

export function useLikePost (postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
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

export function useUnlikePost (postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unlikePost(postId),
    onSuccess: () => {
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

export function useGetPostById (postId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, postId],
    queryFn: () => getPostById(postId),
  });
}

export function useDeletePostById (postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deletePostById(postId),
    onSuccess: () => {
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

export function useReplyPostById(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: NewPost) => replyPostById(postId, post),
    onSuccess: () => {
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