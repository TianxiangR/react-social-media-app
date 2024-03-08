import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Drawer } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { TOKEN_STORAGE_KEY } from '@/constants';
import { useUserContext } from '@/context/AuthContext';

export interface LeftDrawerProps {
  open: boolean;
  onClose?: () => void;
}

function LeftDrawer({ open, onClose }: LeftDrawerProps) {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const logout = () => {
    onClose?.();
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    navigate('/');
  };

  return (
    <Drawer open={open} onClose={onClose} anchor='left'>
      <div className='flex flex-col p-4 min-w-[280px]'>
        <div className='flex flex-col'>
          <img src={user?.profile_image} alt='avatar' className='size-10 rounded-full'/>
          <h2 className='text-[20px] font-bold mt-2'>{user?.name}</h2>
          <span className='text-[#75828d] text-base'>@{user?.username}</span>
          <div className="flex w-full mt-4">
            <Link className="flex mr-4 hover:underline whitespace-pre-wrap" to={`/${user?.username}/following`} onClick={() => onClose?.()}>
              <span className="text-sm text-[#0f1419] font-bold">{user?.following}</span>
              <span className="text-sm text-[#536471]"> Following</span>
            </Link>
            <Link className="flex hover:underline whitespace-pre-wrap" to={`/${user?.username}/followers`} onClick={() => onClose?.()}>
              <span className="text-sm text-[#0f1419] font-bold">{user?.followers}</span>
              <span className="text-sm text-[#536471] "> Follower{user?.followers !== 1 ? 's' : ''}</span>
            </Link>
          </div>
        </div>
        <ul className='flex flex-col mt-10 w-full'>
          <li className='flex gap-4 text-[#0f1419] w-full cursor-pointer' onClick={logout}>
            <LogoutOutlinedIcon sx={{fontSize: '24px', color:'#0f1419'}}/>
            <span className='text-[#0f1419] font-bold'>Log out</span>
          </li>
        </ul>
      </div>
    </Drawer>
  );
}

export default LeftDrawer;