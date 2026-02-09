import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';
import { signUp } from '../services/auth';
import type { SignUpPayload } from '../types/auth';
import { useToast } from '../common/ToastProvider';

const accent = '#346fef';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    companyName: '',
    phoneNumber: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    companyName?: string;
    phoneNumber?: string;
  }>({});
  
  const handleChange =
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isValidE164Phone = (value: string) => /^\+[1-9]\d{7,14}$/.test(value);
  const validateSignUp = (payload: SignUpPayload) => {
    const errors: {
      fullName?: string;
      email?: string;
      companyName?: string;
      phoneNumber?: string;
    } = {};

    if (!payload.fullName) {
      errors.fullName = 'Full name is required.';
    } else if (payload.fullName.length > 30) {
      errors.fullName = 'Full name must be 30 characters or less.';
    }

    if (!payload.email) {
      errors.email = 'Email is required.';
    } else if (payload.email.length > 50) {
      errors.email = 'Email must be 50 characters or less.';
    } else if (!isValidEmail(payload.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!payload.companyName) {
      errors.companyName = 'Company name is required.';
    } else if (payload.companyName.length > 30) {
      errors.companyName = 'Company name must be 30 characters or less.';
    }

    if (!payload.phoneNumber) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!isValidE164Phone(payload.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be in E.164 format (e.g. +14155552671).';
    }

    return errors;
  };
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
    setFieldErrors({});
   
    const payload: SignUpPayload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      companyName: form.companyName.trim(),
      phoneNumber: form.phoneNumber.trim(),
    };

    if (!termsAccepted) {
      showToast({ message: 'Please accept the Terms & Privacy Policy to continue.', severity: 'warning' });
      return;
    }

    const errors = validateSignUp(payload);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    const response = await signUp(payload);
    setSubmitting(false);

    if (!response.success) {
      showToast({
        message: response.details || response.message || 'Signup failed. Please try again.',
        severity: 'error',
      });
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
              inputProps={{ 'aria-label': 'Full name', maxLength: 30 }}
            />
            {fieldErrors.fullName ? (
              <Typography variant="body2" sx={{ color: '#dc2626', mt: 0.5 }}>
                {fieldErrors.fullName}
              </Typography>
            ) : null}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Email</Typography>
            <BasicInput
              fullWidth
              placeholder="user@example.com"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              inputProps={{ 'aria-label': 'Email', maxLength: 50 }}
            />
            {fieldErrors.email ? (
              <Typography variant="body2" sx={{ color: '#dc2626', mt: 0.5 }}>
                {fieldErrors.email}
              </Typography>
            ) : null}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Company name</Typography>
            <BasicInput
              fullWidth
              placeholder="Cliento Inc."
              value={form.companyName}
              onChange={handleChange('companyName')}
              inputProps={{ 'aria-label': 'Company name', maxLength: 30 }}
            />
            {fieldErrors.companyName ? (
              <Typography variant="body2" sx={{ color: '#dc2626', mt: 0.5 }}>
                {fieldErrors.companyName}
              </Typography>
            ) : null}
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
            {fieldErrors.phoneNumber ? (
              <Typography variant="body2" sx={{ color: '#dc2626', mt: 0.5 }}>
                {fieldErrors.phoneNumber}
              </Typography>
            ) : null}
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                sx={{ color: accent, '&.Mui-checked': { color: accent } }}
              />
            }
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
