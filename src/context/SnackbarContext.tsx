import { Snackbar, type SnackbarProps } from '@mui/material';
import React, { createContext, ReactElement, ReactNode, useContext, useState } from 'react';

export interface ISnackbarContext {
  showSnackbar: (options?: {props?: SnackbarProps, content: ReactElement<any, any> | undefined}) => void;
  closeSnackbar: () => void;
}

const SnackbarContext = createContext<ISnackbarContext>({showSnackbar: () => {}, closeSnackbar: () => {}});

function SnackbarContextProvider({children}: {children: ReactNode}) {
  const [options, setOptions] = useState<{props?: SnackbarProps, content?: ReactElement<any, any>}>({});
  const [open, setOpen] = useState(false);
  const context: ISnackbarContext = {
    showSnackbar: (options) => {
      setOptions(options || {});
      setOpen(true);
    },
    closeSnackbar: () => setOpen(false)
  };

  return (
    <SnackbarContext.Provider value={context}>
      {children}
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}   
        {...options?.props}
      >
        {options?.content}
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export const useSnackbarContext = () => useContext(SnackbarContext);

export default SnackbarContextProvider;