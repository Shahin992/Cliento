import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  MenuItem,
  Pagination,
  Popover,
  Select,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  CancelOutlined,
  CheckCircleOutlined,
  DeleteOutline,
  EditOutlined,
  FilterListOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import type { SelectChangeEvent } from '@mui/material';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import ConfirmationAlertModal from '../common/ConfirmationAlertModal';
import BasicInput from '../common/BasicInput';
import BasicSelect from '../common/BasicSelect';
import CustomTooltip from '../common/CustomTooltip';
import { CustomIconButton } from '../common/CustomIconButton';
import AddDealModal from '../components/deals/modals/AddDealModal';
import type { AddDealInitialData } from '../components/deals/modals/AddDealModal';
import MarkLostDealModal from '../components/deals/modals/MarkLostDealModal';
import PipelineModal from '../components/deals/modals/PipelineModal';
import { useDealsQuery } from '../hooks/deals/useDealsQueries';
import {
  useDeleteDealMutation,
  useMarkDealLostMutation,
  useMarkDealWonMutation,
} from '../hooks/deals/useDealsMutations';
import { usePipelinesOptionsQuery } from '../hooks/pipelines/usePipelinesQueries';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addPipelineOption, setPipelineOptions } from '../features/pipelines/pipelinesSlice';
import { validateDealId, validateLostReason } from '../components/deals/modals/lostReasonValidation';

const borderColor = '#dbe4f0';
const mutedText = '#6b7a90';
const primary = '#1d4ed8';
const bgSoft = '#eef4ff';
const pageBg = 'linear-gradient(180deg, #f6f9ff 0%, #ffffff 48%, #f8fbff 100%)';
const DEFAULT_PAGE_SIZE = 10;
const PAGE_LIMIT_OPTIONS = [10, 25, 50, 100];

const formatCloseDate = (value: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatContactName = (contact?: {
  firstName?: string;
  lastName?: string;
  companyName?: string;
}) => {
  if (!contact) return '-';
  const fullName = `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim();
  if (fullName) return fullName;
  return contact.companyName?.trim() || '-';
};

const getStatusTone = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'won') {
    return { color: '#166534', bg: '#e9fce9', border: '#bbf7d0' };
  }
  if (normalized === 'lost') {
    return { color: '#991b1b', bg: '#fef2f2', border: '#fecaca' };
  }
  return { color: '#1e3a8a', bg: '#e8f0ff', border: '#bfdbfe' };
};

const normalizeDealStatus = (status?: string | null) => {
  const normalized = (status ?? '').trim().toLowerCase();
  if (normalized === 'won' || normalized === 'lost') return normalized;
  return 'open';
};

const DealsPage = () => {
  const dispatch = useAppDispatch();
  const useFilterPopover = useMediaQuery('(max-width:1039.95px)');
  const reduxPipelines = useAppSelector((state) => state.pipelines.options);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<AddDealInitialData | null>(null);
  const [isAddPipelineOpen, setIsAddPipelineOpen] = useState(false);
  const [pipelineModalMode, setPipelineModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPipelineId, setSelectedPipelineId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [firstPageTotal, setFirstPageTotal] = useState(0);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, { status: string; lostReason?: string | null }>
  >({});
  const [lostDealId, setLostDealId] = useState<string | null>(null);
  const [lostReason, setLostReason] = useState('');
  const [lostReasonError, setLostReasonError] = useState<string | null>(null);
  const [wonDealId, setWonDealId] = useState<string | null>(null);
  const [wonError, setWonError] = useState<string | null>(null);
  const [dealToDeleteId, setDealToDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [celebrationDealId, setCelebrationDealId] = useState<string | null>(null);
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
  const {
    deleteDeal,
    loading: deletingDeal,
    errorMessage: deleteDealErrorMessage,
  } = useDeleteDealMutation();

  const { pipelines: apiPipelines, loading: loadingPipelineOptions } = usePipelinesOptionsQuery(true);
  const { deals, pagination, loading, hasError, errorMessage } = useDealsQuery(
    page,
    limit,
    debouncedSearchQuery || undefined,
    selectedPipelineId || undefined,
    selectedStatus || undefined,
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [selectedPipelineId]);

  useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  useEffect(() => {
    setPage(1);
  }, [limit]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!useFilterPopover) {
      setFilterAnchorEl(null);
    }
  }, [useFilterPopover]);

  useEffect(() => {
    if ((pagination?.page ?? 0) === 1 && typeof pagination?.total === 'number') {
      setFirstPageTotal(Math.max(0, pagination.total));
    }
  }, [pagination?.page, pagination?.total]);

  useEffect(() => {
    const serverPage = Math.max(1, Number(pagination?.page) || page);
    if (serverPage !== page) {
      setPage(serverPage);
    }
  }, [pagination?.page, page]);

  useEffect(() => {
    if (!apiPipelines.length) return;
    dispatch(setPipelineOptions(apiPipelines));
  }, [apiPipelines, dispatch]);

  const totalDeals =
    (pagination?.page ?? 1) === 1
      ? Math.max(0, Number(pagination?.total) || 0)
      : firstPageTotal;

  const visibleDeals = useMemo(() => deals, [deals]);
  const visibleTotalDeals = totalDeals;
  const totalPages = Math.max(1, Number(pagination?.totalPages) || 1);
  const serverLimit = Math.max(1, Number(pagination?.limit) || limit);
  const pageStart = visibleTotalDeals === 0 ? 0 : (page - 1) * serverLimit + 1;
  const pageEnd =
    visibleTotalDeals === 0
      ? 0
      : Math.min((page - 1) * serverLimit + visibleDeals.length, visibleTotalDeals);

  const pipelineFilterOptions = useMemo(
    () =>
      reduxPipelines.map((pipeline) => ({
        label: pipeline.name,
        value: pipeline._id,
      })),
    [reduxPipelines],
  );

  const statusFilterOptions = useMemo(
    () => [
      { label: 'Open', value: 'open' },
      { label: 'Won', value: 'won' },
      { label: 'Lost', value: 'lost' },
    ],
    [],
  );

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
      setStatusOverrides((prev) => ({
        ...prev,
        [validation.value]: { status: 'won', lostReason: null },
      }));
      setCelebrationDealId(validation.value);
      window.setTimeout(() => setCelebrationDealId(null), 1800);
      setWonDealId(null);
    } catch {
      // Error message is surfaced from mutation state.
    }
  };

  const handleConfirmLost = async () => {
    if (!lostDealId) return;
    const validation = validateLostReason(lostReason);
    if (!validation.success) {
      setLostReasonError(validation.message);
      return;
    }

    setLostReasonError(null);
    try {
      await markDealLost({
        dealId: lostDealId,
        lostReason: validation.value,
      });
      setLostDealId(null);
      setLostReason('');
    } catch {
      // Error message is surfaced from mutation state in modal.
    }
  };

  const handleConfirmDelete = async () => {
    if (!dealToDeleteId) return;
    const validation = validateDealId(dealToDeleteId);
    if (!validation.success) {
      setDeleteError(validation.message);
      return;
    }

    setDeleteError(null);
    try {
      await deleteDeal(validation.value);
      setDealToDeleteId(null);
    } catch {
      // Error surfaced from mutation state.
    }
  };

  const isFilterPopoverOpen = Boolean(filterAnchorEl);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 1.5, sm: 2, md: 3 },
        pb: { xs: 12, sm: 0 },
        height: { xs: 'auto', sm: 'calc(100vh - 112px)' },
        minHeight: 0,
        overflow: { xs: 'visible', sm: 'hidden' },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        background: pageBg,
      }}
    >
      <PageHeader
        title="Deals"
        subtitle="Track active opportunities"
        action={
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
            flexWrap={{ xs: 'nowrap', sm: 'wrap' }}
            sx={{ width: { xs: '100%', sm: 'auto' }, pr: { xs: '20px', sm: 0 } }}
          >
            {useFilterPopover ? (
              <CustomIconButton
                size="small"
                onClick={(event) => setFilterAnchorEl(event.currentTarget)}
                sx={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius: 999,
                  border: `1px solid ${borderColor}`,
                  backgroundColor: 'white',
                  color: '#475569',
                }}
              >
                <FilterListOutlined sx={{ fontSize: 20 }} />
              </CustomIconButton>
            ) : (
              <>
                <Box sx={{ minWidth: 240 }}>
                  <BasicInput
                    fullWidth
                    placeholder="Search deals"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </Box>
                <Box sx={{ minWidth: 190 }}>
                  <BasicSelect
                    options={pipelineFilterOptions}
                    mapping={{ label: 'label', value: 'value' }}
                    value={selectedPipelineId}
                    defaultText="All pipelines"
                    emptyable
                    isLoading={loadingPipelineOptions}
                    onChange={(event: SelectChangeEvent<unknown>) =>
                      setSelectedPipelineId((event.target.value as string) || '')
                    }
                  />
                </Box>
                <Box sx={{ minWidth: 150 }}>
                  <BasicSelect
                    options={statusFilterOptions}
                    mapping={{ label: 'label', value: 'value' }}
                    value={selectedStatus}
                    defaultText="All status"
                    emptyable
                    onChange={(event: SelectChangeEvent<unknown>) =>
                      setSelectedStatus((event.target.value as string) || '')
                    }
                  />
                </Box>
              </>
            )}
            <CustomButton
              variant="contained"
              sx={{
                height: 38,
                borderRadius: 999,
                px: { xs: 1.2, sm: 2.2 },
                textTransform: 'none',
                width: { xs: 'auto', sm: 'auto' },
                flex: { xs: '0 1 auto', sm: '0 0 auto' },
                minWidth: 0,
                fontSize: { xs: 11.5, sm: 14 },
                boxShadow: '0 10px 20px rgba(29, 78, 216, 0.25)',
              }}
              onClick={() => {
                setPipelineModalMode('create');
                setIsAddPipelineOpen(true);
              }}
            >
              Create Pipeline
            </CustomButton>
            <CustomButton
              variant="contained"
              sx={{
                height: 38,
                borderRadius: 999,
                px: { xs: 1.2, sm: 2.8 },
                textTransform: 'none',
                width: { xs: 'auto', sm: 'auto' },
                flex: { xs: '0 1 auto', sm: '0 0 auto' },
                minWidth: 0,
                fontSize: { xs: 11.5, sm: 14 },
                boxShadow: '0 10px 20px rgba(29, 78, 216, 0.25)',
              }}
              onClick={() => {
                setEditingDeal(null);
                setIsAddDealOpen(true);
              }}
            >
              Add Deal
            </CustomButton>
          </Stack>
        }
      />
      <Popover
        open={useFilterPopover && isFilterPopoverOpen}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            width: { xs: 'calc(100vw - 24px)', sm: 340 },
            maxWidth: 'calc(100vw - 24px)',
            p: 1.5,
            borderRadius: 2,
            border: `1px solid ${borderColor}`,
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.16)',
          },
        }}
      >
        <Stack spacing={1.25}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Filters</Typography>
          <BasicInput
            fullWidth
            placeholder="Search deals"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <BasicSelect
            options={pipelineFilterOptions}
            mapping={{ label: 'label', value: 'value' }}
            value={selectedPipelineId}
            defaultText="All pipelines"
            emptyable
            isLoading={loadingPipelineOptions}
            onChange={(event: SelectChangeEvent<unknown>) =>
              setSelectedPipelineId((event.target.value as string) || '')
            }
          />
          <BasicSelect
            options={statusFilterOptions}
            mapping={{ label: 'label', value: 'value' }}
            value={selectedStatus}
            defaultText="All status"
            emptyable
            onChange={(event: SelectChangeEvent<unknown>) =>
              setSelectedStatus((event.target.value as string) || '')
            }
          />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <CustomButton
              variant="text"
              customColor="#64748b"
              sx={{ textTransform: 'none', px: 0 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedPipelineId('');
                setSelectedStatus('');
              }}
            >
              Clear Filters
            </CustomButton>
            <CustomButton
              variant="contained"
              sx={{ textTransform: 'none', borderRadius: 999, px: 2 }}
              onClick={() => setFilterAnchorEl(null)}
            >
              Done
            </CustomButton>
          </Stack>
        </Stack>
      </Popover>

      <Box
        sx={{
          width: '100%',
          borderRadius: 3,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          overflow: 'hidden',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{
            px: { xs: 1.5, sm: 2.5 },
            py: 2,
            gap: 1.5,
            borderBottom: `1px solid ${borderColor}`,
            background: `linear-gradient(135deg, ${bgSoft} 0%, #f8fbff 100%)`,
          }}
        >
          {!loading ? (
            <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
              Total: {visibleTotalDeals} deals
            </Typography>
          ) : null}
          {!loading ? (
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: mutedText }}>
              Active pipeline opportunities
            </Typography>
          ) : null}
        </Stack>

        {celebrationDealId ? (
          <Box
            sx={{
              mx: { xs: 1.5, sm: 2.5 },
              mt: 2,
              mb: 0,
              borderRadius: 2,
              border: '1px solid #bbf7d0',
              backgroundColor: '#f0fdf4',
              px: 2,
              py: 1,
              color: '#166534',
              fontWeight: 700,
              boxShadow: '0 10px 20px rgba(22, 101, 52, 0.08)',
            }}
          >
            Deal marked as won
          </Box>
        ) : null}

        <Box
          sx={{
            overflowX: 'hidden',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', lg: 'grid' },
              gridTemplateColumns:
                'minmax(180px, 1.7fr) minmax(170px, 1.4fr) minmax(170px, 1.4fr) minmax(150px, 1.3fr) minmax(150px, 1.2fr) minmax(110px, 0.9fr) minmax(130px, 1fr) minmax(120px, 1fr)',
              px: 2.5,
              py: 1.5,
              color: mutedText,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderBottom: `1px solid ${borderColor}`,
              alignItems: 'center',
            }}
          >
            <Box>Deal Name</Box>
            <Box>Deal Owner</Box>
            <Box>Contact</Box>
            <Box>Pipeline</Box>
            <Box>Stage</Box>
            <Box>Status</Box>
            <Box>Close Date</Box>
            <Box textAlign="center">Action</Box>
          </Box>

          <Box
            sx={{
              flex: { xs: 'unset', sm: 1 },
              minHeight: { xs: 'auto', sm: 0 },
              overflowY: { xs: 'visible', sm: 'auto' },
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: { xs: 'flex', lg: 'grid' },
                    flexDirection: { xs: 'column', lg: 'unset' },
                    gridTemplateColumns:
                      'minmax(180px, 1.7fr) minmax(170px, 1.4fr) minmax(170px, 1.4fr) minmax(150px, 1.3fr) minmax(150px, 1.2fr) minmax(110px, 0.9fr) minmax(130px, 1fr) minmax(120px, 1fr)',
                    px: { xs: 1.5, sm: 2.5 },
                    py: { xs: 1.5, sm: 1.75 },
                    gap: 1,
                    borderBottom: `1px solid ${borderColor}`,
                    borderRadius: { xs: 2, lg: 0 },
                    backgroundColor: { xs: '#f8fbff', lg: 'transparent' },
                    border: { xs: `1px solid ${borderColor}`, lg: 'none' },
                    mb: { xs: 1.25, lg: 0 },
                  }}
                >
                  {Array.from({ length: 8 }).map((__, itemIndex) => (
                    <Skeleton key={itemIndex} height={26} />
                  ))}
                </Box>
              ))
            ) : hasError ? (
              <Box sx={{ px: 2.5, py: 4 }}>
                <Typography sx={{ color: '#dc2626', fontWeight: 600 }}>
                  {errorMessage ?? 'Failed to load deals.'}
                </Typography>
              </Box>
            ) : visibleDeals.length === 0 ? (
              <Box sx={{ px: 2.5, py: 6, textAlign: 'center' }}>
                <Typography sx={{ color: mutedText, fontWeight: 600 }}>
                  No deals found.
                </Typography>
              </Box>
            ) : (
              visibleDeals.map((deal, index) => {
                const effectiveStatus = normalizeDealStatus(
                  statusOverrides[deal._id]?.status ?? deal.status,
                );
                const effectiveLostReason = statusOverrides[deal._id]?.lostReason ?? deal.lostReason ?? '';
                const statusTone = getStatusTone(effectiveStatus);
                const canMarkWon = effectiveStatus !== 'won';
                const canMarkLost = effectiveStatus !== 'lost';

                return (
                  <Box key={deal._id}>
                    <Box
                      sx={{
                        display: { xs: 'flex', lg: 'none' },
                        flexDirection: 'column',
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 1.6, sm: 1.9 },
                        gap: 1.5,
                        borderRadius: 3,
                        border: `1px solid ${borderColor}`,
                        background:
                          'linear-gradient(165deg, #ffffff 0%, #f8fbff 50%, #f2f7ff 100%)',
                        m:'8px',
                        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" gap={1.2} alignItems="flex-start">
                        <Stack spacing={0.2} sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: 11, color: '#64748b', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Deal
                          </Typography>
                          <Typography
                            component={Link}
                            to={`/deals/${deal._id}`}
                            sx={{
                              fontWeight: 800,
                              color: '#0f172a',
                              textDecoration: 'none',
                              fontSize: 18,
                              lineHeight: 1.2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              '&:hover': { color: primary },
                            }}
                          >
                            {deal.title}
                          </Typography>
                        </Stack>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: statusTone.color,
                            textTransform: 'capitalize',
                            fontSize: 12,
                            px: 1.3,
                            py: 0.55,
                            borderRadius: 999,
                            border: `1px solid ${statusTone.border}`,
                            backgroundColor: statusTone.bg,
                            display: 'inline-flex',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {effectiveStatus}
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                          gap: 1.15,
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Owner
                          </Typography>
                          <Typography sx={{ mt: 0.35, fontWeight: 700, color: '#1f2937', fontSize: 14 }}>
                            {deal.dealOwner?.name ?? '-'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Contact
                          </Typography>
                          <Typography sx={{ mt: 0.35, fontWeight: 700, color: '#1f2937', fontSize: 14 }}>
                            {formatContactName(deal.contact)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Pipeline
                          </Typography>
                          <Typography sx={{ mt: 0.35, fontWeight: 700, color: '#1f2937', fontSize: 14 }}>
                            {deal.pipeline?.name ?? '-'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Stage
                          </Typography>
                          <Typography sx={{ mt: 0.35, fontWeight: 700, color: '#1f2937', fontSize: 14 }}>
                            {deal.stage?.name ?? '-'}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          px: 1.25,
                          py: 1,
                          borderRadius: 2,
                          border: `1px solid ${borderColor}`,
                          backgroundColor: 'rgba(255,255,255,0.85)',
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Close Date
                          </Typography>
                          <Typography sx={{ mt: 0.15, fontWeight: 800, color: '#0f172a' }}>
                            {formatCloseDate(deal.expectedCloseDate)}
                          </Typography>
                        </Box>
                        <Stack direction="row" alignItems="center" gap={0.9}>
                          <CustomTooltip title={canMarkWon ? 'Mark as Won' : 'Already marked as won'} placement="top">
                            <span>
                              <CustomIconButton
                                size="small"
                                disabled={!canMarkWon}
                                sx={{
                                  width: 33,
                                  height: 33,
                                  borderRadius: 999,
                                  border: '1px solid #22c55e',
                                  backgroundColor: '#f0fdf4',
                                  '&:hover': { backgroundColor: '#dcfce7' },
                                }}
                                onClick={() => handleOpenWonConfirm(deal._id, effectiveStatus)}
                              >
                                <CheckCircleOutlined sx={{ fontSize: 16, color: '#16a34a' }} />
                              </CustomIconButton>
                            </span>
                          </CustomTooltip>
                          <CustomTooltip title={canMarkLost ? 'Mark as Lost' : 'Already marked as lost'} placement="top">
                            <span>
                              <CustomIconButton
                                size="small"
                                disabled={!canMarkLost}
                                sx={{
                                  width: 33,
                                  height: 33,
                                  borderRadius: 999,
                                  border: '1px solid #f87171',
                                  backgroundColor: '#fef2f2',
                                  '&:hover': { backgroundColor: '#fee2e2' },
                                }}
                                onClick={() => {
                                  if (!canMarkLost) return;
                                  setLostDealId(deal._id);
                                  setLostReason(effectiveLostReason);
                                  setLostReasonError(null);
                                }}
                              >
                                <CancelOutlined sx={{ fontSize: 16, color: '#ef4444' }} />
                              </CustomIconButton>
                            </span>
                          </CustomTooltip>
                          <CustomTooltip title="Edit Deal" placement="top">
                            <CustomIconButton
                              size="small"
                              sx={{
                                width: 33,
                                height: 33,
                                borderRadius: 999,
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#f8fafc',
                                '&:hover': { backgroundColor: '#f1f5f9' },
                              }}
                              onClick={() => {
                                setEditingDeal({
                                  dealId: deal._id,
                                  pipelineId: deal.pipeline?._id ?? '',
                                  stageId: deal.stage?._id ?? '',
                                  title: deal.title,
                                  amount: deal.amount,
                                  contactId: deal.contact?._id ?? '',
                                  expectedCloseDate: deal.expectedCloseDate,
                                  contactName: formatContactName(deal.contact),
                                  contactPhotoUrl: null,
                                });
                                setIsAddDealOpen(true);
                              }}
                            >
                              <EditOutlined sx={{ fontSize: 16, color: '#64748b' }} />
                            </CustomIconButton>
                          </CustomTooltip>
                          <CustomTooltip title="Delete Deal" placement="top">
                            <CustomIconButton
                              size="small"
                              sx={{
                                width: 33,
                                height: 33,
                                borderRadius: 999,
                                border: '1px solid #fca5a5',
                                backgroundColor: '#fff1f2',
                                '&:hover': {
                                  backgroundColor: '#ffe4e6',
                                  borderColor: '#fca5a5',
                                  color: '#ef4444',
                                },
                                '&:focus, &:focus-visible, &.Mui-focusVisible': {
                                  backgroundColor: '#ffe4e6',
                                  borderColor: '#fca5a5',
                                  color: '#ef4444',
                                  boxShadow: 'none',
                                  outline: 'none',
                                },
                              }}
                              onClick={() => {
                                setDealToDeleteId(deal._id);
                                setDeleteError(null);
                              }}
                            >
                              <DeleteOutline sx={{ fontSize: 16, color: '#ef4444' }} />
                            </CustomIconButton>
                          </CustomTooltip>
                        </Stack>
                      </Stack>
                    </Box>

                    <Box
                      sx={{
                        display: { xs: 'none', lg: 'grid' },
                        gridTemplateColumns:
                          'minmax(180px, 1.7fr) minmax(170px, 1.4fr) minmax(170px, 1.4fr) minmax(150px, 1.3fr) minmax(150px, 1.2fr) minmax(110px, 0.9fr) minmax(130px, 1fr) minmax(120px, 1fr)',
                        px: 2.5,
                        py: 1.75,
                        gap: 0,
                        alignItems: 'center',
                        borderBottom: index === visibleDeals.length - 1 ? 'none' : `1px solid ${borderColor}`,
                        transition: 'background-color .2s ease',
                        '&:hover': { backgroundColor: '#f8fbff' },
                      }}
                    >
                      <Typography
                        component={Link}
                        to={`/deals/${deal._id}`}
                        sx={{ fontWeight: 700, color: '#0f172a', textDecoration: 'none', '&:hover': { color: primary } }}
                      >
                        {deal.title}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {deal.dealOwner?.name ?? '-'}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {formatContactName(deal.contact)}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {deal.pipeline?.name ?? '-'}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {deal.stage?.name ?? '-'}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: statusTone.color,
                          textTransform: 'capitalize',
                          fontSize: 12,
                          px: 1.2,
                          py: 0.45,
                          borderRadius: 999,
                          border: `1px solid ${statusTone.border}`,
                          backgroundColor: statusTone.bg,
                          display: 'inline-flex',
                          width: 'fit-content',
                        }}
                      >
                        {effectiveStatus}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {formatCloseDate(deal.expectedCloseDate)}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 1,
                          flexWrap: 'nowrap',
                        }}
                      >
                        <CustomTooltip title={canMarkWon ? 'Mark as Won' : 'Already marked as won'} placement="top">
                          <span>
                            <CustomIconButton
                              size="small"
                              disabled={!canMarkWon}
                              sx={{
                                width: 33,
                                height: 33,
                                borderRadius: 999,
                                border: '1px solid #22c55e',
                                backgroundColor: '#f0fdf4',
                                '&:hover': { backgroundColor: '#dcfce7' },
                              }}
                              onClick={() => handleOpenWonConfirm(deal._id, effectiveStatus)}
                            >
                              <CheckCircleOutlined sx={{ fontSize: 16, color: '#16a34a' }} />
                            </CustomIconButton>
                          </span>
                        </CustomTooltip>
                        <CustomTooltip title={canMarkLost ? 'Mark as Lost' : 'Already marked as lost'} placement="top">
                          <span>
                            <CustomIconButton
                              size="small"
                              disabled={!canMarkLost}
                              sx={{
                                width: 33,
                                height: 33,
                                borderRadius: 999,
                                border: '1px solid #f87171',
                                backgroundColor: '#fef2f2',
                                '&:hover': { backgroundColor: '#fee2e2' },
                              }}
                              onClick={() => {
                                if (!canMarkLost) return;
                                setLostDealId(deal._id);
                                setLostReason(effectiveLostReason);
                                setLostReasonError(null);
                              }}
                            >
                              <CancelOutlined sx={{ fontSize: 16, color: '#ef4444' }} />
                            </CustomIconButton>
                          </span>
                        </CustomTooltip>
                        <CustomTooltip title="Edit Deal" placement="top">
                          <CustomIconButton
                            size="small"
                            sx={{
                              width: 33,
                              height: 33,
                              borderRadius: 999,
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#f8fafc',
                              '&:hover': { backgroundColor: '#f1f5f9' },
                            }}
                            onClick={() => {
                              setEditingDeal({
                                dealId: deal._id,
                                pipelineId: deal.pipeline?._id ?? '',
                                stageId: deal.stage?._id ?? '',
                                title: deal.title,
                                amount: deal.amount,
                                contactId: deal.contact?._id ?? '',
                                expectedCloseDate: deal.expectedCloseDate,
                                contactName: formatContactName(deal.contact),
                                contactPhotoUrl: null,
                              });
                              setIsAddDealOpen(true);
                            }}
                          >
                            <EditOutlined sx={{ fontSize: 16, color: '#64748b' }} />
                          </CustomIconButton>
                        </CustomTooltip>
                        <CustomTooltip title="Delete Deal" placement="top">
                          <CustomIconButton
                            size="small"
                            sx={{
                              width: 33,
                              height: 33,
                              borderRadius: 999,
                              border: '1px solid #fca5a5',
                              backgroundColor: '#fff1f2',
                              '&:hover': {
                                backgroundColor: '#ffe4e6',
                                borderColor: '#fca5a5',
                                color: '#ef4444',
                              },
                              '&:focus, &:focus-visible, &.Mui-focusVisible': {
                                backgroundColor: '#ffe4e6',
                                borderColor: '#fca5a5',
                                color: '#ef4444',
                                boxShadow: 'none',
                                outline: 'none',
                              },
                            }}
                            onClick={() => {
                              setDealToDeleteId(deal._id);
                              setDeleteError(null);
                            }}
                          >
                            <DeleteOutline sx={{ fontSize: 16, color: '#ef4444' }} />
                          </CustomIconButton>
                        </CustomTooltip>
                      </Box>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        {!loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 1.25, sm: 2 },
              borderTop: `1px solid ${borderColor}`,
              backgroundColor: 'white',
              flexWrap: 'nowrap',
              overflowX: 'auto',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
              <Typography sx={{ color: mutedText, fontSize: 13, display: { xs: 'none', sm: 'block' } }}>
                Rows per page
              </Typography>
              <Select
                size="small"
                value={String(limit)}
                onChange={(event) => setLimit(Number(event.target.value))}
                sx={{
                  minWidth: 84,
                  height: 32,
                  borderRadius: 999,
                  '& .MuiSelect-select': {
                    py: 0.5,
                    px: 1.25,
                  },
                }}
              >
                {PAGE_LIMIT_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
              sx={{ ml: 'auto', flexShrink: 0 }}
            >
              <Typography sx={{ color: mutedText, fontSize: 13 }}>
                {visibleTotalDeals === 0 ? '0 results' : `${pageStart}-${pageEnd} of ${visibleTotalDeals}`}
              </Typography>
              <Pagination
                page={page}
                count={totalPages}
                onChange={(_, value) => {
                  if (value !== page) {
                    setPage(value);
                  }
                }}
                disabled={totalPages <= 1}
                shape="rounded"
                size="small"
                color="primary"
                siblingCount={0}
                boundaryCount={1}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 999,
                  },
                }}
              />
            </Stack>
          </Box>
        ) : null}
      </Box>

      <AddDealModal
        open={isAddDealOpen}
        onClose={() => {
          setIsAddDealOpen(false);
          setEditingDeal(null);
        }}
        onSave={() => {
          setIsAddDealOpen(false);
          setEditingDeal(null);
        }}
        initialDeal={editingDeal}
      />

      <MarkLostDealModal
        open={Boolean(lostDealId)}
        lostReason={lostReason}
        onLostReasonChange={setLostReason}
        onClose={() => {
          setLostDealId(null);
          setLostReason('');
          setLostReasonError(null);
        }}
        onSubmit={handleConfirmLost}
        submitDisabled={markingDealLost}
        errorMessage={lostReasonError ?? markDealLostErrorMessage}
      />

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

      <ConfirmationAlertModal
        open={Boolean(dealToDeleteId)}
        variant="delete"
        title="Delete deal?"
        message={
          deleteError
          ?? deleteDealErrorMessage
          ?? 'This action cannot be undone. Do you want to continue?'
        }
        confirmText="Delete"
        cancelText="Cancel"
        isConfirmLoading={deletingDeal}
        onClose={() => {
          setDealToDeleteId(null);
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <PipelineModal
        open={isAddPipelineOpen}
        mode={pipelineModalMode}
        onClose={() => {
          setIsAddPipelineOpen(false);
        }}
        onCreateSuccess={(pipeline) =>
          dispatch(addPipelineOption({ _id: pipeline.id, name: pipeline.name }))
        }
      />
    </Box>
  );
};

export default DealsPage;
