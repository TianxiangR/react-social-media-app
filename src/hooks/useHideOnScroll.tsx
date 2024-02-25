import { isCancelledError } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';

const useHideOnScroll = (ref: React.RefObject<HTMLElement>, scrollPos: number) => {
  const prevScrollPos = useRef(0);
  const isScrollingDown = useRef(false);
  const firstScrollDown = useRef(0);
  const firstScrollUp = useRef(0);

  const handleScroll = () => {
    const currentScrollPos = scrollPos;
    const scrollingDown = currentScrollPos > prevScrollPos.current;
    if (scrollingDown && scrollingDown !== isScrollingDown.current) {
      firstScrollDown.current = currentScrollPos;
    } else if (!scrollingDown && scrollingDown !== isScrollingDown.current) {
      firstScrollUp.current = currentScrollPos;
    }
    isScrollingDown.current = scrollingDown;
    prevScrollPos.current = currentScrollPos;

    if (ref.current) {
      ref.current.style.transition = 'transform 0.3s';
      if (isScrollingDown.current && currentScrollPos > firstScrollDown.current + 50) {
        ref.current.style.transform = 'translateY(-100%)';
      } else if (!isScrollingDown.current && currentScrollPos < firstScrollUp.current - 50) {
        ref.current.style.transform = 'translateY(0)';
      }
    }
  };

  useEffect(() => {
    handleScroll();
  }, [ref, scrollPos]);
};

export default useHideOnScroll;