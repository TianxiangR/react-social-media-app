import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useGlobalContext } from '@/context/GlobalContext';
import { useGetUserMedia } from '@/react-query/queriesAndMutations';

import FullScreenImageView from '../../../components/shared/FullScreenImageView';
import ImageGrid from '../../../components/shared/ImageGrid';
import Loader from '../../../components/shared/Loader';

export interface UserMediaProps {
  username: string;
}

function UserMedia({ username }: UserMediaProps) {
  const {data, isPending, isError, fetchNextPage} = useGetUserMedia(username);
  const { ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const renderImages = () => {
    if (isPending) {
      return (
        <div className="flex jusitfy-center items-center mt-10">
          <Loader />
        </div>
      );
    }
    else if (isError) {
      // no-op
    }
    else if (data) {
      const images = data.pages.map((page) => page.results).flat();
      return <ImageGrid images={images} />;
    }
  };

  return (
    <div className="w-full h-full">
      {renderImages()}
    </div>
  );
}

export default UserMedia;