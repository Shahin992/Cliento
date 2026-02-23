import { useEffect } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CustomButton } from '../common/CustomButton';
import { removeSpecificQueryParams } from '../utils/url';

const STRIPE_QUERY_PARAMS_TO_REMOVE = [
  'session_id',
  'sessionId',
  'redirect_status',
  'payment_intent',
  'payment_intent_client_secret',
];

const PaymentCancelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const cleanedSearch = removeSpecificQueryParams(location.search, STRIPE_QUERY_PARAMS_TO_REMOVE);
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
        }}
      >
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
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ErrorOutline sx={{ fontSize: 34 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 } }}>
              Payment canceled
            </Typography>
            <Typography sx={{ color: '#475569', maxWidth: 520 }}>
              Your checkout was canceled. No payment was completed. You can try again anytime.
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <CustomButton
              variant="outlined"
              customColor="#1f6feb"
              sx={{ borderRadius: 999, px: 3.5, textTransform: 'none' }}
              component={Link}
              to="/signin"
            >
              Go to login
            </CustomButton>
            <CustomButton
              variant="contained"
              customColor="#1f6feb"
              sx={{ borderRadius: 999, px: 3.5, textTransform: 'none' }}
              component={Link}
              to="/settings/subscription"
            >
              Try again
            </CustomButton>
          </Stack>
        </Stack>
      </Box>
    </Container>
    </Box>
  );
};

export default PaymentCancelPage;
