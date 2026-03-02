import { Box, Skeleton, Stack } from '@mui/material';

import { borderColor, cardBg } from './shared';

const shellSx = {
  border: `1px solid ${borderColor}`,
  bgcolor: cardBg,
  borderRadius: { xs: 3, sm: 4 },
  p: { xs: 1.5, sm: 2 },
};

const MetricSkeletonCard = () => (
  <Box sx={shellSx}>
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="42%" height={16} />
          <Skeleton variant="text" width="30%" height={40} sx={{ mt: 0.5 }} />
        </Box>
        <Skeleton variant="rounded" width={38} height={38} sx={{ borderRadius: 2.5, flexShrink: 0 }} />
      </Stack>
      <Skeleton variant="rounded" height={34} sx={{ borderRadius: 999 }} />
    </Stack>
  </Box>
);

const ListSkeletonCard = () => (
  <Box sx={shellSx}>
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="65%" height={18} />
        </Box>
        <Skeleton variant="rounded" width={68} height={28} sx={{ borderRadius: 999 }} />
      </Stack>

      <Stack spacing={1.25}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              border: `1px solid ${borderColor}`,
              borderRadius: 3,
              px: 1.25,
              py: 1.1,
              bgcolor: 'rgba(255,255,255,0.55)',
            }}
          >
            <Stack spacing={0.8}>
              <Skeleton variant="text" width={`${58 - index * 6}%`} height={20} />
              <Skeleton variant="text" width={`${42 + index * 8}%`} height={16} />
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  </Box>
);

const DashboardLoadingState = () => (
  <Stack spacing={2}>
    <Box sx={shellSx}>
      <Stack spacing={1.5}>
        <Skeleton variant="text" width="22%" height={16} />
        <Skeleton variant="text" height={52} sx={{ width: { xs: '62%', sm: '36%' } }} />
        <Skeleton variant="text" height={20} sx={{ width: { xs: '92%', sm: '58%' } }} />
      </Stack>
    </Box>

    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
        gap: 2,
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <MetricSkeletonCard key={index} />
      ))}
    </Box>

    <Box sx={shellSx}>
      <Stack spacing={2.5}>
        <Skeleton variant="text" width="26%" height={24} />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '160px minmax(0, 1fr)' },
            gap: 2.5,
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', placeItems: { xs: 'start', md: 'center' } }}>
            <Skeleton variant="circular" width={132} height={132} />
          </Box>
          <Stack spacing={1.4}>
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="rounded" height={8} sx={{ borderRadius: 999 }} />
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="rounded" height={8} sx={{ borderRadius: 999 }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 1.5,
                pt: 0.5,
              }}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index}>
                  <Skeleton variant="text" width="58%" height={14} />
                  <Skeleton variant="text" width="82%" height={24} />
                </Box>
              ))}
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>

    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.45fr) minmax(320px, 0.95fr)' },
        gap: 2,
      }}
    >
      <ListSkeletonCard />
      <Stack spacing={2}>
        <ListSkeletonCard />
        <ListSkeletonCard />
      </Stack>
    </Box>
  </Stack>
);

export default DashboardLoadingState;
