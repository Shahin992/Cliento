import { Box, Typography } from '@mui/material';

const labelSx = { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' };
const valueSx = { fontSize: 13, fontWeight: 600, color: '#1f2937' };

interface DealInfoSectionProps {
  progress: string;
  appointment: string;
  roomArea: string;
  people: string;
  price: string;
  roomAccess: string;
  instructions: string;
}

const DealInfoSection = ({
  progress,
  appointment,
  roomArea,
  people,
  price,
  roomAccess,
  instructions,
}: DealInfoSectionProps) => (
  <Box
    sx={{
      borderRadius: 3,
      border: '1px solid #e7edf6',
      backgroundColor: 'white',
      px: { xs: 1.5, sm: 2.5 },
      py: 2,
    }}
  >
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.6fr) minmax(220px, 1fr)' },
        gap: { xs: 2, md: 3 },
        alignItems: 'start',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={labelSx}>Progress</Typography>
            <Typography sx={valueSx}>{progress}</Typography>
          </Box>
          <Box>
            <Typography sx={labelSx}>Appointment Date</Typography>
            <Typography sx={valueSx}>{appointment}</Typography>
          </Box>
          <Box>
            <Typography sx={labelSx}>Room Area</Typography>
            <Typography sx={valueSx}>{roomArea}</Typography>
          </Box>
          <Box>
            <Typography sx={labelSx}>Number of people</Typography>
            <Typography sx={valueSx}>{people}</Typography>
          </Box>
          <Box>
            <Typography sx={labelSx}>Price</Typography>
            <Typography sx={valueSx}>{price}</Typography>
          </Box>
          <Box>
            <Typography sx={labelSx}>Room Access</Typography>
            <Typography sx={valueSx}>{roomAccess}</Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography sx={labelSx}>Special Instructions</Typography>
          <Typography sx={{ fontSize: 13, color: '#475569', maxWidth: 520 }}>
            {instructions}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: { xs: 200, md: '100%' },
          minHeight: { md: 240 },
          borderRadius: 2,
          backgroundColor: '#eef2f7',
        }}
      />
    </Box>
  </Box>
);

export default DealInfoSection;
