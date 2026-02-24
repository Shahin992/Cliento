import { useEffect, useMemo, useState } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import PlanDetailsSection from '../components/billing/PlanDetailsSection';
import PaymentMethodSection from '../components/billing/PaymentMethodSection';
import GlobalEmptyPage from '../common/GlobalEmptyPage';
import type {
  PaymentCard,
  PlanDetails,
} from '../components/billing/types';
import { useCurrentSubscriptionQuery } from '../hooks/packages/useSubscriptionsQueries';

const formatCurrency = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (dateValue?: string | null) => {
  if (!dateValue) return 'N/A';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const capitalize = (value?: string | null) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : 'N/A';

const BillingsPage = () => {
  const { currentSubscription, loading, errorMessage } = useCurrentSubscriptionQuery();

  const [cards, setCards] = useState<PaymentCard[]>([]);

  useEffect(() => {
    if (!currentSubscription?.card) {
      setCards([]);
      return;
    }

    const { card } = currentSubscription;
    const expMonth = String(card.expMonth).padStart(2, '0');
    const expYear = String(card.expYear).slice(-2);
    setCards([
      {
        id: card.paymentMethodId,
        brand: card.brand.charAt(0).toUpperCase() + card.brand.slice(1),
        last4: card.last4,
        expiry: `${expMonth}/${expYear}`,
      },
    ]);
  }, [currentSubscription]);

  const planDetails: PlanDetails | null = useMemo(() => {
    if (!currentSubscription) return null;

    const baseAmount = currentSubscription.amount ?? currentSubscription.packageId?.price?.amount ?? 0;

    return {
      planName: currentSubscription.packageId?.name ?? 'Current Plan',
      billingCycle: capitalize(currentSubscription.billingCycle),
      planPrice: `${formatCurrency(baseAmount, currentSubscription.currency)} / ${currentSubscription.billingCycle}`,
      nextBillingDate: formatDate(currentSubscription.currentPeriodEnd),
      nextInvoiceTotal: formatCurrency(currentSubscription.amount, currentSubscription.currency),
      status: capitalize(currentSubscription.status),
    };
  }, [currentSubscription]);

  const estimatedTotal = planDetails?.nextInvoiceTotal ?? '$0.00';

  const BillingsSkeleton = () => (
    <Stack spacing={2}>
      <Skeleton variant="rounded" height={84} sx={{ borderRadius: 3 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr' }, gap: 2 }}>
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
      </Box>
      <Skeleton variant="rounded" height={240} sx={{ borderRadius: 3 }} />
    </Stack>
  );

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
        subtitle="Plan summary and payment method"
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

      {loading ? <BillingsSkeleton /> : null}

      {!loading && errorMessage ? (
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid #fecaca',
            bgcolor: '#fff1f2',
            p: 2,
          }}
        >
          <Typography sx={{ color: '#be123c', fontWeight: 600 }}>
            Failed to load billing information.
          </Typography>
          <Typography sx={{ color: '#be123c', mt: 0.5 }}>{errorMessage}</Typography>
        </Box>
      ) : null}

      {!loading && !errorMessage && !currentSubscription ? (
        <GlobalEmptyPage message="No active billing subscription found." />
      ) : null}

      {!loading && !errorMessage && currentSubscription && planDetails ? (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr' },
              gap: 2,
            }}
          >
            <PlanDetailsSection plan={{ ...planDetails, nextInvoiceTotal: estimatedTotal }} />
            <PaymentMethodSection cards={cards} />
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export default BillingsPage;
