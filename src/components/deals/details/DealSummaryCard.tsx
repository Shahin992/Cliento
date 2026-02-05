import { Box, Stack, Typography } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';

interface DealSummaryCardProps {
  address: string;
}

const DealSummaryCard = ({ address }: DealSummaryCardProps) => (
  <Box
    sx={{
      borderRadius: 3,
      border: '1px solid #e7edf6',
      backgroundColor: 'white',
      px: { xs: 1.5, sm: 2.5 },
      py: 2,
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
      <Typography sx={{ fontWeight: 700, color: '#1f2937', fontSize: 18 }}>
        {address}
      </Typography>
      <Stack direction="row" spacing={1}>
        <IconButton
          size="small"
          customColor="#ef4444"
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #e7edf6',
            backgroundColor: 'white',
            color: '#ef4444',
            '& .MuiSvgIcon-root': { color: '#ef4444' },
          }}
        >
          <DeleteOutline sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          customColor="#6366f1"
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #e7edf6',
            backgroundColor: 'white',
            color: '#6366f1',
            '& .MuiSvgIcon-root': { color: '#6366f1' },
          }}
        >
          <EditOutlined sx={{ fontSize: 16 }} />
        </IconButton>
      </Stack>
    </Stack>
  </Box>
);

export default DealSummaryCard;
