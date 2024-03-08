import React, { ComponentType, ReactComponentElement, ReactElement,ReactHTML,ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export interface InViewContainerProps {
  children?: ReactNode;
  component?: keyof ReactHTML;
  onInview?: () => void;
  once?: boolean;
}

function InViewContainer({ children, component, onInview, once }: InViewContainerProps) {
  const { inView, ref } = useInView();
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (inView && onInview && (!once || !hasBeenInView)) {
      onInview();
      setHasBeenInView(true);
    }
  }, [inView, once]);

  if (component) {
    return React.createElement(component, {ref}, children);
  }

  return <div ref={ref}>{children}</div>;
}

export default InViewContainer;