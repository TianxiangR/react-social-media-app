import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
import { Alert, Slide, SlideProps } from '@mui/material';
import React, { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGlobalContext } from '@/context/GlobalContext';
import { useSnackbarContext } from '@/context/SnackbarContext';
import { useAddBookmark, useLikePost , useRemoveBookmark, useRepostPostById, useUnlikePost } from '@/react-query/queriesAndMutations';
import { IPostPreview } from '@/types';

import PostDialogContent from './CreatePostDialogContent';
import IconButton from './IconButton';

function SlideUp(props: SlideProps) {
  return (
    <Slide direction="up" {...props} />
  );
}

export interface PostStatsProps {
  id: string;
  liked: boolean;
  like_count: number;
  comment_count: number;
  repost_count: number;
  view_count: number;
  bookmarked: boolean;
}


function PostDetailStats(props: IPostPreview) {
  const {id, liked: initial_liked, like_count: initial_like_count, comment_count, repost_count, view_count, bookmarked, bookmark_count} = props;
  const [liked, setLiked] = useState(initial_liked);
  const [like_count, setLikeCount] = useState(initial_like_count);
  const { mutateAsync: repost} = useRepostPostById(id);
  const { openDialog } = useGlobalContext().dialog;
  const hasShareAPI = !!navigator.share;
  const { showSnackbar } = useSnackbarContext();
  
  const { mutateAsync: likePost } = useLikePost(id);
  const { mutateAsync: unlikePost } = useUnlikePost(id);
  const { mutateAsync: addBookmark } = useAddBookmark(id);
  const { mutateAsync: removeBookmark } = useRemoveBookmark(id);


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

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDialog(() => <PostDialogContent variant='reply' parent_post={props}/>);
  };

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDialog(() => <PostDialogContent variant='repost' parent_post={props}/>);
  };

  const handleRepostClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    repost({});
  };
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark();
    } else {
      addBookmark();
    }
  };

  const copyLinkSuccess = <Alert severity="info">Copied to clipboard</Alert>;

  const handleCopyLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/${props.author.username}/status/${id}`);
    showSnackbar({
      props: {
        autoHideDuration: 3000, 
        TransitionComponent: SlideUp,
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      }, 
      content: copyLinkSuccess
    });
  };

  const shareFail = <Alert severity="error">Failed to share</Alert>;
  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasShareAPI) {
      navigator
        .share({title: 'Share', url: `${window.location.origin}/${props.author.username}/status/${id}`})
        .catch(() => {
          showSnackbar({
            props: {
              autoHideDuration: 3000, 
              TransitionComponent: SlideUp,
              anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
            }, 
            content: shareFail
          });
        });
    }
  };


  return (
    <div className='flex justify-between items-center group/comment w-full'>
      <div className="flex flex-1 justify-start">
        <div className="flex justify-start items-center group gap-1.5 hover:cursor-pointer">
          <IconButton className="text-[#536471] group-hover:text-blue text-xl" onClick={handleCommentClick}>
            <ChatBubbleOutlineIcon sx={{fontSize: '1.25rem'}}/>
          </IconButton>
          <span className="text-sm group-hover:text-blue select-none">{comment_count || ''}</span>
        </div>
      </div>

      <div className="flex flex-1 justify-start">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <div className="flex justify-start items-center group/repost gap-1 hover:cursor-pointer">
              <IconButton className="text-[#536471] group-hover/repost:text-[#00ba7c]  text-xl" onClick={(e) => e.stopPropagation()}>
                <RepeatIcon sx={{fontSize: '1.3rem'}}/>
              </IconButton>
              <span className="text-sm group-hover/repost:text-[#00ba7c] select-none">{repost_count || ''}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl p-0">
            <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer h-[44px]" onClick={handleRepostClick}>
              <div className="flex gap-2">
                <RepeatIcon sx={{fontSize: '1.3rem'}}/>
                <span className="text-base font-bold">Repost</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer h-[44px]" onClick={handleQuoteClick}>
              <div className="flex gap-2">
                <EditOutlinedIcon sx={{fontSize: '1.3rem'}}/>
                <span className="text-base font-bold">Quote</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-1 justify-start">
        <div className="flex justify-start items-center group/like gap-1 hover:cursor-pointer" style={{color : liked ? '#f91880' : '#536471'}}>
          <IconButton className='text-[inherit] group-hover/like:text-[#f91880] text-xl' onClick={handleLikeClick}>
            {liked ? <FavoriteIcon sx={{fontSize: '1.3rem'}}/> : <FavoriteBorderIcon sx={{fontSize: '1.3rem'}}/>}
          </IconButton>
          <span className="text-sm group-hover/like:text-[#f91880] select-none">{like_count || ''}</span>
        </div>
      </div>

      <div className="flex flex-1 jjustify-start items-center group/like gap-1 hover:cursor-pointer">
        <IconButton className="text-[#536471] hover:text-blue text-xl" onClick={handleBookmarkClick}>
          {bookmarked ? <BookmarkIcon sx={{fontSize: '1.4rem', color: 'rgb(29, 155, 240)'}}/> : <BookmarkBorderOutlinedIcon sx={{fontSize: '1.4rem'}}/>}
        </IconButton>
        <span className="text-sm group-hover/like:text-blue select-none">{bookmark_count || ''}</span>
      </div>

      <div className="flex justify-start items-center gap-3">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
            <IconButton className="text-[#536471] hover:text-blue text-xl">
              <IosShareIcon sx={{fontSize: '1.4rem'}}/>
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl p-0">
            <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer h-[44px]" onClick={handleCopyLinkClick}>
              <div className="flex gap-2">
                <LinkOutlinedIcon sx={{fontSize: '1.4rem', transform: 'rotate(-45deg)'}}/>
                <span className="text-base font-bold">Copy link</span>
              </div>
            </DropdownMenuItem>
            {
              hasShareAPI && 
              <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer h-[44px]" onClick={handleShareClick}>
                <div className="flex gap-2">
                  <IosShareIcon sx={{fontSize: '1.4rem'}}/>
                  <span className="text-base font-bold">Share</span>
                </div>
              </DropdownMenuItem>
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default PostDetailStats;