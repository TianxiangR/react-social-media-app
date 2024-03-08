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

import BookmarksPage from '@/pages/BookmarksPage';
import ExplorePage from '@/pages/ExplorePage';
import FollowPage from '@/pages/FollowPage';
import Home from '@/pages/HomePage';
import NotificationsPage from '@/pages/NotificationsPage';
import PostPage from '@/pages/PostPage';
import ProfilePage from '@/pages/ProfilePage';
import SearchPage from '@/pages/SearchPage';

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
    element: <ExplorePage />,
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
    element: <NotificationsPage />,
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
    element: <BookmarksPage />,
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
  },
  {
    path: '/search',
    element: <SearchPage />,
    label: 'Search'
  },
  {
    path: '/:username/:tab',
    element: <FollowPage />,
    label: 'Follow'
  }
];