
import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import React, { useEffect, useRef, useState } from 'react';

import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';
import { countNonWhiteSpaceCharacters } from '@/lib/utils';
import { useCreatePost, useReplyPostById, useRepostPostById } from '@/react-query/queriesAndMutations';
import { IPostPreview } from '@/types';

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
  const enablePost = imageUrls.length > 0 || countNonWhiteSpaceCharacters(inputText) > 0 || parent_post;
  const enableImage = imageUrls.length < 4;
  const {user} = useUserContext();
  const { mutateAsync: createPost,  reset: resetCreatePost } = useCreatePost();
  const { mutateAsync: replyPost, reset: resetReplyPost } = useReplyPostById(parent_post?.id || '');
  const { mutateAsync: repostPost, reset: resetRepostPost } = useRepostPostById(parent_post?.id || '');

  const focusOnInput = () => { 
    inputRef.current?.focus();
  };

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
    resetCreatePost();
    resetReplyPost();
    resetRepostPost();
    clearInput();
    closeDialog();
  };

  const handleSubmit = async () => {
    if (variant === 'reply') {
      await replyPost({content: inputText, images: imageFiles},  {onSuccess: onMutateSuccess});
      return;
    }

    if (variant === 'repost') {
      await repostPost({content: inputText, images: imageFiles},  {onSuccess: onMutateSuccess});
      return;
    }

    await createPost({content: inputText, images: imageFiles},  {onSuccess: onMutateSuccess});
  };

  return (  
    <div className="overflow-auto w-[600px] relative rounded-lg bg-white" style={{maxHeight: 'calc(100vh - 3rem - 6px)'}}>

      {/* Top Bar */}
      <div className="flex justify-start p-2 pb-0 top-0 sticky-bar">
        <Button
          className="flex justify-center items-center w-fit rounded-full p-2 hover:bg-[#e6e6e7] hover:cursor-pointer bg-transparent text-black"
          onClick={() => {clearInput(); closeDialog();}}
        >
          <CloseIcon />
        </Button>
      </div>

      {/* Input Area */}
      <div className="w-full gap-3 p-4 box-border flex hover:cursor-text"
        onClick={focusOnInput}
      >
        <img src={user?.profile_image} className="profile-image" />
        <div className="grow min-h-[100px] text-[20px] max-w-[510px] flex flex-col gap-4">
          { 
            <TextArea 
              className="outline-none text-xl w-full" 
              placeholder="What's happening?!" 
              onChange={handleInputTextChange}
              value={inputText}
              rows={1}
              ref={inputRef}
            />
          }
          
          { imageUrls.length > 0 &&
            <Slides defaultPosition='end' slideCols={2} scrollCols={2}>
              {
                imageUrls.map((url, index) => {
                  const baseClassName = 'object-center w-full rounded-2xl';
                  const heightClassname = imageUrls.length === 1 ? 'object-cover max-h-[660px]' : 'object-cover h-[288px] max-h-[288px]';
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
      <div className="flex justify-between bottom-0 px-4 py-2 sticky-bar border-t-[1px] border-[#eff3f4]">
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