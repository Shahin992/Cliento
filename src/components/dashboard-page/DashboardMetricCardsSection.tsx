import {
  AssignmentOutlined,
  EmojiEventsOutlined,
  GroupOutlined,
  type SvgIconComponent,
  TrendingUpOutlined,
} from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import DashboardCard from './DashboardCard';
import { mutedText, textColor } from './shared';

type MetricCardProps = {
  label: string;
  value: string | number;
  to: string;
  actionLabel: string;
  icon: SvgIconComponent;
  iconBg: string;
  iconColor: string;
};

const MetricCard = ({
  label,
  value,
  to,
  actionLabel,
  icon: Icon,
  iconBg,
  iconColor,
}: MetricCardProps) => (
  <DashboardCard
    sx={{
      background: 'linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(241,245,249,0.92) 100%)',
    }}
  >
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
        <Box>
          <Typography variant="caption" sx={{ color: mutedText, textTransform: 'uppercase' }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: textColor }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 3,
            display: 'grid',
            placeItems: 'center',
            bgcolor: iconBg,
            color: iconColor,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 22 }} />
        </Box>
      </Stack>
      <Button component={Link} to={to} size="small" variant="outlined" fullWidth sx={{ textTransform: 'none' }}>
        {actionLabel}
      </Button>
    </Stack>
  </DashboardCard>
);

type DashboardMetricCardsSectionProps = {
  dealSummary: { open: number };
  wonThisMonth: { count: number };
  contactSummary: { total: number };
  recentTasksCount: number;
};

const DashboardMetricCardsSection = ({
  dealSummary,
  wonThisMonth,
  contactSummary,
  recentTasksCount,
}: DashboardMetricCardsSectionProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
      gap: 2,
    }}
  >
    <MetricCard
      label="Open Deals"
      value={dealSummary.open}
      to="/deals"
      actionLabel="View deals"
      icon={TrendingUpOutlined}
      iconBg="#dbeafe"
      iconColor="#1d4ed8"
    />
    <MetricCard
      label="Won This Month"
      value={wonThisMonth.count}
      to="/deals"
      actionLabel="Review wins"
      icon={EmojiEventsOutlined}
      iconBg="#dcfce7"
      iconColor="#15803d"
    />
    <MetricCard
      label="Contacts"
      value={contactSummary.total}
      to="/contacts"
      actionLabel="Open contacts"
      icon={GroupOutlined}
      iconBg="#ede9fe"
      iconColor="#6d28d9"
    />
    <MetricCard
      label="Tasks"
      value={recentTasksCount}
      to="/tasks"
      actionLabel="Open tasks"
      icon={AssignmentOutlined}
      iconBg="#ffedd5"
      iconColor="#c2410c"
    />
  </Box>
);

export default DashboardMetricCardsSection;
