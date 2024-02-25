import React from 'react';
import { Outlet} from 'react-router-dom';

import { AuthProvider } from '@/context/AuthContext';
import GlobalContextProvider from '@/context/GlobalContext';

import LeftNavBar from './LeftNavBar';

function RootLayer() {

  return (
    <AuthProvider>
      <GlobalContextProvider>
        <div className="w-full max-h-screen h-screen flex">
          <div className="flex flex-auto flex-col items-end ml-[60px] w-auto lg:w-[275px]">
            <div className="fixed top-0 border-[#eff3f4] border-r-[1px]">
              <LeftNavBar />
            </div>
          </div>

          <div className="flex flex-auto items-start h-full w-[600px] xl:w-[1050px] lg:w-[920px]">
            <div className="flex h-auto min-h-screen w-full max-w-[600px] border-[#eff3f4] border-r-[1px]">
              <Outlet />
            </div>
          </div>
        </div>
      </GlobalContextProvider>
    </AuthProvider>
  );
}

export default RootLayer;