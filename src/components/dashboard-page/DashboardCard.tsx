import { Box } from '@mui/material';
import type React from 'react';

import { borderColor, cardBg } from './shared';

type DashboardCardProps = {
  children: React.ReactNode;
  sx?: Record<string, unknown>;
};

const DashboardCard = ({ children, sx }: DashboardCardProps) => (
  <Box
    sx={{
      border: `1px solid ${borderColor}`,
      borderRadius: { xs: 3, sm: 4 },
      bgcolor: cardBg,
      p: { xs: 1.5, sm: 2, md: 2.5 },
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
      backdropFilter: 'blur(10px)',
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default DashboardCard;
