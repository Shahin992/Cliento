import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Modal, Stack, Typography } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { CloseOutlined, EventOutlined } from '@mui/icons-material';

import type { DealActivity } from '../../../data/deals';
import { CustomButton } from '../../../common/CustomButton';

interface EditActivityModalProps {
  open: boolean;
  onClose: () => void;
  activity: DealActivity | null;
}

const labelSx = {
  fontSize: 12,
  fontWeight: 700,
  color: '#0f172a',
  mb: 0.75,
};

const inputSx = {
  width: '100%',
  height: 36,
  px: 1.5,
  borderRadius: 2,
  border: '1px solid #e7edf6',
  backgroundColor: '#f8fbff',
  fontSize: 12,
  color: '#0f172a',
  outline: 'none',
  '&::placeholder': {
    color: '#94a3b8',
    opacity: 1,
  },
};

const EditActivityModal = ({ open, onClose, activity }: EditActivityModalProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const imageUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ''),
    [imageFile],
  );

  useEffect(() => {
    if (!imageFile) {
      return undefined;
    }

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageFile, imageUrl]);

  useEffect(() => {
    if (!open) {
      setImageFile(null);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-activity-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92vw', sm: 340 },
          maxWidth: '92vw',
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22)',
          p: 2.5,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="edit-activity-title" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Edit Activity
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
          <Box component="input" sx={inputSx} defaultValue={activity?.title ?? ''} />

        <Box sx={{ position: 'relative' }}>
          <Box
            component="input"
            type="datetime-local"
            defaultValue="2021-11-30T09:13"
            sx={{
              width: '100%',
              height: 36,
              px: 1.5,
              borderRadius: 8,
              border: '1px solid #e7edf6',
              backgroundColor: '#f8fbff',
              color: '#64748b',
              fontSize: 12,
              outline: 'none',
              '&::-webkit-calendar-picker-indicator': {
                opacity: 0,
                cursor: 'pointer',
              },
            }}
          />
          <EventOutlined
            sx={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 18,
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          />
        </Box>

          <Box>
            <Typography sx={labelSx}>Images</Typography>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e7edf6',
                borderRadius: 8,
                px: 1.5,
                py: 1,
                backgroundColor: '#f8fbff',
                color: '#94a3b8',
                fontSize: 12,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              {imageUrl ? (
                <Box
                  component="img"
                  src={imageUrl}
                  alt="Activity upload"
                  sx={{ width: '100%', height: 56, objectFit: 'cover', borderRadius: 6 }}
                />
              ) : (
                'ADD'
              )}
            </Box>
            <Box
              component="input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setImageFile(file);
              }}
              sx={{ display: 'none' }}
            />
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <CustomButton
            variant="text"
            customColor="#ef4444"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Delete
          </CustomButton>
          <CustomButton
            variant="contained"
            customColor="#6d28ff"
            sx={{ borderRadius: 999, px: 3, textTransform: 'none', height: 34 }}
          >
            Done
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditActivityModal;
