import React from 'react';

import { useTabContext } from '.';

export type TabPanelProps = React.ComponentPropsWithoutRef<'div'> & {
  value?: string | number;
}

// eslint-disable-next-line react/prop-types
function TabPanel({value, children, className}: TabPanelProps) {
  const {activeTab} = useTabContext();
  
  return activeTab === value ? (
    <section className={className}>{children}</section>
  ) : <></>;
}

export default TabPanel;