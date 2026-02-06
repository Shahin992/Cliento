import { Box, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CheckCircleOutline } from '@mui/icons-material';
import { CustomButton } from '../common/CustomButton';

const PaymentSuccessPage = () => (
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
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleOutline sx={{ fontSize: 34 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 } }}>
              Payment successful
            </Typography>
            <Typography sx={{ color: '#475569', maxWidth: 520 }}>
              Your subscription is active and ready. A confirmation email is on the
              way with your receipt and plan details.
            </Typography>
          </Stack>

          <CustomButton
            variant="contained"
            customColor="#1f6feb"
            sx={{ borderRadius: 999, px: 4, textTransform: 'none' }}
            component={Link}
            to="/signin"
          >
            Go to login
          </CustomButton>
        </Stack>
      </Box>
    </Container>
  </Box>
);

export default PaymentSuccessPage;
