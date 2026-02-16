import {
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import {
  CheckCircleOutline,
  ErrorOutline,
  MarkEmailReadOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useGoogleMailAccountsQuery } from '../hooks/mail/useMailQueries';
import { CustomButton } from '../common/CustomButton';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const primary = '#6d28ff';

const iconWrapSx = {
  width: 64,
  height: 64,
  borderRadius: 3,
  display: 'grid',
  placeItems: 'center',
} as const;

const GoogleCallbackPage = () => {
  const { accounts, loading, hasError, errorMessage } = useGoogleMailAccountsQuery(true);

  const connectedCount = accounts?.connectedCount ?? 0;
  const isSuccess = !loading && !hasError && connectedCount > 0;
  const isError = !loading && !isSuccess;

  const finalMessage = hasError
    ? errorMessage || 'Could not verify Gmail connection status.'
    : isSuccess
      ? 'Gmail connected successfully. Your mailbox is now ready to use.'
      : 'Gmail was not connected. Please try again.';

  const handleTryConnectAgain = () => {
    const authUrl = accounts?.authUrl;
    if (!authUrl) return;
    window.location.href = authUrl;
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        background:
          'radial-gradient(circle at 15% 15%, rgba(109,40,255,0.10) 0%, rgba(248,251,255,1) 38%, rgba(248,251,255,1) 100%)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 620,
          borderRadius: 4,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          p: { xs: 2.25, sm: 3.25 },
          boxShadow: '0 24px 50px rgba(15, 23, 42, 0.10)',
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: '#eef2ff',
                color: primary,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <MarkEmailReadOutlined sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ color: '#0f172a', fontWeight: 800, fontSize: 20 }}>
                Gmail Connection
              </Typography>
              <Typography sx={{ color: mutedText, fontSize: 13 }}>
                Verifying mailbox authorization status
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ borderTop: `1px solid ${borderColor}` }} />

          {loading ? (
            <Stack spacing={1.5} alignItems="center" sx={{ py: 2.5 }}>
              <Box sx={{ ...iconWrapSx, bgcolor: '#f3f4f6', color: '#475569' }}>
                <CircularProgress size={28} />
              </Box>
              <Typography sx={{ color: '#0f172a', fontWeight: 800, fontSize: 22 }}>
                Finishing connection...
              </Typography>
              <Typography sx={{ color: mutedText, textAlign: 'center' }}>
                Confirming Gmail account status with your workspace.
              </Typography>
            </Stack>
          ) : null}

          {isSuccess ? (
            <Stack spacing={1.5} alignItems="center" sx={{ py: 0.5 }}>
              <Box sx={{ ...iconWrapSx, bgcolor: '#ecfdf3', color: '#047857' }}>
                <CheckCircleOutline sx={{ fontSize: 34 }} />
              </Box>
              <Typography sx={{ color: '#065f46', fontWeight: 800, fontSize: 26 }}>
                Connected Successfully
              </Typography>
              <Typography sx={{ color: mutedText, textAlign: 'center', maxWidth: 460 }}>
                {finalMessage}
              </Typography>
              <CustomButton
                component={Link}
                to="/settings/mail"
                variant="contained"
                sx={{
                  mt: 0.5,
                  textTransform: 'none',
                  borderRadius: 999,
                  px: 2.75,
                  bgcolor: primary,
                  '&:hover': { bgcolor: '#5b21d7' },
                }}
              >
                Go to Mail Settings
              </CustomButton>
            </Stack>
          ) : null}

          {isError ? (
            <Stack spacing={1.5} alignItems="center" sx={{ py: 0.5 }}>
              <Box sx={{ ...iconWrapSx, bgcolor: '#fef2f2', color: '#b91c1c' }}>
                <ErrorOutline sx={{ fontSize: 34 }} />
              </Box>
              <Typography sx={{ color: '#b91c1c', fontWeight: 800, fontSize: 26 }}>
                Connection Failed
              </Typography>
              <Typography sx={{ color: mutedText, textAlign: 'center', maxWidth: 460 }}>
                {finalMessage}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                {accounts?.authUrl ? (
                  <CustomButton
                    variant="contained"
                    onClick={handleTryConnectAgain}
                    sx={{
                      mt: 0.5,
                      textTransform: 'none',
                      borderRadius: 999,
                      px: 2.75,
                      bgcolor: primary,
                      '&:hover': { bgcolor: '#5b21d7' },
                    }}
                  >
                    Try Connect Again
                  </CustomButton>
                ) : null}
                <CustomButton
                  component={Link}
                  to="/settings/mail"
                  variant="outlined"
                  customColor={primary}
                  sx={{
                    mt: 0.5,
                    textTransform: 'none',
                    borderRadius: 999,
                    px: 2.75,
                  }}
                >
                  Go to Mail Settings
                </CustomButton>
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
};

export default GoogleCallbackPage;
