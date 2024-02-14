import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutLinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import React from 'react';

import Home from '@/pages/HomePage';
import PostPage from '@/pages/PostPage';
import ProfilePage from '@/pages/ProfilePage';

export const routeConfig = [
  {
    path: '/home',
    element: <Home />,
    label: 'Home',
    meta: {
      icon: {
        active: HomeIcon, 
        inactive: HomeOutLinedIcon
      }
    }
  },
  {
    path: '/explore',
    element: <h1>Explore</h1>,
    label: 'Explore',
    meta: {
      icon: {
        active: SearchIcon,
        inactive: SearchOutlinedIcon
      }
    }
  },
  {
    path: '/notifications',
    element: <h1>Notifications</h1>,
    label: 'Notifications',
    meta: {
      icon : {
        active: NotificationsIcon,
        inactive: NotificationsNoneOutlinedIcon
      }
    }
  },
  {
    path: '/bookmarks',
    element: <h1>Bookmarks</h1>,
    label: 'Bookmarks',
    meta: {
      icon: {
        active: BookmarkIcon,
        inactive: BookmarkBorderOutlinedIcon
      }
    }
  },
  {
    path: '/:username',
    element: <ProfilePage />,
    label: 'Profile',
    meta: {
      icon: {
        active: PersonIcon,
        inactive: PersonOutlinedIcon
      }
    }
  },
  {
    path: '/:username/status/:postId',
    element: <PostPage />,
    label: 'Post'
  }
];