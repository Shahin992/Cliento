import { Box, Stack, Typography } from '@mui/material';

import { bgSoft, borderColor, cardSx, mutedText } from './billingStyles';
import type { PlanDetails } from './types';

interface PlanDetailsSectionProps {
  plan: PlanDetails;
}

const PlanDetailsSection = ({ plan }: PlanDetailsSectionProps) => (
  <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Plan Details</Typography>
      <Typography sx={{ color: mutedText, mt: 0.5 }}>
        Review your current subscription details.
      </Typography>
    </Box>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          px: 1.5,
          py: 1.25,
        }}
      >
        <Typography sx={{ fontSize: 12, color: mutedText }}>Plan</Typography>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{plan.planName}</Typography>
      </Box>
      <Box
        sx={{
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          px: 1.5,
          py: 1.25,
        }}
      >
        <Typography sx={{ fontSize: 12, color: mutedText }}>Billing Cycle</Typography>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{plan.billingCycle}</Typography>
      </Box>
      <Box
        sx={{
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          px: 1.5,
          py: 1.25,
        }}
      >
        <Typography sx={{ fontSize: 12, color: mutedText }}>Seats</Typography>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{plan.seats}</Typography>
      </Box>
      <Box
        sx={{
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          px: 1.5,
          py: 1.25,
        }}
      >
        <Typography sx={{ fontSize: 12, color: mutedText }}>Price / Seat</Typography>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{plan.pricePerSeat}</Typography>
      </Box>
    </Box>

    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        backgroundColor: bgSoft,
        px: 1.5,
        py: 1.25,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
          Next invoice: {plan.nextBillingDate}
        </Typography>
        <Typography sx={{ fontSize: 12, color: mutedText }}>
          Total due: {plan.nextInvoiceTotal}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{plan.status}</Typography>
      </Stack>
    </Box>
  </Box>
);

export default PlanDetailsSection;
