
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserContext } from '@/context/AuthContext';
import { multiFormatDateString } from '@/lib/utils';
import { useDeletePostById, useFollowUser, useUnfollowUser } from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview } from '@/types';

import IconButton from './IconButton';
import ImageView from './ImageView';
import PostPreviewStats from './PostPreviewStats';
import QuotedPost from './QuotedPost';

function PostPreview(props: AugmentedPostPreview) {
  const { author, content, created_at, images, repost_parent } = props;
  const navigate = useNavigate();
  const { mutateAsync: deletePost } = useDeletePostById(props.id);
  const { user } = useUserContext();
  const {mutate: follow} = useFollowUser();
  const {mutate: unfollow} = useUnfollowUser();

  const handleFollowClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (author.is_following) {
      unfollow(author.username);
    } else {
      follow(author.username);
    }
  };
  
  const handleClick = () => {
    navigate(`/${author.username}/status/${props.id}`);
  };

  const handleDeletPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePost();
  };


  return (
    <div 
      className="flex p-4 w-full hover:bg-[#f7f7f7] hover:cursor-pointer"
      onClick={handleClick}
    >
      {/* left */}
      <img src={author.profile_image} alt="avatar" className='w-[40px] h-[40px] rounded-full'/>

      {/* right */}
      <div className="flex flex-1 w-full flex-col ml-4">
        {/* Top row */}
        <div className="flex justify-between w-full h-fit">
          <div className='flex h-fit'>
            <p className='flex flex-row'>
              <Link to={`/${author.username}`} onClick={(e) => e.stopPropagation()}><span className="font-bold text-base hover:underline truncate">{author.name}</span></Link>
              <span className="text-[#75828d] text-base ml-1 truncate">@{author.username}</span>
              <span className="text-[#75828d] text-base ml-1 flex-1">·</span>
              <time className="text-[#75828d] text-base ml-1 flex-1">{multiFormatDateString(created_at)}</time>
            </p>
          </div>

          {/* Options */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="w-fit h-fit">
              <IconButton className="text-[#536471] hover:text-blue" onClick={(e) => e.stopPropagation()}>
                <MoreHorizIcon sx={{fontSize: '24px'}}/>
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl p-0 w-fit h-fit">
              {
                author.id !== user?.id ?
                  <>
                    {
                      author.is_following ? (
                        <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer" onClick={handleFollowClick}>
                          <div className='flex gap-2 items-center justify-start text-[#0f1419]'>
                            <PersonRemoveOutlinedIcon sx={{fontSize: '22px'}}/>
                            <span className="text-base font-bold">{`Unfollow @${author.username}`}</span>
                          </div>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer" onClick={handleFollowClick}>
                          <div className='flex gap-2 items-center justify-start text-[#0f1419]'>
                            <PersonAddAltIcon sx={{fontSize: '22px'}}/>
                            <span className="text-base font-bold">{`Follow @${author.username}`}</span>
                          </div>
                        </DropdownMenuItem>
                      )
                    }
                  </> :
                  <>
                    <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer" onClick={handleDeletPost}>
                      <div className='flex gap-2 items-center justify-start text-red-500'>
                        <DeleteForeverOutlinedIcon sx={{fontSize: '22px'}}/>
                        <span className="text-base font-bold">Delete</span>
                      </div>
                    </DropdownMenuItem>
                  </>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <div className="preview-text-box">
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