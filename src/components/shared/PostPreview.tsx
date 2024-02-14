
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGlobalContext } from '@/context/GlobalContext';
import { multiFormatDateString } from '@/lib/utils';
import { useDeletePostById } from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview, IPostPreview } from '@/types';

import IconButton from './IconButton';
import ImageView from './ImageView';
import PostPreviewStats from './PostPreviewStats';
import QuotedPost from './QuotedPost';

function PostPreview(props: AugmentedPostPreview) {
  const { author, content, created_at, images, repost_parent } = props;
  const navigate = useNavigate();
  const { mutateAsync: deletePost } = useDeletePostById(props.id);
  
  const handleClick = () => {
    navigate(`/${author.username}/status/${props.id}`);
  };

  const handleDeletPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePost();
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

          {/* Options */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <IconButton className="text-[#536471] hover:text-blue" onClick={(e) => e.stopPropagation()}>
                <MoreHorizIcon sx={{fontSize: '24px'}}/>
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl p-0 h-[44px]">
              <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer" onClick={handleDeletPost}>
                <div className='flex gap-2 items-center justify-start text-red-500'>
                  <DeleteForeverOutlinedIcon sx={{fontSize: '22px'}}/>
                  <span className="text-base font-bold">Delete</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <div className="text-box">
            {content}
          </div>

          <div className="flex flex-col mt-2">
            <div className="flex" style={{display: images?.length > 0 ? 'flex' : 'none'}}>
              <ImageView images={images} rounded allowFullScreen/>
            </div>
            {
              repost_parent && 
              <QuotedPost post={repost_parent} />
            }
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