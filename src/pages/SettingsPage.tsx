import { Box, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  ManageAccountsOutlined,
  Person2Outlined,
  WorkspacePremiumOutlined,
} from '@mui/icons-material';

import PageHeader from '../components/PageHeader';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const primary = '#6d28ff';
const bgSoft = '#f8fbff';

const cardSx = {
  borderRadius: 3,
  border: `1px solid ${borderColor}`,
  backgroundColor: 'white',
  px: { xs: 1.5, sm: 2.5 },
  py: { xs: 2, sm: 2.5 },
};

const settingsItems = [
  {
    title: 'My Profile',
    description: 'Update personal details, security, and preferences.',
    to: '/profile',
    icon: <Person2Outlined sx={{ width: 20, height: 20 }} />,
  },
  {
    title: 'Subscription',
    description: 'Manage plan tiers, billing cycle, and plan upgrades.',
    to: '/settings/subscription',
    icon: <WorkspacePremiumOutlined sx={{ width: 20, height: 20 }} />,
  },
  {
    title: 'User Management',
    description: 'Create users, set roles, and manage permissions.',
    to: '/settings/users',
    icon: <ManageAccountsOutlined sx={{ width: 20, height: 20 }} />,
  },
  {
    title: 'Billing',
    description: 'Update payment method and review transactions.',
    to: '/billings',
    icon: <CreditCard sx={{ width: 20, height: 20 }} />,
  },
];

const SettingsPage = () => (
  <Box
    sx={{
      width: '100%',
      maxWidth: '100%',
      px: { xs: 1.5, sm: 2, md: 3 },
      pb: 4,
      minHeight: { xs: 'calc(100vh - 96px)', sm: 'calc(100vh - 110px)' },
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <PageHeader title="Settings" subtitle="Manage account preferences and billing" />

    <Box
      sx={{
        ...cardSx,
        backgroundColor: bgSoft,
        borderColor,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 1.5,
      }}
    >
      {settingsItems.map((item) => (
        <Box
          key={item.title}
          component={Link}
          to={item.to}
          sx={{
            ...cardSx,
            textDecoration: 'none',
            color: 'inherit',
            borderColor,
            transition: 'transform 200ms ease, box-shadow 200ms ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 18px 30px rgba(15, 23, 42, 0.12)',
              borderColor: primary,
            },
          }}
        >
          <Stack spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 12,
                bgcolor: '#ede9fe',
                color: primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                {item.title}
              </Typography>
              <Typography sx={{ color: mutedText, mt: 0.5 }}>
                {item.description}
              </Typography>
            </Box>
          </Stack>
        </Box>
      ))}
    </Box>
  </Box>
);

export default SettingsPage;
