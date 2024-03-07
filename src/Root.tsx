import './globals.css';

import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import SnackbarContextProvider from './context/SnackbarContext';
import { QueryProvider } from './react-query/QueryProvider';

function Root() {
  return (
    <>
      <SnackbarContextProvider>
        <QueryProvider>
          <Outlet />
          <ScrollRestoration getKey={(location) => location.pathname} />
        </QueryProvider>
      </SnackbarContextProvider>
    </>
  );
}

export default Root;