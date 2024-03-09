import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Avatar from '@/components/shared/Avatar';
import IconButton from '@/components/shared/IconButton';
import ImageView from '@/components/shared/ImageView';
import PostDetailStats from '@/components/shared/PostDetailStats';
import PostPreview from '@/components/shared/PostPreview';
import QuotedPost from '@/components/shared/QuotedPost';
import ReplyPostForm from '@/components/shared/ReplyPostForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserContext } from '@/context/AuthContext';
import useIsPhoneScreen from '@/hooks/useIsPhoneScreen';
import { formatDetailedDateString } from '@/lib/utils';
import { useDeletePostById, useFollowUser, useUnfollowUser } from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview, IPostPreview } from '@/types';

function PostDetail(props: IPostPreview) {
  const isRepost = !!(props.repost_parent && props.content.length === 0);
  const rendered_post = isRepost ? props.repost_parent as AugmentedPostPreview : props;
  const { author, content, created_at, images, id, repost_parent } = rendered_post;
  const { mutateAsync: deletePost } = useDeletePostById(id);
  const { mutate: follow } = useFollowUser();
  const { mutate: unfollow } = useUnfollowUser();
  const navigate = useNavigate();
  const {user} = useUserContext();
  const isPhoneScreen = useIsPhoneScreen();

  const handleDeletPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePost(undefined, {onSuccess: () => navigate(-1)});
  };

  const handleFollowClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (rendered_post.author.is_following) {
      unfollow(author.username);
    } else {
      follow(author.username);
    }
  };

  const jumpToPost = (post: IPostPreview) => {
    navigate(`/${post.author.username}/status/${post.author.id}`);
  };

  const reply_parents: IPostPreview[] = [];
  let current_post = rendered_post;

  while (current_post.reply_parent) {
    reply_parents.push(current_post.reply_parent);
    current_post = current_post.reply_parent;
  }

  reply_parents.reverse();

  return (
    <div>
      {
        reply_parents.map((reply_parent, index) => (
          <PostPreview key={index} post={reply_parent} variant={index === 0 ? 'top' : 'middle'} />
        ))
      }
      <div className="flex flex-col px-4 pt-4 w-full">
        {
          isRepost && 
        <div className="flex items-center gap-2">
          <div className="flex w-[40px] justify-end">
            <RepeatIcon sx={{fontSize: '16px', color: '#536471'}}/>
          </div>
          <Link className="text-[#536471] text-sm font-bold hover:underline" to={`/${rendered_post.author.username}`} onClick={(e) => e.stopPropagation()}>
            {`${rendered_post.author.id === user?.id ? 'You' : rendered_post.author.name} reposted`}
          </Link>
        </div>
        }
        <div className="flex justify-between">
          {/* top */}
          <div className="flex gap-2 items-center">
            <div className="relative">
              {
                rendered_post.reply_parent &&
                <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[calc(100%+0.25rem)] h-4 w-[2px] bg-[#cfd9de]'/>
              }
              <Avatar src={author.profile_image} size={40} />
            </div>
            <div className='flex h-fit flex-col justify-center'>
              <Link to={`/${author.username}`}><span className="font-bold text-base hover:underline">{author.name}</span></Link>
              <span className="text-[#75828d] text-base">@{author.username}</span>
            </div>
          </div>

          <div className={`flex flex-row ${isPhoneScreen ? 'items-center' : 'items-start'} gap-2`}>
            <div>
              {
                user?.id !== id && isPhoneScreen &&
              <>
                {
                  author.is_following ? (
                    <button className="rounded-full px-4 py-1 border-[#cfd9de] border-[1px] text-[#0f1419] font-bold bg-transparent text-sm"
                      onClick={handleFollowClick}
                    >Following</button>
                  ) : (
                    <button className="bg-black text-white rounded-full px-4 py-1 font-bold text-sm"
                      onClick={handleFollowClick}
                    >Follow</button>
                  )
                }
              </>
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

        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 mt-3">
          <div className="whitespace-pre-wrap">
            {content}
          </div>
          <div className="flex w-full mt-2" style={{display: images?.length > 0 ? 'flex' : 'none'}}>
            <ImageView images={images} size="large" rounded allowFullScreen />
          </div>
          {
            repost_parent&& (
              <div className="flex hover:cursor-pointer" onClick={() => jumpToPost(rendered_post)}>
                <QuotedPost post={repost_parent} variant='small' />
              </div>
            )
          }
        </div>
        <span className="text-[#536471] text-base mt-4">
          <time>{formatDetailedDateString(created_at)}</time>
          {
            rendered_post.view_count > 0 && (
              <span> · <span className="text-[#0f1419] text-base font-medium">{rendered_post.view_count}</span>{` View${rendered_post.view_count > 0 ? 's' : ''}`}</span>
            )
          }
        </span>
        <hr className="mt-4 border-[#eff3f4] border-[1px]" />
        <div className="px-1 py-3 ">
          <PostDetailStats {...rendered_post} />
        </div>
      </div>
      {
        !isPhoneScreen &&
          <>
            <hr className="border-[#eff3f4] border-[1px]" />
            <ReplyPostForm postId={id} author={author} />
          </>
      }
    </div>
  );
}

export default PostDetail;