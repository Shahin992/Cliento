import { Box, Container, Stack, Typography } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';

const ink = '#0f172a';
const accent = '#2563eb';
const success = '#16a34a';
const softBg = 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #ffffff 100%)';

const WelcomePage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      background: softBg,
      color: ink,
      fontFamily: '"Sora", "Space Grotesk", "Segoe UI", sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 6, md: 10 } }}>
      <Stack
        direction={{ xs: 'column-reverse', md: 'row' }}
        spacing={{ xs: 5, md: 8 }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
      >
        <Box sx={{ maxWidth: 560, width: '100%' }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: { xs: 2, sm: 3 } }}
          >
            <Box
              component="img"
              src="/Cliento-logo.png"
              alt="Cliento"
              sx={{
                width: { xs: 72, sm: 88, md: 100 },
                height: { xs: 72, sm: 88, md: 100 },
                objectFit: 'contain',
              }}
            />
            {/* <Typography sx={{ fontWeight: 700, color: accent }}>Cliento</Typography> */}
          </Stack>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 30, sm: 38, md: 44 },
              lineHeight: 1.08,
              mb: 1.5,
            }}
          >
            Almost there! Check your email.
          </Typography>
          <Typography sx={{ color: '#475569', fontSize: 16, mb: 2 }}>
            Your login details are on their way to your inbox.
          </Typography>

          <Typography sx={{ color: '#0f172a', fontWeight: 600, mb: 2 }}>
            Get started in a few simple steps.
          </Typography>

          <Stack spacing={1.2} sx={{ mb: 3 }}>
            {[
              "Check your inbox. If you don't see it in a bit, it might be stuck in your spam.",
              'Follow guided steps to finish setting up.',
              'Use in-app guides and hands-on tutorials to learn Cliento.',
              'Use pre-loaded data or upload your own.',
            ].map((item) => (
              <Stack key={item} direction="row" spacing={1.2} alignItems="flex-start">
                <CheckCircleRounded sx={{ color: success, mt: '2px' }} />
                <Typography sx={{ color: '#334155' }}>{item}</Typography>
              </Stack>
            ))}
          </Stack>

          <Typography sx={{ color: '#475569' }}>
            Want to log in now?{' '}
            <Box
              component="span"
              sx={{
                color: accent,
                fontWeight: 600,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => (window.location.href = '/signin')}
            >
              Go to sign in
            </Box>
          </Typography>
          
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: 420 },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src="https://res.cloudinary.com/dpwfxxdhp/image/upload/v1770656597/Sign-up/b046b184-0267-4732-88b5-234feb821365.png"
            alt="Welcome illustration"
            sx={{
              width: '100%',
              maxWidth: { xs: 360, sm: 420, md: 460 },
              height: 'auto',
              filter: 'drop-shadow(0 20px 40px rgba(15, 23, 42, 0.15))',
            }}
          />
        </Box>
      </Stack>
    </Container>
  </Box>
);

export default WelcomePage;
