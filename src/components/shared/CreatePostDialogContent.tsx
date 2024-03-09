
import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Alert, Slide, SlideProps, Snackbar, TextField } from '@mui/material';
import { AxiosProgressEvent } from 'axios';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';
import { useSnackbarContext } from '@/context/SnackbarContext';
import { countNonWhiteSpaceCharacters, formatDateString } from '@/lib/utils';
import { useCreatePost, useReplyPostById, useRepostPostById } from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview, IPostPreview } from '@/types';

import { Button } from '../ui/button';
import IconButton from './IconButton';
import QuotedPost from './QuotedPost';
import Slides from './Slides';
import TextArea from './TextArea';


export type PostDialogContentProps = {
  variant?: 'create';
  parent_post?: undefined
} | {
  variant: 'reply' | 'repost';
  parent_post: IPostPreview;
}

function PostDialogContent({variant = 'create', parent_post}: PostDialogContentProps) {
  const { closeDialog } = useGlobalContext().dialog;
  const selectFileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [inputText, setInputText] = useState('');
  const {user} = useUserContext();
  const { mutateAsync: createPost,  reset: resetCreatePost, isPending: isCreatePostPending } = useCreatePost();
  const { mutateAsync: replyPost, reset: resetReplyPost, isPending: isReplyPostPending } = useReplyPostById(parent_post?.id || '');
  const { mutateAsync: repostPost, reset: resetRepostPost, isPending: isRepostPostPending } = useRepostPostById(parent_post?.id || '');
  const isPending = isCreatePostPending || isReplyPostPending || isRepostPostPending;
  const enablePost = (imageUrls.length > 0 || countNonWhiteSpaceCharacters(inputText) > 0 || (variant === 'repost' && parent_post)) && !isPending;
  const enableImage = imageUrls.length < 4;
  const [progress, setProgress] = useState(0);

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(percentCompleted);
      setProgress(percentCompleted);
    }
  };

  const focusOnInput = () => { 
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusOnInput();
  }, []);

  const handleSelectFileClick = () => {
    selectFileRef.current?.click(); 
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const acceptedFiles = event.target.files;
    if (acceptedFiles) {
      const url = URL.createObjectURL(acceptedFiles[0]);
      setImageUrls((prev) => [...prev, url]);
      setImageFiles((prev) => [...prev, acceptedFiles[0]]);
    }
  };

  const handleInputTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const clearInput = () => {
    setInputText('');
    setImageUrls([]);
    setImageFiles([]);
  };

  const onMutateSuccess = () => {
    setProgress(0);
    resetCreatePost();
    resetReplyPost();
    resetRepostPost();
    clearInput();
    closeDialog();
  };

  const handleSubmit = async () => {
    if (variant === 'reply') {
      await replyPost({post: {content: inputText, images: imageFiles}, onUploadProgress},  {onSuccess: onMutateSuccess});
      return;
    }

    if (variant === 'repost') {
      await repostPost({post: {content: inputText, images: imageFiles}, onUploadProgress},  {onSuccess: onMutateSuccess});
      return;
    }

    await createPost({post: {content: inputText, images: imageFiles}, onUploadProgress},  {onSuccess: onMutateSuccess});
  };

  return (  
    <div className="dialog-content">
      {/* progress bar */}
      <div className="w-full h-1 sticky top-0 z-20">
        <div className="h-full bg-blue" style={{width: `${progress}%`, transition: 'width 0.5s ease'}}/>
      </div>

      {/* Top Bar */}
      <div className="flex justify-start p-2 pb-0 top-0 sticky-bar z-10">
        <Button
          className="flex justify-center items-center w-fit rounded-full p-2 hover:bg-[#e6e6e7] hover:cursor-pointer bg-transparent text-black"
          onClick={() => {clearInput(); closeDialog();}}
        >
          <CloseIcon />
        </Button>
      </div>

      {/* repost parent */}
      {
        variant === 'reply' && parent_post &&
        <div className="flex p-4 gap-2 box-border">
          <div className="relative shrink-0">
            <img src={parent_post.author.profile_image} className="profile-image"/>
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[calc(40px+0.25rem)] h-[calc(100%-40px+0.5rem)] w-[2px] bg-[#cfd9de]'/>
          </div>
          <div className="flex flex-col">
            <span>
              <span className="font-bold">{parent_post.author.name}</span>
              <span className="text-[#536471]"> @{parent_post.author.username}</span>
              <time className="text-[#536471]"> · {formatDateString(parent_post.created_at)}</time>
            </span>
            <p>
              {parent_post.content}
            </p>
            <div className='mt-4'>
              Replying to <span className="text-[#1d9bf0]">@{parent_post.author.username}</span>
            </div>
          </div>
        </div>
      }

      {/* Input Area */}
      <div className="w-full gap-2 p-4 box-border flex hover:cursor-text"
        onClick={focusOnInput}
      >
        <div className="relative shrink-0">
          <img src={user?.profile_image} className="profile-image" />
          {
            variant === 'reply' && parent_post &&
           <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[calc(100%+0.25rem)] h-[calc(1rem)] w-[2px] bg-[#cfd9de]'/>
          }
        </div>
        <div className="grow min-h-[100px] text-[20px] max-w-[510px] flex flex-col gap-4">
          <TextArea 
            className="outline-none text-xl w-full" 
            placeholder="What's happening?!" 
            onChange={handleInputTextChange}
            value={inputText}
            ref={inputRef}
            rows={1}
          />
          
          { imageUrls.length > 0 &&
            <Slides defaultPosition='end' slideCols={2} scrollCols={2}>
              {
                imageUrls.map((url, index) => {
                  const baseClassName = 'object-center w-full rounded-2xl';
                  const heightClassname = imageUrls.length === 1 ? 'object-cover max-h-[660px] h-auto' : 'object-cover h-[288px] max-h-[288px]';
                  const className = `${baseClassName} ${heightClassname}`;
                  const removeImage = () => {
                    setImageUrls((prev) => prev.filter((_, i) => i !== index));
                    setImageFiles((prev) => prev.filter((_, i) => i !== index));
                  };

                  return (
                    <div className="mr-1 relative rounded-2xl overflow-hidden" key={index}>
                      <img src={url} className={className}/>
                      <Button
                        className="flex justify-center items-center w-fit rounded-full p-2 hover:bg-[#1d2124] hover:cursor-pointer bg-[#0b0f13] text-black absolute top-1 right-1 z-10"
                        onClick={removeImage}
                      >
                        <CloseIcon sx={{color: 'white'}}/>
                      </Button>
                    </div>
                  );
                })
              }
            </Slides>
          }
 
          { variant === 'repost' && parent_post &&
            <QuotedPost post={parent_post} />
          }
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between bottom-0 px-4 py-2 sticky-bar border-t-[1px] border-[#eff3f4] z-20">
        <div className="flex items-center">
          <IconButton 
            className='text-[#1d9bf0] text-xl'
            disabled={!enableImage}
            onClick={handleSelectFileClick}
          >
            <ImageOutlinedIcon />
            <input type="file" className="hidden" accept="image/*" ref={selectFileRef} onChange={handleFileChange}/>
          </IconButton>
        </div>
        <div className="flex">
          <Button
            className="w-full h-9 bg-blue rounded-full hover:bg-blue-100"
            disabled={!enablePost}
            onClick={handleSubmit}
          >
            <span className="font-bold text-[15px]">Post</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PostDialogContent;