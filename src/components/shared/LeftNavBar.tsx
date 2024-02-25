
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

function LeftNavBar() {
  const { pathname } = useLocation();
  const { openDialog } = useGlobalContext().dialog;
  const {user} = useUserContext();
  const navigate = useNavigate();

  console.log(pathname);

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    navigate('/');
  };

  const handlePostClick = () => {
    openDialog(() => <PostDialogContent variant="create" />);
  };

  return (
    <nav className="h-screen flex flex-col justify-between w-[4rem] min-w-[4rem] lg:w-[260px] items-center lg:items-start">
      <ul className="flex w-fit lg:w-full flex-col gap-3 pt-2 px-[8px] box-border">
        {/* Logo */}
        <li className="flex w-fit">
          <Link to='/home' className="flex items-center gap-3 w-fit rounded-full p-2.5 hover:bg-[#e7e7e8]">
            <XIcon sx={{fontSize: '28px'}}/>
          </Link>
        </li>

        {/* Routes */}
        {routeConfig.map((route) => {
          if (!route?.meta?.icon) return null;

          const isActive = pathname === route.path || pathname === route.path + '/' || (route.path === '/:username' && (pathname === `/${user?.username}` || pathname === `/${user?.username}/`) );
          const Icon = isActive ? route.meta.icon.active : route.meta.icon.inactive;
          const path = route.path === '/:username' ? `/${user?.username}` : route.path;

          return (
            <li key={route.label} className="flex w-fit">
              <Link to={path} className="flex items-center gap-3 w-[auto] rounded-full p-2.5 hover:bg-[#e7e7e8] select-none">
                <Icon sx={{fontSize: '28px'}}/>
                <span className={`${isActive ? 'text-black font-bold' : 'text-[#0f1419]'} text-[20px] select-none hidden lg:flex`}>
                  {route.label}
                </span>
              </Link>
            </li>
          );
        }
        )}
        <li className="w-fit lg:w-full">
          <Button className="w-fit aspect-square lg:w-[233px] lg:aspect-auto h-12 bg-blue rounded-full hover:bg-blue-100" onClick={handlePostClick}>
            <div className="flex lg:hidden">
              <CreateOutlinedIcon sx={{fontSize: '24px'}}/>
            </div>
            <span className="font-bold text-[18px] hidden lg:inline">Post</span>
          </Button>
        </li>
      </ul>

      {/* User */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="w-auto lg:w-full mb-3 hover:cursor-pointer min-w-fit">
            <div className="w-full flex rounded-full hover:bg-[#e7e7e8] p-3 aspect-square lg:aspect-auto">
              <div className="w-full flex justify-between">
                <div className="flex gap-3 items-center">
                  <img src={user?.profile_image} className="profile-image" />
                  <div className="flex-col hidden lg:flex justify-between">
                    <span className="text-[#0f1419] font-bold text-[14px]">{user?.name}</span>
                    <span className="text-[#75828d] text-[14px]">@{user?.username}</span>
                  </div>
                </div>
                <div className="hidden lg:flex justify-center items-center">
                  <MoreHorizOutlinedIcon sx={{fontSize: '24px'}}/>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px] rounded-[14px] py-2 px-0">
          <DropdownMenuItem className="py-4 px-4 hover:cursor-pointer">
            <p className="text-[16px] font-bold">
              Add an existing account
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-4 px-4 hover:cursor-pointer" onClick={logout}>
            <p className="text-[16px] font-bold">
              Log out @{user?.username}
            </p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export default LeftNavBar;