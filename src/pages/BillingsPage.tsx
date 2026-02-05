import { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import PlanDetailsSection from '../components/billing/PlanDetailsSection';
import PaymentMethodSection from '../components/billing/PaymentMethodSection';
import TransactionsSection from '../components/billing/TransactionsSection';
import type {
  PaymentCard,
  PaymentMethodState,
  PlanDetails,
  TransactionItem,
} from '../components/billing/types';

const BillingsPage = () => {
  const planDetails: PlanDetails = {
    planName: 'Growth',
    billingCycle: 'Annual',
    seats: 8,
    pricePerSeat: '$16 / seat',
    nextBillingDate: 'Feb 20, 2026',
    nextInvoiceTotal: '$1,632.00',
    status: 'Active',
  };

  const [payment, setPayment] = useState<PaymentMethodState>({
    billingEmail: 'billing@cliento.com',
  });

  const [cards, setCards] = useState<PaymentCard[]>([
    {
      id: 'card-1',
      brand: 'Visa',
      last4: '4242',
      expiry: '08/28',
      holder: 'Emma Cole',
      isDefault: true,
    },
    {
      id: 'card-2',
      brand: 'Mastercard',
      last4: '4455',
      expiry: '11/27',
      holder: 'Emma Cole',
      isDefault: false,
    },
  ]);

  const transactions: TransactionItem[] = [
    { id: 'INV-1284', date: 'Jan 20, 2026', amount: '$148.00', status: 'Paid' },
    { id: 'INV-1276', date: 'Dec 20, 2025', amount: '$148.00', status: 'Paid' },
    { id: 'INV-1268', date: 'Nov 20, 2025', amount: '$148.00', status: 'Paid' },
    { id: 'INV-1259', date: 'Oct 20, 2025', amount: '$148.00', status: 'Paid' },
  ];

  const estimatedTotal = useMemo(() => planDetails.nextInvoiceTotal, [planDetails.nextInvoiceTotal]);

  const detectBrand = (rawNumber: string) => {
    const digits = rawNumber.replace(/\s+/g, '');
    if (digits.startsWith('4')) return 'Visa';
    if (digits.startsWith('5')) return 'Mastercard';
    if (digits.startsWith('3')) return 'Amex';
    return 'Card';
  };

  const handleAddCard = (payload: { holder: string; number: string; expiry: string }) => {
    const last4 = payload.number.replace(/\s+/g, '').slice(-4) || '0000';
    const brand = detectBrand(payload.number);
    setCards((prev) => [
      ...prev.map((card) => ({ ...card, isDefault: card.isDefault })),
      {
        id: `card-${Date.now()}`,
        brand,
        last4,
        expiry: payload.expiry,
        holder: payload.holder,
        isDefault: prev.length === 0,
      },
    ]);
  };

  const handleRemoveCard = (cardId: string) => {
    setCards((prev) => {
      const next = prev.filter((card) => card.id !== cardId);
      if (!next.some((card) => card.isDefault) && next.length > 0) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  };

  const handleSetDefault = (cardId: string) => {
    setCards((prev) =>
      prev.map((card) => ({ ...card, isDefault: card.id === cardId })),
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 1.5, sm: 2, md: 3 },
        pb: 4,
        minHeight: { xs: 'calc(100vh - 96px)', sm: 'calc(100vh - 110px)' },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <PageHeader
        title="Billing"
        subtitle="Plan summary, payment method, and transactions"
        action={
          <CustomButton
            component={Link}
            to="/settings/subscription"
            variant="outlined"
            customColor="#94a3b8"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
          >
            Manage Subscription
          </CustomButton>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr' },
          gap: 2,
        }}
      >
        <PlanDetailsSection plan={{ ...planDetails, nextInvoiceTotal: estimatedTotal }} />
        <PaymentMethodSection
          payment={payment}
          onFieldChange={(field, value) =>
            setPayment((prev) => ({ ...prev, [field]: value }))
          }
          cards={cards}
          onAddCard={handleAddCard}
          onRemoveCard={handleRemoveCard}
          onSetDefault={handleSetDefault}
        />
      </Box>

      <TransactionsSection transactions={transactions} />
    </Box>
  );
};

export default BillingsPage;
