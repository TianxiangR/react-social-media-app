import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {  PostLike } from '@/types';


function LikePreview(props: PostLike) {
  const sender = props.user;
  const { content } = props.post;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${props.post.author.username}/status/${props.post.id}`);
  };

  return (
    <div 
      className="flex p-4 w-full hover:bg-[#f7f7f7] hover:cursor-pointer"
      onClick={handleClick}
    >
      {/* left */}
      <div className="flex justify-center items-center size-[40px]">
        <FavoriteIcon sx={{color: '#f91880', fontSize: '30px'}}/>
      </div>
      {/* right */}
      <div className="flex flex-1 w-full flex-col ml-4">
        <img src={sender.profile_image} alt="avatar" className='size-[32px] rounded-full'/>

        {/* Top row */}
        <div className="flex justify-between w-full h-fit">
          <div className='flex h-fit'>
            <p>
              <Link to={`/${sender.username}`} onClick={(e) => e.stopPropagation()}><span className="font-bold text-base hover:underline">{sender.name}</span></Link>
              <span className="text-[#75828d] text-base ml-1">@{sender.username}</span>
              <span className="text-[#75828d] text-base ml-1">liked your post</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <div className="preview-text-box">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LikePreview;