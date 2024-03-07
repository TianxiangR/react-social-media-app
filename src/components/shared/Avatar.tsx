import React from 'react';

export interface AvatarProps {
  src: string;
  size: number;
  variant?: 'default' | 'top' | 'middle' | 'bottom';
}

function Avatar({ src, size, variant = 'default'}: AvatarProps) {
  return (
    <div className={`flex flex-col aspect-square size-[${size}px] relative`}>
      <img src={src} alt="avatar" className={`rounded-full object-cover size-[${size}px]`}/>
    </div>
  );
}

export default Avatar;