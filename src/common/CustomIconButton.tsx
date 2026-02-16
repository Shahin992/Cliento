import type { IconButtonProps } from '@mui/material/IconButton';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

interface CustomIconButtonProps extends IconButtonProps {
  customColor?: string;
}

export const CustomIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'customColor',
})<CustomIconButtonProps>(({ customColor = '#346fef' }) => ({
  color: `${customColor} !important`,
  '&:hover, &:focus, &:focus-visible': {
    backgroundColor: 'transparent !important',
    outline: 'none',
    boxShadow: 'none',
  },
  '&.Mui-focusVisible': {
    outline: 'none',
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    color: `rgba(0, 0, 0, 0.26) !important`,
  },
}));
