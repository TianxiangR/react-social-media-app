import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router-dom';

import Loader from '@/components/shared/Loader';
import PostPreview from '@/components/shared/PostPreview';
import { useSearchLatest } from '@/react-query/queriesAndMutations';

function Latest() {
  const [searchParams] = useSearchParams();
  const {data, isPending, isError, fetchNextPage, isFetchingNextPage} = useSearchLatest(searchParams.get('q') || '');
  const { ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const renderPosts = () => {
    if (isPending) {
      return (
        <Loader />
      );
    }
    else if (isError) {
      return (
        <div className="mt-10">
          <p className="text-red-500">Error fetching data</p>
        </div>
      );
    }
    else if (data) {
      const posts = data.pages.map((page) => page.results).flat();

      return (
        <ul className="post-list">
          {
            posts.map((post, index) => {
              if (index === posts.length - 5) {
                return (
                  <li key={post.id} ref={ref}>
                    <PostPreview post={post} />
                  </li>
                );
              }

              return (
                <li key={post.id}>
                  <PostPreview post={post} />
                </li>
              );
            })
          }
          {
            isFetchingNextPage && (
              <Loader />
            )
          }
        </ul>
      );
    }
  };

  return (
    <>
      {renderPosts()}
    </>
  );
}

export default Latest;