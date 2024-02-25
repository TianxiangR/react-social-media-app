import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate,useSearchParams  } from 'react-router-dom';

import Loader from '@/components/shared/Loader';
import PostPreview from '@/components/shared/PostPreview';
import SearchLatest from '@/components/shared/SearchLatest';
import SearchMedia from '@/components/shared/SearchMedia';
import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import UserPreview from '@/components/shared/UserPreview';
import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import { useSearchTop } from '@/react-query/queriesAndMutations';
import { QUERY_KEYS } from '@/react-query/queryKeys';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputText, setInputText] = useState<string>(searchParams.get('q') || '');
  const {data: searchResults, isFetching, isError} = useSearchTop(searchParams.get('q') || '');
  const [currentTab, setCurrentTab] = useState('top');
  const queryClient = useQueryClient();
  const {user} = useUserContext();
  const {openDrawer} = useGlobalContext().drawer;
  const naivgate = useNavigate();
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
  useEffect(() => {
    if (searchParams.get('q') === null || searchParams.get('q') === '') {
      naivgate('/explore');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleEnterKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputText.length > 0) {
      const prev = searchParams.get('q');
      setSearchParams({q: inputText});

      if (prev === inputText) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SEARCH_TOP],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SEARCH_LATEST],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SEARCH_MEDIA],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SEARCH_PEOPLE],
        });
      }
    }
  };

  const renderTop = useMemo(() => {
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
    else if (searchResults) {
      return (
        <div className="post-list">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold px-4 py-2">People</h1>
            <ul className="flex flex-col">
              {
                searchResults.users.slice(0, 3).map((user) => (
                  <li key={user.id} >
                    <UserPreview {...user} />
                  </li>
                ))
              }
              <li 
                className="p-4 w-full hover:bg-[#f7f7f7] hover:cursor-pointer text-blue"
                onClick={() => setCurrentTab('people')}
              >
                View all
              </li>
            </ul>
          </div>
          {
            searchResults.posts.length > 0 && (
              <div className="flex flex-col">
                <ul className="post-list">
                  {
                    searchResults.posts.map((post) => (
                      <li key={post.id} >
                        <PostPreview {...post} />
                      </li>
                    ))
                  }
                </ul>
              </div>
            )
          }
        </div>
      );
    }
  }, [searchResults, isFetching, isError]);

  const renderPeople = useMemo(() => {
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
    else if (searchResults) {
      return (
        <ul className="flex flex-col">
          {
            searchResults.users.map((user) => (
              <li key={user.id} >
                <UserPreview {...user} />
              </li>
            ))
          }
        </ul>
      );
    }
  }, [searchResults, isFetching, isError]);

  return (
    <TabContext value={currentTab}>
      <div className="flex flex-col w-full post-list relative">
        <div className="flex sticky-bar top-0 flex-col z-10" ref={ref}>
          <div className="w-full px-4 pt-2 pb-1 flex gap-4 items-center">
            <img src={user?.profile_image} alt="" className="size-8 rounded-full inline-block md:hidden" onClick={openDrawer}/>
            <div className="flex flex-row flex-1 bg-[#eff3f4] px-4 py-2 
            rounded-full items-center h-[42px] gap-4 border-[1px] has-[:focus]:bg-transparent
             has-[:focus]:border-blue has-[:focus]:text-blue">
              <SearchIcon />
              <input 
                type="text" 
                className="bg-transparent outline-none w-full flex-1 focus:text-black" 
                placeholder="Search" 
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleEnterKeydown}
              />
            </div>
          </div>
          <TabList onChange={(e, value) => {setCurrentTab(value as any);}} className="">
            <Tab value="top" label="Top"/>
            <Tab value="latest" label="Latest"/>
            <Tab value='people' label="People"/>
            <Tab value="media" label="Media"/>
          </TabList>
        </div>
        <TabPanel value="top" className="flex flex-col">
          {renderTop}
        </TabPanel>
        <TabPanel value="latest" className="flex flex-col">
          <SearchLatest />
        </TabPanel>
        <TabPanel value="people" className="flex flex-col">
          {renderPeople}
        </TabPanel>
        <TabPanel value="media">
          <SearchMedia />
        </TabPanel>
      </div>
    </TabContext>
  );
}

export default SearchPage;