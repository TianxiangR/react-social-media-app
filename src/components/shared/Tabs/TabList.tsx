import React, { ReactElement } from 'react';

import { cn } from '@/lib/utils';

import { TabProps } from '.';

export type TabListProps<T extends string> = Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> & {
  onChange?: (event: React.SyntheticEvent, value?: T) => void;
  children?:  ReactElement<TabProps<T>> | ReactElement<TabProps<T>>[];
}

// eslint-disable-next-line react/prop-types
function TabList<T extends string>({onChange, children, className, ...props}: TabListProps<T>) {
  const newClassName = cn('flex w-full h-[53px]', className);

  const renderChildren = () => {
    if (!children) return null;

    return React.Children.map(children, (child) => {
      if (child) {
        return React.cloneElement(child as React.ReactElement, {
          onChange
        });
      }
    });
  };

  return (
    <div onChange={(e) => onChange?.(e)} className={newClassName} {...props}>
      {renderChildren()}
    </div>
  );
}

export default TabList;