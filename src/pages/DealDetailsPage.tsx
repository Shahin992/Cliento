import { useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import {
  AccountTreeOutlined,
  CancelOutlined,
  CalendarTodayOutlined,
  CallOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EmailOutlined,
  StackedLineChartOutlined,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';

import { CustomButton } from '../common/CustomButton';
import ConfirmationAlertModal from '../common/ConfirmationAlertModal';
import AddDealModal from '../components/deals/modals/AddDealModal';
import MarkLostDealModal from '../components/deals/modals/MarkLostDealModal';
import ContactNotesPanel from '../components/deals/details/ContactNotesPanel';
import type { AddDealInitialData } from '../components/deals/modals/AddDealModal';
import { validateDealId, validateLostReason } from '../components/deals/modals/lostReasonValidation';
import { useDealDetailsQuery } from '../hooks/deals/useDealsQueries';
import { useMarkDealLostMutation, useMarkDealWonMutation } from '../hooks/deals/useDealsMutations';

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatCurrency = (value?: number | null) => {
  if (typeof value !== 'number') return '-';
  return `$${value.toLocaleString()}`;
};

const getInitials = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'D';

const getStatusStyles = (status?: string) => {
  const normalized = (status ?? '').toLowerCase();
  if (normalized === 'won') return { color: '#166534', bg: '#ecfdf3', border: '#bbf7d0' };
  if (normalized === 'lost') return { color: '#991b1b', bg: '#fef2f2', border: '#fecaca' };
  return { color: '#1e3a8a', bg: '#eff6ff', border: '#bfdbfe' };
};

const DealDetailsPage = () => {
  const { dealId } = useParams();
  const { deal, loading, hasError, errorMessage } = useDealDetailsQuery(dealId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [lostReason, setLostReason] = useState('');
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [wonConfirmOpen, setWonConfirmOpen] = useState(false);
  const [wonError, setWonError] = useState<string | null>(null);
  const [lostError, setLostError] = useState<string | null>(null);
  const { markDealWon, loading: markingWon, errorMessage: markWonErrorMessage } = useMarkDealWonMutation();
  const { markDealLost, loading: markingLost, errorMessage: markLostErrorMessage } = useMarkDealLostMutation();

  if (loading) {
    return (
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 4 }}>
        <Skeleton height={40} sx={{ mb: 1 }} />
        <Skeleton height={180} />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 4 }}>
        <Typography sx={{ color: '#dc2626' }}>{errorMessage ?? 'Failed to load deal details.'}</Typography>
      </Box>
    );
  }

  if (!deal) {
    return (
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 4 }}>
        <Typography sx={{ color: '#64748b' }}>Deal not found.</Typography>
      </Box>
    );
  }

  const contactName = [deal.contact?.firstName, deal.contact?.lastName].filter(Boolean).join(' ').trim()
    || deal.contact?.companyName
    || '-';
  const contactEmail = deal.contact?.emails?.[0] || deal.dealOwner?.email || '-';
  const contactPhone = deal.contact?.phones?.[0] || deal.dealOwner?.phone || '-';
  const statusStyles = getStatusStyles(deal.status);
  const normalizedStatus = (deal.status ?? '').toLowerCase();
  const editInitialDeal: AddDealInitialData = {
    dealId: deal._id,
    pipelineId: deal.pipeline?._id ?? '',
    stageId: deal.stage?._id ?? '',
    title: deal.title,
    amount: deal.amount,
    contactId: deal.contact?._id ?? '',
    expectedCloseDate: deal.expectedCloseDate,
    contactName,
    contactPhotoUrl: null,
  };

  const handleConfirmWon = async () => {
    const validation = validateDealId(deal._id);
    if (!validation.success) {
      setWonError(validation.message);
      return;
    }
    setWonError(null);
    try {
      await markDealWon({ dealId: validation.value });
      setWonConfirmOpen(false);
    } catch {
      // Error shown from mutation state.
    }
  };

  const handleConfirmLost = async () => {
    const dealValidation = validateDealId(deal._id);
    if (!dealValidation.success) {
      setLostError(dealValidation.message);
      return;
    }
    const reasonValidation = validateLostReason(lostReason);
    if (!reasonValidation.success) {
      setLostError(reasonValidation.message);
      return;
    }
    setLostError(null);
    try {
      await markDealLost({
        dealId: dealValidation.value,
        lostReason: reasonValidation.value,
      });
      setIsLostModalOpen(false);
      setLostReason('');
    } catch {
      // Error shown from mutation state.
    }
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
        background: 'linear-gradient(180deg, #f4f8ff 0%, #ffffff 40%)',
      }}
    >
      <Box
        sx={{
          borderRadius: 4,
          border: '1px solid #dbe4f0',
          backgroundColor: 'white',
          overflow: 'hidden',
          boxShadow: '0 18px 36px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Box
          sx={{
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 2, sm: 2.5 },
            borderBottom: '1px solid #e7edf6',
            background: 'linear-gradient(130deg, #eef4ff 0%, #f8fbff 100%)',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            gap={1.25}
            sx={{ width: '100%' }}
          >
            <Box>
              <Typography sx={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>
                Deal Details
              </Typography>
              <Typography sx={{ color: '#0f172a', fontSize: { xs: 20, sm: 24 }, fontWeight: 800 }}>
                {deal.title}
              </Typography>
            </Box>
            <CustomButton
              variant="outlined"
              customColor="#64748b"
              startIcon={<EditOutlined sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 999,
                textTransform: 'none',
                px: 2.1,
                py: 0.45,
                minWidth: 0,
                ml: { xs: 0, sm: 'auto' },
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={() => setIsEditOpen(true)}
            >
              Edit Deal
            </CustomButton>
          </Stack>
          <Stack direction="row" spacing={1.25} mt={1.5} flexWrap="wrap" useFlexGap>
            <Box
              sx={{
                borderRadius: 999,
                border: `1px solid ${statusStyles.border}`,
                backgroundColor: statusStyles.bg,
                color: statusStyles.color,
                px: 1.4,
                py: 0.5,
                fontWeight: 700,
                textTransform: 'capitalize',
                fontSize: 13,
                lineHeight: 1.2,
              }}
            >
              {deal.status}
            </Box>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <AccountTreeOutlined sx={{ color: '#64748b', fontSize: 16 }} />
              <Typography sx={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
                {deal.pipeline?.name ?? '-'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <StackedLineChartOutlined sx={{ color: '#64748b', fontSize: 16 }} />
              <Typography sx={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
                {deal.stage?.name ?? '-'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <CalendarTodayOutlined sx={{ color: '#64748b', fontSize: 15 }} />
              <Typography sx={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
                Close: {formatDate(deal.expectedCloseDate)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <CheckCircleOutlined sx={{ color: '#64748b', fontSize: 16 }} />
              <Typography sx={{ fontSize: 13, color: '#334155', fontWeight: 700 }}>
                {formatCurrency(deal.amount)}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ px: { xs: 1.5, sm: 2.5 }, py: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.8fr) minmax(0, 1fr)' },
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ border: '1px solid #e7edf6', borderRadius: 3, p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography sx={{ fontWeight: 700, color: '#1f2937' }}>
                  Deal Overview
                </Typography>
                <Stack direction="row" spacing={1}>
                  {normalizedStatus !== 'won' ? (
                    <CustomButton
                      variant="contained"
                      startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
                      sx={{ borderRadius: 999, textTransform: 'none', px: 2.1, py: 0.45, minWidth: 0 }}
                      onClick={() => {
                        setWonError(null);
                        setWonConfirmOpen(true);
                      }}
                    >
                      Mark as Won
                    </CustomButton>
                  ) : null}
                  {normalizedStatus !== 'lost' ? (
                    <CustomButton
                      variant="outlined"
                      customColor="#dc2626"
                      startIcon={<CancelOutlined sx={{ fontSize: 16 }} />}
                      sx={{ borderRadius: 999, textTransform: 'none', px: 2.1, py: 0.45, minWidth: 0 }}
                      onClick={() => {
                        setLostError(null);
                        setLostReason(deal.lostReason ?? '');
                        setIsLostModalOpen(true);
                      }}
                    >
                      Mark as Lost
                    </CustomButton>
                  ) : null}
                </Stack>
              </Stack>
              <Box
                sx={{
                  display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Amount</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{formatCurrency(deal.amount)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Expected Close</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{formatDate(deal.expectedCloseDate)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Pipeline</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{deal.pipeline?.name ?? '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Stage</Typography>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      {deal.stage?.color ? (
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: deal.stage.color }} />
                      ) : null}
                      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{deal.stage?.name ?? '-'}</Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Created</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#334155' }}>{formatDateTime(deal.createdAt)}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Updated</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#334155' }}>{formatDateTime(deal.updatedAt)}</Typography>
                  </Box>
                </Box>
                {deal.lostReason ? (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid #fecaca',
                      backgroundColor: '#fff7f7',
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: '#b91c1c', textTransform: 'uppercase', mb: 0.5 }}>
                      Lost Reason
                    </Typography>
                    <Typography sx={{ color: '#7f1d1d', fontWeight: 600 }}>{deal.lostReason}</Typography>
                  </Box>
                ) : null}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <ContactNotesPanel
                contactId={deal.contact?._id}
                contactName={contactName}
                contactEmail={contactEmail}
                contactPhone={contactPhone}
                companyName={deal.contact?.companyName}
                initials={getInitials(contactName)}
              />
              <Box sx={{ border: '1px solid #e7edf6', borderRadius: 3, p: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#1f2937', mb: 1.5 }}>
                  Deal Owner
                </Typography>
                <Stack direction="row" spacing={1.25} alignItems="center" mb={1.25}>
                  <Avatar sx={{ width: 38, height: 38, bgcolor: '#f1f5f9', color: '#334155', fontWeight: 700 }}>
                    {getInitials(deal.dealOwner?.name || 'Owner')}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>{deal.dealOwner?.name || '-'}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: 12 }}>
                      Owner ID: {deal.dealOwner?._id || '-'}
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 1.25 }} />
              <Stack spacing={1.1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailOutlined sx={{ fontSize: 16, color: '#64748b' }} />
                  <Typography sx={{ color: '#334155', fontSize: 13 }}>{deal.dealOwner?.email || '-'}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CallOutlined sx={{ fontSize: 16, color: '#64748b' }} />
                  <Typography sx={{ color: '#334155', fontSize: 13 }}>{deal.dealOwner?.phone || '-'}</Typography>
                </Stack>
              </Stack>
            </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <AddDealModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={() => setIsEditOpen(false)}
        initialDeal={editInitialDeal}
      />

      <ConfirmationAlertModal
        open={wonConfirmOpen}
        variant="warning"
        title="Mark deal as won?"
        message={wonError ?? markWonErrorMessage ?? 'Do you want to mark this deal as won?'}
        confirmText="Mark Won"
        cancelText="Cancel"
        isConfirmLoading={markingWon}
        onClose={() => {
          setWonConfirmOpen(false);
          setWonError(null);
        }}
        onConfirm={handleConfirmWon}
      />

      <MarkLostDealModal
        open={isLostModalOpen}
        lostReason={lostReason}
        onLostReasonChange={(value) => {
          setLostError(null);
          setLostReason(value);
        }}
        onClose={() => {
          setIsLostModalOpen(false);
          setLostError(null);
          setLostReason('');
        }}
        onSubmit={handleConfirmLost}
        submitDisabled={markingLost}
        errorMessage={lostError ?? markLostErrorMessage}
      />
    </Box>
  );
};

export default DealDetailsPage;
