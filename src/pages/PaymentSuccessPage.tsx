import { useEffect, useRef, useState } from 'react';
import { keyframes } from '@mui/system';
import { Box, Container, LinearProgress, Stack, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleOutline, ErrorOutline, HourglassTop } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { CustomButton } from '../common/CustomButton';
import { useSyncCheckoutSessionMutation } from '../hooks/packages/useSubscriptionsMutations';
import { meQueryOptions } from '../hooks/auth/useAuthQueries';
import { useAppDispatch } from '../app/hooks';
import { setAuth } from '../features/auth/authSlice';
import { getQueryParamValue, keepOnlyQueryParams } from '../utils/url';

type SyncState = 'processing' | 'success' | 'error';
const spin360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SUCCESS_QUERY_PARAMS_TO_KEEP = ['session_id'];

const PaymentSuccessPage = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionIdRef = useRef(getQueryParamValue(location.search, 'session_id'));
  const hasSyncStarted = useRef(false);
  const [syncState, setSyncState] = useState<SyncState>('processing');
  const [syncError, setSyncError] = useState<string | null>(null);
  const { syncCheckoutSession } = useSyncCheckoutSessionMutation();

  useEffect(() => {
    const cleanedSearch = keepOnlyQueryParams(location.search, SUCCESS_QUERY_PARAMS_TO_KEEP);
    if (cleanedSearch !== location.search) {
      navigate(
        {
          pathname: location.pathname,
          search: cleanedSearch,
        },
        { replace: true },
      );
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (hasSyncStarted.current) return;
    hasSyncStarted.current = true;

    const sessionId = sessionIdRef.current;
    if (!sessionId) {
      setSyncState('error');
      setSyncError('Missing Stripe session id from callback URL.');
      return;
    }

    const run = async () => {
      setSyncState('processing');
      setSyncError(null);
      try {
        await syncCheckoutSession({ sessionId });
        setSyncState('success');
        navigate(
          {
            pathname: location.pathname,
            search: '',
          },
          { replace: true },
        );

        // Refresh auth data in background without blocking success UI.
        try {
          const latestMe = await queryClient.fetchQuery(meQueryOptions());
          dispatch(setAuth({ user: latestMe }));
        } catch {
          // Keep success state; guards can re-validate on next protected navigation.
        }
      } catch (error) {
        setSyncState('error');
        setSyncError(
          error instanceof Error
            ? error.message
            : 'We could not verify your checkout session right now.'
        );
      }
    };

    const startSync = async () => {
      await run();
    };

    startSync();
  }, [dispatch, location.pathname, navigate, queryClient, syncCheckoutSession]);

  const isProcessing = syncState === 'processing';
  const isSuccess = syncState === 'success';
  const icon = isProcessing ? (
    <HourglassTop sx={{ fontSize: 34 }} />
  ) : isSuccess ? (
    <CheckCircleOutline sx={{ fontSize: 34 }} />
  ) : (
    <ErrorOutline sx={{ fontSize: 34 }} />
  );
  const iconStyles = isProcessing
    ? { backgroundColor: '#dbeafe', color: '#1d4ed8' }
    : isSuccess
      ? { backgroundColor: '#dcfce7', color: '#16a34a' }
      : { backgroundColor: '#fee2e2', color: '#dc2626' };
  const title = isProcessing ? 'Hold tight, we are processing your payment' : isSuccess ? 'Payment successful' : 'Payment verification failed';
  const description = isProcessing
    ? 'We are validating your Stripe checkout session and activating your subscription.'
    : isSuccess
      ? 'Your subscription is active and ready. You can continue to your dashboard.'
      : syncError ?? 'We were unable to process your payment confirmation. Please try again.';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        color: '#0b1220',
        fontFamily: '"Space Grotesk", "Sora", "Segoe UI", sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 5,
            border: '1px solid #e2e8f0',
            boxShadow: '0 30px 80px rgba(15, 23, 42, 0.12)',
            p: { xs: 3, md: 5 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isProcessing ? (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#1d4ed8',
                },
              }}
            />
          ) : null}
          <Box
            sx={{
              position: 'absolute',
              top: -120,
              right: -120,
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(31,111,235,0.2), transparent 70%)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -120,
              left: -120,
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.2), transparent 70%)',
            }}
          />

          <Stack spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Stack
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              sx={{ textAlign: { md: 'center' } }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...iconStyles,
                }}
              >
                <Box
                  sx={
                    isProcessing
                      ? {
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: `${spin360} 1.2s linear infinite`,
                        }
                      : {
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }
                  }
                >
                  {icon}
                </Box>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 } }}>
                {title}
              </Typography>
              <Typography sx={{ color: '#475569', maxWidth: 520 }}>
                {description}
              </Typography>
            </Stack>

            <CustomButton
              variant="contained"
              customColor="#1f6feb"
              sx={{ borderRadius: 999, px: 4, textTransform: 'none' }}
              component={Link}
              to="/dashboard"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Go to dashboard'}
            </CustomButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentSuccessPage;
