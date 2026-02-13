import { CustomIconButton  } from '../common/CustomIconButton';
import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import {
  CancelOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import BasicInput from '../common/BasicInput';
import BasicSelect from '../common/BasicSelect';
import CustomModal from '../common/CustomModal';
import CustomTooltip from '../common/CustomTooltip';
import AddDealModal from '../components/deals/modals/AddDealModal';
import { deals as seedDeals } from '../data/deals';
import { pipelines as seedPipelines } from '../data/pipelines';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const primary = '#6d28ff';
const bgSoft = '#f8fbff';

const statusStyles: Record<string, { color: string; background: string }> = {
  'In Progress': { color: primary, background: '#efe9ff' },
  Won: { color: '#16a34a', background: '#dcfce7' },
  Lost: { color: '#ef4444', background: '#fee2e2' },
};

const DealsPage = () => {
  const [sortBy, setSortBy] = useState('date-created');
  const [dealList, setDealList] = useState(seedDeals);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<null | (typeof seedDeals)[number]>(
    null,
  );
  const [lostDeal, setLostDeal] = useState<null | (typeof seedDeals)[number]>(null);
  const [lostReason, setLostReason] = useState('');
  const [celebrationDealId, setCelebrationDealId] = useState<number | null>(null);
  const [pipelines, setPipelines] = useState(seedPipelines);
  const [selectedPipelineId, setSelectedPipelineId] = useState('all');
  const [isAddPipelineOpen, setIsAddPipelineOpen] = useState(false);
  const [pipelineName, setPipelineName] = useState('');
  const [stageDrafts, setStageDrafts] = useState([
    { id: 'stage-1', name: 'Lead', color: '#2563eb' },
    { id: 'stage-2', name: 'Qualified', color: '#0f766e' },
    { id: 'stage-3', name: 'Proposal', color: '#7c3aed' },
  ]);

  const pipelineOptions = useMemo(
    () => [
      { label: 'All pipelines', value: 'all' },
      ...pipelines.map((pipeline) => ({
        label: pipeline.name,
        value: pipeline.id,
      })),
    ],
    [pipelines],
  );
  const sortOptions = [
    { label: 'Sort by: Date Created', value: 'date-created' },
    { label: 'Sort by: Appointment Date', value: 'appointment' },
    { label: 'Sort by: Price', value: 'price' },
  ];

  const pipelineMap = useMemo(
    () =>
      new Map(
        pipelines.map((pipeline) => [
          pipeline.id,
          {
            name: pipeline.name,
            stages: new Map(pipeline.stages.map((stage) => [stage.id, stage])),
          },
        ]),
      ),
    [pipelines],
  );

  const filteredDeals = useMemo(() => {
    if (selectedPipelineId === 'all') return dealList;
    return dealList.filter((deal) => deal.pipelineId === selectedPipelineId);
  }, [selectedPipelineId, dealList]);

  const totalDeals = dealList.length;

  const stagePalette = [
    '#2563eb',
    '#0f766e',
    '#7c3aed',
    '#b45309',
    '#15803d',
    '#ef4444',
  ];

  const getStageBackground = (hex: string) => {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    if (Number.isNaN(bigint)) return '#f1f5f9';
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const mix = (channel: number) => Math.round(channel + (255 - channel) * 0.82);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  };

  const getStageIdForStatus = (pipelineId: string, status: 'Won' | 'Lost') => {
    const pipeline = pipelines.find((item) => item.id === pipelineId);
    if (!pipeline) return null;
    const target = pipeline.stages.find((stage) =>
      status === 'Won'
        ? stage.id === 'won' || stage.name.toLowerCase().includes('won')
        : stage.id === 'lost' || stage.name.toLowerCase().includes('lost'),
    );
    return target?.id ?? null;
  };

  const handleMarkWon = (dealId: number) => {
    setDealList((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;
        const stageId = getStageIdForStatus(deal.pipelineId, 'Won');
        return {
          ...deal,
          status: 'Won',
          stageId: stageId ?? deal.stageId,
          lostReason: undefined,
        };
      }),
    );
    setCelebrationDealId(dealId);
    window.setTimeout(() => setCelebrationDealId(null), 1800);
  };

  const handleConfirmLost = () => {
    if (!lostDeal) return;
    const reason = lostReason.trim();
    setDealList((prev) =>
      prev.map((deal) => {
        if (deal.id !== lostDeal.id) return deal;
        const stageId = getStageIdForStatus(deal.pipelineId, 'Lost');
        return {
          ...deal,
          status: 'Lost',
          stageId: stageId ?? deal.stageId,
          lostReason: reason || 'No reason provided',
        };
      }),
    );
    setLostDeal(null);
    setLostReason('');
  };

  const handleCreatePipeline = () => {
    const trimmedName = pipelineName.trim();
    const stages = stageDrafts
      .map((stage) => ({
        name: stage.name.trim(),
        color: stage.color,
      }))
      .filter((stage) => stage.name);

    if (!trimmedName || stages.length === 0) {
      return;
    }

    const newPipelineId = `pipeline-${Date.now()}`;
    const newPipeline = {
      id: newPipelineId,
      name: trimmedName,
      stages: stages.map((stage, index) => ({
        id: `${newPipelineId}-${stage.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: stage.name,
        color: stage.color || stagePalette[index % stagePalette.length],
        background: getStageBackground(stage.color || stagePalette[index % stagePalette.length]),
      })),
    };

    setPipelines((prev) => [...prev, newPipeline]);
    setPipelineName('');
    setStageDrafts([
      { id: 'stage-1', name: 'Lead', color: '#2563eb' },
      { id: 'stage-2', name: 'Qualified', color: '#0f766e' },
      { id: 'stage-3', name: 'Proposal', color: '#7c3aed' },
    ]);
    setIsAddPipelineOpen(false);
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
        title="Deals"
        subtitle="Track active opportunities"
        action={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Box sx={{ minWidth: { xs: '100%', sm: 210 } }}>
              <BasicSelect
                options={pipelineOptions}
                mapping={{ label: 'label', value: 'value' }}
                value={selectedPipelineId}
                onChange={(event) => setSelectedPipelineId(event.target.value as string)}
              />
            </Box>
            <Box sx={{ minWidth: { xs: '100%', sm: 170 } }}>
              <BasicSelect
                options={sortOptions}
                mapping={{ label: 'label', value: 'value' }}
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as string)}
              />
            </Box>
            <CustomButton
              variant="contained"
              sx={{
                height: 36,
                borderRadius: 999,
                px: 2,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={() => setIsAddPipelineOpen(true)}
            >
              Create Pipeline
            </CustomButton>
            <CustomButton
              variant="contained"
              sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
              onClick={() => setIsAddDealOpen(true)}
            >
              Add Deal
            </CustomButton>
          </Stack>
        }
      />

      <Box
        sx={{
          width: '100%',
          borderRadius: 3,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
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
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🎉 Deal marked as won
          </Box>
        ) : null}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{
            px: { xs: 1.5, sm: 2.5 },
            py: 2,
            gap: 1.5,
            borderBottom: `1px solid ${borderColor}`,
            backgroundColor: bgSoft,
          }}
        >
          <Typography sx={{ fontWeight: 600, color: '#111827' }}>
            Total: {totalDeals} deals
          </Typography>
        </Stack>

        <Box sx={{ overflowX: { xs: 'visible', md: 'hidden' } }}>
          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns:
                'minmax(240px, 2.2fr) minmax(110px, 0.8fr) minmax(160px, 1.1fr) minmax(110px, 0.8fr) minmax(130px, 0.9fr) minmax(120px, 0.9fr) minmax(110px, 0.8fr)',
              px: 2.5,
              py: 1.5,
              color: mutedText,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            <Box>Name</Box>
            <Box>Pipeline</Box>
            <Box>Area</Box>
            <Box>Appointment Date</Box>
            <Box>Price</Box>
            <Box>Stage</Box>
            <Box textAlign="center">Actions</Box>
          </Box>

          <Box
            sx={{
              maxHeight: { xs: 'none', md: '50vh' },
              overflowY: { xs: 'visible', md: 'auto' },
            }}
          >
            {filteredDeals.map((deal, index) => {
            const pipeline = pipelineMap.get(deal.pipelineId);
            const stage = pipeline?.stages.get(deal.stageId);
            return (
              <Box
                key={`${deal.id}-${index}`}
                sx={{
                  display: { xs: 'flex', md: 'grid' },
                  flexDirection: { xs: 'column', md: 'unset' },
                  gridTemplateColumns:
                    'minmax(240px, 2.2fr) minmax(110px, 0.8fr) minmax(160px, 1.1fr) minmax(110px, 0.8fr) minmax(130px, 0.9fr) minmax(120px, 0.9fr) minmax(110px, 0.8fr)',
                  px: { xs: 1.5, sm: 2.5 },
                  py: { xs: 1.5, sm: 1.75 },
                  gap: { xs: 1.25, sm: 0 },
                  alignItems: { md: 'center' },
                  borderBottom:
                    index === filteredDeals.length - 1
                      ? 'none'
                      : `1px solid ${borderColor}`,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#eef2ff',
                      color: primary,
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {deal.avatar}
                  </Avatar>
                  <Box>
                    <Typography
                      component={Link}
                      to={`/deals/${deal.id}`}
                      sx={{
                        fontWeight: 600,
                        color: '#1f2937',
                        textDecoration: 'none',
                        marginRight: '8px',
                        '&:hover': { color: primary },
                      }}
                    >
                      {deal.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: mutedText }}>
                      {deal.location}
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    display: { xs: 'flex', md: 'block' },
                    justifyContent: { xs: 'space-between', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', md: 'none' } }}
                  >
                    Pipeline
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.4,
                      py: 0.35,
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#1f2937',
                      backgroundColor: '#f1f5f9',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {pipeline?.name ?? 'Pipeline'}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'flex', md: 'block' },
                    justifyContent: { xs: 'space-between', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', md: 'none' } }}
                  >
                    Area
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {deal.area}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'flex', md: 'block' },
                    justifyContent: { xs: 'space-between', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', md: 'none' } }}
                  >
                    Appointment Date
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {deal.appointment}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'flex', md: 'block' },
                    justifyContent: { xs: 'space-between', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', md: 'none' } }}
                  >
                    Price
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#1f2937' }}>
                    {deal.price}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'flex', md: 'block' },
                    justifyContent: { xs: 'space-between', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', md: 'none' } }}
                  >
                    Stage
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 1.5,
                      py: 0.4,
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: stage?.color ?? statusStyles[deal.status].color,
                      backgroundColor:
                        stage?.background ?? statusStyles[deal.status].background,
                    }}
                  >
                    {stage?.name ?? deal.status}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-end', md: 'center' },
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 1,
                    flexWrap: 'nowrap',
                  }}
                >
                  <CustomTooltip title="Mark as Won" placement="top">
                    <CustomIconButton
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        border: `1px solid #16a34a`,
                        color: '#16a34a',
                        backgroundColor: 'white',
                        '&:hover': {
                          border: `1px solid #16a34a`,
                        },
                      }}
                      onClick={() => handleMarkWon(deal.id)}
                    >
                      <CheckCircleOutlined sx={{ fontSize: 16, color: '#16a34a' }} />
                    </CustomIconButton>
                  </CustomTooltip>
                  <CustomTooltip title="Mark as Lost" placement="top">
                    <CustomIconButton
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        border: `1px solid #ef4444`,
                        color: '#ef4444',
                        backgroundColor: 'white',
                        '&:hover': {
                          border: `1px solid #ef4444`,
                        },
                      }}
                      onClick={() => {
                        setLostDeal(deal);
                        setLostReason(deal.lostReason ?? '');
                      }}
                    >
                      <CancelOutlined sx={{ fontSize: 16, color: '#ef4444' }} />
                    </CustomIconButton>
                  </CustomTooltip>
                  <CustomTooltip title="Edit Deal" placement="top">
                    <CustomIconButton
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        border: `1px solid #64748b`,
                        color: '#64748b',
                        backgroundColor: 'white',
                        '&:hover': {
                          border: `1px solid #64748b`,
                        },
                      }}
                      onClick={() => setEditingDeal(deal)}
                    >
                      <EditOutlined sx={{ fontSize: 16, color: '#64748b' }} />
                    </CustomIconButton>
                  </CustomTooltip>
                </Box>
              </Box>
            );
          })}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
          <CustomButton
            variant="outlined"
            customColor="#94a3b8"
            sx={{ borderRadius: 999, px: 3, textTransform: 'none' }}
          >
            Load More
          </CustomButton>
        </Box>
      </Box>

      <CustomModal
        open={Boolean(lostDeal)}
        handleClose={() => {
          setLostDeal(null);
          setLostReason('');
        }}
        handleSubmit={handleConfirmLost}
        title="Mark Deal as Lost"
        description="Tell us why this deal was lost."
        submitButtonText="Save Reason"
      >
        <Stack spacing={1.5}>
          <BasicInput
            fullWidth
            multiline
            minRows={3}
            height="auto"
            placeholder="Lost reason"
            value={lostReason}
            onChange={(event) => setLostReason(event.target.value)}
            sx={{ alignItems: 'flex-start', py: 1 }}
          />
        </Stack>
      </CustomModal>

      <AddDealModal
        open={isAddDealOpen || Boolean(editingDeal)}
        onClose={() => {
          setIsAddDealOpen(false);
          setEditingDeal(null);
        }}
        initialDeal={editingDeal}
        onSave={(payload) => {
          if (editingDeal) {
            setDealList((prev) =>
              prev.map((deal) =>
                deal.id === editingDeal.id
                  ? {
                      ...deal,
                      name: payload.name,
                      location: payload.location,
                      area: payload.area,
                      appointment: payload.appointment,
                      price: payload.price,
                      roomArea: payload.roomArea,
                      people: payload.people,
                      roomAccess: payload.roomAccess,
                      instructions: payload.instructions,
                      pipelineId: payload.pipelineId,
                      stageId: payload.stageId,
                    }
                  : deal,
              ),
            );
            setEditingDeal(null);
          } else {
            const initials = payload.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            setDealList((prev) => [
              ...prev,
              {
                id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                name: payload.name,
                location: payload.location,
                area: payload.area,
                appointment: payload.appointment,
                price: payload.price,
                status: 'In Progress',
                pipelineId: payload.pipelineId,
                stageId: payload.stageId,
                avatar: initials || 'DL',
                customer: 'New Contact',
                email: 'new@client.com',
                phone: '000-000-0000',
                address: '',
                progress: 'In Progress',
                roomArea: payload.roomArea,
                people: payload.people,
                roomAccess: payload.roomAccess,
                instructions: payload.instructions,
                activity: [],
              },
            ]);
            setIsAddDealOpen(false);
          }
        }}
        pipelines={pipelines}
      />
      <CustomModal
        open={isAddPipelineOpen}
        handleClose={() => setIsAddPipelineOpen(false)}
        handleSubmit={handleCreatePipeline}
        title="Create Pipeline"
        description="Add a pipeline and define its stages."
        submitButtonText="Create"
      >
        <Stack spacing={1.5}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              Pipeline Name
            </Typography>
            <BasicInput
              fullWidth
              placeholder="Example: Enterprise Sales"
              value={pipelineName}
              onChange={(event) => setPipelineName(event.target.value)}
            />
          </Box>
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              Stages & Colors
            </Typography>
            <Box
              sx={{
                maxHeight: { xs: 220, sm: 260 },
                overflowY: 'auto',
                pr: 0.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {stageDrafts.map((stage) => (
                <Box
                  key={stage.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr auto', sm: '1.4fr 0.8fr' },
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <BasicInput
                    fullWidth
                    placeholder="Stage name"
                    value={stage.name}
                    onChange={(event) =>
                      setStageDrafts((prev) =>
                        prev.map((item) =>
                          item.id === stage.id ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flexWrap: 'nowrap',
                    }}
                  >
                    <Box
                      component="input"
                      type="color"
                      value={stage.color}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setStageDrafts((prev) =>
                          prev.map((item) =>
                            item.id === stage.id ? { ...item, color: event.target.value } : item,
                          ),
                        )
                      }
                      sx={{
                        width: 42,
                        height: 42,
                        border: 'none',
                        borderRadius: 3,
                        padding: 0,
                        backgroundColor: 'transparent',
                      }}
                    />
                    <CustomButton
                      variant="outlined"
                      customColor="#ef4444"
                      sx={{ borderRadius: 999, px: 1.75, textTransform: 'none' }}
                      onClick={() =>
                        setStageDrafts((prev) => prev.filter((item) => item.id !== stage.id))
                      }
                      disabled={stageDrafts.length <= 1}
                    >
                      Remove
                    </CustomButton>
                  </Box>
                </Box>
              ))}
            </Box>
            <CustomButton
              variant="outlined"
              customColor="#94a3b8"
              sx={{ borderRadius: 999, px: 2.5, textTransform: 'none', alignSelf: 'flex-start' }}
              onClick={() =>
                setStageDrafts((prev) => [
                  ...prev,
                  {
                    id: `stage-${Date.now()}`,
                    name: '',
                    color: stagePalette[prev.length % stagePalette.length],
                  },
                ])
              }
            >
              Add Stage
            </CustomButton>
          </Stack>
        </Stack>
      </CustomModal>
    </Box>
  );
};

export default DealsPage;
