import React, { useEffect, useState } from 'react';

import { useTabContext } from '.';

export type TabPanelProps = React.ComponentPropsWithoutRef<'div'> & {
  value?: string | number;
}

// eslint-disable-next-line react/prop-types
function TabPanel({value, children, className}: TabPanelProps) {
  const {activeTab} = useTabContext();
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    if (activeTab === value) {
      setNewClassName(className || '');
    }
    else {
      setNewClassName('hidden');
    }
  }, [activeTab, value, className]);

  return (
    <div className={newClassName}>{children}</div>
  );
}

export default TabPanel;