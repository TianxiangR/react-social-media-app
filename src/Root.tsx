import './globals.css';

import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import GlobalContextProvider from './context/GlobalContext';
import { QueryProvider } from './react-query/QueryProvider';

function Root() {
  return (
    <>
      <QueryProvider>
        <GlobalContextProvider>
          <Outlet />
          <ScrollRestoration getKey={(location) => location.pathname} />
        </GlobalContextProvider>
      </QueryProvider>
    </>
  );
}

export default Root;