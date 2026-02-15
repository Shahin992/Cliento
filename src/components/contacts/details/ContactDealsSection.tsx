import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { CancelOutlined, CheckCircleOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import ConfirmationAlertModal from '../../../common/ConfirmationAlertModal';
import CustomTooltip from '../../../common/CustomTooltip';
import { CustomIconButton } from '../../../common/CustomIconButton';
import MarkLostDealModal from '../../deals/modals/MarkLostDealModal';
import { validateDealId, validateLostReason } from '../../deals/modals/lostReasonValidation';
import type { ContactDetails } from '../../../hooks/contacts/contactTypes';
import { useContactDealsQuery } from '../../../hooks/deals/useDealsQueries';
import { useMarkDealLostMutation, useMarkDealWonMutation } from '../../../hooks/deals/useDealsMutations';

const borderColor = '#e6eaf1';
const mutedText = '#7e8796';
const primary = '#6d28ff';

const dealStatusTabs = [
  { label: 'Open', value: 'open' },
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' },
] as const;

type DealStatusFilter = (typeof dealStatusTabs)[number]['value'];

interface ContactDealsSectionProps {
  contact: ContactDetails;
  contactId?: string;
  dealStatusFilter: DealStatusFilter;
  onDealStatusFilterChange: (value: DealStatusFilter) => void;
  onDealsCountChange: (count: number) => void;
}

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
};

const formatCurrency = (value?: number | null) => {
  if (typeof value !== 'number') return '-';
  return `$${value.toLocaleString()}`;
};

const normalizeDealStatus = (status?: string | null) => {
  const normalized = (status ?? '').trim().toLowerCase();
  if (normalized === 'won' || normalized === 'lost') return normalized;
  return 'open';
};

const ContactDealsSection = ({
  contact,
  contactId,
  dealStatusFilter,
  onDealStatusFilterChange,
  onDealsCountChange,
}: ContactDealsSectionProps) => {
  const [lostDealId, setLostDealId] = useState<string | null>(null);
  const [lostReason, setLostReason] = useState('');
  const [lostReasonError, setLostReasonError] = useState<string | null>(null);
  const [wonDealId, setWonDealId] = useState<string | null>(null);
  const [wonError, setWonError] = useState<string | null>(null);

  const {
    deals: associatedDeals,
    loading: isLoadingDeals,
    isFetching: isFetchingDeals,
    hasError: hasDealsError,
    errorMessage: dealsErrorMessage,
  } = useContactDealsQuery(contactId, 1, 50, null, dealStatusFilter);
  const {
    markDealLost,
    loading: markingDealLost,
    errorMessage: markDealLostErrorMessage,
  } = useMarkDealLostMutation();
  const {
    markDealWon,
    loading: markingDealWon,
    errorMessage: markDealWonErrorMessage,
  } = useMarkDealWonMutation();

  const fullName = useMemo(
    () => [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'Unnamed Contact',
    [contact.firstName, contact.lastName],
  );

  const initials = useMemo(() => {
    const first = contact.firstName?.trim()?.[0] ?? '';
    const last = contact.lastName?.trim()?.[0] ?? '';
    return `${first}${last}`.toUpperCase() || 'C';
  }, [contact.firstName, contact.lastName]);

  const isDealsLoading = isLoadingDeals || isFetchingDeals;

  useEffect(() => {
    onDealsCountChange(associatedDeals.length);
  }, [associatedDeals.length, onDealsCountChange]);

  const handleOpenWonConfirm = (dealId: string, currentStatus: string) => {
    if (normalizeDealStatus(currentStatus) === 'won') return;
    setWonError(null);
    setWonDealId(dealId);
  };

  const handleConfirmWon = async () => {
    if (!wonDealId) return;
    const validation = validateDealId(wonDealId);
    if (!validation.success) {
      setWonError(validation.message);
      return;
    }

    setWonError(null);
    try {
      await markDealWon({ dealId: validation.value });
      setWonDealId(null);
    } catch {
      // Error surfaced from mutation state.
    }
  };

  const handleConfirmLost = async () => {
    if (!lostDealId) return;
    const dealValidation = validateDealId(lostDealId);
    if (!dealValidation.success) {
      setLostReasonError(dealValidation.message);
      return;
    }
    const reasonValidation = validateLostReason(lostReason);
    if (!reasonValidation.success) {
      setLostReasonError(reasonValidation.message);
      return;
    }

    setLostReasonError(null);
    try {
      await markDealLost({
        dealId: dealValidation.value,
        lostReason: reasonValidation.value,
      });
      setLostDealId(null);
      setLostReason('');
    } catch {
      // Error surfaced from mutation state.
    }
  };

  return (
    <>
      <Stack spacing={1.5}>
        <Stack spacing={0.75}>
          <Typography sx={{ fontSize: 11, color: mutedText, fontWeight: 700, letterSpacing: '0.08em' }}>
            DEAL STATUS
          </Typography>
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            flexWrap="wrap"
            sx={{
              width: 'fit-content',
              maxWidth: '100%',
              borderRadius: 999,
              p: 0.5,
              backgroundColor: '#f3f6fb',
              border: `1px solid ${borderColor}`,
            }}
          >
            {dealStatusTabs.map((tab) => (
              <Box
                key={tab.value}
                onClick={() => onDealStatusFilterChange(tab.value)}
                sx={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: 12,
                  lineHeight: 1.1,
                  fontWeight: 700,
                  borderRadius: 999,
                  px: 1.5,
                  py: 0.65,
                  border: `1px solid ${dealStatusFilter === tab.value ? '#d9c7ff' : 'transparent'}`,
                  color: dealStatusFilter === tab.value ? primary : '#475569',
                  backgroundColor: dealStatusFilter === tab.value ? '#ffffff' : 'transparent',
                  boxShadow: dealStatusFilter === tab.value ? '0 6px 14px rgba(109, 40, 255, 0.12)' : 'none',
                  transition: 'all .2s ease',
                }}
              >
                {tab.label}
              </Box>
            ))}
          </Stack>
        </Stack>

        {isDealsLoading ? (
          <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: 2, p: 2 }}>
            <Stack spacing={1.2}>
              <Skeleton variant="text" width={180} height={24} />
              <Skeleton variant="rounded" height={62} />
              <Skeleton variant="rounded" height={62} />
            </Stack>
          </Box>
        ) : hasDealsError ? (
          <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: 2, p: 2 }}>
            <Typography sx={{ color: '#111827', fontWeight: 700, mb: 0.5 }}>
              Failed to load deals
            </Typography>
            <Typography sx={{ color: mutedText, fontSize: 13 }}>
              {dealsErrorMessage || 'Please try again in a moment.'}
            </Typography>
          </Box>
        ) : associatedDeals.length === 0 ? (
          <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: 2, p: 2 }}>
            <Typography sx={{ color: '#111827', fontWeight: 700, mb: 0.5 }}>No deals found</Typography>
            <Typography sx={{ color: mutedText, fontSize: 13 }}>
              No {dealStatusFilter} deals found for this contact.
            </Typography>
          </Box>
        ) : (
          <>
            <Stack direction="row" spacing={1.2} alignItems="flex-start">
              <Avatar src={contact.photoUrl || undefined} sx={{ width: 28, height: 28, fontSize: 12 }}>
                {initials}
              </Avatar>
              <Box>
                <Typography sx={{ color: '#111827', fontWeight: 700, fontSize: 14 }}>
                  {fullName}
                </Typography>
                <Typography sx={{ color: mutedText, fontSize: 13 }}>
                  {associatedDeals.length} {dealStatusFilter} {associatedDeals.length === 1 ? 'deal' : 'deals'}
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                maxHeight: { xs: 420, md: 520 },
                overflowY: 'auto',
                pr: 0.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              {associatedDeals.map((deal) => {
                const effectiveStatus = normalizeDealStatus(deal.status);
                const canMarkWon = effectiveStatus !== 'won';
                const canMarkLost = effectiveStatus !== 'lost';

                return (
                  <Box
                    key={deal._id}
                    sx={{
                      border: `1px solid ${borderColor}`,
                      borderRadius: 2.5,
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                      boxShadow: '0 10px 22px rgba(15, 23, 42, 0.06)',
                      transition: 'transform .2s ease, box-shadow .2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 14px 30px rgba(15, 23, 42, 0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.5,
                        py: 1.2,
                        borderBottom: `1px solid ${borderColor}`,
                        background: 'linear-gradient(90deg, #f8fbff 0%, #f5f3ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                      }}
                    >
                      <Typography
                        component={Link}
                        to={`/deals/${deal._id}`}
                        sx={{
                          color: '#0f172a',
                          textDecoration: 'none',
                          fontWeight: 800,
                          fontSize: 14,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {deal.title}
                      </Typography>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <Chip
                          size="small"
                          label={deal.status}
                          sx={{
                            height: 22,
                            textTransform: 'capitalize',
                            fontWeight: 700,
                            borderRadius: 999,
                            bgcolor:
                              deal.status === 'won'
                                ? '#ecfdf3'
                                : deal.status === 'lost'
                                  ? '#fef2f2'
                                  : '#eaf2ff',
                            color:
                              deal.status === 'won'
                                ? '#166534'
                                : deal.status === 'lost'
                                  ? '#991b1b'
                                  : '#1e3a8a',
                            border: `1px solid ${
                              deal.status === 'won'
                                ? '#bbf7d0'
                                : deal.status === 'lost'
                                  ? '#fecaca'
                                  : '#bfdbfe'
                            }`,
                          }}
                        />
                        {dealStatusFilter !== 'won' ? (
                          <CustomTooltip title={canMarkWon ? 'Mark as Won' : 'Already marked as won'} placement="top">
                            <span>
                              <CustomIconButton
                                size="small"
                                disabled={!canMarkWon}
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: 999,
                                  border: '1px solid #22c55e',
                                  backgroundColor: '#f0fdf4',
                                  '&:hover': { backgroundColor: '#dcfce7' },
                                }}
                                onClick={() => handleOpenWonConfirm(deal._id, effectiveStatus)}
                              >
                                <CheckCircleOutlined sx={{ fontSize: 15, color: '#16a34a' }} />
                              </CustomIconButton>
                            </span>
                          </CustomTooltip>
                        ) : null}
                        {dealStatusFilter !== 'lost' ? (
                          <CustomTooltip title={canMarkLost ? 'Mark as Lost' : 'Already marked as lost'} placement="top">
                            <span>
                              <CustomIconButton
                                size="small"
                                disabled={!canMarkLost}
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: 999,
                                  border: '1px solid #f87171',
                                  backgroundColor: '#fef2f2',
                                  '&:hover': { backgroundColor: '#fee2e2' },
                                }}
                                onClick={() => {
                                  if (!canMarkLost) return;
                                  setLostDealId(deal._id);
                                  setLostReason(deal.lostReason ?? '');
                                  setLostReasonError(null);
                                }}
                              >
                                <CancelOutlined sx={{ fontSize: 15, color: '#ef4444' }} />
                              </CustomIconButton>
                            </span>
                          </CustomTooltip>
                        ) : null}
                      </Stack>
                    </Box>

                    <Stack spacing={0.9} sx={{ p: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ color: mutedText, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>
                          AMOUNT
                        </Typography>
                        <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 800 }}>
                          {formatCurrency(deal.amount)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ color: mutedText, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>
                          CLOSE DATE
                        </Typography>
                        <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 700 }}>
                          {formatDate(deal.expectedCloseDate)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Typography sx={{ color: mutedText, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>
                          PIPELINE
                        </Typography>
                        <Typography sx={{ color: '#334155', fontSize: 12, fontWeight: 700 }} noWrap>
                          {deal.pipeline?.name ?? '-'}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Typography sx={{ color: mutedText, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>
                          STAGE
                        </Typography>
                        <Typography sx={{ color: '#334155', fontSize: 12, fontWeight: 700 }} noWrap>
                          {deal.stage?.name ?? '-'}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </Stack>

      <ConfirmationAlertModal
        open={Boolean(wonDealId)}
        variant="warning"
        title="Mark Deal as Won?"
        message={wonError ?? markDealWonErrorMessage ?? 'Do you want to mark this deal as won?'}
        confirmText="Mark Won"
        cancelText="Cancel"
        isConfirmLoading={markingDealWon}
        onClose={() => {
          setWonDealId(null);
          setWonError(null);
        }}
        onConfirm={handleConfirmWon}
      />

      <MarkLostDealModal
        open={Boolean(lostDealId)}
        lostReason={lostReason}
        onLostReasonChange={(value) => {
          setLostReasonError(null);
          setLostReason(value);
        }}
        onClose={() => {
          setLostDealId(null);
          setLostReason('');
          setLostReasonError(null);
        }}
        onSubmit={handleConfirmLost}
        submitDisabled={markingDealLost}
        errorMessage={lostReasonError ?? markDealLostErrorMessage}
      />
    </>
  );
};

export default ContactDealsSection;
