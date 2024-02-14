import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import RepeatIcon from '@mui/icons-material/Repeat';
import React, { useState } from 'react';

import { useLikePost , useUnlikePost } from '@/react-query/queriesAndMutations';
import { IPostPreview } from '@/types';

import IconButton from './IconButton';


export interface PostStatsProps {
  id: string;
  liked: boolean;
  like_count: number;
  comment_count: number;
  repost_count: number;
  view_count: number;
  bookmarked: boolean;
}
function PostDetailStats({id, liked: initial_liked, like_count: initial_like_count, comment_count, repost_count, view_count, bookmarked}: IPostPreview) {
  const [liked, setLiked] = useState(initial_liked);
  const [like_count, setLikeCount] = useState(initial_like_count);

  const onLikeSuccess = () => {
    setLiked(true);
    setLikeCount((prev) => prev + 1);
  };



  const onUnlikeSuccess = () => {
    setLiked(false);
    setLikeCount((prev) => prev - 1);
  };

  const handleLikeClick = () => {
    if (liked) {
      unlikePost(undefined, {onSuccess: onUnlikeSuccess});
    } else {
      likePost(undefined, {onSuccess: onLikeSuccess});
    }
  };

  const { mutateAsync: likePost } = useLikePost(id);
  const { mutateAsync: unlikePost } = useUnlikePost(id);


  return (
    <div className='flex justify-between items-center group/comment w-full'>
      <div className="flex flex-1 justify-start items-center group gap-1.5 hover:cursor-pointer">
        <IconButton className="text-[#536471] group-hover:text-blue text-xl">
          <ChatBubbleOutlineIcon sx={{fontSize: '1.25rem'}}/>
        </IconButton>
        <span className="text-sm group-hover:text-blue select-none">{comment_count || ''}</span>
      </div>
      <div className="flex flex-1 justify-start items-center group/repost gap-1 hover:cursor-pointer">
        <IconButton className="text-[#536471] group-hover/repost:text-[#00ba7c]  text-xl">
          <RepeatIcon sx={{fontSize: '1.3rem'}}/>
        </IconButton>
        <span className="text-sm group-hover/repost:text-[#00ba7c] select-none">{repost_count || ''}</span>
      </div>
      <div className="flex flex-1 justify-start items-center group/like gap-1 hover:cursor-pointer" style={{color : liked ? '#f91880' : '#536471'}}>
        <IconButton className='text-[inherit] group-hover/like:text-[#f91880] text-xl' onClick={handleLikeClick}>
          {liked ? <FavoriteIcon sx={{fontSize: '1.3rem'}}/> : <FavoriteBorderIcon sx={{fontSize: '1.3rem'}}/>}
        </IconButton>
        <span className="text-sm group-hover/like:text-[#f91880] select-none">{like_count || ''}</span>
      </div>
      <div className="flex flex-1 jjustify-start items-center group/like gap-1 hover:cursor-pointer">
        <IconButton className="text-[#536471] hover:text-blue text-xl">
          {bookmarked ? <BookmarkIcon sx={{fontSize: '1.4rem'}}/> : <BookmarkBorderOutlinedIcon sx={{fontSize: '1.5rem'}}/>}
        </IconButton>
        <span className="text-sm group-hover/like:text-blue select-none">{view_count || ''}</span>
      </div>
      <div className="flex justify-start items-center gap-3">
        <IconButton className="text-[#536471] hover:text-blue text-xl">
          <IosShareIcon sx={{fontSize: '1.4rem'}}/>
        </IconButton>
      </div>
    </div>
  );
}

export default PostDetailStats;