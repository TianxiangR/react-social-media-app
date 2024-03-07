import React, { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router-dom';

import Loader from '@/components/shared/Loader';
import PostPreview from '@/components/shared/PostPreview';
import UserPreview from '@/components/shared/UserPreview';
import { useSearchPeople, useSearchTop } from '@/react-query/queriesAndMutations';


function Top({setCurrentTab}: {setCurrentTab: (tab: string) => void}){
  const [searchParams] = useSearchParams();
  const {data: postData, isPending: isPendingPosts, isError: isErrorPosts, fetchNextPage, isFetchingNextPage} = useSearchTop(searchParams.get('q') || '');
  const {data: peopleData, isPending: isPendingPeople, isError: isErrorPeople} = useSearchPeople(searchParams.get('q') || '');
  const { ref, inView } = useInView();


  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  
  const renderTop = () => {
    if ((isPendingPosts || isPendingPeople) && (!postData || !peopleData)) {
      return (
        <div className="mt-10">
          <Loader />
        </div>
      );
    }
    else if (isErrorPosts || isErrorPeople) {
      return (
        <div className="mt-10">
          <p className="text-red-500">Error fetching data</p>
        </div>
      );
    }
    else if (postData && peopleData) {
      const posts = postData.pages.map((page) => page.results).flat();
      const people = peopleData.pages.map((page) => page.results).flat().slice(0, 3);

      return (
        <div className="post-list">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold px-4 py-2">People</h1>
            <ul className="flex flex-col">
              {
                people.map((user) => (
                  <li key={user.id} >
                    <UserPreview {...user} />
                  </li>
                ))
              }
              <li 
                className="p-4 w-full hover:bg-[#f7f7f7] hover:cursor-pointer text-blue"
                onClick={() => setCurrentTab('people')}
              >
                View all
              </li>
            </ul>
          </div>
          {
            posts.length > 0 && (
              <div className="flex flex-col">
                <ul className="post-list">
                  {
                    posts.map((post, index) => {
                      if (index === posts.length - 5) {
                        return (
                          <li key={post.id} className="w-full" ref={ref}>
                            <PostPreview post={post} />
                          </li>
                        );
                      }
                    
                      return (
                        <li key={post.id} className="w-full">
                          <PostPreview post={post} />
                        </li>
                      );
                    })
                  }
                  {
                    isFetchingNextPage && (
                      <li className="w-full">
                        <Loader />
                      </li>
                    )
                  }
                </ul>
              </div>
            )
          }
        </div>
      );
    }
  };

  return (
    <>
      {renderTop()}
    </>
  );
}

export default Top;