import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Modal,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AltRouteOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  SearchOutlined,
  StarOutline,
} from '@mui/icons-material';

import PageHeader from '../components/PageHeader';
import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';
import { CustomIconButton } from '../common/CustomIconButton';
import { useToast } from '../common/ToastProvider';
import {
  type PipelineListItem,
  usePipelinesOptionsQuery,
  usePipelinesQuery,
} from '../hooks/pipelines/usePipelinesQueries';
import {
  useDeletePipelineMutation,
} from '../hooks/pipelines/usePipelinesMutations';
import PipelineModal from '../components/deals/modals/PipelineModal';

const borderColor = '#dbe4f0';
const mutedText = '#64748b';
const primary = '#2563eb';
const bgSoft = 'linear-gradient(180deg, #f6f9ff 0%, #ffffff 50%, #f8fbff 100%)';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_LIMIT_OPTIONS = [10, 25, 50, 100];



const cardSx = {
  borderRadius: 3,
  border: `1px solid ${borderColor}`,
  backgroundColor: 'white',
};

const PipelineRowSkeleton = () => (
  <Box
    sx={{
      ...cardSx,
      p: { xs: 1.25, sm: 1.5 },
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    }}
  >
    <Skeleton variant="text" width={180} height={28} />
    <Skeleton variant="text" width={220} height={22} />
    <Stack direction="row" spacing={0.75}>
      <Skeleton variant="rounded" width={80} height={24} />
      <Skeleton variant="rounded" width={80} height={24} />
    </Stack>
    <Stack direction="row" spacing={0.75}>
      <Skeleton variant="circular" width={34} height={34} />
      <Skeleton variant="circular" width={34} height={34} />
    </Stack>
  </Box>
);

const MetricCard = ({
  title,
  value,
  tone,
}: {
  title: string;
  value: number;
  tone: 'blue' | 'green' | 'orange';
}) => {
  const palette = {
    blue: { bg: '#eef4ff', text: '#1d4ed8', border: '#bfd3ff' },
    green: { bg: '#ecfdf3', text: '#047857', border: '#b7e9d1' },
    orange: { bg: '#fff7ed', text: '#c2410c', border: '#ffd3ad' },
  }[tone];

  return (
    <Box
      sx={{
        borderRadius: 2.5,
        border: `1px solid ${palette.border}`,
        backgroundColor: palette.bg,
        px: 1.5,
        py: 1.1,
        flex: { xs: 'unset', sm: 1 },
        minWidth: 0,
      }}
    >
      <Typography sx={{ color: mutedText, fontSize: 12, fontWeight: 700 }}>{title}</Typography>
      <Typography sx={{ color: palette.text, fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>
        {value}
      </Typography>
    </Box>
  );
};

const PipelinesManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [isCreatePipelineOpen, setIsCreatePipelineOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<PipelineListItem | null>(null);
  const [pipelineToDelete, setPipelineToDelete] = useState<PipelineListItem | null>(null);
  const [deleteDealAction, setDeleteDealAction] = useState<'move' | 'delete' | ''>('');
  const [targetPipelineId, setTargetPipelineId] = useState('');
  const [deleteValidationError, setDeleteValidationError] = useState<string | null>(null);

  const { showToast } = useToast();
  const { deletePipeline, loading: isDeletingPipeline } = useDeletePipelineMutation();
  const { pipelines: allPipelines } = usePipelinesOptionsQuery(Boolean(pipelineToDelete));

  const { pipelines, pagination, loading, errorMessage } = usePipelinesQuery(
    page,
    limit,
    debouncedSearchQuery || undefined,
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

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
    const serverPage = Math.max(1, Number(pagination?.page) || page);
    if (serverPage !== page) {
      setPage(serverPage);
    }
  }, [pagination?.page, page]);

  const totalPipelines = Math.max(0, Number(pagination?.total) || pipelines.length);
  const totalPages = Math.max(1, Number(pagination?.totalPages) || 1);
  const serverLimit = Math.max(1, Number(pagination?.limit) || limit);
  const pageStart = totalPipelines === 0 ? 0 : (page - 1) * serverLimit + 1;
  const pageEnd =
    totalPipelines === 0
      ? 0
      : Math.min((page - 1) * serverLimit + pipelines.length, totalPipelines);

  const rows = useMemo(() => pipelines, [pipelines]);
  const defaultCount = useMemo(() => rows.filter((item) => item.isDefault).length, [rows]);
  const customCount = Math.max(0, rows.length - defaultCount);
  const availableTargetPipelines = useMemo(() => {
    const selectedId = pipelineToDelete?._id?.trim();
    if (!selectedId) return [];
    return allPipelines.filter((pipeline) => pipeline._id !== selectedId);
  }, [allPipelines, pipelineToDelete?._id]);

  useEffect(() => {
    if (!pipelineToDelete) {
      setDeleteDealAction('');
      setTargetPipelineId('');
      setDeleteValidationError(null);
      return;
    }

    setDeleteDealAction('');
    setTargetPipelineId(availableTargetPipelines[0]?._id ?? '');
    setDeleteValidationError(null);
  }, [pipelineToDelete, availableTargetPipelines]);

  const openEditModal = (pipeline: PipelineListItem) => {
    setEditingPipeline(pipeline);
  };

  const handleConfirmDelete = async () => {
    const pipelineId = pipelineToDelete?._id?.trim();
    if (!pipelineId) {
      setPipelineToDelete(null);
      return;
    }

    if (!deleteDealAction) {
      setDeleteValidationError('Please choose what to do with associated deals: Move or Delete.');
      return;
    }

    if (deleteDealAction === 'move') {
      const normalizedTargetPipelineId = targetPipelineId.trim();
      if (!normalizedTargetPipelineId) {
        setDeleteValidationError('Please select a target pipeline.');
        return;
      }
      if (normalizedTargetPipelineId === pipelineId) {
        setDeleteValidationError('Target pipeline must be different from the pipeline being deleted.');
        return;
      }
    }

    try {
      await deletePipeline(
        pipelineId,
        deleteDealAction === 'move'
          ? { dealAction: 'move', targetPipelineId: targetPipelineId.trim() }
          : { dealAction: 'delete' },
      );
      showToast({ message: 'Pipeline deleted successfully.', severity: 'success' });
      setPipelineToDelete(null);
      setDeleteValidationError(null);
      if (rows.length <= 1 && page > 1) {
        setPage((prev) => Math.max(1, prev - 1));
      }
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to delete pipeline.',
        severity: 'error',
      });
    }
  };

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
        background: bgSoft,
      }}
    >
      <PageHeader
        title="Pipeline Management"
        subtitle="Create, tune, and maintain pipelines with default controls"
        stackOnMobile={false}
        action={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems="center"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <BasicInput
              fullWidth
              placeholder="Search pipelines"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              minWidth={220}
              sx={{
                height: 40,
                borderRadius: 999,
                borderColor: '#c8d6ea',
                minWidth: { sm: 230, md: 280 },
                width: { xs: '100%', sm: 'auto' },
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchOutlined sx={{ color: mutedText, fontSize: 20 }} />
                </InputAdornment>
              }
            />
            <CustomButton
              variant="contained"
              sx={{
                borderRadius: 999,
                px: 2.6,
                textTransform: 'none',
                minWidth: { xs: '100%', sm: 144 },
                whiteSpace: 'nowrap',
                backgroundColor: primary,
                '&:hover': { backgroundColor: '#1d4ed8' },
              }}
              onClick={() => setIsCreatePipelineOpen(true)}
            >
              Add Pipeline
            </CustomButton>
          </Stack>
        }
      />

      <Box sx={{ ...cardSx, p: { xs: 1.25, sm: 1.5 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <MetricCard title="Total Pipelines" value={totalPipelines} tone="blue" />
          <MetricCard title="Default Pipelines" value={defaultCount} tone="green" />
          <MetricCard title="Custom Pipelines" value={customCount} tone="orange" />
        </Stack>
      </Box>

      <Box
        sx={{
          ...cardSx,
          overflow: 'hidden',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <Box sx={{ p: { xs: 1.25, sm: 1.5 }, flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {loading ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
                gap: 1,
              }}
            >
              {Array.from({ length: Math.max(3, Math.min(limit, 8)) }).map((_, index) => (
                <PipelineRowSkeleton key={index} />
              ))}
            </Box>
          ) : null}

          {!loading && errorMessage ? (
            <Box
              sx={{
                ...cardSx,
                p: 2,
                borderColor: '#fecaca',
                backgroundColor: '#fff1f2',
              }}
            >
              <Typography sx={{ color: '#be123c', fontWeight: 700 }}>Could not load pipelines</Typography>
              <Typography sx={{ color: '#be123c', mt: 0.5 }}>{errorMessage}</Typography>
            </Box>
          ) : null}

          {!loading && !errorMessage && rows.length === 0 ? (
            <Box
              sx={{
                ...cardSx,
                px: 2,
                py: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 1,
              }}
            >
              <AltRouteOutlined sx={{ fontSize: 38, color: '#94a3b8' }} />
              <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>No pipelines found</Typography>
              <Typography sx={{ color: mutedText, maxWidth: 420 }}>
                {searchQuery.trim()
                  ? 'Try another search term.'
                  : 'Create your first pipeline to organize deal stages.'}
              </Typography>
              <CustomButton
                variant="contained"
                sx={{ borderRadius: 999, px: 2.25, mt: 1, textTransform: 'none' }}
                onClick={() => setIsCreatePipelineOpen(true)}
              >
                Add Pipeline
              </CustomButton>
            </Box>
          ) : null}

          {!loading && !errorMessage && rows.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
                gap: 1,
              }}
            >
              {rows.map((pipeline) => {
                const stages = pipeline.stages ?? [];

                return (
                  <Box
                    key={pipeline._id}
                    sx={{
                      ...cardSx,
                      p: { xs: 1.25, sm: 1.5 },
                      transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        borderColor: '#c7d7ec',
                        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
                      },
                    }}
                  >
                    <Stack spacing={0.9}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: 18 }}>
                            {pipeline.name}
                          </Typography>
                          <Chip
                            size="small"
                            icon={pipeline.isDefault ? <StarOutline sx={{ fontSize: '14px !important' }} /> : undefined}
                            label={pipeline.isDefault ? 'Default' : 'Custom'}
                            sx={{
                              borderRadius: 999,
                              fontWeight: 700,
                              bgcolor: pipeline.isDefault ? '#ecfdf3' : '#eef2ff',
                              color: pipeline.isDefault ? '#047857' : '#4338ca',
                              '& .MuiChip-icon': {
                                color: '#059669',
                              },
                            }}
                          />
                        </Stack>

                        <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
                          <Tooltip title="Edit Pipeline" placement="top">
                            <CustomIconButton
                              size="small"
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 999,
                                border: `1px solid ${borderColor}`,
                                backgroundColor: '#fff',
                              }}
                              onClick={() => openEditModal(pipeline)}
                            >
                              <EditOutlined sx={{ fontSize: 16, color: '#64748b' }} />
                            </CustomIconButton>
                          </Tooltip>
                          <Tooltip title="Delete Pipeline" placement="top">
                            <CustomIconButton
                              size="small"
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 999,
                                border: '1px solid #fecaca',
                                backgroundColor: '#fff1f2',
                              }}
                              onClick={() => setPipelineToDelete(pipeline)}
                            >
                              <DeleteOutlineOutlined sx={{ fontSize: 16, color: '#ef4444' }} />
                            </CustomIconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={0.7} alignItems="center" flexWrap="wrap">
                        <Chip
                          size="small"
                          label={`${stages.length} ${stages.length === 1 ? 'stage' : 'stages'}`}
                          sx={{
                            borderRadius: 999,
                            fontWeight: 700,
                            bgcolor: '#eef4ff',
                            color: '#1d4ed8',
                          }}
                        />
                      </Stack>

                      {stages.length > 0 ? (
                        <Stack direction="row" spacing={0.6} flexWrap="wrap" sx={{ rowGap: 0.7 }}>
                          {stages.slice(0, 5).map((stage) => (
                            <Chip
                              key={stage._id}
                              size="small"
                              label={stage.name}
                              sx={{
                                borderRadius: 999,
                                bgcolor: '#f8fafc',
                                color: '#334155',
                                border: '1px solid #e2e8f0',
                                fontWeight: 600,
                              }}
                            />
                          ))}
                          {stages.length > 5 ? (
                            <Chip
                              size="small"
                              label={`+${stages.length - 5} more`}
                              sx={{
                                borderRadius: 999,
                                bgcolor: '#eff6ff',
                                color: '#1d4ed8',
                                fontWeight: 700,
                              }}
                            />
                          ) : null}
                        </Stack>
                      ) : null}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          ) : null}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.25, sm: 1.5 },
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
              disabled={loading}
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
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ ml: 'auto', flexShrink: 0 }}>
            {!loading ? (
              <Typography sx={{ color: mutedText, fontSize: 13 }}>
                {totalPipelines === 0 ? '0 results' : `${pageStart}-${pageEnd} of ${totalPipelines}`}
              </Typography>
            ) : null}
            {!loading ? (
              <Pagination
                page={page}
                count={totalPages}
                onChange={(_, value) => {
                  if (value !== page) {
                    setPage(value);
                  }
                }}
                disabled={loading || totalPages <= 1}
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
            ) : null}
          </Stack>
        </Box>
      </Box>

      {isCreatePipelineOpen ? (
        <PipelineModal
          open={isCreatePipelineOpen}
          mode="create"
          onClose={() => setIsCreatePipelineOpen(false)}
          onCreateSuccess={() => {
            showToast({ message: 'Pipeline created successfully.', severity: 'success' });
            setPage(1);
          }}
        />
      ) : null}

      {editingPipeline ? (
        <PipelineModal
          open={Boolean(editingPipeline)}
          mode="edit"
          editPipeline={{
            id: editingPipeline._id,
            name: editingPipeline.name,
            isDefault: editingPipeline.isDefault,
            stages: editingPipeline.stages,
          }}
          onClose={() => setEditingPipeline(null)}
          onUpdateSuccess={() => {
            showToast({ message: 'Pipeline updated successfully.', severity: 'success' });
            setEditingPipeline(null);
          }}
        />
      ) : null}

      {pipelineToDelete ? (
        <Modal open={Boolean(pipelineToDelete)} onClose={() => setPipelineToDelete(null)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '92vw', sm: 460 },
              maxWidth: '92vw',
              p: 2.25,
              borderRadius: 3,
              border: `1px solid ${borderColor}`,
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
              outline: 'none',
            }}
          >
            <Stack spacing={1.3}>
              <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>Delete Pipeline</Typography>
              <Typography sx={{ color: mutedText, fontSize: 13 }}>
                Before deleting, choose what should happen to deals in{' '}
                <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {pipelineToDelete.name}
                </Box>
                .
              </Typography>

              <RadioGroup
                value={deleteDealAction}
                onChange={(event) => {
                  const selected = event.target.value as 'move' | 'delete';
                  setDeleteDealAction(selected);
                  if (selected === 'move' && !targetPipelineId && availableTargetPipelines[0]?._id) {
                    setTargetPipelineId(availableTargetPipelines[0]._id);
                  }
                  setDeleteValidationError(null);
                }}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  px: 1.25,
                  py: 0.75,
                  gap: 0.5,
                }}
              >
                <FormControlLabel
                  value="move"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: 13.5 }}>
                        Move deals to another pipeline
                      </Typography>
                      <Typography sx={{ color: mutedText, fontSize: 12 }}>
                        Recommended. Keeps deals active and organized.
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', m: 0 }}
                />
                <FormControlLabel
                  value="delete"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: 13.5 }}>
                        Remove deals from active list
                      </Typography>
                      <Typography sx={{ color: mutedText, fontSize: 12 }}>
                        This will remove those deals permanently.
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', m: 0 }}
                />
              </RadioGroup>

              {deleteDealAction === 'move' ? (
                <Box>
                  <Typography sx={{ color: mutedText, fontSize: 13, mb: 0.75 }}>
                    Pick the destination pipeline for all current deals.
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.6, fontSize: 13 }}>
                    Target Pipeline
                  </Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={targetPipelineId}
                    onChange={(event) => {
                      setDeleteValidationError(null);
                      setTargetPipelineId(String(event.target.value));
                    }}
                    displayEmpty
                    sx={{ borderRadius: 2 }}
                  >
                    {availableTargetPipelines.length === 0 ? (
                      <MenuItem value="" disabled>
                        No available pipeline to move deals
                      </MenuItem>
                    ) : null}
                    {availableTargetPipelines.map((pipeline) => (
                      <MenuItem key={pipeline._id} value={pipeline._id}>
                        {pipeline.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              ) : null}

              {deleteDealAction === 'delete' ? (
                <Typography sx={{ color: '#b91c1c', fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>
                  Deals in this pipeline will be permanently removed and cannot be restored.
                </Typography>
              ) : null}

              {!deleteDealAction ? (
                <Typography sx={{ color: mutedText, fontSize: 13 }}>
                  Choose one option to continue.
                </Typography>
              ) : null}

              {deleteValidationError ? (
                <Typography sx={{ color: '#dc2626', fontSize: 13, fontWeight: 600 }}>
                  {deleteValidationError}
                </Typography>
              ) : null}

              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <CustomButton
                  variant="text"
                  customColor="#64748b"
                  onClick={() => setPipelineToDelete(null)}
                  sx={{ textTransform: 'none' }}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  variant="contained"
                  customColor="#ef4444"
                  onClick={() => void handleConfirmDelete()}
                  disabled={
                    isDeletingPipeline ||
                    !deleteDealAction ||
                    (deleteDealAction === 'move' && availableTargetPipelines.length === 0)
                  }
                  sx={{ borderRadius: 999, textTransform: 'none', minWidth: 110 }}
                >
                  {isDeletingPipeline ? 'Deleting...' : 'Confirm Delete'}
                </CustomButton>
              </Stack>
            </Stack>
          </Box>
        </Modal>
      ) : null}
    </Box>
  );
};

export default PipelinesManagementPage;
