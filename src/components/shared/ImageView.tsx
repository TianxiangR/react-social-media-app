import React from 'react';

export type ImageViewProps = {
  images?: string[];
  size?: 'medium' | 'large';
};

function ImageView({images, size}: ImageViewProps) {

  if (!images || images?.length === 0) {
    return <></>;
  }

  if (images.length === 1) {
    let className = 'rounded-2xl max-h-[510px] overflow-hidden w-full';

    if (size === 'large') {
      className = 'rounded-2xl overflow-hidden w-full max-h-[800px]';
    }

    return (
      <div className={className}>
        <img src={images[0]} alt="Image" className="object-contain object-center rounded-2xl" />
      </div>
    );
  }

  let baseClassName = 'rounded-2xl overflow-hidden gap-[2px] max-h-[288px] h-[288px] w-full';

  if (size === 'large') {
    baseClassName = 'rounded-2xl overflow-hidden gap-[2px] max-h-[300px] h-[300px] w-full';
  }

  if (images.length === 2) {
    return (
      <div className={`${baseClassName} grid grid-cols-2`}>
        {images.map((image, index) => (
          <img key={index} src={image} alt="Image" className="w-full h-full object-cover" />
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className={`${baseClassName} grid grid-cols-2 grid-rows-2`}>
        <div className="row-span-2">
          <img src={images[0]} alt="Image" className="w-full h-full object-cover" />
        </div>
        <div className="row-span-1">
          <img src={images[1]} alt="Image" className="w-full h-full object-cover" />
        </div>
        <div className="row-span-1">
          <img src={images[2]} alt="Image" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClassName} grid grid-cols-2 grid-rows-2`}>
      <div className="row-span-1">
        <img src={images[0]} alt="Image" className="w-full h-full object-cover" />
      </div>
      <div className="row-span-1">
        <img src={images[1]} alt="Image" className="w-full h-full object-cover" />
      </div>
      <div className="row-span-1">
        <img src={images[2]} alt="Image" className="w-full h-full object-cover" />
      </div>
      <div className="row-span-1">
        <img src={images[3]} alt="Image" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default ImageView;