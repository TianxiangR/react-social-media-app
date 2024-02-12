import React from 'react';

import { cn } from '@/lib/utils';

export type TextAreaProps = React.ComponentPropsWithRef<'textarea'>;

const TextArea: React.FC<TextAreaProps> = React.forwardRef<HTMLTextAreaElement>(({className, onChange, ...props}, ref) => {
  const defaultClassName = 'resize-none';

  const resizeOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    e.target.style.height = 'auto';
    const { scrollHeight } = e.target;
    e.target.style.height = `${scrollHeight}px`;
  };

  return (
    <textarea className={cn(defaultClassName, className)} onChange={resizeOnChange} ref={ref} {...props} />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;