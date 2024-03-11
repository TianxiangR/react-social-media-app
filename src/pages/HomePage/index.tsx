import XIcon from '@mui/icons-material/X';
import { Slide } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import CreatePostForm from '@/components/shared/CreatePostForm';
import NewPostIndicator from '@/components/shared/NewPostIndicator';
import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import useIsPhoneScreen from '@/hooks/useIsPhoneScreen';
import FollowingPosts from '@/pages/HomePage/Tabs/FollowingPosts';
import { IPostPreview } from '@/types';

import ForYouPosts from './Tabs/ForYou';

const mockData = [        {
  'id': 'a6c4cfed-9c6d-441a-8808-86215f553fca',
  'author': {
    'id': '0ec00ed2-9c17-46ce-b2a7-a5f8ea23fa8b',
    'username': 'Tian',
    'email': 'tian@tiantian.com',
    'name': 'Tian',
    'date_of_birth': '2000-06-29',
    'created_at': '2024-02-24T11:54:09.588061Z',
    'profile_image': 'http://localhost:8000/media/profile_images/profile_QFY5cbb.png',
    'bio': '',
    'location': '',
    'followers': 1,
    'following': 1,
    'website': '',
    'header_photo': null,
    'is_following': true
  },
  'content': 'lalalala',
  'created_at': '2024-03-11T01:49:40.422039Z',
  'images': [],
  'liked': false,
  'reply_count': 0,
  'repost_count': 0,
  'like_count': 0,
  'view_count': 0,
  'bookmark_count': 0,
  'bookmarked': false,
  'reposted': false,
  'repost_parent': null,
  'reply_parent': null
},
] as IPostPreview[];
function Home() {
  const globalContext = useGlobalContext();
  const { currentTab, setCurrentTab } = globalContext.home;
  const { user } = useUserContext();
  const { openDrawer } = useGlobalContext().drawer;
  const shouldHide = useIsPhoneScreen();
  const hideRef = useRef(null);
  const [forYouNewPosts, setForYouNewPosts] = useState<IPostPreview[] | undefined>(undefined);
  const [followingNewPosts, setFollowingNewPosts] = useState<IPostPreview[] | undefined>(undefined);
  const newPosts = currentTab === 'for-you' ? forYouNewPosts : followingNewPosts;
  useHideOnScroll(shouldHide ? hideRef : undefined);
  const newPostRef = useRef<HTMLDivElement>(null);

  const onForYouNewPosts = (posts: IPostPreview[] | undefined) => {
    setForYouNewPosts(posts);
  };

  const onFollowingNewPosts = (posts: IPostPreview[] | undefined) => {
    setFollowingNewPosts(posts);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <TabContext value={currentTab}>
        <div className='sticky-bar top-0 z-10' ref={hideRef}>
          <div className="relative">
            <div className="z-20">
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
              <div className="absolute w-full flex justify-center items-center bottom-0 z-[-1] pt-4 transition-all ease-in-out"
                style={{
                  transform: `translateY(${newPosts?.length ? '100%' : '0'})`,
                  opacity: newPosts?.length ? 1 : 0,
                }}
              >
                <NewPostIndicator posts={newPosts || []} />
              </div>
            </div>

          </div>
        </div>
        <TabPanel value="for-you" className="flex flex-col">
          <ForYouPosts onNewPosts={onForYouNewPosts} />
        </TabPanel>
        <TabPanel value="following" className="h-full">
          <FollowingPosts onNewPosts={onFollowingNewPosts}/>
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Home;