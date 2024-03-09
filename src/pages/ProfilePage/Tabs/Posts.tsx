import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import ListNode from '@/classes/ListNode';
import CreatePostForm from '@/components/shared/CreatePostForm';
import PostPreview from '@/components/shared/PostPreview';
import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';
import { useGetUserPosts } from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview, PostMeta } from '@/types';

import Loader from '../../../components/shared/Loader';

export interface UserPostsProps {
  username: string;
}

function UserPosts({ username }: UserPostsProps) {
  const { data, isPending: isLoadingPosts, isError, fetchNextPage, isFetchingNextPage } = useGetUserPosts(username);
  const { ref, inView } = useInView();
  const {user} = useUserContext();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const preprocessPosts = (posts: AugmentedPostPreview[]): Array<PostMeta[]> => {
    if (!user) return [];

    const map: Map<string, ListNode> = new Map();
    const heads: Array<ListNode> = [];
    const groups: Array<Array<AugmentedPostPreview>> = [];
    
    for (let i = posts.length - 1; i >= 0; i--) {
      const post = posts[i];
      const newNode = new ListNode(post);
      if (post.reply_parent && post.reply_parent.author.id === user.id) {
        const parent = post.reply_parent;
        if (map.has(parent.id)) {
          const node = map.get(parent.id);
          if (node) {
            if (node.next) {
              heads.push(node.next);
            }
            node.next = newNode;
          }
        } else if (parent.author.id === user.id) {
          const parentNode = new ListNode(parent);
          parentNode.next = newNode;
          heads.push(parentNode);
          map.set(parent.id, parentNode);
        }
        else {
          heads.push(newNode);
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

  const renderPosts = () => {
    if (isLoadingPosts) {
      return <Loader />;
    } else if (isError) {
      return <div>Failed to load posts</div>;
    } else if (data) {
      const posts = data.pages.map((page) => page.results).flat();
      const postGroups = preprocessPosts(posts);
      let i = 0;
      const actualLength = postGroups.flat().length;
      return postGroups.map((group) => {
        return (
          <li key={i} className="w-full h-full">
            <ul className="flex flex-col">
              {
                group.map((post) => {
                  i++;
                  if (i === actualLength - 5) {
                    return (
                      <li key={i} ref={ref}>
                        <PostPreview post={post.post} variant={post.variant} />
                      </li>
                    );
                  }
                  else {
                    return (
                      <li key={i}>
                        <PostPreview post={post.post} variant={post.variant} />
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
    <ul className="flex flex-col w-full h-full post-list">
      {renderPosts()}
      {
        isFetchingNextPage &&
          <Loader />
      }
    </ul>
  );
}

export default UserPosts;