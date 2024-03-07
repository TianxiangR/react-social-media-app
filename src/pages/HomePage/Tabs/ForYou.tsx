import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import CreatePostForm from '@/components/shared/CreatePostForm';
import PostPreview from '@/components/shared/PostPreview';
import { useGetTopRatedPosts } from '@/react-query/queriesAndMutations';

import Loader from '../../../components/shared/Loader';


function ForYouPosts() {   
  const { data, isPending: isLoadingPosts, isError, fetchNextPage, isFetchingNextPage } = useGetTopRatedPosts();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const renderPosts = () => {
    if (isLoadingPosts) {
      return <Loader />;
    }
    else if (isError) {
      return <div>Failed to load posts</div>;
    }
    else if (data) {
      const posts = data.pages.map((page) => page.results).flat();
      return posts.map((post, index) => {
        if (index === posts.length - 5) {
          return (
            <li key={post.id} className="w-full" ref={ref}>
              <PostPreview post={post} />
            </li>
          );
        }

        return (
          <>
            <li key={post.id} className="w-full">
              <PostPreview post={post} />
            </li>
          </>
        );
      });
    }
  };

  return (
    <ul className="flex flex-col w-full h-full post-list">
      <li className="">
        <CreatePostForm />
      </li>
      {
        renderPosts()
      }
      {
        isFetchingNextPage && <Loader />
      }
    </ul>
  );
}

export default ForYouPosts;