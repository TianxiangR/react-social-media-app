import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import React from 'react';
import { Link, useLocation, useParams} from 'react-router-dom';

import { routeConfig } from '@/configs';
import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';
import { useGetNotifications, useGetPostById,useGetUnreadNotificationsCount } from '@/react-query/queriesAndMutations';

import { Button } from '../ui/button';
import PostDialogContent from './CreatePostDialogContent';

function ChatButton() {
  const { postId = '' } = useParams();
  const { data: post } = useGetPostById(postId);
  const { openDialog } = useGlobalContext().dialog;

  return (
    post && 
    <button
      onClick={() => openDialog(() => <PostDialogContent variant="reply" parent_post={post} />)} 
      className='bg-blue rounded-full size-12 absolute right-3 top-[-0.75rem] text-white hover:bg-blue-100'
      style={{transform: 'translateY(-100%)'}}
    >
      <ChatBubbleOutlineOutlinedIcon sx={{fontSize: '28px'}} />
    </button>
  );
}


function BottomNavBar() {
  const { pathname } = useLocation();
  const { openDialog } = useGlobalContext().dialog;
  const location = useLocation();
  const {user} = useUserContext();
  const { data } = useGetUnreadNotificationsCount();
  const unread_count = data?.count || 0;
  const isPostPath = location.pathname.includes('/status');

  return (
    <div className='min-h-14 bg-white w-full px-4 flex relative'>
      { !isPostPath ?
        <button
          onClick={() => openDialog(() => <PostDialogContent variant="create" />)} 
          className='bg-blue rounded-full size-12 absolute right-3 top-[-0.75rem] text-white hover:bg-blue-100'
          style={{transform: 'translateY(-100%)'}}
        >
          <CreateOutlinedIcon sx={{fontSize: '28px'}} />
        </button>
        : <ChatButton />
      }

      <ul className="flex w-full flex-row justify-between items-center">
        {/* Routes */}
        {routeConfig.map((route) => {
          if (!route?.meta?.icon) return null;

          const isActive = pathname === route.path || pathname === route.path + '/' || (route.path === '/:username' && (pathname === `/${user?.username}` || pathname === `/${user?.username}/`) );
          const Icon = isActive ? route.meta.icon.active : route.meta.icon.inactive;
          const path = route.path === '/:username' ? `/${user?.username}` : route.path;
          const isNotification = route.label === 'Notifications';

          return (
            <li key={route.label} className="flex w-fit">
              <Link to={path} className="flex items-center gap-3 w-[auto] rounded-full p-2.5 select-none" onClick={(e) => {
                if (isActive) {
                  e.preventDefault();
                  window.scrollTo({top: 0, behavior: 'smooth'});
                }
              }}>
                <div className='relative'>
                  <Icon sx={{fontSize: '28px'}}/>
                  {
                    isNotification && unread_count > 0 && 
                    <div 
                      className="absolute rounded-full bg-blue border-white border-[1px] top-0 right-0 translate-x-[calc(100%-12px)] -translate-y-[33%]
                    justify-center flex items-center text-white text-xs leading-3 px-[3px] py-[2px] min-h-[18px] min-w-[18px] font-bold"
                    >
                      {unread_count > 99 ? '99+' : unread_count}
                    </div>
                  }
                </div>
              </Link>
            </li>
          );
        }
        )}
      </ul>
    </div>
  );
}

export default BottomNavBar;