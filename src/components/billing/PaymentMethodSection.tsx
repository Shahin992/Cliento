import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import BasicInput from '../../common/BasicInput';
import { CustomButton } from '../../common/CustomButton';
import { bgSoft, borderColor, cardSx, labelSx, mutedText } from './billingStyles';
import type { PaymentCard, PaymentMethodState } from './types';

interface PaymentMethodSectionProps {
  payment: PaymentMethodState;
  onFieldChange: (field: keyof PaymentMethodState, value: string) => void;
  cards: PaymentCard[];
  onAddCard: (payload: { holder: string; number: string; expiry: string }) => void;
  onRemoveCard: (cardId: string) => void;
  onSetDefault: (cardId: string) => void;
}

const PaymentMethodSection = ({
  payment,
  onFieldChange,
  cards,
  onAddCard,
  onRemoveCard,
  onSetDefault,
}: PaymentMethodSectionProps) => {
  const [newHolder, setNewHolder] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const handleAddCard = () => {
    if (!newHolder.trim() || !newNumber.trim() || !newExpiry.trim()) {
      return;
    }
    onAddCard({ holder: newHolder.trim(), number: newNumber.trim(), expiry: newExpiry.trim() });
    setNewHolder('');
    setNewNumber('');
    setNewExpiry('');
  };

  return (
    <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Payment Method</Typography>
        <Typography sx={{ color: mutedText, mt: 0.5 }}>
          Manage your saved cards and billing contact.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 1 }}>
        {cards.map((card) => (
          <Box
            key={card.id}
            sx={{
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              px: 1.5,
              py: 1.25,
              backgroundColor: card.isDefault ? bgSoft : 'white',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                {card.brand} •••• {card.last4}
              </Typography>
              <Typography sx={{ fontSize: 12, color: mutedText }}>
                {card.holder} · Expires {card.expiry}
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              {!card.isDefault ? (
                <CustomButton
                  variant="outlined"
                  customColor="#94a3b8"
                  sx={{ borderRadius: 999, px: 2.25, textTransform: 'none' }}
                  onClick={() => onSetDefault(card.id)}
                >
                  Set Default
                </CustomButton>
              ) : (
                <Box
                  sx={{
                    borderRadius: 999,
                    px: 2,
                    py: 0.6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#15803d',
                    backgroundColor: '#dcfce7',
                    textAlign: 'center',
                  }}
                >
                  Default
                </Box>
              )}
              <CustomButton
                variant="outlined"
                customColor="#ef4444"
                sx={{ borderRadius: 999, px: 2.25, textTransform: 'none' }}
                onClick={() => onRemoveCard(card.id)}
              >
                Remove
              </CustomButton>
            </Stack>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          backgroundColor: bgSoft,
          px: 1.5,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Add a new card</Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 1.5,
          }}
        >
          <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / span 2' } }}>
            <Typography sx={labelSx}>Cardholder Name</Typography>
            <BasicInput
              fullWidth
              value={newHolder}
              onChange={(event) => setNewHolder(event.target.value)}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / span 2' } }}>
            <Typography sx={labelSx}>Card Number</Typography>
            <BasicInput
              fullWidth
              value={newNumber}
              onChange={(event) => setNewNumber(event.target.value)}
            />
          </Box>
          <Box>
            <Typography sx={labelSx}>Expiry</Typography>
            <BasicInput
              fullWidth
              placeholder="MM/YY"
              value={newExpiry}
              onChange={(event) => setNewExpiry(event.target.value)}
            />
          </Box>
        </Box>
        <CustomButton
          variant="contained"
          sx={{ borderRadius: 999, px: 2.5, textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
          onClick={handleAddCard}
        >
          Add Card
        </CustomButton>
      </Box>

      <Box>
        <Typography sx={labelSx}>Billing Email</Typography>
        <BasicInput
          fullWidth
          type="email"
          value={payment.billingEmail}
          onChange={(event) => onFieldChange('billingEmail', event.target.value)}
        />
      </Box>
    </Box>
  );
};

export default PaymentMethodSection;
