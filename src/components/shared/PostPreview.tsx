
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
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
import { AugmentedPostPreview, IPostPreview } from '@/types';

import Avatar from './Avatar';
import IconButton from './IconButton';
import ImageView from './ImageView';
import PostPreviewStats from './PostPreviewStats';
import QuotedPost from './QuotedPost';

export interface PostPreviewProps {
  post: AugmentedPostPreview;
  variant?: 'normal' | 'top' | 'middle' | 'bottom';
}

function PostPreview(props: PostPreviewProps) {
  const { variant = 'normal', post } = props;
  const navigate = useNavigate();
  const { user } = useUserContext();

  const isRepost = !!(post.repost_parent && post.content.length === 0);
  const rendered_post = isRepost ? post.repost_parent as AugmentedPostPreview : post;
  const { author, content, created_at, images, reply_parent, repost_parent } = rendered_post;
  const { mutateAsync: deletePost } = useDeletePostById(rendered_post.id);
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
    navigate(`/${author.username}/status/${post.id}`);
  };
  
  const handleDeletPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePost();
  };  

  return (
    <div 
      className="flex px-4 py-3 w-full h-auto hover:bg-[#f7f7f7] hover:cursor-pointer gap-2 flex-col box-border"
      onClick={handleClick}
    > 
      {
        isRepost && 
        <div className="flex items-center gap-2">
          <div className="flex w-[40px] justify-end">
            <RepeatIcon sx={{fontSize: '16px', color: '#536471'}}/>
          </div>
          <span className="text-[#536471] text-sm font-bold">{`${post.author.id === user?.id ? 'You' : post.author.name} reposted`}</span>
        </div>
      }
      <div className="flex w-full h-auto">
        {/* left */}
        <div className='relative'>
          {
            (variant === 'top' || variant === 'middle') && 
              <div className='absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[calc(40px+0.25rem)] h-[calc(100%-40px+0.5rem)] w-[2px] bg-[#cfd9de]'/>
          }
          <Avatar src={author.profile_image} size={40} />
          {
            (variant === 'middle' || variant === 'bottom') &&
              <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[calc(100%+0.25rem)] h-[calc(0.75rem-0.25rem)] w-[2px] bg-[#cfd9de]'/>
          }
        </div>
  
        {/* right */}
        <div className="flex flex-1 w-full flex-col ml-2">
          {/* Top row */}
          <div className="flex justify-between w-full h-fit">
            <div className='flex h-fit flex-col'>
              <p className='flex flex-row'>
                <Link to={`/${author.username}`} onClick={(e) => e.stopPropagation()}><span className="font-bold text-base hover:underline truncate">{author.name}</span></Link>
                <span className="text-[#75828d] text-base ml-1 truncate">@{author.username}</span>
                <span className="text-[#75828d] text-base ml-1 flex-1">·</span>
                <time className="text-[#75828d] text-base ml-1 flex-1">{multiFormatDateString(created_at)}</time>
              </p>
              {
                reply_parent && variant === 'normal' &&
                <p>
                Replying to <Link to={`/${reply_parent.author.username}`} onClick={(e) => e.stopPropagation()}><span className="text-base hover:underline truncate text-blue">@{reply_parent?.author.username}</span></Link>
                </p>
              }
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
          <div className="flex flex-col gap-2">
            <div className="preview-text-box">
              {content}
            </div>
  
            <div className="flex" style={{display: images?.length > 0 ? 'flex' : 'none'}}>
              <ImageView images={images} rounded allowFullScreen/>
            </div>
            {
              repost_parent && 
                <QuotedPost post={repost_parent} variant='small'/>
            }
          </div>
  
          {/* Bottom row */}
          <div className='flex mt-3 h-fit'>
            <PostPreviewStats {...rendered_post} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPreview;