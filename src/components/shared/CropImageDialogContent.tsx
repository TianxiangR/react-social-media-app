import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useRef,useState } from 'react';
import ReactCrop, {centerCrop, convertToPixelCrop,Crop, makeAspectCrop} from 'react-image-crop';
import { set } from 'zod';

import { base64StringtoFile, extractImageFileExtensionFromBase64, image64ToCanvasRef } from '@/lib/utils';

import { Button } from '../ui/button';

export interface CropImageDialogContentProps {
  imageData: string;
  aspectRatio: number;
  onDone: (data: string) => void;
}

function CropImageDialogContent({ imageData, aspectRatio, onDone }: CropImageDialogContentProps) {
  const [crop, setCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCropChange = (crop: Crop) => {
    setCrop(crop);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const {width, height} = e.currentTarget;
    console.log(width, height);
    const crop = makeAspectCrop(
      {
        unit: '%',
        width: Math.min(width, height)
      },
      aspectRatio,
      width,
      height
    );

    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleDone = () => {
    if (!imageRef.current || !canvasRef.current || !crop) {
      return;
    }
    image64ToCanvasRef(canvasRef.current, imageData || '', convertToPixelCrop(crop, imageRef.current.naturalWidth, imageRef.current.naturalHeight ));
    onDone(canvasRef.current.toDataURL());
  };

  return (
    <div className="overflow-auto w-[600px] h-[800px] relative rounded-lg bg-white" style={{maxHeight: 'calc(100vh - 3rem - 6px)'}}>
      {/* Top Bar */}
      <div className="flex justify-between top-0 h-[53px] items-center sticky-bar px-2 z-50">
        <div className="flex jusitfy-start items-center">
          <Button
            className="flex justify-center items-center w-fit rounded-full p-2 hover:bg-[#e6e6e7] hover:cursor-pointer bg-transparent text-black"
            onClick={() => {onDone(imageData);}}
            type="button"
          >
            <ArrowBackIcon />
          </Button>
          <span className="text-lg font-bold ml-2">Edit Profile</span>
        </div>
        <Button className="rounded-full text-sm text-white" type="button"
          onClick={handleDone}
        >Apply</Button>
      </div>
      <div className="w-full max-h-[500px] flex flex-col justify-center items-center">
        <ReactCrop
          crop={crop}
          aspect={aspectRatio}
          keepSelection
          onChange={(_, crop) => {handleCropChange(crop);}}
        > 
          <img src={imageData || ''} onLoad={handleImageLoad} className="object-contain" ref={imageRef}/>
        </ReactCrop>
        <canvas ref={canvasRef} style={{display: 'none'}} />
      </div>
    </div>
  );
}

export default CropImageDialogContent;