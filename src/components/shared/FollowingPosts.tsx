import React, { useEffect } from 'react';

import CreatePostForm from '@/components/shared/CreatePostForm';
import PostPreview from '@/components/shared/PostPreview';
import { useGlobalContext } from '@/context/GlobalContext';
import { useGetPosts } from '@/react-query/queriesAndMutations';

import Loader from './Loader';


function FollowingPosts() {
  const globalContext = useGlobalContext();
  const { data: posts, isPending: isLoadingPosts } = globalContext.home.following.queryResults;

  return (
    <ul className="flex flex-col w-full h-full post-list">
      <li className="">
        <CreatePostForm />
      </li>
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

export default FollowingPosts;