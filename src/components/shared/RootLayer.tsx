import React, { useEffect, useRef, useState } from 'react';
import { Outlet} from 'react-router-dom';

import { useGlobalContext } from '@/context/GlobalContext';
import { runMicroTask } from '@/lib/utils';

import LeftNavBar from './LeftNavBar';

function RootLayer() {

  return (
    <div className="w-full max-h-screen h-screen flex">
      <div className="flex-auto flex flex-col items-end ml-[60px] w-[275px]">
        <div className="fixed top-0">
          <LeftNavBar />
        </div>
      </div>

      <div className="flex flex-auto items-start h-full xl:w-[1050px] lg:w-[920px]">
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayer;