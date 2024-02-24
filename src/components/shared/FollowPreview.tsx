
import PersonIcon from '@mui/icons-material/Person';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {  User } from '@/types';


function FollowPreview(props: User) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${props.username}`);
  };

  return (
    <div 
      className="flex p-4 w-full hover:bg-[#f7f7f7] hover:cursor-pointer"
      onClick={handleClick}
    >
      {/* left */}
      <div className="flex justify-center items-center size-[40px]">
        <PersonIcon sx={{color: 'rgb(29, 155, 240)', fontSize: '35px'}}/>
      </div>
      {/* right */}
      <div className="flex flex-1 w-full flex-col ml-4">
        <img src={props.profile_image} alt="avatar" className='size-[32px] rounded-full'/>

        {/* Top row */}
        <div className="flex justify-between w-full h-fit">
          <div className='flex h-fit'>
            <p>
              <Link to={`/${props.username}`} onClick={(e) => e.stopPropagation()}><span className="font-bold text-base hover:underline">{props.name}</span></Link>
              <span className="text-[#75828d] text-base ml-1">@{props.username}</span>
              <span className="text-[#75828d] text-base ml-1">followed you</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FollowPreview;