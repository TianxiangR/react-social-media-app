import React from 'react';
import { Outlet } from 'react-router-dom';

import Bottombar from '@/components/shared/Bottombar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import Topbar from '@/components/shared/Topbar';

function RootLayout() {
  return (
    <div className="w-full md:flex md:pl-0 pl-[30rem] ">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
}

export default RootLayout;