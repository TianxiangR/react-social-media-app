import React, { useEffect, useState } from 'react';
import { ScrollRestoration } from 'react-router-dom';

import CreatePostForm from '@/components/shared/CreatePostForm';
import FollowingPosts from '@/components/shared/FollowingPosts';
import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import { useGlobalContext } from '@/context/GlobalContext';


function Home() {
  const globalContext = useGlobalContext();
  const { currentTab, setCurrentTab } = globalContext.home;
  const tabClassName = 'text-base font-bold';

  useEffect(() => {
    if (currentTab === 'for-you') {
      globalContext.home.for_you.setScrollY(globalContext.globalScrollY);
    } else if (currentTab === 'following') {
      globalContext.home.following.setScrollY(globalContext.globalScrollY);
    }
  }, [currentTab, globalContext.globalScrollY]);

  return (
    <div className="min-h-full border-r-[1px] border-[#eff3f4] w-[600px] max-w-[600px]">
      <TabContext value={currentTab}>
        <TabList
          onChange={(e, value) => {setCurrentTab(value as any);}} className="h-14 top-0 border-[#eff3f4] border-b-[1px] z-10 sticky-bar"
        >
          <Tab value="for-you" label="For You" className={tabClassName}/>
          <Tab value="following" label="Following" className={tabClassName}/>
        </TabList>
        <TabPanel value="for-you" className="flex flex-col">
          <ul className="flex flex-col w-full">
            <li className="border-b-[1px] border-[#eff3f4]">
              <CreatePostForm />
            </li>
          </ul>
        </TabPanel>
        <TabPanel value="following" className="h-full">
          <FollowingPosts />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Home;