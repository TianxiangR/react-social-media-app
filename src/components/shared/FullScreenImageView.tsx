import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect,useState } from 'react';

import { Button } from '@/components/ui/button';
import { useGlobalContext } from '@/context/GlobalContext';


export interface FullScreenImageViewProps {
  images: string[];
  defaultIndex?: number;
}

function FullScreenImageView({ images, defaultIndex = 0 }: FullScreenImageViewProps) {
  const { closeDialog } = useGlobalContext().dialog;
  const [startX, setStartX] = useState(0);
  const [startOffset, setStartOffset] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [offset, setOffset] = useState(defaultIndex * window.innerWidth);
  const [slideIndex, setSlideIndex] = useState(defaultIndex);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isTouchScreen, setIsTouchScreen] = useState(navigator.maxTouchPoints > 0);

  useEffect(() => {
    setIsTouchScreen(navigator.maxTouchPoints > 0);
  }, [navigator.maxTouchPoints]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setOffset(slideIndex * screenWidth);
  }, [screenWidth]);

  const handleMousedown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setStartX(e.clientX);
    setStartOffset(offset);
    setIsDown(true);
  };

  const handleScrollEnd = (endX: number) => {
    setIsDown(false);
    
    if (Math.abs(endX - startX) < 10) {
      closeDialog();
    }

    // adjust position
    const containerLength = containerRef.current?.clientWidth || 0;
    const slideWidth = window.innerWidth;
    

    const walk = offset - startOffset;
    const scrolledLeft = walk > 0;

    const roundedUp = Math.ceil(offset / slideWidth) * slideWidth;
    const roundedDown = Math.floor(offset / slideWidth) * slideWidth;

    let expectedOffset = 0;

    if (scrolledLeft) {
      if (offset > roundedDown + slideWidth / 10) {
        expectedOffset = roundedUp;
      } else {
        expectedOffset = roundedDown;
      }
    } else {
      if (offset < roundedUp - slideWidth / 10) {
        expectedOffset = roundedDown;
      } else {
        expectedOffset = roundedUp;
      }
    }

    const actualOffset = Math.min(containerLength - window.innerWidth, Math.max(0, expectedOffset));
    setOffset(actualOffset);
    setSlideIndex(Math.round(actualOffset / slideWidth));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleScrollEnd(e.clientX);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleScrollEnd(e.clientX);
  };

  const handleMove = (x: number) => {
    const walkMultiplier = isTouchScreen ? 1 : 5;
    const walk = (x - startX) * walkMultiplier;
    const containerLength = containerRef.current?.clientWidth || 0;
    setOffset((prev) => Math.min(containerLength - window.innerWidth, Math.max(0, startOffset - walk)));
  };

  const handleMousMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isDown) return;
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setStartX(e.touches[0].clientX);
    setStartOffset(offset);
    setIsDown(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleScrollEnd(e.changedTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isDown) return;
    const x = e.touches[0].clientX;
    handleMove(x);
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleScrollEnd(e.changedTouches[0].clientX);
  };

  const moveLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const slideWidth = window.innerWidth;
    const expectedOffset = Math.max(0, offset - slideWidth);
    setOffset(expectedOffset);
    setSlideIndex(Math.round(expectedOffset / slideWidth));
  };

  const moveRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const slideWidth = window.innerWidth;
    const expectedOffset = Math.min((images.length - 1) * slideWidth, offset + slideWidth);
    setOffset(expectedOffset);
    setSlideIndex(Math.round(expectedOffset / slideWidth));
  };

  return (
    <div className="w-screen h-screen max-w-[100vw] max-h-screen overflow-hidden" style={{background: 'rgba(0, 0, 0, 90%)'}}>
      { !isTouchScreen &&
        <Button
          className="flex justify-center items-center w-fit rounded-full aspect-square border-white border-2 p-2 hover:bg-[#1d2124] hover:cursor-pointer bg-black text-black absolute top-10 left-10 z-10"
          onClick={closeDialog}
        >
          <CloseIcon sx={{color: 'white'}}/>
        </Button>
      }


      { offset > 0 && !isTouchScreen &&
        <Button
          className="flex justify-center items-center w-fit rounded-full aspect-square border-white border-2 p-2 hover:bg-[#1d2124] hover:cursor-pointer bg-black text-black absolute top-[45%] left-10 z-10"
          onClick={moveLeft}
        >
          <ArrowBackIcon sx={{color: 'white'}}/>
        </Button>
      }

      { offset < (images.length - 1) * window.innerWidth && !isTouchScreen &&
        <Button
          className="flex justify-center items-center w-fit rounded-full aspect-square border-white border-2 p-2 hover:bg-[#1d2124] hover:cursor-pointer bg-black text-black absolute top-[45%] right-10 z-10"
          onClick={moveRight}
        >
          <ArrowForwardIcon sx={{color: 'white'}}/>
        </Button>
      }

      <div
        className="flex h-full w-fit gap-0 relative" 
        style={{
          transform: `translateX(-${offset}px)`,
          transition: isDown ? 'none' : 'transform 0.5s ease',
        }}
        onMouseDown={handleMousedown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMousMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchCancel={handleTouchCancel}

        ref={containerRef}
      >
        {
          images.map((url, index) => {
            return (
              <div className='h-full w-screen overflow-auto relative' key={index} 
                style={{
                  minWidth: 'calc(100vw)',
                }}
              >
                <div className="absolute top-[50%] left-[50%] flex justify-center items-center w-full h-full" style={{transform: 'translate(-50%, -50%)'}}>
                  <img 
                    src={url} 
                    alt="Image"
                    className="object-contain object-center max-h-screen max-w-screen h-auto min-h-[50%] min-w-[80%]"
                  />
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default FullScreenImageView;