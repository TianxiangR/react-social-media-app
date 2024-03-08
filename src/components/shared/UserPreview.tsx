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
      <img src={profile_image} alt="avatar" className='size-[40px] rounded-full shrink-0'/>
      <div className="flex flex-col ml-2 w-full">
        <div className="flex justify-between w-full">
          <div className="flex flex-col flex-auto">
            <p className="font-bold text-base">{props.name}</p>
            <p className="text-[#75828d] text-base">{`@${props.username}`}
              {is_following && 
            <div className="bg-[#eff3f4] ml-1 w-fit inline-flex py-[2px] px-1 box-border leading-3 rounded-sm justify-center items-center">
              <span className="text-[#536471] text-xs leading-3 font-medium">Follows you</span>
            </div>
              }</p>
          </div>
          <div>
            {
              user?.id !== id && 
              <>
                {
                  is_following ? (
                    <button className="rounded-full px-4 py-1 border-[#cfd9de] border-[1px] text-[#0f1419] font-bold bg-transparent text-sm"
                      onClick={handleFollowClick}
                    >Following</button>
                  ) : (
                    <button className="bg-black text-white rounded-full px-4 py-1 font-bold text-sm"
                      onClick={handleFollowClick}
                    >Follow</button>
                  )
                }
              </>
            }
          </div>
        </div>
        <p className="text-base text-[#0f1419]">{props.bio}</p>
      </div>
    </Link>
  );
}

export default UserPreview;