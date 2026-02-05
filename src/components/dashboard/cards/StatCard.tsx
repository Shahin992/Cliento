import { Box, Typography } from '@mui/material';

const borderColor = '#eef2f7';
const mutedText = '#8b95a7';

interface StatCardProps {
  label: string;
  value: string;
  color: string;
}

export const StatCard = ({ label, value, color }: StatCardProps) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 3,
      bgcolor: 'white',
      border: `1px solid ${borderColor}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Box>
      <Typography variant="caption" sx={{ color: mutedText, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700, color: '#1f2937' }}>
        {value}
      </Typography>
    </Box>
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        bgcolor: color,
        display: 'grid',
        placeItems: 'center',
        color: 'white',
        fontWeight: 700,
      }}
    >
      {label.slice(0, 1)}
    </Box>
  </Box>
);
