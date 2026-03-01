import { Box, Typography } from '@mui/material';

type UserManagementErrorStateProps = {
  errorMessage: string;
};

const UserManagementErrorState = ({ errorMessage }: UserManagementErrorStateProps) => (
  <Box
    sx={{
      borderRadius: 3,
      border: '1px solid #fecaca',
      bgcolor: '#fff1f2',
      p: 2,
    }}
  >
    <Typography sx={{ color: '#be123c', fontWeight: 700 }}>Failed to load team users.</Typography>
    <Typography sx={{ color: '#be123c', mt: 0.5 }}>{errorMessage}</Typography>
  </Box>
);

export default UserManagementErrorState;
