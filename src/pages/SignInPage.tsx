import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';

const accent = '#346fef';

const SignInPage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
      py: 4,
      bgcolor: '#f3f6fb',
    }}
  >
    <Box
      sx={{
        width: '100%',
        maxWidth: 420,
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
        p: { xs: 3, sm: 4 },
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          component="img"
          src="/Cliento-logo.png"
          alt="Cliento logo"
          sx={{ width: 140, height: 'auto' }}
        />
        <Box textAlign="center">
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Sign in
          </Typography>
          <Typography sx={{ color: '#6b7280' }}>
            Use your email and password to continue.
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={2.5} sx={{ mt: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Email</Typography>
          <BasicInput fullWidth placeholder="you@company.com" type="email" />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Password</Typography>
          <BasicInput fullWidth placeholder="••••••••" type="password" />
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <FormControlLabel
            control={<Checkbox sx={{ color: accent, '&.Mui-checked': { color: accent } }} />}
            label="Keep me signed in"
          />
          <Typography
            component={Link}
            to="/forgot"
            sx={{
              color: accent,
              fontWeight: 600,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'none',
            }}
          >
            Forgot password?
          </Typography>
        </Stack>

        <CustomButton variant="contained" customColor={accent} fullWidth component={Link} to="/dashboard">
          Sign in
        </CustomButton>
      </Stack>

      <Typography sx={{ mt: 3, color: '#6b7280', textAlign: 'center' }}>
        New to Cliento?{' '}
        <Box component={Link} to="/signup" sx={{ color: accent, fontWeight: 600 }}>
          Create an account
        </Box>
      </Typography>
    </Box>
  </Box>
);

export default SignInPage;
