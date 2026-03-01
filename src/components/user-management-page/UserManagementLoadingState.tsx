import { Box, Skeleton, Stack } from '@mui/material';

import { borderColor } from './utils';

const UserRowSkeleton = () => (
  <Box
    sx={{
      borderRadius: 3,
      border: `1px solid ${borderColor}`,
      p: { xs: 1.5, sm: 2 },
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1.4fr 0.7fr 0.9fr 1fr' },
      gap: { xs: 1.25, md: 1.5 },
      alignItems: 'center',
    }}
  >
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Skeleton variant="circular" width={38} height={38} />
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="text" width={170} height={24} />
        <Skeleton variant="text" width={220} height={20} />
      </Box>
    </Stack>
    <Skeleton variant="rounded" height={28} width={110} />
    <Skeleton variant="rounded" height={28} width={120} />
    <Skeleton variant="text" width={170} height={22} />
  </Box>
);

const UserManagementLoadingState = () => (
  <Stack spacing={1.25}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 1.25,
      }}
    >
      <Skeleton variant="rounded" height={104} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={104} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={104} sx={{ borderRadius: 3 }} />
    </Box>
    <UserRowSkeleton />
    <UserRowSkeleton />
    <UserRowSkeleton />
  </Stack>
);

export default UserManagementLoadingState;
