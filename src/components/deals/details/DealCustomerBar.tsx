import { Avatar, Box, Stack, Typography } from '@mui/material';

const labelSx = { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' };
const valueSx = { fontSize: 13, fontWeight: 600, color: '#1f2937' };

interface DealCustomerBarProps {
  customer: string;
  email: string;
  phone: string;
}

const DealCustomerBar = ({ customer, email, phone }: DealCustomerBarProps) => (
  <Box
    sx={{
      px: { xs: 1.5, sm: 2.5 },
      py: 1.5,
      borderBottom: '1px solid #e7edf6',
      backgroundColor: '#f8fbff',
    }}
  >
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 1.5, md: 3 }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: '#e2e8f0',
          color: '#64748b',
          fontWeight: 700,
        }}
      >
        {customer.slice(0, 1)}
      </Avatar>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(160px, 1fr))' },
          gap: { xs: 1, sm: 2.5 },
          width: '100%',
        }}
      >
        <Box>
          <Typography sx={labelSx}>Customer</Typography>
          <Typography sx={valueSx}>{customer}</Typography>
        </Box>
        <Box>
          <Typography sx={labelSx}>Email</Typography>
          <Typography sx={valueSx}>{email}</Typography>
        </Box>
        <Box>
          <Typography sx={labelSx}>Phone</Typography>
          <Typography sx={valueSx}>{phone}</Typography>
        </Box>
      </Box>
    </Stack>
  </Box>
);

export default DealCustomerBar;
