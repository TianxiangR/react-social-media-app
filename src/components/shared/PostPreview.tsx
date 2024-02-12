
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { multiFormatDateString } from '@/lib/utils';
import { IPostPreview } from '@/types';

import IconButton from './IconButton';
import ImageView from './ImageView';
import PostPreviewStats from './PostPreviewStats';

function PostPreview({
  images, author, created_at, content, ...props
}: IPostPreview) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/${author.username}/status/${props.id}`);
  };


  return (
    <div 
      className="flex p-4 w-full border-b-[1px] border-[#eff3f4] hover:bg-[#f7f7f7] hover:cursor-pointer"
      onClick={handleClick}
    >
      {/* left */}
      <img src={author.profile_image} alt="avatar" className='w-[40px] h-[40px] rounded-full'/>

      {/* right */}
      <div className="flex flex-1 w-full flex-col ml-4">
        {/* Top row */}
        <div className="flex justify-between w-full h-fit">
          <div className='flex h-fit'>
            <p>
              <Link to='/profile'><span className="font-bold text-base hover:underline">{author.name}</span></Link>
              <span className="text-[#75828d] text-base ml-1">@{author.username}</span>
              <span className="text-[#75828d] text-base ml-1">·</span>
              <time className="text-[#75828d] text-base ml-1">{multiFormatDateString(created_at)}</time>
            </p>
          </div>

          <IconButton className="text-[#536471] hover:text-blue">
            <MoreHorizIcon sx={{fontSize: '24px'}}/>
          </IconButton>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <div className="text-box">
            {content}
          </div>
          <div className="flex w-full mt-1" style={{display: images?.length > 0 ? 'flex' : 'none'}}>
            <ImageView images={images} />
          </div>
        </div>

        {/* Bottom row */}
        <div className='flex mt-3 h-fit'>
          <PostPreviewStats {...props} />
        </div>
      </div>
    </div>
  );
}

export default PostPreview;