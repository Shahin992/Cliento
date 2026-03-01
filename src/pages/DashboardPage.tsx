import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';

import PageHeader from '../components/PageHeader';
import DashboardCard from '../components/dashboard-page/DashboardCard';
import DashboardLoadingState from '../components/dashboard-page/DashboardLoadingState';
import DashboardMetricCardsSection from '../components/dashboard-page/DashboardMetricCardsSection';
import DashboardOverviewSection from '../components/dashboard-page/DashboardOverviewSection';
import DashboardRecentSections from '../components/dashboard-page/DashboardRecentSections';
import DashboardWonLostSection from '../components/dashboard-page/DashboardWonLostSection';
import {
  useDashboardOverviewQuery,
} from '../hooks/dashboard/useDashboardQueries';
import { pageBg, mutedText } from '../components/dashboard-page/shared';

const DashboardPage = () => {
  const { summary, recentDeals, recentContacts, recentTasks, loading, hasError, errorMessage, refetch } =
    useDashboardOverviewQuery();

  const dealSummary = summary?.deals ?? { total: 0, open: 0, won: 0, lost: 0 };
  const contactSummary = summary?.contacts ?? { total: 0 };
  const wonThisMonth = summary?.wonThisMonth ?? { count: 0, amount: 0 };
  const comparison = summary?.wonLostComparison ?? {
    wonCount: 0,
    lostCount: 0,
    wonAmount: 0,
    lostAmount: 0,
    winRate: 0,
  };
  const pipelineValue = comparison.wonAmount + comparison.lostAmount;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 1.5, sm: 2, md: 3 },
        pb: 4,
        minHeight: { xs: 'calc(100vh - 96px)', sm: 'calc(100vh - 110px)' },
        background: pageBg,
      }}
    >
      <PageHeader title="Dashboard" subtitle="Minimal overview of pipeline and recent activity." />

      {loading ? (
        <DashboardLoadingState />
      ) : hasError ? (
        <DashboardCard
          sx={{
            background: 'linear-gradient(180deg, rgba(248,250,252,0.92) 0%, rgba(255,255,255,0.76) 100%)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Dashboard unavailable
          </Typography>
          <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: mutedText }}>
              {errorMessage || 'Failed to load overview data.'}
            </Typography>
            <Box>
              <Button variant="contained" onClick={() => void refetch()} sx={{ textTransform: 'none' }}>
                Try again
              </Button>
            </Box>
          </Stack>
          </Box>
        </DashboardCard>
      ) : (
        <Stack spacing={2}>
          <DashboardOverviewSection pipelineValue={pipelineValue} dealSummary={dealSummary} />
          <DashboardMetricCardsSection
            dealSummary={dealSummary}
            wonThisMonth={wonThisMonth}
            contactSummary={contactSummary}
            recentTasksCount={recentTasks.length}
          />
          <DashboardWonLostSection comparison={comparison} wonThisMonth={wonThisMonth} />
          <DashboardRecentSections
            recentDeals={recentDeals}
            recentContacts={recentContacts}
            recentTasks={recentTasks}
          />
        </Stack>
      )}
    </Box>
  );
};

export default DashboardPage;
