import React from 'react';

import { useGetUserMedia } from '@/react-query/queriesAndMutations';

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
      return (
        <ul className="w-full h-full grid grid-cols-3 gap-1 p-1">
          {data.images.map((image, index) => (
            <li key={index} className="aspect-square">
              <img src={image} alt="avatar" className="aspect-square object-cover object-center"/>
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="w-full h-full">
      {renderImages()}
    </div>
  );
}

export default UserMedia;