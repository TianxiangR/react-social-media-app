
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

import { Button } from '../ui/button';
import CreatePostDialog from './CreatePostDialog';

function LeftNavBar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const user = useUserContext();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    navigate('/');
  };

  const handlePostClick = () => {
    setOpen(true);
  };

  return (
    <nav className="h-screen flex flex-col justify-between border-r-[1px] border-[#eff3f4] w-[260px]">
      <ul className="flex w-full flex-col gap-3 pt-2 px-[8px]">
        {/* Logo */}
        <li>
          <Link to='/home' className="flex items-center gap-3 w-fit rounded-full p-2.5 hover:bg-[#e7e7e8]">
            <XIcon sx={{fontSize: '24px'}}/>
          </Link>
        </li>

        {/* Routes */}
        {routeConfig.map((route) => {
          if (!route?.meta?.icon) return null;

          const isActive = pathname === route.path;
          const Icon = isActive ? route.meta.icon.active : route.meta.icon.inactive;
          const path = route.path === '/:username' ? `/${user?.username}` : route.path;

          return (
            <li key={route.label} className="flex">
              <Link to={path} className="flex items-center gap-3 w-[auto] rounded-full p-2.5 hover:bg-[#e7e7e8]">
                <Icon sx={{fontSize: '24px'}}/>
                <span className={`${isActive ? 'text-black font-bold' : 'text-[#0f1419]'} text-[20px]`}>
                  {route.label}
                </span>
              </Link>
            </li>
          );
        }
        )}
        <li className="w-full pr-4 mt-4">
          <Button className="w-full h-12 bg-blue rounded-full hover:bg-blue-100" onClick={handlePostClick}>
            <span className="font-bold text-[18px]">Post</span>
          </Button>
        </li>
      </ul>

      {/* User */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-full mb-3 px-2 hover:cursor-pointer">
            <div className="w-full flex rounded-full hover:bg-[#e7e7e8] py-2 pl-3 pr-4 items-center justify-between">
              <div className="flex gap-3 items-center">
                <img src={user?.profile_image} className="profile-image" />
                <div className="flex flex-col">
                  <p className="text-[#0f1419] font-bold text-[16px]">{user?.name}</p>
                  <p className="text-[#75828d] text-[16px]">@{user?.username}</p>
                </div>
              </div>
              <MoreHorizOutlinedIcon sx={{fontSize: '24px'}}/>
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
      <CreatePostDialog open={open} onClose={() => setOpen(false)}/>
    </nav>
  );
}

export default LeftNavBar;