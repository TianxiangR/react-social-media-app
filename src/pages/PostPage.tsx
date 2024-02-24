import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import IconButton from '@/components/shared/IconButton';
import ImageView from '@/components/shared/ImageView';
import Loader from '@/components/shared/Loader';
import PostDetailStats from '@/components/shared/PostDetailStats';
import PostPreview from '@/components/shared/PostPreview';
import QuotedPost from '@/components/shared/QuotedPost';
import ReplyPostForm from '@/components/shared/ReplyPostForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserContext } from '@/context/AuthContext';
import { useDeletePostById, useFollowUser, useGetPostById, useUnfollowUser } from '@/react-query/queriesAndMutations';

function PostPage() {
  const { username = '', postId = '-1' } = useParams();
  const {data: post, isPending, isError} = useGetPostById(postId);
  const navigate = useNavigate();
  const { mutateAsync: deletePost } = useDeletePostById(postId);
  const { mutate: follow } = useFollowUser();
  const { mutate: unfollow } = useUnfollowUser();

  const { user } = useUserContext();

  useEffect(() => {
    if (!isPending && !isError && post.author.username !== username) {
      navigate(`/${post.author.username}/status/${postId}`);
    }
  }, [post, isPending]);

  const jumpToPost = (postId: string) => {
    navigate(`/${username}/status/${postId}`);
  };

  const handleDeletPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePost(undefined, {onSuccess: () => navigate(-1)});
  };

  const handleFollowClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (post?.author.is_following) {
      unfollow(username);
    } else {
      follow(username);
    }
  };

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
      const { author, content, created_at, images, replies } = post;

      return (
        <div className="flex flex-col w-full">
          <div className="flex flex-col px-4 pt-4 w-full border-b-[1px] border-[#eff3f4]">
            <div className="flex justify-between">
              {/* top */}
              <div className="flex gap-2 items-center">
                <img src={author.profile_image} alt="avatar" className='w-[40px] h-[40px] rounded-full'/>
                <div className='flex h-fit flex-col justify-center'>
                  <Link to={`/${author.username}`}><span className="font-bold text-base hover:underline">{author.name}</span></Link>
                  <span className="text-[#75828d] text-base">@{author.username}</span>
                </div>
              </div>

              <div className="flex flex-row justify-start">
                {/* Options */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-fit h-fit">
                    <IconButton className="text-[#536471] hover:text-blue" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizIcon sx={{fontSize: '24px'}}/>
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-2xl p-0 w-fit h-fit">
                    {
                      author.id !== user?.id ?
                        <>
                          {
                            author.is_following ? (
                              <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer" onClick={handleFollowClick}>
                                <div className='flex gap-2 items-center justify-start text-[#0f1419]'>
                                  <PersonRemoveOutlinedIcon sx={{fontSize: '22px'}}/>
                                  <span className="text-base font-bold">{`Unfollow @${author.username}`}</span>
                                </div>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer" onClick={handleFollowClick}>
                                <div className='flex gap-2 items-center justify-start text-[#0f1419]'>
                                  <PersonAddAltIcon sx={{fontSize: '22px'}}/>
                                  <span className="text-base font-bold">{`Follow @${author.username}`}</span>
                                </div>
                              </DropdownMenuItem>
                            )
                          }
                        </> :
                        <>
                          <DropdownMenuItem className="py-2 px-4 hover:cursor-pointer" onClick={handleDeletPost}>
                            <div className='flex gap-2 items-center justify-start text-red-500'>
                              <DeleteForeverOutlinedIcon sx={{fontSize: '22px'}}/>
                              <span className="text-base font-bold">Delete</span>
                            </div>
                          </DropdownMenuItem>
                        </>
                    }
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 mt-3">
              <div className="whitespace-pre-wrap">
                {content}
              </div>
              <div className="flex w-full mt-2" style={{display: images?.length > 0 ? 'flex' : 'none'}}>
                <ImageView images={images} size="large" rounded allowFullScreen />
              </div>
              {
                post.repost_parent && (
                  <div className="flex hover:cursor-pointer" onClick={() => jumpToPost(post.repost_parent?.id || '')}>
                    <QuotedPost post={post.repost_parent} />
                  </div>
                )
              }
            </div>

            <div className="mt-4 px-1 py-2 border-[#eff3f4] border-y-[1px]">
              <PostDetailStats {...post} />
            </div>

            <div className="mt-2">
              <ReplyPostForm postId={postId} author={author} />
            </div>
          </div>

          <ul className='flex flex-col post-list'>
            {replies.map((reply) => (
              <li key={reply.id}>
                <PostPreview {...reply} />
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full w-full">
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
