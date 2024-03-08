import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router-dom';

import Loader from '@/components/shared/Loader';
import UserPreview from '@/components/shared/UserPreview';
import { useSearchPeople } from '@/react-query/queriesAndMutations';

function People() {
  const [searchParams] = useSearchParams();
  const {data, isPending, isError, fetchNextPage, isFetchingNextPage} = useSearchPeople(searchParams.get('q') || '');
  const { ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const renderPeople = () => {
    if (isPending) {
      return (
        <Loader />
      );
    }
    else if (isError) {
      return (
        <div className="mt-10">
          <p className="text-red-500">Error fetching data</p>
        </div>
      );
    }
    else if (data) {
      const people = data.pages.map((page) => page.results).flat();

      return (
        <ul className="flex flex-col">
          {
            people.map((user, index) => {
              if (index === people.length - 5) {
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
          {
            isFetchingNextPage && (
              <Loader />
            )
          }
        </ul>
      );
    }
  };


  return (
    <>
      {renderPeople()}
    </>
  );
}

export default People;