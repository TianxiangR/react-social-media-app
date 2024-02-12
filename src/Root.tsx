import './globals.css';

import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import GlobalContextProvider from './context/GlobalContext';
import { QueryProvider } from './react-query/QueryProvider';

function Root() {
  return (
    <>
      <QueryProvider>
        <AuthProvider>
          <GlobalContextProvider>
            <Outlet />
            <ScrollRestoration getKey={(location, matches) => {
              return location.pathname;
            }} />
          </GlobalContextProvider>
        </AuthProvider>
      </QueryProvider>
    </>
  );
}

export default Root;