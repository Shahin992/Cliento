import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import PlanDetailsSection from '../components/billing/PlanDetailsSection';
import PaymentMethodSection from '../components/billing/PaymentMethodSection';
import TransactionsSection from '../components/billing/TransactionsSection';
import GlobalEmptyPage from '../common/GlobalEmptyPage';
import type { PaymentCard, PlanDetails, TransactionItem } from '../components/billing/types';
import {
  type SubscriptionTransaction,
  useCurrentSubscriptionQuery,
  useSubscriptionTransactionsQuery,
} from '../hooks/packages/useSubscriptionsQueries';

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

const capitalize = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? `${normalized?.charAt(0)?.toUpperCase()}${normalized.slice(1)}` : 'N/A';
};

const getTransactionId = (transaction: SubscriptionTransaction) =>
  transaction.invoice?.number?.trim() ||
  transaction.invoice?.id?.trim() ||
  'Invoice';

const getTransactionInvoiceUrl = (transaction: SubscriptionTransaction) =>
  transaction.invoice?.invoicePdfUrl?.trim() ||
  transaction.invoice?.hostedInvoiceUrl?.trim() ||
  null;

const getTransactionAmount = (transaction: SubscriptionTransaction) => {
  const rawAmount = transaction.invoice?.amountPaid ?? transaction.invoice?.amountDue ?? 0;
  return rawAmount / 100;
};

const formatTransactionStatus = (status?: string | null) => {
  const normalized = status?.trim();
  return normalized ? `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}` : 'Unknown';
};

const getTransactionPurpose = (transaction: SubscriptionTransaction) => {
  const planName = transaction.subscription?.packageId?.name?.trim();
  const cycle = transaction.subscription?.packageId?.billingCycle?.trim();

  if (planName && cycle) {
    return `${planName} plan (${capitalize(cycle)} billing)`;
  }

  if (planName) {
    return `${planName} plan billing`;
  }

  return 'Subscription billing charge';
};

type BillingTab = 'billing-info' | 'transactions';
const TRANSACTIONS_PAGE_SIZE = 10;

const BillingsPage = () => {
  const [activeTab, setActiveTab] = useState<BillingTab>('billing-info');
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [allTransactionItems, setAllTransactionItems] = useState<TransactionItem[]>([]);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const { currentSubscription, loading, errorMessage } = useCurrentSubscriptionQuery();
  const {
    transactions,
    pagination: transactionsPagination,
    isInitialLoading: isTransactionsInitialLoading,
    isFetching: isTransactionsFetching,
    errorMessage: transactionsErrorMessage,
  } = useSubscriptionTransactionsQuery(
    transactionsPage,
    TRANSACTIONS_PAGE_SIZE,
    activeTab === 'transactions',
  );

  const cards = useMemo<PaymentCard[]>(() => {
    if (!currentSubscription) return [];

    const sourceCards =
      currentSubscription.cards && currentSubscription.cards.length > 0
        ? currentSubscription.cards
        : currentSubscription.card
          ? [currentSubscription.card]
          : [];

    return sourceCards.map((card) => {
      const expMonth = String(card.expMonth).padStart(2, '0');
      const expYear = String(card.expYear).slice(-2);
      const normalizedBrand = card.brand?.trim();

      return {
        id: card.paymentMethodId,
        brand: normalizedBrand
          ? `${normalizedBrand.charAt(0).toUpperCase()}${normalizedBrand.slice(1)}`
          : 'Unknown',
        last4: card.last4,
        expiry: `${expMonth}/${expYear}`,
        isDefault: Boolean(card.isDefault),
      };
    });
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

  const transactionItems = useMemo<TransactionItem[]>(
    () =>
      transactions.map((item) => ({
        id: getTransactionId(item),
        date: formatDate(item.invoice?.createdAt),
        amount: formatCurrency(
          getTransactionAmount(item),
          item.invoice?.currency ?? currentSubscription?.currency ?? 'USD',
        ),
        status: formatTransactionStatus(item.invoice?.status),
        description: getTransactionPurpose(item),
        invoiceUrl: getTransactionInvoiceUrl(item),
      })),
    [currentSubscription?.currency, transactions],
  );

  useEffect(() => {
    if (activeTab !== 'transactions') {
      return;
    }

    if (transactionsErrorMessage) {
      return;
    }

    const hasPaginationNext = Boolean(transactionsPagination?.hasNextPage);

    setHasMoreTransactions(
      transactionsPagination
        ? hasPaginationNext
        : transactionItems.length >= TRANSACTIONS_PAGE_SIZE,
    );

    setAllTransactionItems((prev) => {
      if (transactionsPage === 1) {
        return transactionItems;
      }

      if (transactionItems.length === 0) {
        return prev;
      }

      const next = [...prev];
      const existingKeys = new Set(prev.map((item) => `${item.id}-${item.date}`));

      for (const item of transactionItems) {
        const key = `${item.id}-${item.date}`;
        if (!existingKeys.has(key)) {
          existingKeys.add(key);
          next.push(item);
        }
      }

      return next;
    });
  }, [
    activeTab,
    transactionItems,
    transactionsErrorMessage,
    transactionsPage,
    transactionsPagination,
  ]);

  const handleLoadMoreTransactions = useCallback(() => {
    if (
      activeTab !== 'transactions' ||
      isTransactionsFetching ||
      !hasMoreTransactions ||
      Boolean(transactionsErrorMessage)
    ) {
      return;
    }

    setTransactionsPage((prev) => prev + 1);
  }, [
    activeTab,
    hasMoreTransactions,
    isTransactionsFetching,
    transactionsErrorMessage,
  ]);

  const estimatedTotal = planDetails?.nextInvoiceTotal ?? '$0.00';
  const transactionsLoading =
    transactionsPage === 1 &&
    allTransactionItems.length === 0 &&
    (isTransactionsInitialLoading || isTransactionsFetching);
  const loadingMoreTransactions = isTransactionsFetching && transactionsPage > 1;

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
            sx={{
              borderRadius: 999,
              px: 2.5,
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Manage Subscription
          </CustomButton>
        }
      />

      <Box
        sx={{
          width: { xs: '100%', sm: 'fit-content' },
          borderRadius: 999,
          p: 0,
          border: '1px solid #cbd5e1',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, value: BillingTab) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            minHeight: 0,
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTabs-flexContainer': {
              gap: 0,
              width: { xs: '100%', sm: 'auto' },
            },
          }}
        >
          <Tab
            disableRipple
            value="billing-info"
            icon={<CreditCardRoundedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Billing Info"
            sx={{
              minHeight: 0,
              minWidth: { xs: '50%', sm: 0 },
              px: { xs: 1.5, sm: 2.4 },
              py: 1.05,
              borderRadius: '999px 0 0 999px',
              textTransform: 'none',
              fontSize: { xs: 12.5, sm: 14 },
              fontWeight: 700,
              color: '#64748b',
              borderRight: '1px solid #e2e8f0',
              transition: 'all 180ms ease',
              '&:hover': {
                color: '#334155',
                bgcolor: '#f8fafc',
              },
              '&.Mui-selected': {
                color: '#ffffff',
                bgcolor: '#2563eb',
                borderRightColor: '#2563eb',
                boxShadow: 'none',
              },
              '& .MuiTab-iconWrapper': {
                color: '#94a3b8',
                transition: 'color 180ms ease',
              },
              '&.Mui-selected .MuiTab-iconWrapper': {
                color: '#ffffff',
              },
            }}
          />
          <Tab
            disableRipple
            value="transactions"
            icon={<ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Transactions"
            sx={{
              minHeight: 0,
              minWidth: { xs: '50%', sm: 0 },
              px: { xs: 1.5, sm: 2.4 },
              py: 1.05,
              borderRadius: '0 999px 999px 0',
              textTransform: 'none',
              fontSize: { xs: 12.5, sm: 14 },
              fontWeight: 700,
              color: '#64748b',
              borderLeft: '1px solid #e2e8f0',
              transition: 'all 180ms ease',
              '&:hover': {
                color: '#334155',
                bgcolor: '#f8fafc',
              },
              '&.Mui-selected': {
                color: '#ffffff',
                bgcolor: '#2563eb',
                borderLeftColor: '#2563eb',
                boxShadow: 'none',
              },
              '& .MuiTab-iconWrapper': {
                color: '#94a3b8',
                transition: 'color 180ms ease',
              },
              '&.Mui-selected .MuiTab-iconWrapper': {
                color: '#ffffff',
              },
            }}
          />
        </Tabs>
      </Box>

      {activeTab === 'billing-info' && loading ? <BillingsSkeleton /> : null}

      {activeTab === 'billing-info' && !loading && errorMessage ? (
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

      {activeTab === 'billing-info' && !loading && !errorMessage && !currentSubscription ? (
        <GlobalEmptyPage message="No active billing subscription found." />
      ) : null}

      {activeTab === 'billing-info' && !loading && !errorMessage && currentSubscription && planDetails ? (
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
      ) : null}

      {activeTab === 'transactions' && transactionsLoading ? (
        <Stack spacing={1.25}>
          <Skeleton variant="rounded" height={104} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rounded" height={104} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rounded" height={104} sx={{ borderRadius: 3 }} />
        </Stack>
      ) : null}

      {activeTab === 'transactions' && !transactionsLoading && transactionsErrorMessage ? (
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid #fecaca',
            bgcolor: '#fff1f2',
            p: 2,
          }}
        >
          <Typography sx={{ color: '#be123c', fontWeight: 600 }}>Failed to load transactions.</Typography>
          <Typography sx={{ color: '#be123c', mt: 0.5 }}>{transactionsErrorMessage}</Typography>
        </Box>
      ) : null}

      {activeTab === 'transactions' &&
      !transactionsLoading &&
      !isTransactionsFetching &&
      !transactionsErrorMessage &&
      allTransactionItems.length === 0 ? (
        <GlobalEmptyPage message="No transactions found yet." />
      ) : null}

      {activeTab === 'transactions' &&
      !transactionsLoading &&
      !transactionsErrorMessage &&
      allTransactionItems.length > 0 ? (
        <TransactionsSection
          transactions={allTransactionItems}
          hasMore={hasMoreTransactions}
          isLoadingMore={loadingMoreTransactions}
          onLoadMore={handleLoadMoreTransactions}
        />
      ) : null}
    </Box>
  );
};

export default BillingsPage;
