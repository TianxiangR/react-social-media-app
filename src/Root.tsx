import './globals.css';

import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { QueryProvider } from './react-query/QueryProvider';

function Root() {
  return (
    <>
      <QueryProvider>
        <Outlet />
        <ScrollRestoration getKey={(location) => location.pathname} />
      </QueryProvider>
    </>
  );
}

export default Root;