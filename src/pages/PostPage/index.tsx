import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import IconButton from '@/components/shared/IconButton';
import Loader from '@/components/shared/Loader';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import useIsPhoneScreen from '@/hooks/useIsPhoneScreen';
import { useGetPostById } from '@/react-query/queriesAndMutations';
import { AugmentedPostPreview, IPostPreview } from '@/types';

import PostDetail from './PostDetail';
import PostReplies from './PostReplies';

function PostPage() {
  const { username = '', postId = '' } = useParams();
  const {data: post, isPending: isPostPending, isError: isPostError} = useGetPostById(postId);
  const navigate = useNavigate();
  const shouldHide = useIsPhoneScreen();
  const ref = useRef(null);
  useHideOnScroll(shouldHide ? ref : undefined);

  const jumpToPost = (post: IPostPreview) => {
    navigate(`/${post.author.username}/status/${post.id}`);
  };

  useEffect(() => {
    if (!isPostPending && !isPostError && post.author.username !== username) {
      jumpToPost(post);
    }
  }, [post, isPostPending]);

  const renderPost = () => {
    if (isPostPending) {
      return (
        <Loader />
      );
    }
    else if (isPostError) {
    // no-op
    }
    else if (post) {
      const isRepost = !!(post.repost_parent && post.content.length === 0);
      const rendered_post = isRepost ? post.repost_parent as AugmentedPostPreview : post;
      return (
        <div className="flex flex-col w-full">
          <PostDetail {...post} />
          <PostReplies postId={rendered_post.id} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full w-full">
      <div className="h-14 top-0 border-[#eff3f4] border-b-[1px] z-10 sticky-bar flex items-center p-4" ref={ref}>
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
