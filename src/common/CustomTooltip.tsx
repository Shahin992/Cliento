import type { ReactElement, ReactNode } from 'react';
import Tooltip from '@mui/material/Tooltip';

interface CustomTooltipProps {
  title: ReactNode;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  children: ReactElement;
  arrow?: boolean;
}

const CustomTooltip = ({
  title,
  placement = 'top',
  children,
  arrow = true,
}: CustomTooltipProps) => (
  <Tooltip title={title} placement={placement} arrow={arrow}>
    {children}
  </Tooltip>
);

export default CustomTooltip;
