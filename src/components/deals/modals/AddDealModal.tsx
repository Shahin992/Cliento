import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Modal, Stack, Typography, type SelectChangeEvent } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

import { CustomButton } from '../../../common/CustomButton';
import BasicInput from '../../../common/BasicInput';
import BasicSelect from '../../../common/BasicSelect';
import type { DealDetail } from '../../../data/deals';
import type { Pipeline } from '../../../data/pipelines';
import {
  borderColor,
  labelSx,
  mutedText,
  primary,
} from './dealModalStyles';
import SelectContactModal from './SelectContactModal';
import AddContactModal from '../../contacts/modals/AddContactModal';
import type { ContactOption } from '../../../hooks/contacts/useContactOptionsInfiniteQuery';
import {
  usePipelinesOptionsQuery,
  usePipelineStagesQuery,
} from '../../../hooks/pipelines/usePipelinesQueries';
import { useCreateDealMutation } from '../../../hooks/deals/useDealsMutations';
import { useAppSelector } from '../../../app/hooks';
import { validateCreateDealPayload } from './addDealValidation';

export type AddDealPayload = {
  ownerId: string;
  pipelineId: string;
  stageId: string;
  title: string;
  amount: number | null;
  contactId: string;
  expectedCloseDate: string | null;
};

interface AddDealModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (payload: AddDealPayload) => void;
  pipelines?: Pipeline[];
  initialDeal?: DealDetail | null;
}

const getDefaultCloseDateInput = () => {
  const nextYearDate = new Date();
  nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
  return nextYearDate.toISOString().slice(0, 10);
};

const AddDealModal = ({
  open,
  onClose,
  onSave,
  pipelines = [],
  initialDeal = null,
}: AddDealModalProps) => {
  const authUser = useAppSelector((state) => state.auth.user);
  const reduxPipelines = useAppSelector((state) => state.pipelines.options);
  const { createDeal, loading: creatingDeal, errorMessage: createDealErrorMessage } = useCreateDealMutation();
  const shouldLoadPipelinesFromApi = open && reduxPipelines.length === 0;
  const { pipelines: apiPipelines, loading: loadingPipelines } = usePipelinesOptionsQuery(
    shouldLoadPipelinesFromApi,
  );
  const [isSelectContactOpen, setIsSelectContactOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactOption | null>(null);
  const initialPipelineId = initialDeal?.pipelineId ?? '';
  const initialStageId = initialDeal?.stageId ?? '';

  const [formState, setFormState] = useState<AddDealPayload>({
    ownerId: '',
    pipelineId: initialPipelineId,
    stageId: initialStageId,
    title: initialDeal?.name ?? '',
    amount: Number((initialDeal?.price ?? '').replace(/[^\d.]/g, '')) || null,
    contactId: '',
    expectedCloseDate: null,
  });
  const [amountInput, setAmountInput] = useState(
    initialDeal?.price ? String(Number((initialDeal.price ?? '').replace(/[^\d.]/g, '')) || '') : '',
  );
  const [expectedCloseDateInput, setExpectedCloseDateInput] = useState(getDefaultCloseDateInput);
  const [validationError, setValidationError] = useState<string | null>(null);
  const {
    stages: apiStages,
    loading: loadingStages,
  } = usePipelineStagesQuery(formState.pipelineId, open);

  const pipelineOptions = useMemo(
    () => {
      if (reduxPipelines.length) {
        return reduxPipelines.map((pipeline) => ({
          label: pipeline.name,
          value: pipeline._id,
        }));
      }

      if (apiPipelines.length) {
        return apiPipelines.map((pipeline) => ({
          label: pipeline.name,
          value: pipeline._id,
        }));
      }

      return pipelines.map((pipeline) => ({
        label: pipeline.name,
        value: pipeline.id,
      }));
    },
    [reduxPipelines, apiPipelines, pipelines],
  );
  const stageOptions = useMemo(
    () =>
      apiStages.map((stage) => ({
        label: stage.name,
        value: stage._id,
      })),
    [apiStages],
  );

  useEffect(() => {
    if (!initialDeal) return;
    setFormState((prev) => ({
      ...prev,
      ownerId: authUser?._id ?? '',
      pipelineId: initialDeal.pipelineId ?? '',
      stageId: initialDeal.stageId ?? '',
      title: initialDeal.name ?? '',
      amount: Number((initialDeal.price ?? '').replace(/[^\d.]/g, '')) || null,
      expectedCloseDate: null,
    }));
    setAmountInput(String(Number((initialDeal.price ?? '').replace(/[^\d.]/g, '')) || ''));
    setExpectedCloseDateInput(getDefaultCloseDateInput());
    setValidationError(null);
  }, [initialDeal, pipelines, authUser?._id]);

  useEffect(() => {
    if (!open || initialDeal) return;
    setExpectedCloseDateInput(getDefaultCloseDateInput());
  }, [open, initialDeal]);

  useEffect(() => {
    setFormState((prev) => ({ ...prev, contactId: selectedContact?._id ?? '' }));
  }, [selectedContact]);

  useEffect(() => {
    setFormState((prev) => ({ ...prev, ownerId: authUser?._id ?? '' }));
  }, [authUser?._id]);

  const submitDisabled =
    creatingDeal ||
    !formState.pipelineId.trim() ||
    !formState.stageId.trim() ||
    !formState.title.trim() ||
    !formState.contactId.trim();

  const handleSubmit = async () => {
    const validation = validateCreateDealPayload({
      ownerId: authUser?._id ?? '',
      pipelineId: formState.pipelineId,
      stageId: formState.stageId,
      title: formState.title,
      amount: amountInput,
      contactId: formState.contactId,
      expectedCloseDate: expectedCloseDateInput,
    });

    if (!validation.success) {
      setValidationError(validation.message);
      return;
    }
    setValidationError(null);

    if (initialDeal) {
      onSave?.(validation.payload);
      return;
    }

    console.log('Create deal payload', validation.payload);
    await createDeal(validation.payload);
    onSave?.(validation.payload);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="add-deal-title">
        <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '94vw', sm: 560 },
          maxWidth: '94vw',
          maxHeight: { xs: '90vh', sm: '85vh' },
          overflow: 'hidden',
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22)',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: { xs: 2, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            borderBottom: '1px solid #eef2f7',
            bgcolor: 'white',
          }}
        >
          <Typography id="add-deal-title" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {initialDeal ? 'Edit Deal' : 'Add New Deal'}
          </Typography>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              width: 28,
              height: 28,
              borderRadius: 999,
              backgroundColor: '#f1f5f9',
              color: '#94a3b8',
              '&:hover': { backgroundColor: '#e2e8f0' },
            }}
          >
            <CloseOutlined sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: { xs: 2, sm: 2.5 },
            py: { xs: 2, sm: 2.5 },
          }}
        >
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                backgroundColor: '#f8fbff',
                borderRadius: 2,
                px: 1.5,
                py: 1.2,
                border: `1px solid ${borderColor}`,
              }}
            >
              {selectedContact ? (
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#e8f0ff',
                      color: primary,
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                    src={selectedContact.photoUrl ?? undefined}
                  >
                    {selectedContact.name
                      .split(' ')
                      .map((part) => part[0] ?? '')
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'C'}
                  </Avatar>
                  <Box>
                    <Typography variant="caption" sx={{ color: mutedText }}>
                      Contact
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {selectedContact.name}
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Box sx={{ flex: 1 }} />
              )}
              <CustomButton
                variant="outlined"
                customColor="#94a3b8"
                sx={{
                  borderRadius: 999,
                  px: 2,
                  textTransform: 'none',
                  height: 28,
                  width: { xs: '100%', sm: 'auto' },
                  ml: { sm: 'auto' },
                }}
                onClick={() => setIsSelectContactOpen(true)}
              >
                {selectedContact ? 'Change Contact' : 'Select Contact'}
              </CustomButton>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', },
                gap: 1.5,
              }}
            >
              <Box>
                <Typography sx={labelSx}>Deal Title</Typography>
                <BasicInput
                  fullWidth
                  sx={{ mt: 1 }}
                  placeholder="deal title"
                  value={formState.title}
                  onChange={(event) => {
                    if (validationError) setValidationError(null);
                    setFormState((prev) => ({ ...prev, title: event.target.value }))
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 1.5,
              }}
            >
              <Box>
                <Typography sx={labelSx}>Amount</Typography>
                <BasicInput
                  fullWidth
                  type="number"
                  sx={{ mt: 1 }}
                  placeholder="0"
                  value={amountInput}
                  onChange={(event) => {
                    if (validationError) setValidationError(null);
                    setAmountInput(event.target.value);
                  }}
                />
              </Box>
              <Box>
                <Typography sx={labelSx}>Expected Close Date</Typography>
                <BasicInput
                  fullWidth
                  type="date"
                  sx={{ mt: 1 }}
                  value={expectedCloseDateInput}
                  onChange={(event) => {
                    if (validationError) setValidationError(null);
                    setExpectedCloseDateInput(event.target.value);
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography sx={labelSx}>Pipeline</Typography>
              <BasicSelect
                options={pipelineOptions}
                mapping={{ label: 'label', value: 'value' }}
                value={formState.pipelineId}
                isLoading={loadingPipelines}
                defaultText="Select pipeline"
                onChange={(event: SelectChangeEvent<unknown>) =>
                  {
                    if (validationError) setValidationError(null);
                    setFormState((prev) => ({
                      ...prev,
                      pipelineId: event.target.value as string,
                      stageId: '',
                    }));
                  }
                }
              />
            </Box>

            <Box>
              <Typography sx={labelSx}>Stage</Typography>
              <BasicSelect
                options={stageOptions}
                mapping={{ label: 'label', value: 'value' }}
                value={formState.stageId}
                isLoading={loadingStages}
                disabled={!formState.pipelineId}
                defaultText="Select stage"
                onChange={(event: SelectChangeEvent<unknown>) =>
                  {
                    if (validationError) setValidationError(null);
                    setFormState((prev) => ({
                      ...prev,
                      stageId: event.target.value as string,
                    }));
                  }
                }
              />
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            borderTop: '1px solid #eef2f7',
            bgcolor: 'white',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              width: { xs: '100%', sm: 'auto' },
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { sm: 'flex-end' },
            }}
          >
            <CustomButton
              variant="text"
              customColor="#64748b"
              onClick={onClose}
              sx={{ textTransform: 'none', fontWeight: 600, width: { xs: '100%', sm: 'auto' } }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              disabled={submitDisabled}
              onClick={handleSubmit}
              sx={{
                borderRadius: 999,
                px: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {creatingDeal
                ? 'Saving...'
                : initialDeal
                  ? 'Save Changes'
                  : 'Save Deal'}
            </CustomButton>
          </Box>
          {validationError ? (
            <Typography sx={{ color: '#dc2626', fontSize: 13, mt: 1 }}>
              {validationError}
            </Typography>
          ) : null}
          {createDealErrorMessage && !validationError ? (
            <Typography sx={{ color: '#dc2626', fontSize: 13, mt: 1 }}>
              {createDealErrorMessage}
            </Typography>
          ) : null}
        </Box>
        </Box>
      </Modal>
      <SelectContactModal
        open={isSelectContactOpen}
        onClose={() => setIsSelectContactOpen(false)}
        onSelect={(contact) => {
          setSelectedContact(contact);
          setIsSelectContactOpen(false);
        }}
      />
      <AddContactModal
        open={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        onSave={() => setIsAddContactOpen(false)}
      />
    </>
  );
};

export default AddDealModal;
