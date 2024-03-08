import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Loader from '@/components/shared/Loader';
import UserPreview from '@/components/shared/UserPreview';
import { useGetUserFollowers } from '@/react-query/queriesAndMutations';

function Followers({username}: {username: string}) {
  const {data, isPending, isError, isFetchingNextPage, fetchNextPage} = useGetUserFollowers(username);
  const { inView, ref } = useInView();

  useEffect(() => {
    if (inView && isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage, fetchNextPage]);

  const renderFollowers = () => {
    if (isPending) {
      return <Loader />;
    }

    if (isError) {
      return <p>Error loading followers</p>;
    }

    const users = data.pages.map((page) => page.results).flat();
    return (
      <ul className="flex flex-col">
        {
          users.map((user, index) => {
            if (index === users.length - 5) {
              return (
                <li key={user.id} ref={ref}>
                  <UserPreview {...user} />
                </li>
              );
            }
            return (
              <li key={user.id}>
                <UserPreview {...user} />
              </li>
            );
          })
        }
      </ul>
    );
  };

  return (
    <div className="w-full h-full">
      {renderFollowers()}
    </div>
  );
}

export default Followers;