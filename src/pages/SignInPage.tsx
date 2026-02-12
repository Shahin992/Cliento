import { Box, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';
import { getMeProfile, signIn } from '../services/auth';
import type { SignInPayload } from '../types/auth';
import { useAppDispatch } from '../app/hooks';
import { setAuth } from '../features/auth/authSlice';
import { useToast } from '../common/ToastProvider';

const accent = '#346fef';

const SignInPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange =
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFieldErrors({});

    const payload: SignInPayload = {
      email: form.email.trim(),
      password: form.password,
    };

    if (!payload.email || !payload.password) {
      setFieldErrors({
        email: !payload.email ? 'Email is required.' : undefined,
        password: !payload.password ? 'Password is required.' : undefined,
      });
      return;
    }

    if (!isValidEmail(payload.email)) {
      setFieldErrors({ email: 'Please enter a valid email address.' });
      return;
    }

    if (payload.password.length < 6) {
      setFieldErrors({ password: 'Password must be at least 6 characters.' });
      return;
    }

    setSubmitting(true);
    const response = await signIn(payload);
    setSubmitting(false);

    if (!response.success) {
      showToast({
        message: response.details || response.message || 'Sign in failed. Please try again.',
        severity: 'error',
      });
      return;
    }

    const profileResponse = await getMeProfile();
    if (!profileResponse.success || !profileResponse.data) {
      showToast({
        message: profileResponse.message || 'Unable to load your profile. Please sign in again.',
        severity: 'error',
      });
      return;
    }

    dispatch(setAuth({ user: profileResponse.data }));
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
              {fieldErrors.email ? (
                <Typography variant="body2" sx={{ color: '#dc2626', mt: 0.5 }}>
                  {fieldErrors.email}
                </Typography>
              ) : null}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Password</Typography>
              <BasicInput
                fullWidth
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                inputProps={{ 'aria-label': 'Password' }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                      sx={{ color: '#6b7280' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {fieldErrors.password ? (
                <Typography variant="body2" sx={{ color: '#dc2626', mt: 0.5 }}>
                  {fieldErrors.password}
                </Typography>
              ) : null}
            </Box>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {/* <FormControlLabel
                control={<Checkbox sx={{ color: accent, '&.Mui-checked': { color: accent } }} />}
                label="Keep me signed in"
              /> */}
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
