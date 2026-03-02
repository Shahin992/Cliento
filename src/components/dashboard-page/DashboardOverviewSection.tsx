import { Box, Stack, Typography } from '@mui/material';

import DashboardCard from './DashboardCard';
import { formatCurrency } from './shared';

type DashboardOverviewSectionProps = {
  pipelineValue: number;
  dealSummary: {
    total: number;
    open: number;
    won: number;
    lost: number;
  };
};

const DashboardOverviewSection = ({
  pipelineValue,
  dealSummary,
}: DashboardOverviewSectionProps) => (
  <DashboardCard
    sx={{
      position: 'relative',
      overflow: 'hidden',
      background:
        'radial-gradient(circle at top left, rgba(255,255,255,0.26) 0, transparent 24%), linear-gradient(135deg, #0f172a 0%, #164e63 48%, #0f766e 100%)',
      borderColor: 'rgba(255,255,255,0.10)',
      color: 'white',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: -40,
        right: -20,
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        filter: 'blur(6px)',
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        bottom: -60,
        left: '28%',
        width: 220,
        height: 220,
        borderRadius: '50%',
        background: 'rgba(45, 212, 191, 0.12)',
        filter: 'blur(18px)',
      }}
    />
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={2}
      alignItems={{ xs: 'flex-start', lg: 'center' }}
      justifyContent="space-between"
      sx={{ position: 'relative', zIndex: 1 }}
    >
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.72)',
            textTransform: 'uppercase',
            letterSpacing: { xs: 1.1, sm: 1.4 },
          }}
        >
          Deal value
        </Typography>
        <Typography
          sx={{
            mt: 1,
            fontWeight: 700,
            color: 'white',
            fontSize: { xs: '2rem', sm: '3rem' },
            lineHeight: 1.05,
            wordBreak: 'break-word',
          }}
        >
          {formatCurrency(pipelineValue)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.72)' }}>
          {dealSummary.total} deals tracked. {dealSummary.open} open, {dealSummary.won} won, {dealSummary.lost}{' '}
          lost.
        </Typography>
      </Box>
    </Stack>
  </DashboardCard>
);

export default DashboardOverviewSection;
