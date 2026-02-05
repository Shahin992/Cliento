import { Box, Stack, Switch, Typography } from '@mui/material';

import { bgSoft, borderColor, cardSx, mutedText, primary } from './profileStyles';
import type { ProfileState } from './types';

interface NotificationsSectionProps {
  profile: ProfileState;
  onToggle: (field: keyof ProfileState, value: boolean) => void;
}

const notificationItems = [
  {
    key: 'emailDigest',
    title: 'Daily summary email',
    description: 'Highlights of deals, tasks, and mentions.',
  },
  {
    key: 'dealUpdates',
    title: 'Deal status updates',
    description: 'Get notified when deals change stages.',
  },
  {
    key: 'taskReminders',
    title: 'Task reminders',
    description: 'Reminders before tasks are due.',
  },
  {
    key: 'marketing',
    title: 'Product updates',
    description: 'Occasional CRM tips and feature releases.',
  },
];

const NotificationsSection = ({ profile, onToggle }: NotificationsSectionProps) => (
  <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Notifications</Typography>
      <Typography sx={{ color: mutedText, mt: 0.5 }}>
        Choose when we should reach out to you.
      </Typography>
    </Box>
    <Stack spacing={1.5}>
      {notificationItems.map((item) => (
        <Box
          key={item.key}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            borderRadius: 2,
            border: `1px solid ${borderColor}`,
            px: 1.5,
            py: 1.25,
            backgroundColor: bgSoft,
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>{item.title}</Typography>
            <Typography sx={{ color: mutedText, fontSize: 12 }}>{item.description}</Typography>
          </Box>
          <Switch
            checked={Boolean(profile[item.key as keyof ProfileState])}
            onChange={(event) =>
              onToggle(item.key as keyof ProfileState, event.target.checked)
            }
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: primary } }}
          />
        </Box>
      ))}
    </Stack>
  </Box>
);

export default NotificationsSection;
