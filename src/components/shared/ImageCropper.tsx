import 'react-image-crop/dist/ReactCrop.css';
import './ReactCrop.css';

import React, {useEffect,useRef,useState} from 'react';
import ReactCrop, { centerCrop, type Crop, makeAspectCrop, type PercentCrop, type PixelCrop } from 'react-image-crop';

import { setCanvasPreview } from '@/lib/utils';



export type ImageCropperDialogProp = React.HTMLAttributes<HTMLDivElement> & {
  src: string;
  onCrop?: (data: string) => void;
  className?: string;
}

function ImageCropper({ src, onCrop, ...props}: ImageCropperDialogProp) {
  const [crop, setCrop] = useState<Crop>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const {width, height} = e.currentTarget;
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

  const handleOnChange = (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    // if (!imageRef.current || !canvasRef.current) {
    //   return;
    // }
    // setCanvasPreview(canvasRef.current, imageRef.current, pixelCrop);
    setCrop(percentCrop);
    // onChange?.(canvasRef.current.toDataURL());
  };

  return (
    <div {...props}>
      <ReactCrop
        crop={crop}
        aspect={1}
        circularCrop
        keepSelection
        onChange={handleOnChange}
      > 
        <img src={src} onLoad={handleImageLoad} className="object-contain" ref={imageRef}/>
      </ReactCrop>
    </div>
  );
}

export default ImageCropper;