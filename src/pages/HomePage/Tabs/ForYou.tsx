import { Slide } from '@mui/material';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import ListNode from '@/classes/ListNode';
import CreatePostForm from '@/components/shared/CreatePostForm';
import NewPostIndicator from '@/components/shared/NewPostIndicator';
import PostPreview from '@/components/shared/PostPreview';
import useIsPhoneScreen from '@/hooks/useIsPhoneScreen';
import { useGetTopRatedPosts } from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview, PostMeta } from '@/types';

import Loader from '../../../components/shared/Loader';


function ForYouPosts() {   
  const { data, isPending: isLoadingPosts, isError, fetchNextPage, isFetchingNextPage, isRefetching, updateInfiniteData, newData } = useGetTopRatedPosts();
  const [fetchNextRef, fetchNextInView] = useInView({rootMargin: '-55px 0px 0px 0px'});
  const [showMoreRef, showMoreIView] = useInView({rootMargin: '-55px 0px 0px 0px'});
  const isPhoneScreen = useIsPhoneScreen();

  const getNewPostCount = () => {
    const seen = new Set();

    data?.pages[0].results.forEach((post) => {
      seen.add(post.id);
    });

    return newData?.reduce((acc, post) => {
      if (!seen.has(post.id)) {
        acc++;
      }
      return acc;
    }, 0) || 0;
  };

  const newPostCount = getNewPostCount();

  useEffect(() => {
    if (fetchNextInView && !isFetchingNextPage && !isLoadingPosts && !isRefetching) {
      fetchNextPage();
    }
  }, [fetchNextInView, isFetchingNextPage, isLoadingPosts, isRefetching]);


  const preprocessPosts = (posts: AugmentedPostPreview[]): Array<PostMeta[]> => {
    const map: Map<string, ListNode> = new Map();
    const rankMap: Map<string, number> = new Map();
    const heads: Array<ListNode> = [];
    const groups: Array<Array<AugmentedPostPreview>> = [];

    posts.forEach((post, index) => {
      rankMap.set(post.id, index);
    });
    
    for (let i = posts.length - 1; i >= 0; i--) {
      const post = posts[i];
      const newNode = new ListNode(post);
      if (post.reply_parent) {
        const parent = post.reply_parent;
        if (map.has(parent.id)) {
          const node = map.get(parent.id);
          if (node) {
            if (node.next) {
              heads.push(node.next);
            }
            node.next = newNode;
          }
        } 
        else {
          const parentNode = new ListNode(parent);
          parentNode.next = newNode;
          heads.push(parentNode);
          map.set(parent.id, parentNode);
        }
      } else {
        heads.push(newNode);
      }
      map.set(post.id, newNode);
    }

    heads.forEach((head) => {
      const group: Array<AugmentedPostPreview> = [];
      let current: ListNode | null = head;
      while (current) {
        group.push(current.value);
        current = current.next;
      }
      groups.push(group);
    });

    groups.sort((a, b) => {
      return rankMap.get(a[a.length - 1].id)! - rankMap.get(b[b.length - 1].id)!;
    });

    return groups.map((group) => {
      return group.map((post, index, group) => {
        let variant: 'normal' | 'top' | 'bottom' | 'middle' = 'normal';
        if (group.length > 1) {
          if (index === 0) {
            variant = 'top';
          } else if (index === group.length - 1) {
            variant = 'bottom';
          } else {
            variant = 'middle';
          }
        }

        return {
          post,
          variant,
        };
      });
    });
  };

  const renderPosts = () => {
    if (isLoadingPosts) {
      return <Loader />;
    } else if (isError) {
      return <div>Failed to load posts</div>;
    } else if (data) {
      const posts = data.pages.map((page) => page.results).flat();
      let i = 0;
      const postGroups = preprocessPosts(posts);
      const actualLength = postGroups.flat().length;
      return postGroups.map((group) => {
        return (
          <li key={i} className="w-full h-full">
            <ul className="flex flex-col">
              {
                group.map((postMeta, index) => {
                  i++;
                  if (index === 0) {
                    delete postMeta.post.reply_parent;
                  }

                  if (i === actualLength - 5) {
                    return (
                      <li key={i} ref={fetchNextRef}>
                        <PostPreview post={postMeta.post} variant={postMeta.variant} />
                      </li>
                    );
                  }
                  else {
                    return (
                      <li key={i}>
                        <PostPreview post={postMeta.post} variant={postMeta.variant} />
                      </li>
                    );
                  }
                })
              }
            </ul>
          </li>
        );
      });
    }
  };

  return (
    <ul className="flex flex-col w-full h-full post-list relative">
      {
        <Slide in={newPostCount > 0 && !showMoreIView} style={{zIndex: 10}} direction='down'>
          <div className="sticky top-[70px] z-10 w-full h-0">
            <div className="relative w-full">
              <div className="absolute w-full flex justify-center items-center">
                <NewPostIndicator posts={newData ?? []} />
              </div>
            </div>
          </div>
        </Slide>
      }
      {
        !isPhoneScreen &&
        <li className="">
          <CreatePostForm />
        </li>
      }
      {
        newPostCount > 0 &&
        <li 
          className="w-full flex justify-center items-center text-blue py-3 hover:cursor-pointer hover:bg-[#f7f7f7]"
          onClick={() => updateInfiniteData()}
          ref={showMoreRef}
        >
          Show {newPostCount} post{newPostCount > 1 ? 's' : ''}
        </li>
      }
      {
        renderPosts()
      }
      {
        isFetchingNextPage && 
          <Loader />
      }
    </ul>
  );
}

export default ForYouPosts;