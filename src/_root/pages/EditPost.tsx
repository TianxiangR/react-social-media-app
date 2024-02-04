import React from 'react';
import { useParams } from 'react-router-dom';

import PostForm from '@/components/forms/PostForm';
import Loader from '@/components/shared/Loader';
import { useGetPostById } from '@/lib/react-query/queriesAndMutations';

function EditPost() {
  const { postId = '-1' } = useParams<{ postId: string }>();
  const { data: post, isPending: isLoadingPost} = useGetPostById(postId);

  if (isLoadingPost) 
    return (
      <div className="h-full w-full relative">
        <div className="top-[50%] left-[50%] absolute">
          <Loader/>
        </div>
      </div>);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        {/* Page Title */}
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="Add Post"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Edit Post
          </h2>
        </div>

        {/* Post Form */}
        <PostForm post={post}/>
      </div>
    </div>
  );
}

export default EditPost;