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
import { IPostPreview } from '@/types';

export interface IPostDetailProps {
  post: IPostPreview;
  variant?: 'normal' | 'small';
}

function QuotedPost({post, variant = 'normal' }: IPostDetailProps) {
  const { author, content, created_at, images, ...stats } = post;

  const renderContent = () => {
    if (variant === 'normal') {
      return (
        <>
          <div className="flex flex-col px-4 pt-4 pb-2 w-full">
            <div className="flex justify-between">
              {/* top */}
              <div className="flex gap-2 items-center">
                <img src={author.profile_image} alt="avatar" className='w-[20px] h-[20px] rounded-full'/>
                <span className="font-bold text-base">{author.name}</span>
                <span className="text-[#75828d] text-base">@{author.username}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 mt-2 mb-2">
              <div className="preview-text-box text-md text-[#0f1419] leading-4">
                {content}
              </div>
            </div>
          </div>
          {
            images?.length > 0 &&
            <div className="flex w-full overflow-hidden max-h-[288px]">
              <ImageView images={images} size="large" allowFullScreen />
            </div>
          }
        </>
      );
    }
    else if (variant === 'small') {
      return (
        <>
          <div className="flex flex-col px-4 pt-4 pb-2 w-full">
            <div className="flex justify-between">
              {/* top */}
              <div className="flex gap-2 items-center">
                <img src={author.profile_image} alt="avatar" className='w-[20px] h-[20px] rounded-full'/>
                <span className="font-bold text-base">{author.name}</span>
                <span className="text-[#75828d] text-base">@{author.username}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex gap-2 mt-2 mb-2">
              {
                images?.length > 0 &&
                <div className="flex overflow-hidden w-[19%] aspect-square">
                  <ImageView images={images} size="large" allowFullScreen rounded />
                </div>
              }
              <div className="preview-text-box text-md text-[#0f1419] leading-4">
                {content}
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col w-full border-[#cfd9de] border-[1px] rounded-2xl overflow-hidden">
      {renderContent()}
    </div>
  );
}

export default QuotedPost;