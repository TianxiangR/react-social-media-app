import { Models } from 'appwrite';
import React, { MouseEvent,useEffect, useState } from 'react';
import { set } from 'react-hook-form';

import { useUserContext } from '@/context/AuthContext';
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from '@/lib/react-query/queriesAndMutations';
import { checkIsLiked } from '@/lib/utils';

type PostStatsProps = {
  post: Models.Document;
  userId: string;
}

function PostStats({post, userId}: PostStatsProps) {
  const likesList = post.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();
  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

  const handleLikePost = (e: MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (checkIsLiked(likes, userId)) {
      const newLikes = likes.filter((id: string) => id !== userId);
      setLikes(newLikes);
      likePost({postId: post.$id, likesArray: newLikes});
    } else {
      const newLikes = [...likes, userId];
      setLikes(newLikes);
      likePost({postId: post.$id, likesArray: newLikes});
    }
  };

  const handleSavePost = (e: MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    console.log('postId', post.$id);
    console.log('currentUser', currentUser);
    console.log('savedPostRecord', savedPostRecord);
    if (savedPostRecord) {
      deleteSavedPost(savedPostRecord.$id);
      setIsSaved(false);
    } else {
      savePost({postId: post.$id, userId: userId});
      setIsSaved(true);
    }
  };

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  return (
    <div className='flex-between z-20'>
      <div className="flex gap-2 mr-5">
        <img 
          src={checkIsLiked(likes, userId) ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}
          alt="like" 
          width={20} 
          height={20}
          onClick={handleLikePost}
          className='cursor-pointer'
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2 mr-5">
        <img 
          src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
          alt="save" 
          width={20} 
          height={20}
          onClick={handleSavePost}
          className='cursor-pointer'
        />
        <p className="small-medium lg:base-medium">{}</p>
      </div>
    </div>
  );
}

export default PostStats;