import { Box, Typography } from '@mui/material';

import { borderColor, mutedText } from './utils';

const UserManagementEmptyState = () => (
  <Box
    sx={{
      borderRadius: 3,
      border: `1px dashed ${borderColor}`,
      bgcolor: '#f8fbff',
      p: { xs: 2.5, sm: 4 },
      textAlign: 'center',
    }}
  >
    <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>No team users found.</Typography>
    <Typography sx={{ color: mutedText, mt: 0.5 }}>
      Team members will appear here once users are added.
    </Typography>
  </Box>
);

export default UserManagementEmptyState;
