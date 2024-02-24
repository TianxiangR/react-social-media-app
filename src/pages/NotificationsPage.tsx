import React, { useState } from 'react';

import FollowPreview from '@/components/shared/FollowPreview';
import LikePreview from '@/components/shared/LikePreview';
import Loader from '@/components/shared/Loader';
import PostPreview from '@/components/shared/PostPreview';
import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import { useGetNotifications } from '@/react-query/queriesAndMutations';

function NotificationsPage() {
  const [currentTab, setCurrentTab] = useState('all');
  const {data: notifications, isPending, isError} = useGetNotifications();

  const renderNotifications = () => {
    if (isPending) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <Loader />
        </div>
      );
    } else if (isError) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <h2 className="text-xl font-bold">Error fetching notifications</h2>
        </div>
      );
    } else if (notifications) {
      return (
        <ul className="post-list">
          {notifications.map((notification) => {
            if (notification.type === 'repost' || notification.type === 'reply') {
              return (
                <li key={notification.id}>
                  <PostPreview {...notification.data} />
                </li>
              );
            }
            else if (notification.type === 'like') {
              return (
                <li key={notification.id}>
                  <LikePreview {...notification.data} />
                </li>
              );
            }
            else if (notification.type === 'follow') {
              return (
                <li key={notification.id}>
                  <FollowPreview {...notification.data} />
                </li>
              );
            }
          })}
        </ul>
      );
    }
  };

  return (
    <TabContext value={currentTab}>
      <div className='flex flex-col w-full'>
        <div className='sticky-bar flex-col flex'>
          <div className="flex flex-row justify-start px-4 py-2">
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>
          <TabList className="flex w-full h-[53px]" onChange={(e, value) => setCurrentTab(value as any)}>
            <Tab label="All" value="all" />
            <Tab label="Mentions" value="mentions" />
          </TabList>
        </div>
        <TabPanel value="all">
          {renderNotifications()}
        </TabPanel>
        <TabPanel value="mentions">

        </TabPanel>
      </div>
    </TabContext>
  );
}

export default NotificationsPage;