import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMediaQuery } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import IconButton from '@/components/shared/IconButton';
import Loader from '@/components/shared/Loader';
import PostPreview from '@/components/shared/PostPreview';
import { useUserContext } from '@/context/AuthContext';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import { useGetBookmarkedPosts } from '@/react-query/queriesAndMutations';

function BookmarksPage() {
  const { user } = useUserContext();
  const { data: posts, isPending, isError } = useGetBookmarkedPosts();
  const navigate = useNavigate();

  const shouldHide = useMediaQuery('(max-width: 768px)');
  const fakeRef = useRef(null);
  const ref = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  useHideOnScroll(shouldHide ? ref : fakeRef, scrollPos);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <div className="flex sticky-bar px-4 py-2 gap-5 items-center h-[53px]" ref={ref}>
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