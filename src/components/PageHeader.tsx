import type React from 'react';
import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  stackOnMobile?: boolean;
  actionFullWidthOnMobile?: boolean;
}

const PageHeader = ({
  title,
  subtitle,
  action,
  stackOnMobile = true,
  actionFullWidthOnMobile = true,
}: PageHeaderProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: { xs: 'flex-start', sm: 'center' },
      justifyContent: 'space-between',
      flexDirection: { xs: stackOnMobile ? 'column' : 'row', sm: 'row' },
      gap: { xs: 1.5, sm: 2 },
      mb: 3,
    }}
  >
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
    {action ? (
      <Box sx={{ width: { xs: actionFullWidthOnMobile ? '100%' : 'auto', sm: 'auto' } }}>
        {action}
      </Box>
    ) : null}
  </Box>
);

export default PageHeader;
