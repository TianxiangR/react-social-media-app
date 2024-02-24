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


function QuotedPost({post}: {post: IPostPreview}) {
  const { author, content, created_at, images, ...stats } = post;
  return (
    <div className="flex flex-col w-full border-[#cfd9de] border-[1px] rounded-2xl overflow-hidden">
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
        <div className="flex flex-col gap-1 mt-1 mb-2">
          <div className="preview-text-box text-sm text-[#0f1419]">
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
    </div>
  );
}

export default QuotedPost;