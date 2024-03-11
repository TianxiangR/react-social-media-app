import React, { useEffect, useRef, useState } from 'react';

import FollowPreview from '@/components/shared/FollowPreview';
import InViewContainer from '@/components/shared/InViewContainer';
import LikePreview from '@/components/shared/LikePreview';
import Loader from '@/components/shared/Loader';
import PostPreview from '@/components/shared/PostPreview';
import ReplyPreview from '@/components/shared/ReplyPreview';
import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import useIsPhoneScreen from '@/hooks/useIsPhoneScreen';
import { useGetNotifications, useMarkNotificationAsRead } from '@/react-query/queriesAndMutations';
import { Notification } from '@/types';

function NotificationsPage() {
  const [currentTab, setCurrentTab] = useState('all');
  const {data, isPending, isError, isFetchingNextPage, fetchNextPage} = useGetNotifications();
  const {user} = useUserContext();
  const {openDrawer} = useGlobalContext().drawer;
  const shouldHide = useIsPhoneScreen();
  const ref = useRef(null);
  const { mutateAsync: markAsRead } = useMarkNotificationAsRead();
  useHideOnScroll(shouldHide ? ref : undefined);

  const inViewMarkAsRead = (notification: Notification, id: string) => {
    if (notification.read === false) markAsRead(id);
  };

  const renderNotifications = () => {
    if (isPending) {
      return (
        <Loader />
      );
    } else if (isError) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <h2 className="text-xl font-bold">Error fetching notifications</h2>
        </div>
      );
    } else if (data) {
      const notifiations = data.pages.map((page) => page.results).flat();
      return (
        <ul className="post-list">
          {notifiations.map((notification, index) => { 
            let notificationComponent = <></>;

            if (notification.type === 'repost' || notification.type === 'reply') {
              notificationComponent = (
                <InViewContainer once onInview={() => inViewMarkAsRead(notification, notification.id)}>
                  <PostPreview post={notification.data} />
                </InViewContainer>
              );
            }
            else if (notification.type === 'like') {
              notificationComponent = (
                <InViewContainer once onInview={() => inViewMarkAsRead(notification, notification.id)}>
                  <LikePreview {...notification.data} />
                </InViewContainer>
              );
            }
            else if (notification.type === 'follow') {
              notificationComponent = (
                <InViewContainer once onInview={() => inViewMarkAsRead(notification, notification.id)}>
                  <FollowPreview {...notification.data} />
                </InViewContainer>
              );
            }

            if (index === notifiations.length - 5) {
              notificationComponent = (
                <InViewContainer onInview={fetchNextPage}>
                  {notificationComponent}
                </InViewContainer>
              );
            }

            return (
              <li key={notification.id} className="w-full">
                {notificationComponent}
              </li>
            );
          })}
          {
            isFetchingNextPage && 
            <li>
              <Loader />
            </li>
          }
        </ul>
      );
    }
  };

  return (
    <TabContext value={currentTab}>
      <div className='flex flex-col w-full'>
        <div className='sticky-bar flex-col flex' ref={ref}>
          <div className="flex flex-row justify-start p-4 gap-4 items-center h-12">
            <img src={user?.profile_image} alt="avatar" className="size-8 rounded-full inline-block md:hidden" onClick={openDrawer}/>
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