import React from 'react';

import { useGlobalContext } from '@/context/GlobalContext';

import FullScreenImageView from './FullScreenImageView';

export type ImageViewProps = {
  images?: string[];
  size?: 'medium' | 'large';
  rounded?: boolean;
  allowFullScreen?: boolean;
};

function ImageView({images, size, rounded, allowFullScreen}: ImageViewProps) {
  const {openDialog} = useGlobalContext().dialog;
  const openFullScreen = (index: number) => {
    openDialog(() => <FullScreenImageView images={images || []} defaultIndex={index} />, {fullScreen: true});
  };

  const handleClick = allowFullScreen ? (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    openFullScreen(index);
  } : undefined;

  if (!images || images?.length === 0) {
    return <></>;
  }

  if (images.length === 1) {
    let defaultClassName = 'flex max-h-[510px] overflow-hidden w-auto h-full w-full' + (rounded ? ' rounded-2xl' : '');
    let imageClassName = 'object-cover object-center h-full min-w-[75%]' + (rounded ? ' rounded-2xl' : '');

    if (size === 'large') {
      defaultClassName = 'flex overflow-hidden w-auto max-h-[800px] h-full w-full' + (rounded ? ' rounded-2xl' : '');
      imageClassName = 'object-cover object-center w-full' + (rounded ? ' rounded-2xl' : '');
    }

    return (
      <div className={defaultClassName}>
        <img src={images[0]} alt="Image" className={imageClassName} onClick={(e) => handleClick?.(e, 0)} />
      </div>
    );
  }

  let baseClassName = 'overflow-hidden gap-[2px] max-h-[288px] h-full w-full' + (rounded ? ' rounded-2xl' : '');

  if (size === 'large') {
    baseClassName = ' overflow-hidden gap-[2px] max-h-[300px] h-full w-full' + (rounded ? ' rounded-2xl' : '');
  }

  if (images.length === 2) {
    return (
      <div className={`${baseClassName} grid grid-cols-2`}>
        {images.map((image, index) => (
          <img key={index} src={image} alt="Image" className="w-full h-full object-cover" onClick={(e) => handleClick?.(e, index)} />
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className={`${baseClassName} grid grid-cols-2 grid-rows-2`}>
        <div className="row-span-2">
          <img src={images[0]} alt="Image" className="w-full h-full object-cover" onClick={(e) => handleClick?.(e, 0)} />
        </div>
        <div className="row-span-1">
          <img src={images[1]} alt="Image" className="w-full h-full object-cover" onClick={(e) => handleClick?.(e, 1)} />
        </div>
        <div className="row-span-1">
          <img src={images[2]} alt="Image" className="w-full h-full object-cover" onClick={(e) => handleClick?.(e, 2)} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClassName} grid grid-cols-2 grid-rows-2`}>
      <div className="row-span-1">
        <img src={images[0]} alt="Image" className="w-full h-full object-cover" onClick={(e) => handleClick?.(e, 0)} />
      </div>
      <div className="row-span-1">
        <img src={images[1]} alt="Image" className="w-full h-full object-cover" onClick={(e) => handleClick?.(e, 1)} />
      </div>
      <div className="row-span-1">
        <img src={images[2]} alt="Image" className="w-full h-full object-cover" onClick={(e) => handleClick?.(e, 2)} />
      </div>
      <div className="row-span-1">
        <img src={images[3]} alt="Image" className="w-full h-full object-cover" onClick={(e) => handleClick?.(e, 3)} />
      </div>
    </div>
  );
}

export default ImageView;