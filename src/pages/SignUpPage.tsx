import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';
import { signUp } from '../services/auth';
import type { SignUpPayload } from '../types/auth';

const accent = '#346fef';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    companyName: '',
    phoneNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange =
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isValidE164Phone = (value: string) => /^\+[1-9]\d{7,14}$/.test(value);
  const normalizePhoneToE164 = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('00')) {
      cleaned = `+${cleaned.slice(2)}`;
    }

    if (cleaned.startsWith('+')) {
      cleaned = `+${cleaned.slice(1).replace(/\D/g, '')}`;
      return cleaned;
    }

    const digits = cleaned.replace(/\D/g, '');
    if (digits.length >= 8 && digits.length <= 15) {
      return `+${digits}`;
    }

    return digits;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
   
    const payload: SignUpPayload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      companyName: form.companyName.trim(),
      phoneNumber: form.phoneNumber.trim(),
    };

    if (!payload.fullName || !payload.email || !payload.companyName || !payload.phoneNumber) {
      setError('Please fill out all required fields.');
      return;
    }
    if (!isValidEmail(payload.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isValidE164Phone(payload.phoneNumber)) {
      setError('Phone number must be in E.164 format (e.g. +14155552671).');
      return;
    }

    setSubmitting(true);
    const response = await signUp(payload);
    setSubmitting(false);

    if (!response.success) {
      setError(response.details || response.message || 'Signup failed. Please try again.');
      return;
    }

    navigate('/welcome');
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
          maxWidth: 560,
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

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5} sx={{ mt: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Full name</Typography>
            <BasicInput
              fullWidth
              placeholder="Alex Johnson"
              value={form.fullName}
              onChange={handleChange('fullName')}
              inputProps={{ 'aria-label': 'Full name' }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Email</Typography>
            <BasicInput
              fullWidth
              placeholder="user@example.com"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              inputProps={{ 'aria-label': 'Email' }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Company name</Typography>
            <BasicInput
              fullWidth
              placeholder="Cliento Inc."
              value={form.companyName}
              onChange={handleChange('companyName')}
              inputProps={{ 'aria-label': 'Company name' }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Phone number</Typography>
            <MuiTelInput
              value={form.phoneNumber}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, phoneNumber: value.replace(/[^\d+]/g, '') }))
              }
              onBlur={() =>
                setForm((prev) => ({
                  ...prev,
                  phoneNumber: normalizePhoneToE164(prev.phoneNumber),
                }))
              }
              defaultCountry="US"
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  '& fieldset': {
                    borderColor: '#ced4da',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ced4da',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ced4da',
                    boxShadow: 'none',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: 15,
                },
                '& .MuiInputAdornment-positionStart .MuiButtonBase-root': {
                  borderRadius: '4px',
                  border: 'none',
                  boxShadow: 'none',
                  backgroundColor: 'transparent',
                },
                '& .MuiInputAdornment-positionStart .MuiButtonBase-root:hover': {
                  backgroundColor: 'transparent',
                },
                '& .MuiInputAdornment-positionStart .MuiButtonBase-root:focus': {
                  backgroundColor: 'transparent',
                },
                '& .MuiInputAdornment-positionStart .MuiButtonBase-root:focus-visible': {
                  outline: 'none',
                },
              }}
            />
          </Box>
          <FormControlLabel
            control={<Checkbox sx={{ color: accent, '&.Mui-checked': { color: accent } }} />}
            label="I agree to the Terms of Service and Privacy Policy."
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'flex-start',
              '& .MuiFormControlLabel-label': {
                textAlign: 'left',
                whiteSpace: { lg: 'nowrap' },
              },
            }}
          />

          <CustomButton
            variant="contained"
            customColor={accent}
            fullWidth
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </CustomButton>

          {error ? (
            <Typography variant="body2" sx={{ color: '#dc2626', textAlign: 'left' }}>
              {error}
            </Typography>
          ) : null}

          <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
            Use a work email so your team can find you faster.
          </Typography>
          </Stack>
        </Box>

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
