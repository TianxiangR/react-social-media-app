import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPost, deletePostById, getPostById, getPosts, likePost, queryLikesByUsername, queryMediaByUsername, queryPostsByUsername, queryUserByUsername, replyPostById, repostPostById, unlikePost } from '@/apis';
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
      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_USER_MEDIA],
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

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        }
      );

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_USER_LIKES],
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

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        }
      );

      queryClient.invalidateQueries(
        {
          queryKey: [QUERY_KEYS.GET_USER_LIKES],
        }
      );
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

export function useRepostPostById(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: Partial<NewPost>) => repostPostById(postId, post),
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

export function useGetUserProfile(username: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_PROFILE, username],
    queryFn: () => queryUserByUsername(username),
  });
}

export function useGetUserPosts(username: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS],
    queryFn: () => queryPostsByUsername(username),
  });
}

export function useGetUserLikes(username: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_LIKES],
    queryFn: () => queryLikesByUsername(username),
  });
}

export function useGetUserMedia(username: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_MEDIA, username],
    queryFn: () => queryMediaByUsername(username)
  });
}