import { CircularProgress } from '@mui/material';
import React from 'react';

function Loader() {
  return (
    <div className="flex w-full py-10 justify-center items-center">
      <CircularProgress color="primary" size={30} />
    </div>
  );
}

export default Loader;