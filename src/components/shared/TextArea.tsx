import React, { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

export type TextAreaProps = React.ComponentPropsWithRef<'textarea'>;

const TextArea: React.FC<TextAreaProps> = React.forwardRef<HTMLTextAreaElement>(({className, onChange, ...props}: TextAreaProps, ref) => {
  const defaultClassName = 'resize-none box-border';
  const myRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const currentRef = ref || myRef;
    const handleWindowResize = () => {
      if (!(currentRef instanceof Function) && currentRef.current) {
        currentRef.current.style.height = 'auto';
        currentRef.current.style.minHeight = 'auto';
        const { scrollHeight } = currentRef.current;
        currentRef.current.style.height = `${Math.min(scrollHeight, 720)}px`;
        currentRef.current.style.minHeight = `${Math.min(scrollHeight, 720)}}px`;
      }
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };

  }, [ref, myRef]);

  const resizeOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    e.target.style.height = 'auto';
    e.target.style.minHeight = 'auto';
    const { scrollHeight } = e.target;
    e.target.style.height = `${Math.min(scrollHeight, 720)}px`;
    e.target.style.minHeight = `${Math.min(scrollHeight, 720)}}px`;
  };

  return (
    <textarea className={cn(defaultClassName, className)} onChange={resizeOnChange} ref={ref || myRef} {...props} />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;