import { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';

const accent = '#346fef';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const email = params.get('email') || '';
  const otp = params.get('otp') || '258914';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleConfirm = () => {
    navigate('/signin');
  };

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
              Reset password
            </Typography>
            <Typography sx={{ color: '#6b7280' }}>
              {email ? `Resetting for ${email}` : 'Create a new password for your account.'}
            </Typography>
          </Box>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5} sx={{ mt: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 0.5 }}>OTP</Typography>
              <BasicInput fullWidth value={otp} disabled />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 0.5 }}>New password</Typography>
              <BasicInput
                fullWidth
                placeholder="Create a password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Confirm password</Typography>
              <BasicInput
                fullWidth
                placeholder="Re-enter password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </Box>

            {!submitted ? (
              <CustomButton
                variant="contained"
                customColor={accent}
                fullWidth
                type="submit"
                disabled={!password || password !== confirmPassword}
              >
                Confirm password
              </CustomButton>
            ) : (
              <CustomButton variant="contained" customColor={accent} fullWidth onClick={handleConfirm}>
                Go to sign in
              </CustomButton>
            )}
          </Stack>
        </Box>

        {submitted ? (
          <Typography sx={{ mt: 3, color: '#16a34a', textAlign: 'center', fontWeight: 600 }}>
            Password updated. Please sign in again.
          </Typography>
        ) : null}

        <Typography sx={{ mt: 3, color: '#6b7280', textAlign: 'center' }}>
          Want to start over?{' '}
          <Box component={Link} to="/forgot" sx={{ color: accent, fontWeight: 600 }}>
            Back to reset
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
