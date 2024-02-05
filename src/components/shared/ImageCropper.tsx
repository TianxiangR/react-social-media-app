import 'react-image-crop/dist/ReactCrop.css';

import React, {useEffect,useRef,useState} from 'react';
import ReactCrop, { centerCrop,type Crop, makeAspectCrop } from 'react-image-crop';



export type ImageCropperDialogProp = {
  src: string;
  onCrop?: (crop: Crop) => void;
}

function ImageCropper({ src, onCrop}: ImageCropperDialogProp) {
  const [crop, setCrop] = useState<Crop>();

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

  return (
    <ReactCrop
      crop={crop}
      aspect={1}
      circularCrop
      keepSelection
      onChange={(newCrop) => setCrop(newCrop)}
    > 
      <img src={src} onLoad={handleImageLoad}/>
    </ReactCrop>
  );
}

export default ImageCropper;