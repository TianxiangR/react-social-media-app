import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useUserContext } from '@/context/AuthContext';
import { useFollowUser, useUnfollowUser } from '@/react-query/queriesAndMutations';
import { User } from '@/types';

function UserPreview(props: User) {
  const { profile_image, id, is_following, username } = props;
  const { user } = useUserContext();
  const {mutate: follow} = useFollowUser();
  const {mutate: unfollow} = useUnfollowUser();

  const handleFollowClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (is_following) {
      unfollow(username);
    } else {
      follow(username);
    }
  };

  return (
    <Link to={`/${username}`} className='flex flex-row p-4 hover:bg-[#f7f7f7] hover:cursor-pointer'>
      <img src={profile_image} alt="avatar" className='size-[40px] rounded-full'/>
      <div className="flex flex-col ml-4 flex-auto">
        <p className="font-bold text-base">{props.name}</p>
        <p className="text-[#75828d] text-base">@{props.username}</p>
        <p className="text-base text-[#0f1419]">{props.bio}</p>
      </div>
      <div>
        {
          user?.id !== id && 
          <>
            {
              is_following ? (
                <button className="rounded-full px-4 py-1 border-[#cfd9de] border-[1px] text-[#0f1419] font-bold bg-transparent"
                  onClick={handleFollowClick}
                >Following</button>
              ) : (
                <button className="bg-black text-white rounded-full px-4 py-1 font-bold"
                  onClick={handleFollowClick}
                >Follow</button>
              )
            }
          </>
        }
      </div>
    </Link>
  );
}

export default UserPreview;