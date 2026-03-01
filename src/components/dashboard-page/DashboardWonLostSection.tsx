import { Box, Divider, LinearProgress, Stack, Typography } from '@mui/material';

import DashboardCard from './DashboardCard';
import { formatCurrency, mutedText, normalizeRate, textColor } from './shared';

type DashboardWonLostSectionProps = {
  comparison: {
    wonCount: number;
    lostCount: number;
    wonAmount: number;
    lostAmount: number;
    winRate: number;
  };
  wonThisMonth: { amount: number };
};

const DashboardWonLostSection = ({
  comparison,
  wonThisMonth,
}: DashboardWonLostSectionProps) => {
  const maxCount = Math.max(1, comparison.wonCount, comparison.lostCount);
  const winRate = normalizeRate(comparison.winRate);

  return (
    <DashboardCard
      sx={{
        background: 'linear-gradient(180deg, rgba(248,250,252,0.92) 0%, rgba(255,255,255,0.76) 100%)',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: textColor }}>
        Won vs lost
      </Typography>
      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
          gap: 3,
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'grid', placeItems: 'center' }}>
          <Box
            sx={{
              width: 170,
              height: 170,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: `conic-gradient(#027a48 0 ${winRate}%, #f04438 ${winRate}% 100%)`,
            }}
          >
            <Box
              sx={{
                width: 122,
                height: 122,
                borderRadius: '50%',
                bgcolor: '#fff',
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: textColor }}>
                  {winRate.toFixed(0)}%
                </Typography>
                <Typography variant="caption" sx={{ color: mutedText }}>
                  close rate
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Stack spacing={2.5}>
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: textColor }}>
                Won deals
              </Typography>
              <Typography variant="body2" sx={{ color: mutedText }}>
                {comparison.wonCount}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(comparison.wonCount / maxCount) * 100}
              sx={{
                mt: 1,
                height: 8,
                borderRadius: 999,
                bgcolor: '#e2e8f0',
                '& .MuiLinearProgress-bar': { bgcolor: '#027a48', borderRadius: 999 },
              }}
            />
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: textColor }}>
                Lost deals
              </Typography>
              <Typography variant="body2" sx={{ color: mutedText }}>
                {comparison.lostCount}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(comparison.lostCount / maxCount) * 100}
              sx={{
                mt: 1,
                height: 8,
                borderRadius: 999,
                bgcolor: '#e2e8f0',
                '& .MuiLinearProgress-bar': { bgcolor: '#f04438', borderRadius: 999 },
              }}
            />
          </Box>

          <Divider />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: mutedText, textTransform: 'uppercase' }}>
                Won value
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 700, color: textColor }}>
                {formatCurrency(comparison.wonAmount)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: mutedText, textTransform: 'uppercase' }}>
                Lost value
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 700, color: textColor }}>
                {formatCurrency(comparison.lostAmount)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: mutedText, textTransform: 'uppercase' }}>
                Won this month
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 700, color: textColor }}>
                {formatCurrency(wonThisMonth.amount)}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </DashboardCard>
  );
};

export default DashboardWonLostSection;
