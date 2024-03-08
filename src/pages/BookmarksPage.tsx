import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import IconButton from '@/components/shared/IconButton';
import Loader from '@/components/shared/Loader';
import PostPreview from '@/components/shared/PostPreview';
import { useUserContext } from '@/context/AuthContext';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import useIsPhoneScreen from '@/hooks/useIsPhoneScreen';
import { useGetBookmarkedPosts } from '@/react-query/queriesAndMutations';

function BookmarksPage() {
  const { user } = useUserContext();
  const { data, isPending, isError, fetchNextPage, isFetchingNextPage } = useGetBookmarkedPosts();
  const navigate = useNavigate();
  const { ref: viewRef, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const shouldHide = useIsPhoneScreen();
  const ref = useRef(null);
  useHideOnScroll(shouldHide ? ref : undefined);

  const renderPosts = () => {
    if (isPending) {
      return (
        <Loader />
      );
    } else if (isError) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <h2 className="text-xl font-bold">Error fetching bookmarks</h2>
        </div>
      );
    } else if (data) {
      const posts = data.pages.map((page) => page.results).flat();
      return (
        <ul className="post-list">
          {posts.map((post, index) => {
            if (index === posts.length - 5) {
              return (
                <li key={post.id} ref={inView ? viewRef : undefined}>
                  <PostPreview post={post} />
                </li>
              );
            }

            return (
              <li key={post.id}>
                <PostPreview post={post} />
              </li>
            );
          })}
          {
            isFetchingNextPage && 
              <Loader />
          }
        </ul>
      );
    }
  };


  return (
    <div className="flex flex-col w-full relative">
      <div className="flex sticky-bar px-4 py-2 gap-5 items-center h-[53px]" ref={viewRef}>
        <div className='block md:hidden'>
          <IconButton className="text-xl" onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{fontSize: '24px'}}/>
          </IconButton>
        </div>
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