import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

import { CustomButton } from '../../../common/CustomButton';
import { contacts } from '../../../data/contacts';
import type { DealDetail } from '../../../data/deals';
import type { Pipeline } from '../../../data/pipelines';
import {
  borderColor,
  inputSx,
  labelSx,
  mutedText,
  primary,
} from './dealModalStyles';
import SelectContactModal from './SelectContactModal';
import AddContactModal from '../../contacts/modals/AddContactModal';

interface AddDealModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (payload: {
    name: string;
    location: string;
    area: string;
    appointment: string;
    price: string;
    roomArea: string;
    people: string;
    roomAccess: string;
    instructions: string;
    pipelineId: string;
    stageId: string;
  }) => void;
  pipelines?: Pipeline[];
  initialDeal?: DealDetail | null;
}

const AddDealModal = ({
  open,
  onClose,
  onSave,
  pipelines = [],
  initialDeal = null,
}: AddDealModalProps) => {
  const [isSelectContactOpen, setIsSelectContactOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [roomImages, setRoomImages] = useState<File[]>([]);
  const [roomImagePreviews, setRoomImagePreviews] = useState<string[]>([]);

  const [selectedPipelineId, setSelectedPipelineId] = useState(
    initialDeal?.pipelineId ?? pipelines[0]?.id ?? '',
  );
  const [selectedStageId, setSelectedStageId] = useState(
    initialDeal?.stageId ?? pipelines[0]?.stages?.[0]?.id ?? '',
  );

  const [formState, setFormState] = useState({
    name: initialDeal?.name ?? '',
    location: initialDeal?.location ?? '',
    area: initialDeal?.area ?? '',
    appointment: initialDeal?.appointment ?? '',
    price: initialDeal?.price ?? '',
    roomArea: initialDeal?.roomArea ?? '',
    people: initialDeal?.people ?? '',
    roomAccess: initialDeal?.roomAccess ?? '',
    instructions: initialDeal?.instructions ?? '',
  });

  const selectedContact = useMemo(
    () => contacts.find((item) => item.id === selectedContactId),
    [selectedContactId],
  );

  const selectedPipeline = useMemo(
    () => pipelines.find((pipeline) => pipeline.id === selectedPipelineId) ?? pipelines[0],
    [pipelines, selectedPipelineId],
  );

  useEffect(() => {
    if (selectedPipeline?.stages?.length) {
      setSelectedStageId(selectedPipeline.stages[0].id);
    }
  }, [selectedPipeline]);

  useEffect(() => {
    if (!pipelines.length) return;
    const hasSelected = pipelines.some((pipeline) => pipeline.id === selectedPipelineId);
    if (!hasSelected) {
      setSelectedPipelineId(pipelines[0].id);
      setSelectedStageId(pipelines[0].stages?.[0]?.id ?? '');
    }
  }, [pipelines, selectedPipelineId]);

  useEffect(() => {
    if (!initialDeal) return;
    setFormState({
      name: initialDeal.name ?? '',
      location: initialDeal.location ?? '',
      area: initialDeal.area ?? '',
      appointment: initialDeal.appointment ?? '',
      price: initialDeal.price ?? '',
      roomArea: initialDeal.roomArea ?? '',
      people: initialDeal.people ?? '',
      roomAccess: initialDeal.roomAccess ?? '',
      instructions: initialDeal.instructions ?? '',
    });
    setSelectedPipelineId(initialDeal.pipelineId ?? pipelines[0]?.id ?? '');
    setSelectedStageId(initialDeal.stageId ?? pipelines[0]?.stages?.[0]?.id ?? '');
  }, [initialDeal, pipelines]);

  useEffect(() => {
    const nextPreviews = roomImages.map((file) => URL.createObjectURL(file));
    setRoomImagePreviews(nextPreviews);
    return () => {
      nextPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [roomImages]);

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
                  >
                    {selectedContact.avatar ?? 'C'}
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

            <Box>
              <Typography sx={labelSx}>Deal Name</Typography>
              <Box
                component="input"
                sx={{ ...inputSx, mt: 1 }}
                placeholder="Deal name"
                value={formState.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </Box>

            <Box>
              <Typography sx={labelSx}>Location</Typography>
              <Box
                component="input"
                sx={{ ...inputSx, mt: 1 }}
                placeholder="City, State"
                value={formState.location}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((prev) => ({ ...prev, location: event.target.value }))
                }
              />
            </Box>

            <Box>
              <Typography sx={labelSx}>Room Images</Typography>
              <CustomButton
                component="label"
                variant="outlined"
                customColor="#94a3b8"
                sx={{
                  mt: 1,
                  height: 30,
                  borderRadius: 2,
                  px: 1.5,
                  textTransform: 'uppercase',
                  fontSize: 11,
                  fontWeight: 700,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Add
                <Box
                  component="input"
                  type="file"
                  accept="image/*"
                  multiple
                  capture="environment"
                  sx={{ display: 'none' }}
                  onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                    (event.target as HTMLInputElement).value = '';
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const files = Array.from(event.target.files ?? []);
                    setRoomImages(files);
                  }}
                />
              </CustomButton>
              {roomImagePreviews.length > 0 && (
                <Box
                  sx={{
                    mt: 1.5,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                    gap: 1,
                  }}
                >
                  {roomImagePreviews.map((src, index) => (
                    <Box
                      key={`${src}-${index}`}
                      sx={{
                        width: '100%',
                        aspectRatio: '4 / 3',
                        borderRadius: 2,
                        border: `1px solid ${borderColor}`,
                        overflow: 'hidden',
                        backgroundColor: '#f1f5f9',
                      }}
                    >
                      <Box
                        component="img"
                        src={src}
                        alt={`Room image ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {pipelines.length ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography sx={labelSx}>Pipeline</Typography>
                  <Box
                    component="select"
                    sx={{ ...inputSx, mt: 1 }}
                    value={selectedPipelineId}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedPipelineId(event.target.value)
                    }
                  >
                    {pipelines.map((pipeline) => (
                      <option key={pipeline.id} value={pipeline.id}>
                        {pipeline.name}
                      </option>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography sx={labelSx}>Stage</Typography>
                  <Box
                    component="select"
                    sx={{ ...inputSx, mt: 1 }}
                    value={selectedStageId}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedStageId(event.target.value)
                    }
                  >
                    {(selectedPipeline?.stages ?? []).map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : null}

            <Box>
              <Typography sx={labelSx}>Appointment</Typography>
              <Box
                component="input"
                sx={{ ...inputSx, mt: 1 }}
                placeholder="Nov 14, 2021 07:00 AM"
                value={formState.appointment}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((prev) => ({ ...prev, appointment: event.target.value }))
                }
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 1.5,
              }}
            >
              <Box>
                <Typography sx={labelSx}>Room Area (m2)</Typography>
                <Box
                  component="input"
                  sx={{ ...inputSx, mt: 1 }}
                  placeholder="Area"
                  value={formState.roomArea}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFormState((prev) => ({ ...prev, roomArea: event.target.value }))
                  }
                />
              </Box>
              <Box>
                <Typography sx={labelSx}># of People</Typography>
                <Box
                  component="input"
                  sx={{ ...inputSx, mt: 1 }}
                  placeholder="People"
                  value={formState.people}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFormState((prev) => ({ ...prev, people: event.target.value }))
                  }
                />
              </Box>
            </Box>

            <Box>
              <Typography sx={labelSx}>Special Instructions</Typography>
              <Box
                component="input"
                sx={{ ...inputSx, mt: 1 }}
                placeholder="Instructions"
                value={formState.instructions}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((prev) => ({ ...prev, instructions: event.target.value }))
                }
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 1.5,
              }}
            >
              <Box>
                <Typography sx={labelSx}>Room Access</Typography>
                <Box
                  component="select"
                  sx={{ ...inputSx, mt: 1 }}
                  value={formState.roomAccess}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormState((prev) => ({ ...prev, roomAccess: event.target.value }))
                  }
                >
                  <option>Keys with doorman</option>
                  <option>Lockbox</option>
                  <option>Meet at door</option>
                </Box>
              </Box>
              <Box>
                <Typography sx={labelSx}>Price ($)</Typography>
                <Box
                  component="input"
                  sx={{ ...inputSx, mt: 1 }}
                  placeholder="$ 0"
                  value={formState.price}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFormState((prev) => ({ ...prev, price: event.target.value }))
                  }
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <Typography sx={labelSx}>Area</Typography>
                <Box
                  component="input"
                  sx={{ ...inputSx, width: { xs: '100%', sm: 220 } }}
                  placeholder="100m2"
                  value={formState.area}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFormState((prev) => ({ ...prev, area: event.target.value }))
                  }
                />
              </Box>
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
                onClick={() =>
                  onSave?.({
                    name: formState.name,
                    location: formState.location,
                    area: formState.area,
                    appointment: formState.appointment,
                    price: formState.price,
                    roomArea: formState.roomArea,
                    people: formState.people,
                    roomAccess: formState.roomAccess,
                    instructions: formState.instructions,
                    pipelineId: selectedPipelineId,
                    stageId: selectedStageId,
                  })
                }
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {initialDeal ? 'Save Changes' : 'Save Deal'}
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Modal>

      <SelectContactModal
        open={isSelectContactOpen}
        onClose={() => setIsSelectContactOpen(false)}
        onSelect={(contactId) => {
          setSelectedContactId(contactId);
          setIsSelectContactOpen(false);
        }}
        onAddNew={() => {
          setIsSelectContactOpen(false);
          setIsAddContactOpen(true);
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
