import { useEffect, useRef, useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import type { StripeCardElement } from '@stripe/stripe-js';

import BasicInput from '../../common/BasicInput';
import { CustomButton } from '../../common/CustomButton';
import { bgSoft, borderColor, cardSx, labelSx, mutedText } from './billingStyles';
import type { PaymentCard } from './types';
import { getStripe } from '../../lib/stripe';
import {
  useAttachPaymentMethodMutation,
  useCreateSetupIntentMutation,
} from '../../hooks/packages/useSubscriptionsMutations';
import { useToast } from '../../common/ToastProvider';

interface PaymentMethodSectionProps {
  cards: PaymentCard[];
}

const normalizeBrand = (brand: string) => brand.trim().toLowerCase();

const renderCardBrandLogo = (brand: string) => {
  const normalized = normalizeBrand(brand);

  if (normalized === 'visa') {
    return (
      <Box
        sx={{
          minWidth: 68,
          height: 26,
          borderRadius: 1.2,
          bgcolor: '#1434cb',
          color: 'white',
          px: 1.1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.5,
        }}
      >
        VISA
      </Box>
    );
  }

  if (normalized === 'mastercard' || normalized === 'master card') {
    return (
      <Box
        sx={{
          minWidth: 68,
          height: 26,
          borderRadius: 1.2,
          bgcolor: '#1f2937',
          px: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.25,
        }}
      >
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#eb001b' }} />
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f79e1b', ml: -0.35 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minWidth: 68,
        height: 26,
        borderRadius: 1.2,
        bgcolor: '#e2e8f0',
        color: '#334155',
        px: 1.1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
      }}
    >
      {brand}
    </Box>
  );
};

const PaymentMethodSection = ({ cards }: PaymentMethodSectionProps) => {
  const { showToast } = useToast();
  const cardMountRef = useRef<HTMLDivElement | null>(null);
  const cardElementRef = useRef<StripeCardElement | null>(null);
  const [newHolder, setNewHolder] = useState('');
  const [isAttachingCard, setIsAttachingCard] = useState(false);
  const { createSetupIntent, loading: setupIntentLoading } = useCreateSetupIntentMutation();
  const { attachPaymentMethod, loading: attachLoading } = useAttachPaymentMethodMutation();

  useEffect(() => {
    let active = true;
    let mountedCard: StripeCardElement | null = null;

    const mountStripeCard = async () => {
      try {
        const stripe = await getStripe();
        if (!stripe || !active || !cardMountRef.current) return;

        const elements = stripe.elements();
        const card = elements.create('card', {
          style: {
            base: {
              fontSize: '15px',
              color: '#0f172a',
              '::placeholder': {
                color: '#94a3b8',
              },
            },
          },
        });
        card.mount(cardMountRef.current);
        cardElementRef.current = card;
        mountedCard = card;
      } catch {
        showToast({
          message: 'Stripe is not configured. Please check payment settings.',
          severity: 'error',
        });
      }
    };

    void mountStripeCard();

    return () => {
      active = false;
      if (mountedCard) {
        mountedCard.destroy();
      }
      cardElementRef.current = null;
    };
  }, [showToast]);

  const handleAttachCard = async () => {
    if (isAttachingCard) return;

    if (!newHolder.trim()) {
      showToast({ message: 'Cardholder name is required.', severity: 'error' });
      return;
    }

    if (!cardElementRef.current) {
      showToast({ message: 'Card form is not ready yet.', severity: 'error' });
      return;
    }

    try {
      setIsAttachingCard(true);
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load.');
      }

      const setupIntentData = await createSetupIntent();
      const { error, setupIntent } = await stripe.confirmCardSetup(setupIntentData.clientSecret, {
        payment_method: {
          card: cardElementRef.current,
          billing_details: {
            name: newHolder.trim(),
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to verify card with Stripe.');
      }

      const paymentMethodId =
        typeof setupIntent?.payment_method === 'string'
          ? setupIntent.payment_method
          : setupIntent?.payment_method?.id;

      if (!paymentMethodId) {
        throw new Error('Stripe did not return a payment method id.');
      }

      await attachPaymentMethod({ paymentMethodId });
      cardElementRef.current.clear();
      setNewHolder('');
      showToast({ message: 'Card added successfully.', severity: 'success' });
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to add card.',
        severity: 'error',
      });
    } finally {
      setIsAttachingCard(false);
    }
  };

  const isSubmitting = setupIntentLoading || attachLoading || isAttachingCard;

  return (
    <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Payment Method</Typography>
        <Typography sx={{ color: mutedText, mt: 0.5 }}>
          Card information from your current subscription.
        </Typography>
      </Box>

      {cards.length === 0 ? (
        <Box
          sx={{
            borderRadius: 2,
            border: `1px solid ${borderColor}`,
            px: 1.5,
            py: 1.25,
            backgroundColor: 'white',
          }}
        >
          <Typography sx={{ color: mutedText }}>No payment card data available.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 1 }}>
          {cards.map((card) => (
            <Box
              key={card.id}
              sx={{
                borderRadius: 2,
                border: `1px solid ${borderColor}`,
                px: 1.5,
                py: 1.25,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {card.brand} •••• {card.last4}
                  </Typography>
                  {card.isDefault ? (
                    <Chip
                      label="Default"
                      size="small"
                      sx={{
                        height: 22,
                        fontWeight: 700,
                        bgcolor: '#dbeafe',
                        color: '#1e3a8a',
                        borderRadius: 999,
                      }}
                    />
                  ) : null}
                </Box>
                <Typography sx={{ fontSize: 12, color: mutedText }}>
                  {card.holder ? `${card.holder} · ` : ''}Expires {card.expiry}
                </Typography>
              </Box>
              {renderCardBrandLogo(card.brand)}
            </Box>
          ))}
        </Box>
      )}

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
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Add a new card (Stripe)</Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 1.5,
          }}
        >
          <Box>
            <Typography sx={labelSx}>Cardholder Name</Typography>
            <BasicInput fullWidth value={newHolder} onChange={(event) => setNewHolder(event.target.value)} />
          </Box>
          <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / span 2' } }}>
            <Typography sx={labelSx}>Card Details</Typography>
            <Box
              sx={{
                border: `1px solid ${borderColor}`,
                borderRadius: 1.5,
                bgcolor: 'white',
                px: 1.5,
                py: 1.7,
              }}
            >
              <Box ref={cardMountRef} />
            </Box>
          </Box>
        </Box>
        <CustomButton
          variant="contained"
          sx={{ borderRadius: 999, px: 2.5, textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
          onClick={handleAttachCard}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Card'}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default PaymentMethodSection;
