import { useEffect, useRef, useState } from 'react';
import { Box, Chip, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from '../hooks/auth/useAuthMutations';
import { useToast } from '../common/ToastProvider';
import type { ForgotPasswordPayload, ResetPasswordPayload, VerifyOtpPayload } from '../types/auth';
import { AccessTime, Visibility, VisibilityOff } from '@mui/icons-material';

const accent = '#2563eb';
const ink = '#0f172a';
const softBg = 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #ffffff 100%)';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [errors, setErrors] = useState<{
    email?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { forgotPassword, loading: forgotLoading } = useForgotPasswordMutation();
  const { verifyOtp, loading: verifyLoading } = useVerifyOtpMutation();
  const { resetPassword, loading: resetLoading } = useResetPasswordMutation();
  const submitting = forgotLoading || verifyLoading || resetLoading;

  useEffect(() => {
    if (step !== 'otp' || otpVerified) {
      return;
    }
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step, otpVerified]);

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    if (!email) {
      setErrors({ email: 'Email is required.' });
      return;
    }
    const payload: ForgotPasswordPayload = { email: email.trim() };
    try {
      await forgotPassword(payload);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to send OTP. Please try again.',
        severity: 'error',
      });
      return;
    }
    showToast({ message: 'OTP sent successfully.', severity: 'success' });
    setStep('otp');
    setTimeLeft(5 * 60);
  };

  const handleResendOtp = async () => {
    if (!email) {
      setErrors({ email: 'Email is required.' });
      return;
    }
    const payload: ForgotPasswordPayload = { email: email.trim() };
    try {
      await forgotPassword(payload);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to resend OTP. Please try again.',
        severity: 'error',
      });
      return;
    }
    showToast({ message: 'OTP resent successfully.', severity: 'success' });
    setTimeLeft(5 * 60);
  };

  const handleOtpVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    if (!otpValue) {
      setErrors({ otp: 'OTP is required.' });
      return;
    }
    if (timeLeft === 0) {
      setErrors({ otp: 'OTP expired. Please request a new one.' });
      return;
    }
    const payload: VerifyOtpPayload = { email: email.trim(), otp: otpValue.trim() };
    try {
      await verifyOtp(payload);
    } catch (error) {
      setErrors({ otp: error instanceof Error ? error.message : 'Invalid OTP. Please try again.' });
      return;
    }
    showToast({ message: 'OTP verified successfully.', severity: 'success' });
    setOtpVerified(true);
    setStep('reset');
  };

  const handleResetSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    if (!password) {
      setErrors({ password: 'Password is required.' });
      return;
    }
    if (password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters.' });
      return;
    }
    if (!confirmPassword) {
      setErrors({ confirmPassword: 'Please confirm your password.' });
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match.' });
      return;
    }
    const payload: ResetPasswordPayload = {
      email: email.trim(),
      otp: otpValue.trim(),
      newPassword: password,
    };
    try {
      await resetPassword(payload);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to reset password.',
        severity: 'error',
      });
      return;
    }
    showToast({ message: 'Password updated successfully.', severity: 'success' });
    navigate('/signin');
  };

  const setOtpDigit = (index: number, digit: string) => {
    const next = otpValue.padEnd(6, ' ').split('');
    next[index] = digit;
    setOtpValue(next.join('').replace(/\s+$/, ''));
  };

  const handleOtpInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/\D/g, '');
    const digit = raw.slice(-1);
    setOtpDigit(index, digit);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otpValue[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) {
      return;
    }
    event.preventDefault();
    setOtpValue(pasted);
    const nextIndex = Math.min(pasted.length, 6) - 1;
    if (nextIndex >= 0) {
      otpRefs.current[nextIndex]?.focus();
    }
  };

  useEffect(() => {
    if (step === 'otp' && timeLeft > 0 && otpValue.length === 6 && !submitting) {
      handleOtpVerify({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    }
  }, [otpValue, step, timeLeft, submitting]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 5, md: 8 },
        background: softBg,
        fontFamily: '"Sora", "Space Grotesk", "Segoe UI", sans-serif',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 520,
          bgcolor: 'white',
          borderRadius: 4,
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, textAlign: 'center' }}>
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="img"
              src="/Cliento-logo.png"
              alt="Cliento logo"
              sx={{ width: 120, height: 'auto', mb: 2 }}
            />
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 26, sm: 30 }, color: ink }}>
              Forgot password
            </Typography>
            <Typography sx={{ color: '#64748b', mt: 0.5 }}>
              {step === 'email'
                ? 'Enter your email to receive a verification code.'
                : step === 'otp'
                  ? 'Enter the 6-digit code we sent.'
                  : 'Create a new password to continue.'}
            </Typography>
          </Box>

          {step === 'email' ? (
            <Box component="form" onSubmit={handleEmailSubmit}>
              <Stack spacing={2.5} alignItems="center">
              <Box sx={{ width: '100%', textAlign:'left' }}>
                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Email</Typography>
                <BasicInput
                  fullWidth
                  placeholder="you@company.com"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                {errors.email ? (
                  <Typography variant="body2" sx={{ color: '#dc2626', mt: 0.5 }}>
                    {errors.email}
                  </Typography>
                ) : null}
              </Box>

              <CustomButton
                variant="contained"
                customColor={accent}
                fullWidth
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send OTP'}
              </CustomButton>
            </Stack>
            </Box>
          ) : null}

          {step === 'otp' ? (
            <Box>
            <Box
              sx={{
                p: 2.25,
                borderRadius: 2,
                bgcolor: '#eef2ff',
                border: '1px solid #c7d2fe',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.2,
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontWeight: 700, color: '#1e3a8a' }}>
                OTP sent to {email || 'your email'}.
              </Typography>
              {timeLeft > 0 ? (
                <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="center">
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    Expires in
                  </Typography>
                  <Chip
                    size="medium"
                    icon={<AccessTime />}
                    label={formatTime(timeLeft)}
                    sx={{
                      height: 32,
                      px: 1,
                      bgcolor: '#ffedd5',
                      color: '#9a3412',
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: '#fdba74',
                      '& .MuiChip-icon': {
                        color: '#ea580c',
                      },
                    }}
                  />
                </Stack>
              ) : null}
              {timeLeft === 0 ? (
                <CustomButton
                  variant="outlined"
                  customColor={accent}
                  sx={{ mt: 1 }}
                  onClick={handleResendOtp}
                  disabled={submitting}
                >
                  {submitting ? 'Resending...' : 'Resend OTP'}
                </CustomButton>
              ) : null}
            </Box>

            <Box component="form" onSubmit={handleOtpVerify}>
              <Stack spacing={2.5} sx={{ mt: 2 }} alignItems="center">
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Box
                        key={index}
                        component="input"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={otpValue[index] ?? ''}
                        onChange={handleOtpInputChange(index)}
                        onKeyDown={handleOtpKeyDown(index)}
                        onPaste={handleOtpPaste}
                        ref={(el) => {
                          otpRefs.current[index] = el as HTMLInputElement | null;
                        }}
                        sx={{
                          flex: 1,
                          width: '100%',
                          height: 48,
                          borderRadius: 1.5,
                          border: '1px solid #cbd5f5',
                          bgcolor: 'white',
                          textAlign: 'center',
                          fontSize: 18,
                          fontWeight: 600,
                          color: '#1e293b',
                          outline: 'none',
                          '&:focus': {
                            borderColor: accent,
                            boxShadow: `0 0 0 2px rgba(37, 99, 235, 0.15)`,
                          },
                        }}
                      />
                    ))}
                  </Box>
                  {errors.otp ? (
                    <Typography variant="body2" sx={{ color: '#dc2626', mt: 0.5 }}>
                      {errors.otp}
                    </Typography>
                  ) : null}
                </Box>

                <CustomButton
                  variant="contained"
                  customColor={accent}
                  fullWidth
                  type="submit"
                  disabled={submitting || otpValue.length !== 6}
                >
                  {submitting ? 'Verifying...' : 'Verify OTP'}
                </CustomButton>
              </Stack>
            </Box>
            </Box>
          ) : null}

          {step === 'reset' ? (
            <Box component="form" onSubmit={handleResetSubmit}>
              <Stack spacing={2.5} alignItems="center">
              <Box sx={{ width: '100%' }}>
                <Typography sx={{ fontWeight: 600, mb: 0.5, textAlign: 'left' }}>
                  New password
                </Typography>
                <BasicInput
                  fullWidth
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
                {errors.password ? (
                  <Typography variant="body2" sx={{ color: '#dc2626', mt: 0.5 }}>
                    {errors.password}
                  </Typography>
                ) : null}
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography sx={{ fontWeight: 600, mb: 0.5, textAlign: 'left' }}>
                  Confirm password
                </Typography>
                <BasicInput
                  fullWidth
                  placeholder="••••••••"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                        sx={{ color: '#6b7280' }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {errors.confirmPassword ? (
                  <Typography variant="body2" sx={{ color: '#dc2626', mt: 0.5 }}>
                    {errors.confirmPassword}
                  </Typography>
                ) : null}
              </Box>

              <CustomButton variant="contained" customColor={accent} fullWidth type="submit" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update password'}
              </CustomButton>
            </Stack>
            </Box>
          ) : null}

          <Typography sx={{ mt: 3, color: '#6b7280' }}>
            Remembered it?{' '}
            <Box component={Link} to="/signin" sx={{ color: accent, fontWeight: 600 }}>
              Back to sign in
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
