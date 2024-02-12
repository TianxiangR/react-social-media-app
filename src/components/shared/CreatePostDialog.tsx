
import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import React, { useEffect,useRef, useState } from 'react';

import { TOKEN_STORAGE_KEY } from '@/constants';
import { useUserContext } from '@/context/AuthContext';
import { countNonWhiteSpaceCharacters } from '@/lib/utils';
import { useCreatePost } from '@/react-query/queriesAndMutations';

import { Button } from '../ui/button';
import IconButton from './IconButton';
import Slides from './Slides';
import TextArea from './TextArea';

export type CreatePostDialogProps = {
  open: boolean;
  onClose: () => void;
};

function CreatePostDialog({ open, onClose }: CreatePostDialogProps) {
  const diaglogRef = useRef<HTMLDialogElement>(null);
  const selectFileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [inputText, setInputText] = useState('');
  const enablePost = imageUrls.length > 0 || countNonWhiteSpaceCharacters(inputText) > 0;
  const enableImage = imageUrls.length < 4;
  const user = useUserContext();
  const { mutateAsync: createPost,  reset: resetCreatePost } = useCreatePost();

  useEffect(() => {
    if (open) {
      diaglogRef.current?.showModal();
    }
    else {
      diaglogRef.current?.close();
    }
  }, [open]);

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

  const onCreatePostSuccess = () => {
    resetCreatePost();
    clearInput();
    onClose();
  };

  const handleSubmit = async () => {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    await createPost({content: inputText, images: imageFiles},  {onSuccess: onCreatePostSuccess});
  };


  return (
    <dialog className='dialog w-[600px] overflow-hidden' ref={diaglogRef} style={{maxHeight: 'calc(100vh - 3rem - 6px)'}}>
      <div className="overflow-auto relative rounded-lg " style={{maxHeight: 'calc(100vh - 3rem - 6px)'}}>

        {/* Top Bar */}
        <div className="flex justify-end p-2 pb-0 top-0 sticky-bar">
          <Button
            className="flex justify-center items-center w-fit rounded-full p-2 hover:bg-[#e6e6e7] hover:cursor-pointer bg-transparent text-black"
            onClick={() => {clearInput(); onClose();}}
          >
            <CloseIcon />
          </Button>
        </div>

        {/* Input Area */}
        <div className="w-full gap-3 p-4 pt-0 box-border flex hover:cursor-text"
          onClick={focusOnInput}
        >
          <img src={user?.profile_image} className="profile-image" />
          <div className="grow min-h-[100px] text-[20px] max-w-[510px]">
            { 
              <TextArea 
                className="outline-none text-xl w-full" 
                placeholder="What's happening?!" 
                onChange={handleInputTextChange}
                value={inputText}
                ref={inputRef}
              />
            }
            {open &&
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
        <div className="flex justify-between bottom-0 p-4 pb-2 sticky-bar">
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
    </dialog>
  );
}

export default CreatePostDialog;