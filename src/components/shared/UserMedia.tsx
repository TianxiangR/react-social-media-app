import React from 'react';

import { useGlobalContext } from '@/context/GlobalContext';
import { useGetUserMedia } from '@/react-query/queriesAndMutations';

import FullScreenImageView from './FullScreenImageView';
import ImageGrid from './ImageGrid';
import Loader from './Loader';

export interface UserMediaProps {
  username: string;
}

function UserMedia({ username }: UserMediaProps) {
  const {data, isPending, isError} = useGetUserMedia(username);

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
      const {images} = data;
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