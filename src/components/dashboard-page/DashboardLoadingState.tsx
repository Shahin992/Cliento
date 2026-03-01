import { Box, Skeleton, Stack } from '@mui/material';

const DashboardLoadingState = () => (
  <Stack spacing={2}>
    <Skeleton variant="rounded" height={180} sx={{ borderRadius: 16 }} />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', xl: 'repeat(4, 1fr)' },
        gap: 2,
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={120} sx={{ borderRadius: 16 }} />
      ))}
    </Box>
    <Skeleton variant="rounded" height={260} sx={{ borderRadius: 16 }} />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={260} sx={{ borderRadius: 16 }} />
      ))}
    </Box>
  </Stack>
);

export default DashboardLoadingState;
