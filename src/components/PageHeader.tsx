import type React from 'react';
import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
    <Box>
      <Typography variant="h4" gutterBottom={Boolean(subtitle)}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Box>
    {action ? <Box>{action}</Box> : null}
  </Box>
);

export default PageHeader;
