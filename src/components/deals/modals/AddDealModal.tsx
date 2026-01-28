import { useMemo, useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

import { CustomButton } from '../../../common/CustomButton';
import { contacts } from '../../../data/contacts';
import {
  borderColor,
  inputSx,
  labelSx,
  mutedText,
  primary,
} from './dealModalStyles';
import SelectCustomerModal from './SelectCustomerModal';

interface AddDealModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const AddDealModal = ({ open, onClose, onSave }: AddDealModalProps) => {
  const [isSelectCustomerOpen, setIsSelectCustomerOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(contacts[0]?.id ?? '');
  const [roomImages, setRoomImages] = useState<File[]>([]);
  const [roomImagePreviews, setRoomImagePreviews] = useState<string[]>([]);

  const selectedCustomer = useMemo(
    () => contacts.find((item) => item.id === selectedCustomerId) ?? contacts[0],
    [selectedCustomerId],
  );

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
            overflowY: 'auto',
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22)',
            p: { xs: 2, sm: 2.5 },
            outline: 'none',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography id="add-deal-title" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Add New Deal
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

          <Stack spacing={1.5} sx={{ mt: 2 }}>
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
                  {selectedCustomer?.avatar ?? 'C'}
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: mutedText }}>
                    Customer
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {selectedCustomer?.name ?? 'Select customer'}
                  </Typography>
                </Box>
              </Stack>
              <CustomButton
                variant="outlined"
                customColor="#94a3b8"
                sx={{
                  borderRadius: 999,
                  px: 2,
                  textTransform: 'none',
                  height: 28,
                  width: { xs: '100%', sm: 'auto' },
                }}
                onClick={() => setIsSelectCustomerOpen(true)}
              >
                Change Customer
              </CustomButton>
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

            <Box>
              <Typography sx={labelSx}>Address</Typography>
              <Box component="input" sx={{ ...inputSx, mt: 1 }} placeholder="Street Address" />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 1.5,
              }}
            >
              <Box component="input" sx={inputSx} placeholder="City" />
              <Box component="input" sx={inputSx} placeholder="State / Province" />
              <Box component="input" sx={inputSx} placeholder="Zip Code" />
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
                <Box component="input" sx={{ ...inputSx, mt: 1 }} placeholder="Area" />
              </Box>
              <Box>
                <Typography sx={labelSx}># of People</Typography>
                <Box component="input" sx={{ ...inputSx, mt: 1 }} placeholder="People" />
              </Box>
            </Box>

            <Box>
              <Typography sx={labelSx}>Appointment Date</Typography>
              <Box
                component="input"
                type="date"
                defaultValue="2021-11-14"
                sx={{ ...inputSx, mt: 1 }}
              />
            </Box>

            <Box>
              <Typography sx={labelSx}>Special Instructions</Typography>
              <Box component="input" sx={{ ...inputSx, mt: 1 }} placeholder="Instructions" />
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
                <Box component="select" sx={{ ...inputSx, mt: 1 }}>
                  <option>Keys with doorman</option>
                  <option>Lockbox</option>
                  <option>Meet at door</option>
                </Box>
              </Box>
              <Box>
                <Typography sx={labelSx}>Price ($)</Typography>
                <Box component="input" sx={{ ...inputSx, mt: 1 }} placeholder="$ 0" />
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
                <Typography sx={labelSx}>Progress</Typography>
                <Box component="select" sx={{ ...inputSx, width: { xs: '100%', sm: 220 } }}>
                  <option>In Progress</option>
                  <option>Closed</option>
                  <option>On Hold</option>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  width: { xs: '100%', sm: 'auto' },
                  flexDirection: { xs: 'column', sm: 'row' },
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
                  onClick={onSave}
                  sx={{
                    borderRadius: 999,
                    px: 2.5,
                    textTransform: 'none',
                    fontWeight: 700,
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Save Deal
                </CustomButton>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <SelectCustomerModal
        open={isSelectCustomerOpen}
        onClose={() => setIsSelectCustomerOpen(false)}
        onSelect={(customerId) => {
          setSelectedCustomerId(customerId);
          setIsSelectCustomerOpen(false);
        }}
      />
    </>
  );
};

export default AddDealModal;
