import React from 'react';

import CreatePostForm from '@/components/shared/CreatePostForm';
import PostPreview from '@/components/shared/PostPreview';
import { useGlobalContext } from '@/context/GlobalContext';
import { useGetUserPosts } from '@/react-query/queriesAndMutations';

import Loader from './Loader';

export interface UserPostsProps {
  username: string;
}

function UserPosts({ username }: UserPostsProps) {
  const { data: posts, isPending: isLoadingPosts } = useGetUserPosts(username);

  return (
    <ul className="flex flex-col w-full h-full post-list">
      {
        isLoadingPosts ? <Loader /> :
          posts?.map((post) => {
            return (
              <li key={post.id} className="flex">
                <PostPreview {...post} />
              </li>
            );
          })
      }
    </ul>
  );
}

export default UserPosts;