import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import ListNode from '@/classes/ListNode';
import Loader from '@/components/shared/Loader';
import PostPreview from '@/components/shared/PostPreview';
import { useGetRepliesByPostId } from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview, PostMeta } from '@/types';

export interface PostRepliesProps {
  postId: string;
}

function PostReplies({postId}: PostRepliesProps) {
  const {data, isError, isPending, isFetchingNextPage, fetchNextPage} = useGetRepliesByPostId(postId);
  const { inView, ref } = useInView({triggerOnce: true});

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage]); 

  useEffect(() => {
    console.log(data?.pages.map((page) => page.results).flat());
  }, [data]);

  const preprocessPosts = (posts: AugmentedPostPreview[]): Array<PostMeta[]> => {
    const map: Map<string, ListNode> = new Map();
    const heads: Array<ListNode> = [];
    const groups: Array<Array<AugmentedPostPreview>> = [];
    
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
        } else if (parent.id === postId) {
          heads.push(newNode);
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
      const aTime = new Date(a[a.length - 1].created_at).getTime();
      const bTime = new Date(b[b.length - 1].created_at).getTime();

      return bTime - aTime;
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

  const renderReplies = () => {
    if (isPending) {
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
                      <li key={i} ref={ref}>
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
    <ul className='flex flex-col post-list'>
      {renderReplies()}
    </ul>
  );
}

export default PostReplies;