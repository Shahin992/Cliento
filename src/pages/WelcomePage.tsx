import { Box, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AutoAwesomeOutlined, BoltOutlined, ShieldOutlined } from '@mui/icons-material';
import { CustomButton } from '../common/CustomButton';

const ink = '#0b1220';
const accent = '#1f6feb';
const accentWarm = '#ff8a3d';

const WelcomePage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: '#f8fafc',
      color: ink,
      fontFamily: '"Space Grotesk", "Sora", "Segoe UI", sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: -180,
        left: -140,
        width: 360,
        height: 360,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(31,111,235,0.25), transparent 65%)',
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        bottom: -220,
        right: -180,
        width: 420,
        height: 420,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,138,61,0.3), transparent 65%)',
      }}
    />

    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={6}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
        >
          <Stack spacing={2} sx={{ maxWidth: 520 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: 32, sm: 40, md: 46 },
                lineHeight: 1.05,
              }}
            >
              Welcome to Cliento
            </Typography>
            <Typography sx={{ color: '#475569', fontSize: 16 }}>
              Your workspace is ready. Start organizing deals, tasks, and customer
              context in minutes.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <CustomButton
                variant="contained"
                customColor={accent}
                sx={{ borderRadius: 999, px: 3, textTransform: 'none' }}
                component={Link}
                to="/dashboard"
              >
                Go to dashboard
              </CustomButton>
              <CustomButton
                variant="outlined"
                customColor={accent}
                sx={{ borderRadius: 999, px: 3, textTransform: 'none' }}
                component={Link}
                to="/settings/subscription"
              >
                Choose a plan
              </CustomButton>
            </Stack>
          </Stack>

          <Box
            sx={{
              minWidth: { md: 320 },
              backgroundColor: '#0f172a',
              color: 'white',
              borderRadius: 4,
              p: 3,
              boxShadow: '0 28px 70px rgba(15, 23, 42, 0.3)',
            }}
          >
            <Typography sx={{ fontWeight: 700, mb: 2 }}>
              Quick start checklist
            </Typography>
            {[
              'Add your first pipeline',
              'Invite your team members',
              'Connect your inbox',
            ].map((item) => (
              <Stack
                key={item}
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: accentWarm,
                  }}
                />
                <Typography sx={{ fontWeight: 600 }}>{item}</Typography>
              </Stack>
            ))}
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
              Need help? Reach out anytime.
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            p: { xs: 3, md: 4 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {[
            {
              title: 'Guided setup',
              detail: 'We tailor your pipeline to your sales process.',
              icon: <AutoAwesomeOutlined />,
            },
            {
              title: 'Faster follow-ups',
              detail: 'Automations keep deals moving forward.',
              icon: <BoltOutlined />,
            },
            {
              title: 'Secure by default',
              detail: 'Role-based access keeps data safe.',
              icon: <ShieldOutlined />,
            },
          ].map((card) => (
            <Stack key={card.title} spacing={1.5}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  backgroundColor: '#e0ecff',
                  color: accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </Box>
              <Typography sx={{ fontWeight: 700 }}>{card.title}</Typography>
              <Typography sx={{ color: '#64748b' }}>{card.detail}</Typography>
            </Stack>
          ))}
        </Box>
      </Stack>
    </Container>
  </Box>
);

export default WelcomePage;
