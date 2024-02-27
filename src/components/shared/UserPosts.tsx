import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import CreatePostForm from '@/components/shared/CreatePostForm';
import PostPreview from '@/components/shared/PostPreview';
import { useGlobalContext } from '@/context/GlobalContext';
import { useGetUserPosts } from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview } from '@/types';

import Loader from './Loader';

export interface UserPostsProps {
  username: string;
}

function UserPosts({ username }: UserPostsProps) {
  const { data, isPending: isLoadingPosts, isError, fetchNextPage } = useGetUserPosts(username);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const renderPosts = () => {
    if (isLoadingPosts) {
      return <Loader />;
    } else if (isError) {
      return <div>Failed to load posts</div>;
    } else if (data) {
      const posts = data.pages.map((page) => page.results).flat();
      return posts.map((post, index) => {
        if (index === posts.length - 5) {
          return (
            <li key={post.id} className="w-full" ref={ref}>
              <PostPreview {...post} />
            </li>
          );
        }
      
        return (
          <li key={post.id} className="w-full">
            <PostPreview {...post} />
          </li>
        );
      });
    }
  };


  return (
    <ul className="flex flex-col w-full h-full post-list">
      {renderPosts()}
    </ul>
  );
}

export default UserPosts;