import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

const PwaInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setShow(false);
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShow(true);
    };

    const handleAppInstalled = () => {
      setShow(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setShow(false);
      setDeferredPrompt(null);
    }
  };

  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 16, sm: 24 },
        left: 'auto',
        bottom: { xs: 16, sm: 88 },
        zIndex: 1500,
      }}
    >
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={handleInstall}
        sx={{
          textTransform: 'none',
          borderRadius: 999,
          px: 2.5,
          bgcolor: '#6d28ff',
          boxShadow: '0 10px 24px rgba(109, 40, 255, 0.35)',
          '&:hover': { bgcolor: '#5b21d6' },
        }}
      >
        Download App
      </Button>
    </Box>
  );
};

export default PwaInstallButton;
