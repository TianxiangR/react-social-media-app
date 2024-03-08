
import { RefObject, useEffect, useRef, useState } from 'react';

const useHideOnScroll = (ref?: RefObject<HTMLElement>) => {
  const prevScrollPos = useRef(0);
  const isScrollingDown = useRef(false);
  const firstScrollDown = useRef(0);
  const firstScrollUp = useRef(0);
  const [scrollPos, setScrollPos] = useState(0);

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

    if (ref?.current) {
      ref.current.style.transition = 'transform 0.3s';
      if (isScrollingDown.current && currentScrollPos > firstScrollDown.current + 50) {
        ref.current.style.transform = 'translateY(-100%)';
      } else if (!isScrollingDown.current && currentScrollPos < firstScrollUp.current - 50) {
        ref.current.style.transform = 'translateY(0)';
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    handleScroll();
  }, [ref, scrollPos]);
};

export default useHideOnScroll;