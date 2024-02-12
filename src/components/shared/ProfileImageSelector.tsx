import 'react-image-crop/dist/ReactCrop.css';
import './ReactCrop.css';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import React, {useCallback, useEffect,useRef,useState} from 'react';
import {FileWithPath, useDropzone} from 'react-dropzone';
import ReactCrop, { centerCrop, convertToPixelCrop,type Crop, makeAspectCrop, type PercentCrop, type PixelCrop } from 'react-image-crop';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { base64StringtoFile, extractImageFileExtensionFromBase64, image64ToCanvasRef, setCanvasPreview } from '@/lib/utils';

import { Button } from '../ui/button';
import ImageCropper from './ImageCropper';

export type ProfileImageSelectorProps = {
  onChange?: (file: File) => void;
  src? : string;
}

function ProfileImageSelector({onChange, src}: ProfileImageSelectorProps) {
  const [imageData, setImageData] = useState<string | null | undefined>(src);
  const [crop, setCrop] = useState<PercentCrop>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const newFile = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(newFile);
    dialogRef.current?.showModal();
  }, [imageData]);

  const {getRootProps, getInputProps} = useDropzone({
    onDrop, 
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.svg']
    }});

  
  const handleOnChange = (data: string) => {
    setImageData(data);
    const fileExtention = extractImageFileExtensionFromBase64(data);
    const fileName = `profile.${fileExtention}`;
    const file = base64StringtoFile(data, fileName);
    onChange?.(file);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const {width, height} = e.currentTarget;
    console.log(width, height);
    const crop = makeAspectCrop(
      {
        unit: '%',
        width: Math.min(width, height)
      },
      1,
      width,
      height
    );

    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleApply = () => {
    if (!imageRef.current || !canvasRef.current || !crop) {
      return;
    }
    image64ToCanvasRef(canvasRef.current, imageData || '', convertToPixelCrop(crop, imageRef.current.naturalWidth, imageRef.current.naturalHeight ));
    handleOnChange(canvasRef.current.toDataURL());
    dialogRef.current?.close();
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{display: 'none', height: 100, width: 100}} />
      <div {...getRootProps()} className="hover:cursor-pointer">
        <input {...getInputProps()} />
        {imageData ? (
          <div className="w-40 h-40 bg-gray-200 rounded-full flex justify-center items-center flex-col relative">
            <div className="select-image-mask">
              <div className="w-20 h-20 flex justify-center items-center opacity-80">
                <EditIcon sx={{fontSize: '50px', color: 'white', opacity: 100}}/>
              </div>
            </div>
            <img src={imageData} alt="profile" className="w-40 h-40 rounded-full object-cover" />
          </div>
        ) : (
          <div className="w-40 h-40 bg-gray-200 rounded-full flex justify-center items-center flex-col relative">
            <AddPhotoAlternateIcon sx={{fontSize: '50px'}}/>
            <span className="text-gray-500">Select an Image</span>
          </div>
        )}
      </div>
      <dialog ref={dialogRef} className="dialog px-6 py-4 ">
        <div className="relative w-full h-full flex flex-col">
          <Button 
            type="button"
            className="flex justify-center items-center w-fit absolute top-2 right-2 rounded-full p-2 hover:bg-[#e6e6e7] hover:cursor-pointer bg-transparent text-black">
            <CloseIcon />
          </Button>
          <div className='flex flex-col gap-4 mt-[50px]'>
            <header className="mt-0">
              <h1 className="text-2xl font-bold">Crop Image</h1>
              <p>Crop the image to fit the profile image</p>
            </header>
            <div className="my-6">
              <div className="w-full max-h-[500px] flex flex-col justify-center items-center">
                <ReactCrop
                  crop={crop}
                  aspect={1}
                  circularCrop
                  keepSelection
                  onChange={(_, crop) => {setCrop(crop);}}
                > 
                  <img src={imageData || ''} onLoad={handleImageLoad} className="object-contain" ref={imageRef}/>
                </ReactCrop>
                <Button type="button" className="mt-4 w-full" onClick={handleApply}>Apply</Button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ProfileImageSelector;
