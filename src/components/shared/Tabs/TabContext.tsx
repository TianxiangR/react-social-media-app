import React, {createContext, useContext, useEffect, useState} from 'react';

export type IContext<T> = {
  activeTab: T;
  setActiveTab: React.Dispatch<React.SetStateAction<T>>;
}

const Context = createContext<IContext<string | number | undefined>>(
  {
    activeTab: undefined,
    setActiveTab: () => {}
  }
);

export const useTabContext = () => useContext(Context);

export type TabContextProps = {
  children?: React.ReactNode;
  value?: string | number;
}

function TabContext({children, value}: TabContextProps) {
  const [activeTab, setActiveTab] = useState(value);

  useEffect(() => {
    setActiveTab(value);
  }, [value]);

  return (
    <Context.Provider value={{activeTab, setActiveTab}}>
      {children}
    </Context.Provider>
  );
}

export default TabContext;