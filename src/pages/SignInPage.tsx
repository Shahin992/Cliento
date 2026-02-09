import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';
import { signIn } from '../services/auth';
import type { SignInPayload } from '../types/auth';
import { encodeBase64, setCookie } from '../utils/auth';
import { useAppDispatch } from '../app/hooks';
import { setAuth } from '../features/auth/authSlice';
import type { User } from '../types/user';

const accent = '#346fef';

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const payload: SignInPayload = {
      email: form.email.trim(),
      password: form.password,
    };

    if (!payload.email || !payload.password) {
      setError('Please enter your email and password.');
      return;
    }

    if (!isValidEmail(payload.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    const response = await signIn(payload);
    setSubmitting(false);

    if (!response.success) {
      setError(response.details || response.message || 'Sign in failed. Please try again.');
      return;
    }

    if (response.token) {
      setCookie('cliento_token', encodeBase64(response.token), {
        maxAgeMs: 2 * 24 * 60 * 60 * 1000,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
      });
    }

    if (response.data) {
      const user = response.data as User;
      setCookie('cliento_user', encodeBase64(JSON.stringify(user)), {
        maxAgeMs: 2 * 24 * 60 * 60 * 1000,
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
      });
      dispatch(setAuth({ user, token: response.token }));
    }

    navigate('/dashboard');
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
              Sign in
            </Typography>
            <Typography sx={{ color: '#6b7280' }}>
              Use your email and password to continue.
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
                value={form.email}
                onChange={handleChange('email')}
                inputProps={{ 'aria-label': 'Email' }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Password</Typography>
              <BasicInput
                fullWidth
                placeholder="••••••••"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                inputProps={{ 'aria-label': 'Password' }}
              />
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

            {error ? (
              <Typography variant="body2" sx={{ color: '#dc2626', textAlign: 'left' }}>
                {error}
              </Typography>
            ) : null}

            <CustomButton
              variant="contained"
              customColor={accent}
              fullWidth
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </CustomButton>
          </Stack>
        </Box>

        <Typography sx={{ mt: 3, color: '#6b7280', textAlign: 'center' }}>
          New to Cliento?{' '}
          <Box component={Link} to="/signup" sx={{ color: accent, fontWeight: 600 }}>
            Create an account
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignInPage;
