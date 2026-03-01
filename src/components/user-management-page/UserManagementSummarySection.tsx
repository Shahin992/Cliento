import {
  Diversity3Rounded as Diversity3RoundedIcon,
  GroupRounded as GroupRoundedIcon,
  PeopleAltRounded as PeopleAltRoundedIcon,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { borderColor, mutedText } from './utils';

type UserSummarySectionProps = {
  summary: {
    totalAllowedUsers: number;
    usedUsers: number;
    remainingUsers: number;
  };
};

const UserManagementSummarySection = ({ summary }: UserSummarySectionProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
      gap: 1.25,
    }}
  >
    {[
      {
        label: 'Total Users',
        value: summary.totalAllowedUsers,
        icon: <Diversity3RoundedIcon sx={{ color: '#1d4ed8', fontSize: 19 }} />,
        bg: '#eff6ff',
      },
      {
        label: 'Active Users',
        value: summary.usedUsers,
        icon: <PeopleAltRoundedIcon sx={{ color: '#0369a1', fontSize: 19 }} />,
        bg: '#ecfeff',
      },
      {
        label: 'Available Users',
        value: summary.remainingUsers,
        icon: <GroupRoundedIcon sx={{ color: '#166534', fontSize: 19 }} />,
        bg: '#ecfdf3',
      },
    ].map((item) => (
      <Box
        key={item.label}
        sx={{
          borderRadius: 3,
          border: `1px solid ${borderColor}`,
          background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.65) 100%)',
          p: { xs: 1.5, sm: 1.75 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box>
          <Typography sx={{ color: mutedText, fontSize: 12 }}>{item.label}</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 26, color: '#0f172a', lineHeight: 1.1 }}>
            {item.value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: item.bg,
            border: '1px solid #dbeafe',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          {item.icon}
        </Box>
      </Box>
    ))}
  </Box>
);

export default UserManagementSummarySection;
