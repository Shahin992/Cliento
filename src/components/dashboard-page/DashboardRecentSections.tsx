import { NorthEastOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import type {
  DashboardRecentContact,
  DashboardRecentDeal,
  DashboardRecentTask,
} from '../../hooks/dashboard/useDashboardQueries';
import DashboardCard from './DashboardCard';
import {
  borderColor,
  elevatedBg,
  formatCurrency,
  formatDate,
  getInitials,
  getStatusTone,
  getTaskTone,
  mutedText,
  textColor,
} from './shared';

const EmptyState = ({ message }: { message: string }) => (
  <Box
    sx={{
      py: 4,
      border: `1px dashed ${borderColor}`,
      borderRadius: 3,
      textAlign: 'center',
      bgcolor: 'rgba(255,255,255,0.45)',
    }}
  >
    <Typography variant="body2" sx={{ color: mutedText }}>
      {message}
    </Typography>
  </Box>
);

const RecentSectionCard = ({
  title,
  count,
  accent,
  subtitle,
  action,
  children,
  sx,
}: {
  title: string;
  count: number;
  accent: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  sx?: Record<string, unknown>;
}) => (
  <DashboardCard
    sx={{
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      background:
        'linear-gradient(180deg, rgba(248,250,252,0.96) 0%, rgba(255,255,255,0.82) 100%)',
      ...sx,
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `radial-gradient(circle at top right, ${accent}18 0, transparent 32%)`,
      }}
    />
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
      spacing={2}
      sx={{ position: 'relative', zIndex: 1 }}
    >
      <Stack spacing={0.75} sx={{ minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: accent,
              boxShadow: `0 0 0 6px ${accent}18`,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: textColor }}>
            {title}
          </Typography>
          <Chip
            label={count}
            size="small"
            sx={{
              height: 24,
              bgcolor: `${accent}16`,
              color: accent,
              fontWeight: 700,
              borderRadius: 999,
            }}
          />
        </Stack>
        {subtitle ? (
          <Typography variant="body2" sx={{ color: mutedText, position: 'relative', zIndex: 1 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
      {action}
    </Stack>
    <Box sx={{ mt: 1.5, position: 'relative', zIndex: 1 }}>{children}</Box>
  </DashboardCard>
);

const RecentDealRow = ({ deal }: { deal: DashboardRecentDeal }) => {
  const tone = getStatusTone(deal.status);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1.5}
      sx={{
        p: 1.25,
        borderRadius: 3,
        bgcolor: elevatedBg,
        border: `1px solid ${borderColor}`,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 700 }}>
          {getInitials(deal.title)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap variant="body2" sx={{ fontWeight: 600, color: textColor }}>
            {deal.title}
          </Typography>
          <Typography noWrap variant="caption" sx={{ color: mutedText }}>
            {deal.contact?.name || deal.contact?.companyName || 'Unassigned contact'}
          </Typography>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: mutedText }}>
              {deal.stage?.name || deal.pipeline?.name || 'No stage'}
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#cbd5e1' }} />
            <Typography variant="caption" sx={{ color: mutedText }}>
              {formatDate(deal.createdAt)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Stack alignItems="flex-end" spacing={0.5} sx={{ flexShrink: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: textColor }}>
          {formatCurrency(deal.amount)}
        </Typography>
        <Chip label={tone.label} size="small" sx={{ bgcolor: tone.bg, color: tone.color, fontWeight: 700 }} />
      </Stack>
    </Stack>
  );
};

const RecentContactRow = ({ contact }: { contact: DashboardRecentContact }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    spacing={1.5}
    sx={{
      p: 1.25,
      borderRadius: 3,
      bgcolor: elevatedBg,
      border: `1px solid ${borderColor}`,
    }}
  >
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
      <Avatar src={contact.photoUrl ?? undefined} sx={{ width: 40, height: 40 }}>
        {getInitials(contact.name)}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap variant="body2" sx={{ fontWeight: 600, color: textColor }}>
          {contact.name}
        </Typography>
        <Typography noWrap variant="caption" sx={{ color: mutedText }}>
          {contact.companyName || 'No company'}
        </Typography>
        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: mutedText }}>
          {(contact.status ?? 'lead').replace(/_/g, ' ')}
        </Typography>
      </Box>
    </Stack>
    <Typography variant="caption" sx={{ color: mutedText, flexShrink: 0 }}>
      {formatDate(contact.createdAt)}
    </Typography>
  </Stack>
);

const RecentTaskRow = ({ task }: { task: DashboardRecentTask }) => {
  const tone = getTaskTone(task.status);

  return (
    <Stack
      spacing={0.75}
      sx={{
        p: 1.25,
        borderRadius: 3,
        bgcolor: elevatedBg,
        border: `1px solid ${borderColor}`,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: textColor }}>
          {task.title || 'Untitled task'}
        </Typography>
        <Chip label={tone.label} size="small" sx={{ bgcolor: tone.bg, color: tone.color, fontWeight: 700 }} />
      </Stack>
      <Typography variant="caption" sx={{ color: mutedText }}>
        {task.dueDate ? `Due ${formatDate(task.dueDate)}` : `Created ${formatDate(task.createdAt)}`}
      </Typography>
      <Button
        component={Link}
        to="/tasks"
        size="small"
        variant="text"
        sx={{ alignSelf: 'flex-start', px: 0, minWidth: 0, textTransform: 'none' }}
      >
        Open task
      </Button>
    </Stack>
  );
};

type DashboardRecentSectionsProps = {
  recentDeals: DashboardRecentDeal[];
  recentContacts: DashboardRecentContact[];
  recentTasks: DashboardRecentTask[];
};

const DashboardRecentSections = ({
  recentDeals,
  recentContacts,
  recentTasks,
}: DashboardRecentSectionsProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.45fr) minmax(320px, 0.95fr)' },
      gridTemplateRows: { xs: 'auto', xl: 'auto auto' },
      gap: 2,
      alignItems: 'stretch',
    }}
  >
    <RecentSectionCard
      title="Recent deals"
      count={recentDeals.length}
      accent="#1d4ed8"
      subtitle="Latest opportunities, deal stages, and current value snapshots."
      action={
        <Button
          component={Link}
          to="/deals"
          size="small"
          endIcon={<NorthEastOutlined sx={{ fontSize: 16 }} />}
          sx={{ textTransform: 'none' }}
        >
          View all
        </Button>
      }
      sx={{
        gridRow: { xl: '1 / span 2' },
      }}
    >
      {recentDeals.length ? (
        <Stack spacing={1.25}>
          {recentDeals.map((deal) => (
            <RecentDealRow key={deal._id} deal={deal} />
          ))}
        </Stack>
      ) : (
        <EmptyState message="No recent deals." />
      )}
    </RecentSectionCard>

    <RecentSectionCard
      title="Recent contacts"
      count={recentContacts.length}
      accent="#7c3aed"
      subtitle="New people and companies added to the workspace."
      action={
        <Button
          component={Link}
          to="/contacts"
          size="small"
          endIcon={<NorthEastOutlined sx={{ fontSize: 16 }} />}
          sx={{ textTransform: 'none' }}
        >
          View all
        </Button>
      }
      sx={{
        gridColumn: { xl: '2' },
        gridRow: { xl: '1' },
      }}
    >
      {recentContacts.length ? (
        <Stack spacing={1.25}>
          {recentContacts.map((contact) => (
            <RecentContactRow key={contact._id} contact={contact} />
          ))}
        </Stack>
      ) : (
        <EmptyState message="No recent contacts." />
      )}
    </RecentSectionCard>

    <RecentSectionCard
      title="Recent tasks"
      count={recentTasks.length}
      accent="#c2410c"
      subtitle="Open follow-ups and tasks currently surfaced in the feed."
      action={
        <Button
          component={Link}
          to="/tasks"
          size="small"
          endIcon={<NorthEastOutlined sx={{ fontSize: 16 }} />}
          sx={{ textTransform: 'none' }}
        >
          View all
        </Button>
      }
      sx={{
        gridColumn: { xl: '2' },
        gridRow: { xl: '2' },
      }}
    >
      {recentTasks.length ? (
        <Stack spacing={1.25}>
          {recentTasks.map((task, index) => (
            <RecentTaskRow key={task._id || task.id || `${task.title}-${index}`} task={task} />
          ))}
        </Stack>
      ) : (
        <EmptyState message="No recent tasks." />
      )}
    </RecentSectionCard>
  </Box>
);

export default DashboardRecentSections;
