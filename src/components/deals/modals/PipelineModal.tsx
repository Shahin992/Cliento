import type React from 'react';
import { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import BasicInput from '../../../common/BasicInput';
import { CustomButton } from '../../../common/CustomButton';
import CustomModal from '../../../common/CustomModal';
import type { Pipeline } from '../../../data/pipelines';
import { validateCreatePipelinePayload } from './createPipelineValidation';
import {
  useCreatePipelineMutation,
  useUpdatePipelineMutation,
  type UpdatePipelinePayload,
} from '../../../hooks/pipelines/usePipelinesMutations';
import type { PipelineStageOption } from '../../../hooks/pipelines/usePipelinesQueries';
import { AppHttpError } from '../../../hooks/useAppQuery';

type StageDraft = {
  _id?: string;
  name: string;
  color: string;
  order: number;
};

type PipelineModalMode = 'create' | 'edit';

type PipelineModalProps = {
  open: boolean;
  mode: PipelineModalMode;
  onClose: () => void;
  onCreateSuccess?: (pipeline: Pipeline) => void;
  onUpdateSuccess?: () => void;
  editPipeline?: {
    id: string;
    name: string;
    isDefault?: boolean;
    stages?: PipelineStageOption[];
  } | null;
};

type PipelineModalContentProps = Omit<PipelineModalProps, 'open'>;

const DEFAULT_STAGE_DRAFTS: StageDraft[] = [
  { name: 'Lead', color: '#2563eb', order: 0 },
  { name: 'Qualified', color: '#0f766e', order: 1 },
  { name: 'Proposal', color: '#7c3aed', order: 2 },
];

const getInitialStageDrafts = (
  isEdit: boolean,
  editPipeline: PipelineModalProps['editPipeline'],
  stagePalette: string[],
): StageDraft[] => {
  if (isEdit && editPipeline) {
    const normalizedStages = (editPipeline.stages ?? []).map((stage, index) => ({
      _id: stage._id,
      name: stage.name ?? '',
      color: stage.color?.trim() || stagePalette[index % stagePalette.length],
      order: typeof stage.order === 'number' ? stage.order : index,
    }));

    return normalizedStages.length ? normalizedStages : [{ name: 'Lead', color: '#2563eb', order: 0 }];
  }

  return DEFAULT_STAGE_DRAFTS;
};

const PipelineModalContent = ({
  mode,
  onClose,
  onCreateSuccess,
  onUpdateSuccess,
  editPipeline = null,
}: PipelineModalContentProps) => {
  const isEdit = mode === 'edit';
  const { createPipeline, loading: isCreatingPipeline } = useCreatePipelineMutation();
  const { updatePipeline, loading: isUpdatingPipeline } = useUpdatePipelineMutation();
  const stagePalette = useMemo(
    () => ['#2563eb', '#0f766e', '#7c3aed', '#b45309', '#15803d', '#ef4444'],
    [],
  );
  const [pipelineName, setPipelineName] = useState(() => (isEdit ? editPipeline?.name ?? '' : ''));
  const [stageDrafts, setStageDrafts] = useState<StageDraft[]>(() =>
    getInitialStageDrafts(isEdit, editPipeline, stagePalette),
  );
  const [pipelineValidationError, setPipelineValidationError] = useState<string | null>(null);

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

  const isSubmitDisabled =
    isEdit
      ? isUpdatingPipeline || !pipelineName.trim() || !stageDrafts.length
      : isCreatingPipeline ||
        !pipelineName.trim() ||
        stageDrafts.length > 30 ||
        stageDrafts.some((stage) => !stage.name.trim());

  const validateUpdateStages = (drafts: StageDraft[]) => {
    if (!drafts.length) {
      return { success: false as const, message: 'At least one stage is required.' };
    }

    const seenNames = new Set<string>();
    const seenOrders = new Set<number>();

    for (let index = 0; index < drafts.length; index += 1) {
      const stage = drafts[index];
      const stagePosition = index + 1;
      const trimmedName = stage.name.trim();

      if (!trimmedName.length) {
        return { success: false as const, message: `Stage ${stagePosition} name is required.` };
      }

      const normalizedName = trimmedName.toLowerCase();
      if (seenNames.has(normalizedName)) {
        return {
          success: false as const,
          message: 'Stage names must be unique (case-insensitive).',
        };
      }
      seenNames.add(normalizedName);

      if (seenOrders.has(stage.order)) {
        return { success: false as const, message: 'Stage orders must be unique.' };
      }
      seenOrders.add(stage.order);
    }

    return { success: true as const };
  };

  const handleSubmit = async () => {
    if (isEdit) {
      const pipelineId = editPipeline?.id?.trim();
      if (!pipelineId) {
        setPipelineValidationError('Missing pipeline id.');
        return;
      }

      const trimmedName = pipelineName.trim();
      if (!trimmedName.length) {
        setPipelineValidationError('Pipeline name is required.');
        return;
      }

      const normalizedStages = stageDrafts.map((stage, index) => ({
        ...stage,
        order: index,
      }));

      const stageValidation = validateUpdateStages(normalizedStages);
      if (!stageValidation.success) {
        setPipelineValidationError(stageValidation.message);
        return;
      }

      const payload: UpdatePipelinePayload = {
        name: trimmedName,
        stages: normalizedStages.map((stage) => ({
          ...(stage._id ? { _id: stage._id } : {}),
          name: stage.name.trim(),
          color: stage.color.trim() || null,
          order: stage.order,
        })),
      };

      try {
        await updatePipeline(pipelineId, payload);
        onUpdateSuccess?.();
        onClose();
      } catch (error) {
        setPipelineValidationError(
          error instanceof AppHttpError
            ? error.message
            : 'Failed to update pipeline. Please try again.',
        );
      }
      return;
    }

    const validation = validateCreatePipelinePayload({
      name: pipelineName,
      stages: stageDrafts.map((stage) => ({
        name: stage.name,
        color: stage.color,
      })),
    });

    if (!validation.success) {
      setPipelineValidationError(validation.message);
      return;
    }
    setPipelineValidationError(null);

    try {
      const createdPipeline = await createPipeline(validation.payload);
      const newPipeline: Pipeline = {
        id: createdPipeline._id,
        name: createdPipeline.name,
        stages: createdPipeline.stages.map((stage, index) => {
          const color = stage.color || stagePalette[index % stagePalette.length];
          return {
            id: stage._id,
            name: stage.name,
            color,
            background: getStageBackground(color),
          };
        }),
      };
      onCreateSuccess?.(newPipeline);
      onClose();
    } catch (error) {
      setPipelineValidationError(
        error instanceof AppHttpError
          ? error.message
          : 'Failed to create pipeline. Please try again.',
      );
    }
  };

  return (
    <CustomModal
      open
      handleClose={onClose}
      handleSubmit={handleSubmit}
      submitDisabled={isSubmitDisabled}
      maxWidth={680}
      title={isEdit ? 'Edit Pipeline' : 'Create Pipeline'}
      description={
        isEdit ? 'Update pipeline details and stage list.' : 'Add a pipeline and define its stages.'
      }
      submitButtonText={isEdit ? 'Save Changes' : 'Create'}
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
            onChange={(event) => {
              if (pipelineValidationError) setPipelineValidationError(null);
              setPipelineName(event.target.value);
            }}
          />
        </Box>

        <Stack spacing={1}>
          <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Stages & Colors</Typography>
          <Box
            sx={{
              maxHeight: { xs: 220, sm: 300 },
              overflowY: 'auto',
              pr: 0.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {stageDrafts.map((stage, stageIndex) => (
              <Box
                key={`${stage._id ?? 'new'}-${stageIndex}`}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' },
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <BasicInput
                  fullWidth
                  placeholder="Stage name"
                  value={stage.name}
                  onChange={(event) => {
                    if (pipelineValidationError) setPipelineValidationError(null);
                    setStageDrafts((prev) =>
                      prev.map((item, index) =>
                        index === stageIndex ? { ...item, name: event.target.value } : item,
                      ),
                    );
                  }}
                />

                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                  <Box
                    component="input"
                    type="color"
                    value={stage.color}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (pipelineValidationError) setPipelineValidationError(null);
                      setStageDrafts((prev) =>
                        prev.map((item, index) =>
                          index === stageIndex ? { ...item, color: event.target.value } : item,
                        ),
                      );
                    }}
                    sx={{
                      width: 40,
                      height: 40,
                      border: 'none',
                      borderRadius: 3,
                      padding: 0,
                      backgroundColor: 'transparent',
                      flexShrink: 0,
                    }}
                  />
                  <CustomButton
                    variant="outlined"
                    customColor="#ef4444"
                    sx={{ borderRadius: 999, px: 1.5, textTransform: 'none' }}
                    onClick={() => {
                      if (pipelineValidationError) setPipelineValidationError(null);
                      setStageDrafts((prev) => prev.filter((_, index) => index !== stageIndex));
                    }}
                    disabled={stageDrafts.length <= 1}
                  >
                    Remove
                  </CustomButton>
                </Stack>
              </Box>
            ))}
          </Box>

          <CustomButton
            variant="outlined"
            customColor="#94a3b8"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none', alignSelf: 'flex-start' }}
            onClick={() => {
              if (pipelineValidationError) setPipelineValidationError(null);
              setStageDrafts((prev) => [
                ...prev,
                {
                  name: '',
                  color: stagePalette[prev.length % stagePalette.length],
                  order: prev.length,
                },
              ]);
            }}
            disabled={stageDrafts.length >= 30}
          >
            Add Stage
          </CustomButton>
        </Stack>

        {pipelineValidationError ? (
          <Typography sx={{ color: '#dc2626', fontSize: 13, fontWeight: 600 }}>
            {pipelineValidationError}
          </Typography>
        ) : null}
      </Stack>
    </CustomModal>
  );
};

const PipelineModal = ({
  open,
  mode,
  onClose,
  onCreateSuccess,
  onUpdateSuccess,
  editPipeline = null,
}: PipelineModalProps) => {
  if (!open) {
    return null;
  }

  const modalKey = mode === 'edit' ? `edit-${editPipeline?.id ?? 'pipeline'}` : 'create-pipeline';

  return (
    <PipelineModalContent
      key={modalKey}
      mode={mode}
      onClose={onClose}
      onCreateSuccess={onCreateSuccess}
      onUpdateSuccess={onUpdateSuccess}
      editPipeline={editPipeline}
    />
  );
};

export default PipelineModal;
