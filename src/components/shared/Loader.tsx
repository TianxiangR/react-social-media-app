import { CircularProgress } from '@mui/material';
import React from 'react';

function Loader() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <CircularProgress color="primary" />
    </div>
  );
}

export default Loader;