import React from 'react';

import { useGlobalContext } from '@/context/GlobalContext';

import FullScreenImageView from './FullScreenImageView';

export interface ImageGridProps {
 images?: string[];
}

function ImageGrid({images}: ImageGridProps) {
  const {openDialog} = useGlobalContext().dialog;
  const handleImageClick = (index: number) => {
    openDialog(() => <FullScreenImageView images={images || []} defaultIndex={index} />, {fullScreen: true});
  };

  return (
    <ul className="w-full h-full grid grid-cols-3 gap-1 p-1">
      {images?.map((image, index) => (
        <li key={index} className="aspect-square">
          <img
            src={image} 
            alt="avatar" className="aspect-square object-cover object-center cursor-pointer"
            onClick={() => handleImageClick(index)}
          />
        </li>
      ))}
    </ul>
  );
}

export default ImageGrid;