import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import CreatePostForm from '@/components/shared/CreatePostForm';
import PostPreview from '@/components/shared/PostPreview';
import { useGetPosts } from '@/react-query/queriesAndMutations';

import Loader from '../../../components/shared/Loader';


function FollowingPosts() {
  const { data: response, isPending: isLoadingPosts, isError, fetchNextPage, isFetchingNextPage } = useGetPosts();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    console.log(response);
  }, [response]);


  const renderPosts = () => {
    if (isLoadingPosts) {
      return <Loader />;
    }
    else if (isError) {
      return <div>Failed to load posts</div>;
    }
    else if (response) {
      const posts = response.pages.map((page) => page.results).flat();
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

export default FollowingPosts;