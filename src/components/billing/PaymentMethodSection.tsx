import { useEffect, useRef, useState } from 'react';
import { Box, Chip, Modal, Stack, Typography } from '@mui/material';
import type { StripeCardElement } from '@stripe/stripe-js';

import BasicInput from '../../common/BasicInput';
import { CustomButton } from '../../common/CustomButton';
import ConfirmationAlertModal from '../../common/ConfirmationAlertModal';
import { bgSoft, borderColor, cardSx, labelSx, mutedText } from './billingStyles';
import type { PaymentCard } from './types';
import { getStripe } from '../../lib/stripe';
import {
  useAttachPaymentMethodMutation,
  useCreateSetupIntentMutation,
  useMakeDefaultCardMutation,
  useRemoveCardMutation,
} from '../../hooks/packages/useSubscriptionsMutations';
import { useToast } from '../../common/ToastProvider';

interface PaymentMethodSectionProps {
  cards: PaymentCard[];
}

type CardActionToConfirm = {
  type: 'default' | 'remove';
  card: PaymentCard;
} | null;

const normalizeBrand = (brand?: string | null) => brand?.trim().toLowerCase() ?? '';

const renderCardBrandLogo = (brand?: string | null) => {
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
      {brand?.trim() || 'Unknown'}
    </Box>
  );
};

const PaymentMethodSection = ({ cards }: PaymentMethodSectionProps) => {
  const { showToast } = useToast();
  const cardMountRef = useRef<HTMLDivElement | null>(null);
  const cardElementRef = useRef<StripeCardElement | null>(null);
  const [newHolder, setNewHolder] = useState('');
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAttachingCard, setIsAttachingCard] = useState(false);
  const [pendingCardAction, setPendingCardAction] = useState<{ type: 'default' | 'remove'; id: string } | null>(null);
  const [cardActionToConfirm, setCardActionToConfirm] = useState<CardActionToConfirm>(null);
  const { createSetupIntent, loading: setupIntentLoading } = useCreateSetupIntentMutation();
  const { attachPaymentMethod, loading: attachLoading } = useAttachPaymentMethodMutation();
  const { makeDefaultCard, loading: makeDefaultLoading } = useMakeDefaultCardMutation();
  const { removeCard, loading: removeCardLoading } = useRemoveCardMutation();

  useEffect(() => {
    if (!isAddCardModalOpen) return;

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
  }, [isAddCardModalOpen, showToast]);

  const openAddCardModal = () => {
    setNewHolder('');
    setIsAddCardModalOpen(true);
  };

  const closeAddCardModal = () => {
    if (isSubmitting) return;
    setIsAddCardModalOpen(false);
  };

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
      cardElementRef.current?.clear();
      setNewHolder('');
      setIsAddCardModalOpen(false);
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

  const confirmCardAction = async () => {
    const paymentMethodId = cardActionToConfirm?.card.id?.trim();
    const actionType = cardActionToConfirm?.type;
    const isDefaultCard = Boolean(cardActionToConfirm?.card.isDefault);
    if (!paymentMethodId) {
      setCardActionToConfirm(null);
      return;
    }
    if (actionType === 'remove' && isDefaultCard) {
      showToast({
        message: 'Default card cannot be removed. Set another card as default first.',
        severity: 'error',
      });
      setCardActionToConfirm(null);
      return;
    }

    try {
      setPendingCardAction({ type: actionType ?? 'remove', id: paymentMethodId });

      if (actionType === 'default') {
        await makeDefaultCard({ paymentMethodId });
        showToast({ message: 'Default card updated successfully.', severity: 'success' });
      } else {
        await removeCard({ paymentMethodId });
        showToast({ message: 'Card removed successfully.', severity: 'success' });
      }

      setCardActionToConfirm(null);
    } catch (error) {
      showToast({
        message:
          error instanceof Error
            ? error.message
            : actionType === 'default'
              ? 'Failed to update default card.'
              : 'Failed to remove card.',
        severity: 'error',
      });
    } finally {
      setPendingCardAction(null);
    }
  };

  const confirmationCardLabel = cardActionToConfirm
    ? `${cardActionToConfirm.card.brand || 'Card'} •••• ${cardActionToConfirm.card.last4}`
    : 'this card';
  const isConfirmingAction =
    cardActionToConfirm?.type === 'default' ? makeDefaultLoading : cardActionToConfirm?.type === 'remove' ? removeCardLoading : false;

  return (
    <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Payment Method</Typography>
            <Typography sx={{ color: mutedText, mt: 0.5 }}>
              Card information from your current subscription.
            </Typography>
          </Box>
          <CustomButton
            variant="contained"
            sx={{
              borderRadius: 999,
              px: 2,
              textTransform: 'none',
              minWidth: 0,
              whiteSpace: 'nowrap',
            }}
            onClick={openAddCardModal}
            disabled={isSubmitting}
          >
            Add Card
          </CustomButton>
        </Stack>
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
                {!card.isDefault ? (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <CustomButton
                      variant="contained"
                      customColor="#eff6ff"
                      customTextColor="#1d4ed8"
                      onClick={() => {
                        setCardActionToConfirm({ type: 'default', card });
                      }}
                      disabled={
                        makeDefaultLoading ||
                        removeCardLoading ||
                        (pendingCardAction?.type === 'default' && pendingCardAction.id === card.id)
                      }
                      sx={{
                        borderRadius: 999,
                        textTransform: 'none',
                        px: 1.6,
                        py: 0.35,
                        fontSize: 12,
                        fontWeight: 700,
                        boxShadow: 'inset 0 0 0 1px #bfdbfe',
                      }}
                    >
                      {pendingCardAction?.type === 'default' && pendingCardAction.id === card.id
                        ? 'Updating...'
                        : 'Make default'}
                    </CustomButton>
                    <CustomButton
                      variant="contained"
                      customColor="#fff1f2"
                      customTextColor="#be123c"
                      onClick={() => setCardActionToConfirm({ type: 'remove', card })}
                      disabled={
                        makeDefaultLoading ||
                        removeCardLoading ||
                        (pendingCardAction?.type === 'remove' && pendingCardAction.id === card.id)
                      }
                      sx={{
                        borderRadius: 999,
                        textTransform: 'none',
                        px: 1.6,
                        py: 0.35,
                        fontSize: 12,
                        fontWeight: 700,
                        boxShadow: 'inset 0 0 0 1px #fecdd3',
                      }}
                    >
                      Remove
                    </CustomButton>
                  </Stack>
                ) : null}
              </Box>
              {renderCardBrandLogo(card.brand)}
            </Box>
          ))}
        </Box>
      )}

      <Modal open={isAddCardModalOpen} onClose={closeAddCardModal} aria-labelledby="add-card-modal-title">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '92vw', sm: 560 },
            maxWidth: '92vw',
            bgcolor: 'white',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            p: { xs: 2, sm: 2.25 },
            outline: 'none',
            boxShadow: '0 24px 48px rgba(15, 23, 42, 0.22)',
          }}
        >
          <Typography id="add-card-modal-title" sx={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
            Add a new card
          </Typography>
          <Typography sx={{ color: '#64748b', mt: 0.5, fontSize: 13 }}>
            Your card details are securely handled by Stripe.
          </Typography>

          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              backgroundColor: bgSoft,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={labelSx}>Cardholder Name</Typography>
              <BasicInput fullWidth value={newHolder} onChange={(event) => setNewHolder(event.target.value)} />
            </Box>
            <Box>
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

          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
            <CustomButton
              variant="outlined"
              customColor="#94a3b8"
              onClick={closeAddCardModal}
              disabled={isSubmitting}
              sx={{ borderRadius: 999, textTransform: 'none', px: 2 }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              onClick={handleAttachCard}
              disabled={isSubmitting}
              sx={{ borderRadius: 999, textTransform: 'none', px: 2 }}
            >
              {isSubmitting ? 'Adding...' : 'Add Card'}
            </CustomButton>
          </Stack>
        </Box>
      </Modal>

      <ConfirmationAlertModal
        open={Boolean(cardActionToConfirm)}
        variant={cardActionToConfirm?.type === 'remove' ? 'delete' : 'warning'}
        title={cardActionToConfirm?.type === 'default' ? 'Make this default card?' : 'Remove card?'}
        message={
          cardActionToConfirm?.type === 'default'
            ? `${confirmationCardLabel} will be set as your primary payment method for future subscription charges.`
            : `${confirmationCardLabel} will be permanently removed from your billing profile. This action cannot be undone.`
        }
        confirmText={cardActionToConfirm?.type === 'default' ? 'Make Default' : 'Remove'}
        cancelText="Cancel"
        isConfirmLoading={isConfirmingAction}
        onClose={() => {
          if (!isConfirmingAction) setCardActionToConfirm(null);
        }}
        onConfirm={confirmCardAction}
      />
    </Box>
  );
};

export default PaymentMethodSection;
