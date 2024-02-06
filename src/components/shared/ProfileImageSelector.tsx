import 'react-image-crop/dist/ReactCrop.css';
import './ReactCrop.css';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
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
import { setCanvasPreview } from '@/lib/utils';

import { Button } from '../ui/button';
import ImageCropper from './ImageCropper';

export type ProfileImageSelectorProps = {
  onChange?: (imageData: string) => void;
  src? : string;
}

function ProfileImageSelector({onChange, src}: ProfileImageSelectorProps) {
  const [imageData, setImageData] = useState<string | null | undefined>(src);
  const [url, setUrl] = useState<string | null | undefined>(src);
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState<PercentCrop>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const newFile = acceptedFiles[0];
    setUrl(URL.createObjectURL(newFile));
    setOpen(true);
  }, [imageData]);

  const {getRootProps, getInputProps} = useDropzone({
    onDrop, 
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.svg']
    }});

  
  const handleOnChange = (data: string) => {
    // setUrl(null);
    setImageData(data);
    onChange?.(data);
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
    setCanvasPreview(canvasRef.current, imageRef.current, convertToPixelCrop(crop, imageRef.current.naturalWidth, imageRef.current.naturalHeight ));
    handleOnChange(canvasRef.current.toDataURL());
    setOpen(false);
  };

  return (
    <div>
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>
              Crop the image to fit the profile picture
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <div className="w-full max-h-[500px] flex justify-center">
              <ReactCrop
                crop={crop}
                aspect={1}
                circularCrop
                keepSelection
                onChange={(_, crop) => {setCrop(crop); console.log(crop);}}
              > 
                <img src={url || ''} onLoad={handleImageLoad} className="object-contain" ref={imageRef}/>
              </ReactCrop>
              <canvas ref={canvasRef} style={{display: 'none', height: 100, width: 100}} />
            </div>
          </div>
          <Button onClick={handleApply}>Apply</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfileImageSelector;