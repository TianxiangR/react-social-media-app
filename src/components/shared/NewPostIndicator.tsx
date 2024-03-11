import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import React from 'react';

import { IPostPreview, User } from '@/types';

export interface NewPostIndicatorProps {
  posts: IPostPreview[];    
}

function NewPostIndicator({posts}: NewPostIndicatorProps) {
  const getDistictUsers = (posts: IPostPreview[]): User[] => {
    const seen = new Set();
    const users = posts.map(post => post.author);

    for (const user of users) {
      if (!seen.has(user.id)) {
        seen.add(user.id);
      }

      if (seen.size === 3) {
        break;
      }
    }

    return users.filter(user => seen.has(user.id));
  };
  const users = getDistictUsers(posts);
  const handleClick = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <div className='bg-blue px-3 py-1 rounded-full text-white flex hover:cursor-pointer hover:bg-blue-100 select-none justify-center items-center' onClick={handleClick}>
      <ArrowUpwardIcon sx={{fontSize: '24px'}} />
      <div className='flex'>
        {
          users.map((user, index) => (
            <img
              key={index}
              src={user.profile_image}
              alt={user.username}
              className={'ml-2 rounded-full size-[30px] border-white border-[1px]'}
              style={{
                zIndex: 3 - index,
                marginLeft: `-${Math.min(1, index) * 10}px`
              }}
            />
          ))
        }
      </div>
      <span className='ml-1'>{users.length > 1 ? 'posted' : `See new post${posts.length > 0 ? 's' : ''}`}</span>
    </div>
  );
}

export default NewPostIndicator;