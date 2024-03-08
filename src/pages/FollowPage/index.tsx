import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useRef } from 'react';
import { useNavigate,useParams } from 'react-router-dom';

import IconButton from '@/components/shared/IconButton';
import Loader from '@/components/shared/Loader';
import { Tab, TabContext, TabList, TabPanel } from '@/components/shared/Tabs';
import useHideOnScroll from '@/hooks/useHideOnScroll';
import useIsPhoneScreen from '@/hooks/useIsPhoneScreen';
import { useGetUserProfile } from '@/react-query/queriesAndMutations';

import Followers from './Tabs/Followers';
import Following from './Tabs/Following';

function FollowPage() {
  const { username = '', tab = 'followers' } = useParams();
  const {data: userInfo, isPending, isError} = useGetUserProfile(username);
  const navigate = useNavigate();
  const ref = useRef(null);
  const shouldHide = useIsPhoneScreen();
  useHideOnScroll(shouldHide ? ref : undefined);
  
  const renderPage = () => {
    if (isPending) {
      return <Loader />;
    }

    if (isError) {
      return <p>Error</p>;
    }

    return (
      <div>
        <TabContext value={tab}>
          <div className="flex flex-col" ref={ref}>
            <div className="sticky top-0 flex flex-col z-10 bg-white">
              <div className='flex flex-row items-center h-[54px] px-4'>
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
              <TabList onChange={(_, value) => navigate(`/${username}/${value}`)} className="min-h-14">
                <Tab value="followers" label="Followers" />
                <Tab value="following" label="Following" />
              </TabList>
            </div>
            <TabPanel value="followers">
              <Followers username={username} />
              <div className="h-[1000px]"></div>
            </TabPanel>
            <TabPanel value="following">
              <Following username={username} />
            </TabPanel>
          </div>
        </TabContext>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      {renderPage()}
    </div>
  );
}

export default FollowPage;