import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import EditProfileDialogContent from '@/components/shared/EditProfileDialogContent';
import IconButton from '@/components/shared/IconButton';
import ImageView from '@/components/shared/ImageView';
import Loader from '@/components/shared/Loader';
import PostDetailStats from '@/components/shared/PostDetailStats';
import PostPreview from '@/components/shared/PostPreview';
import ReplyPostForm from '@/components/shared/ReplyPostForm';
import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import UserLikes from '@/components/shared/UserLikes';
import UserMedia from '@/components/shared/UserMedia';
import UserPosts from '@/components/shared/UserPosts';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useGlobalContext } from '@/context/GlobalContext';
import { useFollowUser, useGetUserProfile, useUnfollowUser } from '@/react-query/queriesAndMutations';

function ProfilePage() {
  const { username = '' } = useParams();
  const {data: userInfo, isPending, isError} = useGetUserProfile(username);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('posts');
  const { openDialog } = useGlobalContext().dialog;
  const [isFollowing, setIsFollowing] = useState(userInfo?.is_following || false);
  const {mutate: follow} = useFollowUser();
  const {mutate: unfollow} = useUnfollowUser();

  const formateBirthday = (date: string) => {
    const months = date.split('-')[1];
    const day = date.split('-')[2];
    const year = date.split('-')[0];
    const d = new Date(Number(year), Number(months) - 1, Number(day));
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    return d.toLocaleDateString('en-US', options);
  };

  const formateJoinedDate = (date: string) => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
    };

    return d.toLocaleDateString('en-US', options);
  };

  const formateUrl = (url: string) => {
    const formatedUrl =  url.replace(/(^\w+:|^)\/\//, '').replace(/^www\./, '');

    if (formatedUrl.length > 30) {
      return formatedUrl.slice(0, 27) + '...';
    }

    return formatedUrl;
  };

  const handleFollowClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (isFollowing) {
      unfollow(username, {onSuccess: () => setIsFollowing(false)});
    } else {
      follow(username, {onSuccess: () => setIsFollowing(true)});
    }
  };


  const renderPage = () => {
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
    else if (userInfo) {
      const handleEditClick = () => {
        openDialog(() => <EditProfileDialogContent {...userInfo}/>);
      };
      return (
        <>
          <div className="h-[54px] top-0 border-[#eff3f4] border-b-[1px] z-10 sticky-bar flex items-center p-4 w-full">
            <div className="min-w-14">
              <IconButton className="text-xl" onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{fontSize: '24px'}}/>
              </IconButton>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-bold">{userInfo.name}</h2>
              <span className="text-[#75828d] text-sm">@{userInfo.username}</span>
            </div>
          </div>
          <div className="flex flex-col w-full">
            {/* header photo */}
            <div className="bg-[#cfd9de] w-full aspect-[3/1]">
              {
                userInfo.header_photo &&
                <img src={userInfo.header_photo} alt="profile" className="w-full h-full object-cover"/>
              }
            </div>

            {/* info */}
            <div className='flex flex-col w-full py-3 px-4'>

              {/* profile image */}
              <div className="flex w-full justify-between">
                <div className="p-1 bg-white rounded-full w-[133.5px] h-[133.5px] mt-[-14%]">
                  <img src={userInfo.profile_image} alt="avatar" className="w-full h-full rounded-full"/>
                </div>

                { user?.id === userInfo.id ?
                  <div>
                    <Button className="rounded-full" variant="outline" onClick={handleEditClick}>
                      <span className="text-base font-bold text-[#303438]">Edit Profile</span>
                    </Button>
                  </div> : userInfo.is_following ? (
                    <div>
                      <button className="bg-white rounded-full px-4 py-1 border-[#cfd9de] border-[1px] font-bold text-[#0f1419]"
                        onClick={handleFollowClick}
                      >Following</button>
                    </div>
                  ) : (
                    <div>
                      <button className="bg-black text-white rounded-full px-4 py-1 font-bold"
                        onClick={handleFollowClick}
                      >Follow</button>
                    </div>
                  )
                }
              </div>

              {/* user info */}
              <div className="flex flex-col gap mt-4">
                <h2 className="text-xl font-bold">{userInfo.name}</h2>
                <span className="text-[#536471] text-base">@{userInfo.username}</span>
              </div>

              {/* bio */}
              {
                userInfo.bio &&
                <div className="mt-2">
                  <p className="text-base text-[#0f1419]">{userInfo.bio}</p>
                </div>
              }

              {/* other info */}
              <div className="w-full mt-2 block">
                { userInfo.location &&
                  <span className="inline-block mr-4 break-words">
                    <LocationOnOutlinedIcon sx={{fontSize: '20px', color: '#536471'}}/>
                    <span className="text-base text-[#536471] ml-1">{userInfo.location}</span>
                  </span>
                }

                { userInfo.website &&
                  <a href={userInfo.website} className="inline-block mr-4 break-words max-w-full hover:underline text-blue" target="blank">
                    <LinkOutlinedIcon sx={{fontSize: '20px', color: '#536471', transform: 'rotate(-45deg)'}}/>
                    <span>{formateUrl(userInfo.website)}</span>
                  </a>
                }

                <span className="inline-block mr-4 break-words">
                  <CakeOutlinedIcon sx={{fontSize: '20px', color: '#536471'}}/>
                  <span className="text-base text-[#536471] ml-1">Born {formateBirthday(userInfo.date_of_birth)}</span>
                </span>
                
                <span className="inline-block mr-4 break-words">
                  <CalendarMonthOutlinedIcon sx={{fontSize: '20px', color: '#536471'}}/>
                  <span className="text-base leading-[1rem] text-[#536471] ml-1">Joined {formateJoinedDate(userInfo.created_at)}</span>
                </span>
              </div>

              {/* follower */}
              <div className="flex w-full mt-4">
                <Link className="flex mr-4 hover:underline whitespace-pre-wrap" to={''}>
                  <span className="text-sm text-[#0f1419] font-bold">{userInfo.following}</span>
                  <span className="text-sm text-[#536471]"> Following</span>
                </Link>
                <Link className="flex hover:underline whitespace-pre-wrap" to={''}>
                  <span className="text-sm text-[#0f1419] font-bold">{userInfo.followers}</span>
                  <span className="text-sm text-[#536471] "> Followers</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full">
            <TabContext value={currentTab}>
              <TabList onChange={(_, value) => setCurrentTab(value || '')} className="min-h-14">
                <Tab value="posts" label="Posts"/>
                <Tab value="replies" label="Replies"/>
                <Tab value="media" label="Media"/>
                <Tab value="likes" label="Likes"/>
              </TabList>
              <TabPanel value="posts" className="h-full pb-80">
                <UserPosts username={userInfo.username} />
              </TabPanel>
              <TabPanel value="replies" className="h-full pb-80">
                <UserPosts username={userInfo.username} />
              </TabPanel>
              <TabPanel value="media" className="h-full pb-80">
                <UserMedia username={userInfo.username} />
              </TabPanel>
              <TabPanel value="likes" className="h-full pb-80">
                <UserLikes username={userInfo.username} />
              </TabPanel>
            </TabContext>
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {renderPage()}
    </div>
  );
}

export default ProfilePage;