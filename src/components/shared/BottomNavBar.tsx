import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import XIcon from '@mui/icons-material/X';
import React, {  useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { routeConfig } from '@/configs';
import { TOKEN_STORAGE_KEY } from '@/constants';
import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';

import { Button } from '../ui/button';
import PostDialogContent from './CreatePostDialogContent';

function BottomNavBar() {
  const { pathname } = useLocation();
  const { openDialog } = useGlobalContext().dialog;
  const {user} = useUserContext();
  const navigate = useNavigate();

  return (
    <div className='min-h-14 bg-white w-full px-4 flex'>
      <ul className="flex w-full flex-row justify-between items-center">
        {/* Routes */}
        {routeConfig.map((route) => {
          if (!route?.meta?.icon) return null;

          const isActive = pathname === route.path || pathname === route.path + '/' || (route.path === '/:username' && (pathname === `/${user?.username}` || pathname === `/${user?.username}/`) );
          const Icon = isActive ? route.meta.icon.active : route.meta.icon.inactive;
          const path = route.path === '/:username' ? `/${user?.username}` : route.path;

          return (
            <li key={route.label} className="flex w-fit">
              <Link to={path} className="flex items-center gap-3 w-[auto] rounded-full p-2.5 select-none">
                <Icon sx={{fontSize: '28px'}}/>
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