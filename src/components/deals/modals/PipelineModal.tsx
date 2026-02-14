import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import BasicInput from '../../../common/BasicInput';
import { CustomButton } from '../../../common/CustomButton';
import CustomModal from '../../../common/CustomModal';
import type { Pipeline } from '../../../data/pipelines';
import {
  validateCreatePipelinePayload,
} from './createPipelineValidation';
import { useCreatePipelineMutation } from '../../../hooks/pipelines/usePipelinesMutations';
import { AppHttpError } from '../../../hooks/useAppQuery';

type StageDraft = {
  name: string;
  color: string;
};

type PipelineModalMode = 'create' | 'edit';

type PipelineModalProps = {
  open: boolean;
  mode: PipelineModalMode;
  onClose: () => void;
  onCreateSuccess: (pipeline: Pipeline) => void;
};

const PipelineModal = ({
  open,
  mode,
  onClose,
  onCreateSuccess,
}: PipelineModalProps) => {
  const isEdit = mode === 'edit';
  const { createPipeline, loading: isCreatingPipeline } = useCreatePipelineMutation();
  const [pipelineName, setPipelineName] = useState('');
  const [stageDrafts, setStageDrafts] = useState<StageDraft[]>([
    { name: 'Lead', color: '#2563eb' },
    { name: 'Qualified', color: '#0f766e' },
    { name: 'Proposal', color: '#7c3aed' },
  ]);
  const [pipelineValidationError, setPipelineValidationError] = useState<string | null>(null);

  const stagePalette = useMemo(
    () => ['#2563eb', '#0f766e', '#7c3aed', '#b45309', '#15803d', '#ef4444'],
    [],
  );

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

  const resetForm = () => {
    setPipelineName('');
    setStageDrafts([
      { name: 'Lead', color: '#2563eb' },
      { name: 'Qualified', color: '#0f766e' },
      { name: 'Proposal', color: '#7c3aed' },
    ]);
    setPipelineValidationError(null);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const isSubmitDisabled =
    isCreatingPipeline ||
    !pipelineName.trim() ||
    stageDrafts.length > 30 ||
    stageDrafts.some((stage) => !stage.name.trim());

  const handleSubmit = async () => {
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
      onCreateSuccess(newPipeline);
      onClose();
      resetForm();
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
      open={open}
      handleClose={onClose}
      handleSubmit={handleSubmit}
      submitDisabled={isSubmitDisabled}
      title={isEdit ? 'Edit Pipeline' : 'Create Pipeline'}
      description={isEdit ? 'Update pipeline details and stages.' : 'Add a pipeline and define its stages.'}
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
            {stageDrafts.map((stage, stageIndex) => (
              <Box
                key={`${stage.name}-${stageIndex}`}
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
                  onChange={(event) => {
                    if (pipelineValidationError) setPipelineValidationError(null);
                    setStageDrafts((prev) =>
                      prev.map((item, index) =>
                        index === stageIndex ? { ...item, name: event.target.value } : item,
                      ),
                    );
                  }}
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
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (pipelineValidationError) setPipelineValidationError(null);
                      setStageDrafts((prev) =>
                        prev.map((item, index) =>
                          index === stageIndex ? { ...item, color: event.target.value } : item,
                        ),
                      );
                    }}
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
                    onClick={() => {
                      if (pipelineValidationError) setPipelineValidationError(null);
                      setStageDrafts((prev) => prev.filter((_, index) => index !== stageIndex));
                    }}
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
            onClick={() => {
              if (pipelineValidationError) setPipelineValidationError(null);
              setStageDrafts((prev) => [
                ...prev,
                {
                  name: '',
                  color: stagePalette[prev.length % stagePalette.length],
                },
              ]);
            }}
            disabled={stageDrafts.length >= 30}
          >
            Add Stage
          </CustomButton>
          {pipelineValidationError ? (
            <Typography sx={{ color: '#dc2626', fontSize: 13, fontWeight: 600 }}>
              {pipelineValidationError}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </CustomModal>
  );
};

export default PipelineModal;
