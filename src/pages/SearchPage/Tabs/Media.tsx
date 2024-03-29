import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router-dom';

import ImageGrid from '@/components/shared/ImageGrid';
import Loader from '@/components/shared/Loader';
import { useSearchMedia } from '@/react-query/queriesAndMutations';

function Media() {
  const [searchParams] = useSearchParams();
  const {data, isPending, isFetchingNextPage, isError, fetchNextPage, isRefetching} = useSearchMedia(searchParams.get('q') || '');
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const renderImages = () => {
    if (isPending) {
      return (
        <Loader />
      );
    }
    else if (isError) {
      // no-op
    }
    else if (data) {
      const images = data.pages.map((page) => page.results).flat();
      return <ImageGrid images={images} liRef={ref} />;
    }
  };

  return (
    <>
      {renderImages()}
      {
        isFetchingNextPage && (
          <Loader />
        )
      }
    </>
  );
}

export default Media;