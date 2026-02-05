import { Box, Typography } from '@mui/material';

import { CustomButton } from '../../common/CustomButton';
import { borderColor, cardSx, mutedText } from './billingStyles';
import type { TransactionItem } from './types';

interface TransactionsSectionProps {
  transactions: TransactionItem[];
}

const TransactionsSection = ({ transactions }: TransactionsSectionProps) => (
  <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Transactions</Typography>
      <Typography sx={{ color: mutedText, mt: 0.5 }}>
        Recent invoices and payments from your account.
      </Typography>
    </Box>
    <Box sx={{ display: 'grid', gap: 1 }}>
      {transactions.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1.2fr 1fr 0.8fr 0.6fr' },
            gap: 1,
            alignItems: 'center',
            borderRadius: 2,
            border: `1px solid ${borderColor}`,
            px: 1.5,
            py: 1.25,
            backgroundColor: 'white',
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{item.id}</Typography>
            <Typography sx={{ fontSize: 12, color: mutedText }}>{item.date}</Typography>
          </Box>
          <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
            {item.amount}
          </Typography>
          <Box
            sx={{
              justifySelf: { xs: 'start', sm: 'center' },
              px: 1.25,
              py: 0.4,
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: '#dcfce7',
              color: '#15803d',
              width: 'fit-content',
            }}
          >
            {item.status}
          </Box>
          <CustomButton
            variant="outlined"
            customColor="#94a3b8"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
          >
            Download
          </CustomButton>
        </Box>
      ))}
    </Box>
  </Box>
);

export default TransactionsSection;
