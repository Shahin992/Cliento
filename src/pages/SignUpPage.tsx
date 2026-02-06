import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';

const accent = '#346fef';

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
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
          maxWidth: 460,
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
            sx={{ width: 150, height: 'auto' }}
          />
          <Box textAlign="center">
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Create account
            </Typography>
            <Typography sx={{ color: '#6b7280' }}>
              Start with a secure workspace in minutes.
            </Typography>
          </Box>
        </Stack>

      <Stack spacing={2.5} sx={{ mt: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Full name</Typography>
          <BasicInput fullWidth placeholder="Alex Johnson" />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Work email</Typography>
          <BasicInput fullWidth placeholder="you@company.com" type="email" />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Company name</Typography>
          <BasicInput fullWidth placeholder="Cliento Inc." />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Password</Typography>
          <BasicInput fullWidth placeholder="Create a password" type="password" />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Confirm password</Typography>
          <BasicInput fullWidth placeholder="Re-enter password" type="password" />
        </Box>
        <FormControlLabel
          control={<Checkbox sx={{ color: accent, '&.Mui-checked': { color: accent } }} />}
          label="I agree to the Terms of Service and Privacy Policy."
          sx={{ alignItems: 'flex-start' }}
        />

        <CustomButton
          variant="contained"
          customColor={accent}
          fullWidth
          onClick={() => navigate('/settings/subscription')}
        >
          Create account
        </CustomButton>

        <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
          Use a work email so your team can find you faster.
        </Typography>
      </Stack>

      <Typography sx={{ mt: 3, color: '#6b7280', textAlign: 'center' }}>
        Already have an account?{' '}
        <Box component={Link} to="/signin" sx={{ color: accent, fontWeight: 600 }}>
          Sign in
        </Box>
      </Typography>
      </Box>
    </Box>
  );
};

export default SignUpPage;
