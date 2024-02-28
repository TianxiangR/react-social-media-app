import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate,useSearchParams  } from 'react-router-dom';

import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import { QUERY_KEYS } from '@/react-query/queryKeys';

import Latest from './Tabs/Latest';
import Media from './Tabs/Media';
import People from './Tabs/People';
import Top from './Tabs/Top';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputText, setInputText] = useState<string>(searchParams.get('q') || '');
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
          <Top setCurrentTab={setCurrentTab} />
        </TabPanel>
        <TabPanel value="latest" className="flex flex-col">
          <Latest />
        </TabPanel>
        <TabPanel value="people" className="flex flex-col">
          <People />
        </TabPanel>
        <TabPanel value="media">
          <Media />
        </TabPanel>
      </div>
    </TabContext>
  );
}

export default SearchPage;