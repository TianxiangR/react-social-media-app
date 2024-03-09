import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Alert, Slide, type SlideProps } from '@mui/material';
import { AxiosProgressEvent } from 'axios';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useUserContext } from '@/context/AuthContext';
import { useSnackbarContext } from '@/context/SnackbarContext';
import { useCreatePost} from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview, UserPreview } from '@/types';

import { Button } from '../ui/button';
import IconButton from './IconButton';
import Slides from './Slides';
import TextArea from './TextArea';

export type ReplyPostProps = {
  postId: string;
  author: UserPreview;
}

function CreatePostForm() {
  const selectFileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [inputText, setInputText] = useState('');
  const {user} = useUserContext();
  const { mutateAsync: createPost, reset, isPending } = useCreatePost();
  const enablePost = (imageUrls.length > 0 || inputText !== '') && !isPending;
  const enableImage = imageUrls.length < 4;
  const [progress, setProgress] = useState(0);

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setProgress(percentCompleted);
    }
  };

  const clearInput = () => {
    setProgress(0);
    setInputText('');
    setImageUrls([]);
    setImageFiles([]);
  };

  const mutateSuccess = () => {
    clearInput();
    reset();
  };

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

  const handleCreatePost = async () => {
    createPost({post: { content: inputText, images: imageFiles }, onUploadProgress}, {onSuccess: mutateSuccess});
  };

  return (
    <div className="relative">
      {/* progress bar */}
      <div className="w-full h-1 sticky top-0 z-10">
        <div className="h-full bg-blue" style={{width: `${progress}%`, transition: 'width 0.5s ease'}}/>
      </div>
      <div className="w-full gap-3 p-4 box-border flex hover:cursor-text"
        onClick={focusOnInput}
      >
        <img src={user?.profile_image} className="profile-image" />
        <div className="w-full flex-col flex ">
          {/* Input Area */}
          <div className="w-full gap-3 pb-2 box-border flex hover:cursor-text jusitfy-center"
            onClick={focusOnInput}
          >

            <div className="grow max-w-[510px]">
              { 
                <TextArea 
                  className="outline-none text-xl w-full" 
                  placeholder="Post your reply" 
                  onChange={handleInputTextChange}
                  value={inputText}
                  ref={inputRef}
                  rows={1}
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
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between sticky bottom-0 bg-transparent rounded-b-lg border-t-[1px] border-[#eff3f4] items-center pt-2">
            <div className="flex items-center">
              <IconButton className='text-[#1d9bf0] text-xl' onClick={handleSelectFileClick} disabled={!enableImage}>
                <ImageOutlinedIcon />
                <input type="file" className="hidden" accept="image/*" ref={selectFileRef} onChange={handleFileChange}/>
              </IconButton>
            </div>
            <div className="flex">
              <Button
                className="w-full h-9 bg-blue rounded-full hover:bg-blue-100"
                disabled={!enablePost}
                onClick={handleCreatePost}
              >
                <span className="font-bold text-[15px]">Post</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostForm;