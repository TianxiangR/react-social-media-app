import React from 'react';

import { useGlobalContext } from '@/context/GlobalContext';

import FullScreenImageView from './FullScreenImageView';

export interface ImageGridProps {
 images?: string[];
 liRef?: React.RefCallback<HTMLLIElement>;
}

function ImageGrid({images, liRef}: ImageGridProps) {
  const {openDialog} = useGlobalContext().dialog;
  const handleImageClick = (index: number) => {
    openDialog(() => <FullScreenImageView images={images || []} defaultIndex={index} />, {fullScreen: true});
  };

  return (
    <ul className="w-full h-full grid grid-cols-3 gap-1 p-1">
      {images?.map((image, index) => {
        if (index === images.length - 5) {
          return (
            <li key={image} ref={liRef}>
              <img
                src={image}
                alt="image"
                className="w-full h-full object-cover"
                onClick={() => handleImageClick(index)}
              />
            </li>
          );
        }

        return (
          <li key={image}>
            <img
              src={image}
              alt="image"
              className="w-full h-full object-cover"
              onClick={() => handleImageClick(index)}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default ImageGrid;