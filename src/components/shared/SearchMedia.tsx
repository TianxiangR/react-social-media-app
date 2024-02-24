import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSearchMedia } from '@/react-query/queriesAndMutations';

import ImageGrid from './ImageGrid';
import Loader from './Loader';

function SearchMedia() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {data, isFetching, isError} = useSearchMedia(searchParams.get('q') || '');

  const renderImages = () => {
    if (isFetching) {
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
      const {media} = data;
      return <ImageGrid images={media} />;
    }
  };

  return (
    <>
      {renderImages()}
    </>
  );
}

export default SearchMedia;