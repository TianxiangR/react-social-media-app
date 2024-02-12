import React from 'react';
import { ScrollRestoration } from 'react-router-dom';

import { useGlobalContext } from '@/context/GlobalContext';

function ScrollManagement() {
  const globalContext = useGlobalContext();

  const getKey = (location: any, matches: any) => {
    // if (location.pathname === '/home') {
    //   return location.pathname + '/' + globalContext.home.currentTab;
    // }

    return location.pathname;
  };

  return (
    <ScrollRestoration getKey={getKey}/>
  );
}

export default ScrollManagement;