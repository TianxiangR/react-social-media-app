import { useMediaQuery } from '@mui/material';

export default function useIsPhoneScreen() {
  return useMediaQuery('(max-width: 768px)');
}