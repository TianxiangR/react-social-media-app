import React from 'react';

import CreatePostForm from '@/components/shared/CreatePostForm';
import PostPreview from '@/components/shared/PostPreview';
import { useGlobalContext } from '@/context/GlobalContext';
import { useGetUserLikes } from '@/react-query/queriesAndMutations';

import Loader from './Loader';

export interface UserLikesProps {
  username: string;
}

function UserLikes({ username }: UserLikesProps) {
  const { data: posts, isPending: isLoadingPosts } = useGetUserLikes(username);

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

export default UserLikes;