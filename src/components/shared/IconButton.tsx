import React, {useRef} from 'react';

import { cn } from '@/lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({children, className, ...props}, ref) => {
    const newClassName = cn('rounded-full w-fit h-auto aspect-square bg-opacity-0 hover:bg-opacity-20 icon-button relative flex justify-center items-center disabled:opacity-50', className);

    const {disabled} = props;

    return (
      <button className={newClassName} ref={ref} {...props}>
        {children}
        <span className="icon-bg absolute top-[50%] left-[50%] bg-[currentColor] w-full h-full rounded-[50%] opacity-0 hover:opacity-10 group-hover:opacity-10 transition-all duration-100 ease-in-out"
          style={{padding: '1em', display: disabled ? 'none' : 'block'}}
        ></span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;