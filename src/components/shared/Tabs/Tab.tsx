import React, { useEffect, useState } from 'react';
import { set } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { useTabContext } from '.';

export type TabProps<T extends string> = Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> & {
  label: string;
  value: T;
  onChange?: (event: React.SyntheticEvent, value?: string | number) => void;
}

// eslint-disable-next-line react/prop-types
export function Tab<T extends string>({label, value, onClick, onChange, className}: TabProps<T>) {
  const {activeTab} = useTabContext();
  const defaultButtonClassName = cn('flex', 'w-full' , 'justify-center', 'items-center', 'hover:bg-[#e7e7e8]');
  const defaultDivClassName = cn('flex', 'w-fit', 'h-full', 'justify-center', 'items-center', 'relative');
  const defaultIndicatorClassName = cn('absolute', 'bottom-0', 'w-full', 'h-1', 'bg-blue', 'rounded-full', 'transition-all', 'duration-300', 'ease-in-out', 'transform', 'opacity-0', 'min-w-14');
  const [buttonClassName, setButtonClassName] = useState(cn(defaultButtonClassName,className));
  const [indicatorClassName, setIndicatorClassName] = useState(defaultIndicatorClassName);


  useEffect(() => {
    if (activeTab === value) {
      setIndicatorClassName(cn(defaultIndicatorClassName, 'opacity-100'));
    } else {
      setIndicatorClassName(cn(defaultIndicatorClassName, 'opacity-0'));
    }
  }, [activeTab]);

  useEffect(() => {
    setButtonClassName(cn(defaultButtonClassName,className));
  }, [className]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onChange !== undefined && value !== undefined) {
      onChange(e, value);
    }
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} className={buttonClassName}>
      <div className={defaultDivClassName}>
        {label}
        <div className={indicatorClassName} />
      </div>
    </button>
  );
}