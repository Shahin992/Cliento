import type React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';


//                            usages

//  <CustomScrollbar sx={{ maxHeight: 300, overflowY: 'auto', p: 2 }}>
//       {/* content here */}
//     </CustomScrollbar>

const CustomScrollbar = styled(Box)(() => ({
  height: 300,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: 10,
    backgroundColor: '#346fef',
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: 10,
    backgroundColor: '#2c3e50',
  },
}));

interface CustomScrollbarBoxProps {
  children?: React.ReactNode;
}

export default function CustomScrollbarBox({ children }: CustomScrollbarBoxProps) {
  return <CustomScrollbar>{children}</CustomScrollbar>;
}
