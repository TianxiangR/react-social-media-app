import React from 'react';

import CreatePostForm from '@/components/shared/CreatePostForm';
import FollowingPosts from '@/components/shared/FollowingPosts';
import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import { useGlobalContext } from '@/context/GlobalContext';


function Home() {
  const globalContext = useGlobalContext();
  const { currentTab, setCurrentTab } = globalContext.home;

  return (
    <div className="h-full w-full">
      <TabContext value={currentTab}>
        <TabList
          onChange={(e, value) => {setCurrentTab(value as any);}} className="h-14 top-0 border-[#eff3f4] border-b-[1px] z-10 sticky-bar"
        >
          <Tab value="for-you" label="For You"/>
          <Tab value="following" label="Following"/>
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