import 'react-image-crop/dist/ReactCrop.css';
import './ReactCrop.css';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, useMediaQuery } from '@mui/material';
import React, {useCallback, useEffect,useRef,useState} from 'react';
import {FileWithPath, useDropzone} from 'react-dropzone';
import ReactCrop, { centerCrop, convertToPixelCrop,type Crop, makeAspectCrop, type PercentCrop, type PixelCrop } from 'react-image-crop';

import { base64StringtoFile, extractImageFileExtensionFromBase64, image64ToCanvasRef, setCanvasPreview } from '@/lib/utils';

import { Button } from '../ui/button';
import CropImageDialogContent from './CropImageDialogContent';
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
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery('(max-width: 768px)');

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const newFile = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(newFile);
    setOpen(true);
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

  const handleApply = (data: string) => {
    setImageData(data);
    setOpen(false);
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
      <Dialog open={open} fullScreen={fullScreen}>
        <CropImageDialogContent 
          imageData={imageData || ''}
          aspectRatio={1/1}
          onDone={handleApply}
        />
      </Dialog>
    </div>
  );
}

export default ProfileImageSelector;
