import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSearchLatest } from '@/react-query/queriesAndMutations';

import Loader from './Loader';
import PostPreview from './PostPreview';

function SearchLatest() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {data: lastest_post, isFetching, isError, refetch} = useSearchLatest(searchParams.get('q') || '');

  const renderPosts = () => {
    if (isFetching) {
      return (
        <div className="mt-10">
          <Loader />
        </div>
      );
    }
    else if (isError) {
      // no-op
    }
    else if (lastest_post) {
      return (
        <ul className="post-list">
          {
            lastest_post.posts.map((post) => (
              <li key={post.id} >
                <PostPreview {...post} />
              </li>
            ))
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

export default SearchLatest;