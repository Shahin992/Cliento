import { Box, Typography } from '@mui/material';

import BasicInput from '../../common/BasicInput';
import { cardSx, labelSx, mutedText } from './profileStyles';
import type { ProfileState } from './types';

interface AccountDetailsSectionProps {
  profile: ProfileState;
  onFieldChange: (field: keyof ProfileState, value: string) => void;
}

const AccountDetailsSection = ({ profile, onFieldChange }: AccountDetailsSectionProps) => (
  <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Account Details</Typography>
      <Typography sx={{ color: mutedText, mt: 0.5 }}>
        Keep your contact info and title current for assignments and approvals.
      </Typography>
    </Box>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        gap: 1.5,
      }}
    >
      <Box>
        <Typography sx={labelSx}>First Name</Typography>
        <BasicInput
          fullWidth
          value={profile.firstName}
          onChange={(event) => onFieldChange('firstName', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Last Name</Typography>
        <BasicInput
          fullWidth
          value={profile.lastName}
          onChange={(event) => onFieldChange('lastName', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Role / Title</Typography>
        <BasicInput
          fullWidth
          value={profile.title}
          onChange={(event) => onFieldChange('title', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Email</Typography>
        <BasicInput
          fullWidth
          type="email"
          value={profile.email}
          onChange={(event) => onFieldChange('email', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Phone</Typography>
        <BasicInput
          fullWidth
          value={profile.phone}
          onChange={(event) => onFieldChange('phone', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Location</Typography>
        <BasicInput
          fullWidth
          value={profile.location}
          onChange={(event) => onFieldChange('location', event.target.value)}
        />
      </Box>
    </Box>
  </Box>
);

export default AccountDetailsSection;
