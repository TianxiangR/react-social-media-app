import XIcon from '@mui/icons-material/X';
import React, { useEffect, useRef, useState } from 'react';

import CreatePostForm from '@/components/shared/CreatePostForm';
import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import useIsPhoneScreen from '@/hooks/useIsPhoneScreen';
import FollowingPosts from '@/pages/HomePage/Tabs/FollowingPosts';

import ForYouPosts from './Tabs/ForYou';

function Home() {
  const globalContext = useGlobalContext();
  const { currentTab, setCurrentTab } = globalContext.home;
  const { user } = useUserContext();
  const { openDrawer } = useGlobalContext().drawer;
  const shouldHide = useIsPhoneScreen();
  const ref = useRef(null);
  useHideOnScroll(shouldHide ? ref : undefined);

  return (
    <div className="h-full w-full flex flex-col">
      <TabContext value={currentTab}>
        <div className='sticky-bar top-0 z-10' ref={ref}>
          <div className="flex md:hidden w-full h-[53px] flex-row justify-between items-center px-4 py-2">
            <img src={user?.profile_image} alt="avatar" className="size-8 rounded-full" onClick={openDrawer}/>
            <XIcon sx={{fontSize: '26px'}}/>
            <XIcon sx={{fontSize: '24px', opacity: 0}}/>
          </div>
          <TabList
            onChange={(e, value) => {setCurrentTab(value as any);}} className="h-14 top-0 border-[#eff3f4] border-b-[1px]"
          >
            <Tab value="for-you" label="For You"/>
            <Tab value="following" label="Following"/>
          </TabList>
        </div>
        <TabPanel value="for-you" className="flex flex-col">
          <ForYouPosts />
        </TabPanel>
        <TabPanel value="following" className="h-full">
          <FollowingPosts />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Home;