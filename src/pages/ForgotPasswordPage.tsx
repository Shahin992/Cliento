import { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';

const accent = '#346fef';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const otp = useMemo(() => '258914', []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleOpenEmailLink = () => {
    const search = new URLSearchParams({ email, otp }).toString();
    navigate(`/reset?${search}`);
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
              Forgot password
            </Typography>
            <Typography sx={{ color: '#6b7280' }}>
              Enter your email and we will send a reset link.
            </Typography>
          </Box>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5} sx={{ mt: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Email</Typography>
              <BasicInput
                fullWidth
                placeholder="you@company.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Box>

            <CustomButton
              variant="contained"
              customColor={accent}
              fullWidth
              type="submit"
              disabled={!email}
            >
              Send reset link
            </CustomButton>
          </Stack>
        </Box>

        {submitted ? (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: '#eef2ff',
              border: '1px solid #c7d2fe',
            }}
          >
            <Typography sx={{ fontWeight: 600, color: '#1e3a8a' }}>
              Verification link sent to {email || 'your email'}.
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', mt: 0.5 }}>
              Dummy OTP: {otp}. Click the email link to reset your password.
            </Typography>
            <CustomButton
              variant="outlined"
              customColor="#1e293b"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleOpenEmailLink}
            >
              Open emailed link
            </CustomButton>
          </Box>
        ) : null}

        <Typography sx={{ mt: 3, color: '#6b7280', textAlign: 'center' }}>
          Remembered it?{' '}
          <Box component={Link} to="/signin" sx={{ color: accent, fontWeight: 600 }}>
            Back to sign in
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
