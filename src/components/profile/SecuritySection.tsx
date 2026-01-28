import { Box, Stack, Switch, Typography } from '@mui/material';

import BasicInput from '../../common/BasicInput';
import { bgSoft, borderColor, cardSx, labelSx, mutedText, primary } from './profileStyles';
import type { PasswordState, ProfileState } from './types';

interface SecuritySectionProps {
  passwords: PasswordState;
  twoFactor: ProfileState['twoFactor'];
  onPasswordChange: (field: keyof PasswordState, value: string) => void;
  onToggle: (value: boolean) => void;
}

const SecuritySection = ({
  passwords,
  twoFactor,
  onPasswordChange,
  onToggle,
}: SecuritySectionProps) => (
  <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Security</Typography>
      <Typography sx={{ color: mutedText, mt: 0.5 }}>
        Update your password and protect your account.
      </Typography>
    </Box>
    <Stack spacing={1.5}>
      <Box>
        <Typography sx={labelSx}>Current Password</Typography>
        <BasicInput
          fullWidth
          type="password"
          value={passwords.current}
          onChange={(event) => onPasswordChange('current', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>New Password</Typography>
        <BasicInput
          fullWidth
          type="password"
          value={passwords.next}
          onChange={(event) => onPasswordChange('next', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Confirm Password</Typography>
        <BasicInput
          fullWidth
          type="password"
          value={passwords.confirm}
          onChange={(event) => onPasswordChange('confirm', event.target.value)}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
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
          <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
            Two-factor authentication
          </Typography>
          <Typography sx={{ color: mutedText, fontSize: 12 }}>
            Require a verification code when signing in.
          </Typography>
        </Box>
        <Switch
          checked={twoFactor}
          onChange={(event) => onToggle(event.target.checked)}
          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: primary } }}
        />
      </Box>
    </Stack>
  </Box>
);

export default SecuritySection;
