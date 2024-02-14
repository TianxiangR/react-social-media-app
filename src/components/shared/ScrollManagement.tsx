import React from 'react';
import { Location,ScrollRestoration, UIMatch } from 'react-router-dom';

import { useGlobalContext } from '@/context/GlobalContext';

function ScrollManagement() {
  const getKey = (location: Location<any>) => {
    const globalContext = useGlobalContext();
    if (location.pathname === '/home') {
      return location.pathname + '/' + globalContext.home.currentTab;
    }

    return location.pathname;
  };

  return (
    <ScrollRestoration getKey={getKey}/>
  );
}

export default ScrollManagement;