import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1565c0' },
    secondary: { main: '#00897b' },
    background: { default: '#f5f7fb' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Space Grotesk", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
  },
});

export default theme;
