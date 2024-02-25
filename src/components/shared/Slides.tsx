import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React, {useEffect, useRef,useState} from 'react';

import { runMicroTask } from '@/lib/utils';

import { Button } from '../ui/button';

export type SliderProps = {
  children?: React.ReactNode;
  defaultPosition?: 'start' | 'middle' | 'end' | 'none';
  slideCols?: number;
  scrollCols?: number;
};

const ACCEPTABLE_ERROR = 2;

function Slides({children, defaultPosition='none', slideCols = 1, scrollCols = 1}: SliderProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const childrenLength = React.Children.count(children);
  const actualSlideCols = Math.max(1, Math.min(slideCols, childrenLength));
  const actualScrollCols = Math.max(1, Math.min(scrollCols, childrenLength - 1));
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleOnScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const getScrollPosition = (scrollWith: number, scrollLeft: number, expectedDisposition: number) => {
    let expectedLeft = scrollLeft + expectedDisposition;
    const roundUpLeft = Math.ceil(expectedLeft / expectedDisposition) * expectedDisposition;
    const roundDownLeft = Math.floor(expectedLeft / expectedDisposition) * expectedDisposition;

    if (expectedLeft + ACCEPTABLE_ERROR >= roundUpLeft) {
      expectedLeft = roundUpLeft;
    }
    else {
      expectedLeft = roundDownLeft;
    }

    expectedLeft = Math.min(expectedLeft, scrollWith);

    return expectedLeft;
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const {scrollWidth, scrollLeft} = scrollContainerRef.current;
      const unitWidth = scrollWidth / childrenLength;
      const expectedDisposition = unitWidth * actualScrollCols;
      const expectedLeft = getScrollPosition(scrollWidth, scrollLeft, expectedDisposition);
      
      scrollContainerRef.current.scrollLeft = expectedLeft;
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const {scrollWidth, scrollLeft} = scrollContainerRef.current;
      const unitWidth = scrollWidth / childrenLength;
      const expectedDisposition = unitWidth * actualScrollCols;
      const expectedLeft = getScrollPosition(scrollWidth, scrollWidth - scrollLeft, expectedDisposition);

      scrollContainerRef.current.scrollLeft = scrollWidth - expectedLeft;
    }
  };

  const scrollToDefault = () => {
    if (scrollContainerRef.current) {
      switch (defaultPosition) {
      case 'start':
        scrollContainerRef.current.scrollLeft = 0;
        break;
      case 'middle': {
        const unitWidth = scrollContainerRef.current.scrollWidth / childrenLength;
        const expectedDisposition = unitWidth * (Math.ceil(childrenLength / actualSlideCols / 2) - 1);
        scrollContainerRef.current.scrollLeft = expectedDisposition;
        break;
      }
      case 'end':
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        break;
      default:
        break;
      }
    }
  };

  const updateArrows = () => {
    if (scrollContainerRef.current) {
      const { clientWidth, scrollWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollPosition >= 20);
      setShowRightArrow(scrollWidth - clientWidth - scrollPosition >= 20);
    }
  };

  useEffect(() => {
    runMicroTask(() => {
      scrollToDefault();
      updateArrows();
    });
  }, []);

  useEffect(() => {
    runMicroTask(() => {
      scrollToDefault();
      updateArrows();
    });
  }, [children]);

  useEffect(() => {
    updateArrows();
  }, [scrollPosition]);

  return (
    <div className="w-full max-w-full h-auto max-h-full relative">
      { showLeftArrow && 
              <Button
                className="flex justify-center items-center w-fit rounded-full p-2 hover:bg-[#1d2124] hover:cursor-pointer bg-[#0b0f13] text-black absolute top-[45%] left-1 z-10"
                onClick={scrollLeft}
              >
                <ArrowBackIcon sx={{color: 'white'}}/>
              </Button>
      }
      { showRightArrow && 
              <Button
                className="flex justify-center items-center w-fit rounded-full p-2 hover:bg-[#1d2124] hover:cursor-pointer bg-[#0b0f13] text-black absolute top-[45%] right-1 z-10"
                onClick={scrollRight}
              >
                <ArrowForwardIcon sx={{color: 'white'}}/>
              </Button>
      }
      <div
        className="flex h-full w-full gap-0 overflow-x-auto overflow-y-hidden relative" 
        ref={scrollContainerRef} 
        style={{
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth',
        }}
        onScroll={handleOnScroll}
      >
        {
          React.Children.map(children, (child, index) => {
            return (
              <div className='w-full h-full overflow-hidden' key={index} style={{minWidth: `calc(100% / ${actualSlideCols})`}}>
                {child}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}


export default Slides;