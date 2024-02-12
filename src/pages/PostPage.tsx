import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import IconButton from '@/components/shared/IconButton';
import ImageView from '@/components/shared/ImageView';
import Loader from '@/components/shared/Loader';
import PostDetailStats from '@/components/shared/PostDetailStats';
import PostPreview from '@/components/shared/PostPreview';
import ReplyPostForm from '@/components/shared/ReplyPostForm';
import { useGetPostById } from '@/react-query/queriesAndMutations';


function PostPage() {
  const { username = '', postId = '-1' } = useParams();
  const {data: post, isPending, isError} = useGetPostById(postId);
  const navigate = useNavigate();
  console.log('post page');

  useEffect(() => {
    if (!isPending && !isError && post.author.username !== username) {
      navigate(`/${post.author.username}/status/${postId}`);
    }
  }, [post, isPending]);


  const renderPost = () => {
    if (isPending) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <Loader />
        </div>
      );
    }
    else if (isError) {
    // no-op
    }
    else if (post) {
      const { author, content, created_at, images, replies, ...stats } = post;
      return (
        <div className="flex flex-col w-full">
          <div className="flex flex-col px-4 pt-4 pb-2 w-full border-b-[1px] border-[#eff3f4]">
            <div className="flex justify-between">
              {/* top */}
              <div className="flex gap-2 items-center">
                <img src={author.profile_image} alt="avatar" className='w-[40px] h-[40px] rounded-full'/>
                <div className='flex h-fit flex-col justify-center'>
                  <Link to='/profile'><span className="font-bold text-base hover:underline">{author.name}</span></Link>
                  <span className="text-[#75828d] text-base">@{author.username}</span>
                </div>
              </div>

              <IconButton className="text-[#536471] hover:text-blue">
                <MoreHorizIcon sx={{fontSize: '24px'}}/>
              </IconButton>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 mt-3">
              <div className="text-box">
                {content}
              </div>
              <div className="flex w-full mt-2" style={{display: images?.length > 0 ? 'flex' : 'none'}}>
                <ImageView images={images} size="large" />
              </div>
            </div>

            <div className="mt-4 px-1 py-2 border-[#eff3f4] border-y-[1px]">
              <PostDetailStats {...stats} />
            </div>

            <div className="mt-2">
              <ReplyPostForm postId={postId} author={author} />
            </div>
          </div>

          <div className='flex flex-col'>
            {replies.map((reply) => (
              <div key={reply.id}>
                <PostPreview {...reply} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full border-r-[1px] border-[#eff3f4] w-[600px] max-w-[600px]">
      <div className="h-14 top-0 border-[#eff3f4] border-b-[1px] z-10 sticky-bar flex items-center p-4">
        <div className="min-w-14">
          <IconButton className="text-xl" onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{fontSize: '24px'}}/>
          </IconButton>
        </div>
        <h2 className="text-xl font-bold">Post</h2>
      </div>
      {renderPost()}
    </div>
  );
}

export default PostPage;