import React from 'react';

import Loader from '@/components/shared/Loader';
import PostPreview from '@/components/shared/PostPreview';
import { useUserContext } from '@/context/AuthContext';
import { useGetBookmarkedPosts } from '@/react-query/queriesAndMutations';

function BookmarksPage() {
  const { user } = useUserContext();
  const { data: posts, isPending, isError } = useGetBookmarkedPosts();

  const renderPosts = () => {
    if (isPending) {
      return (
        <div className="mt-10 flex justify-center items-center">
          <Loader />
        </div>
      );
    } else if (isError) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <h2 className="text-xl font-bold">Error fetching bookmarks</h2>
        </div>
      );
    } else if (posts) {
      return (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id}>
              <PostPreview {...post} />
            </li>
          ))}
        </ul>
      );
    }
  };


  return (
    <div className="flex flex-col w-full relative">
      <div className="flex sticky-bar px-4 py-2">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Bookmarks</h2>
          <span className="text-sm text-[#536471]">{`@${user?.username}`}</span>
        </div>
      </div>
      {renderPosts()}
    </div>
  );
}

export default BookmarksPage;