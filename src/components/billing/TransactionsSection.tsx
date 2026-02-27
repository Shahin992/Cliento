import { Box, Skeleton, Stack, Typography } from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import type { UIEvent } from 'react';

import { CustomButton } from '../../common/CustomButton';
import { borderColor, cardSx, mutedText } from './billingStyles';
import type { TransactionItem } from './types';

interface TransactionsSectionProps {
  transactions: TransactionItem[];
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

const getStatusSx = (status: string) => {
  const normalized = status.trim().toLowerCase();

  if (normalized === 'paid' || normalized === 'succeeded' || normalized === 'success') {
    return {
      bgcolor: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0',
    };
  }

  if (normalized === 'pending' || normalized === 'open') {
    return {
      bgcolor: '#fef9c3',
      color: '#854d0e',
      border: '1px solid #fde68a',
    };
  }

  return {
    bgcolor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
  };
};

const TransactionsSection = ({
  transactions,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: TransactionsSectionProps) => {
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!onLoadMore || !hasMore || isLoadingMore) return;

    const element = event.currentTarget;
    const threshold = 80;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight <= threshold;

    if (isNearBottom) {
      onLoadMore();
    }
  };

  return (
    <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: { xs: 1.75, sm: 2 } }}>
      <Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Transactions</Typography>
        <Typography sx={{ color: mutedText, mt: 0.5 }}>
          Recent invoices and payments from your account.
        </Typography>
      </Box>

      <Box
        onScroll={handleScroll}
        sx={{
          display: 'grid',
          gap: 1.25,
          maxHeight: { xs: '62vh', md: 560 },
          overflowY: 'auto',
          pr: { xs: 0.2, md: 0.6 },
        }}
      >
        {transactions.map((item) => (
          <Box
            key={item.id}
            sx={{
              borderRadius: 2.5,
              border: `1px solid ${borderColor}`,
              px: { xs: 1.25, sm: 1.75 },
              py: { xs: 1.25, sm: 1.5 },
              background:
                'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.72) 100%)',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
              gap: { xs: 1.25, sm: 1.5 },
              alignItems: { xs: 'stretch', md: 'center' },
              boxShadow: '0 10px 26px rgba(15, 23, 42, 0.05)',
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="flex-start">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: '#eff6ff',
                  border: '1px solid #dbeafe',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <ReceiptLongRoundedIcon sx={{ fontSize: 18, color: '#1d4ed8' }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                {item.description ? (
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: 15.5 }}>
                    {item.description}
                  </Typography>
                ) : null}
                <Typography
                  sx={{
                    fontSize: 12,
                    color: mutedText,
                    mt: 0.25,
                    wordBreak: 'break-word',
                  }}
                >
                  Invoice {item.id} • {item.date}
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                width: { xs: '100%', md: 'auto' },
                display: 'grid',
                gridTemplateColumns: { xs: '1fr auto', sm: 'auto auto auto' },
                alignItems: 'center',
                justifyContent: { xs: 'stretch', sm: 'flex-end' },
                columnGap: 1,
                rowGap: 0.75,
              }}
            >
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: 16 }}>
                {item.amount}
              </Typography>
              <Box
                sx={{
                  px: 1.2,
                  py: 0.35,
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  ...getStatusSx(item.status),
                }}
              >
                {item.status}
              </Box>
              <CustomButton
                variant="outlined"
                customColor="#1d4ed8"
                component="a"
                href={item.invoiceUrl ?? undefined}
                disabled={!item.invoiceUrl}
                startIcon={<DownloadRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  borderRadius: 999,
                  px: 1.7,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: { xs: '100%', sm: 0 },
                  gridColumn: { xs: '1 / -1', sm: 'auto' },
                }}
              >
                Download Invoice
              </CustomButton>
            </Box>
          </Box>
        ))}

        {isLoadingMore ? (
          <>
            <Skeleton variant="rounded" height={102} sx={{ borderRadius: 2.5 }} />
            <Skeleton variant="rounded" height={102} sx={{ borderRadius: 2.5 }} />
          </>
        ) : null}
      </Box>

      {hasMore && !isLoadingMore && onLoadMore ? (
        <CustomButton
          variant="outlined"
          onClick={onLoadMore}
          sx={{
            borderRadius: 999,
            px: 2.5,
            alignSelf: { xs: 'stretch', sm: 'center' },
            textTransform: 'none',
          }}
        >
          Load More Transactions
        </CustomButton>
      ) : null}
    </Box>
  );
};

export default TransactionsSection;
