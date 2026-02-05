import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Box, Modal, Stack, Typography } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { CloseOutlined } from '@mui/icons-material';

import { CustomButton } from '../../../common/CustomButton';

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const DEFAULT_AVATAR = '/contact-avatar-placeholder.png';

const labelSx = {
  fontSize: 12,
  fontWeight: 700,
  color: '#0f172a',
};

const inputSx = {
  width: '100%',
  height: 36,
  px: 1.5,
  borderRadius: 2,
  border: '1px solid #eef2f7',
  backgroundColor: '#f8fbff',
  fontSize: 12,
  color: '#0f172a',
  outline: 'none',
  '&::placeholder': {
    color: '#94a3b8',
    opacity: 1,
  },
};

const AddCustomerModal = ({ open, onClose, onSave }: AddCustomerModalProps) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const avatarUrl = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : DEFAULT_AVATAR),
    [avatarFile],
  );

  useEffect(() => {
    if (!avatarFile) {
      return undefined;
    }

    return () => {
      URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarFile, avatarUrl]);

  const handleClose = () => {
    setAvatarFile(null);
    onClose();
  };

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-customer-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92vw', sm: 520 },
          maxWidth: '92vw',
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22)',
          p: 2.5,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="add-customer-title" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Add New Customer
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
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
          <Box>
            <Typography sx={labelSx}>Avatar</Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <Avatar
                src={avatarUrl}
                onClick={handlePickAvatar}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                }}
              />
                <CustomButton
                  variant="outlined"
                  customColor="#94a3b8"
                  sx={{
                    height: 34,
                    borderRadius: 2,
                    px: 1.5,
                    textTransform: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  onClick={handlePickAvatar}
                >
                  Upload Photo
                </CustomButton>
              <Box
                component="input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setAvatarFile(file);
                }}
                sx={{ display: 'none' }}
              />
            </Stack>
          </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Box>
            <Typography sx={labelSx}>First Name</Typography>
            <Box component="input" sx={inputSx} placeholder="Barbara" />
          </Box>
          <Box>
            <Typography sx={labelSx}>Last Name</Typography>
            <Box component="input" sx={inputSx} placeholder="Anderson" />
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Box>
            <Typography sx={labelSx}>Email</Typography>
            <Box component="input" sx={inputSx} placeholder="banderson@gmail.com" />
          </Box>
          <Box>
            <Typography sx={labelSx}>Phone</Typography>
            <Box component="input" sx={inputSx} placeholder="310-685-3335" />
          </Box>
        </Box>

        <Box>
          <Typography sx={labelSx}>Address</Typography>
          <Box component="input" sx={inputSx} placeholder="Street Address" />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
          <Box component="input" sx={inputSx} placeholder="City" />
          <Box component="input" sx={inputSx} placeholder="State / Province" />
          <Box component="input" sx={inputSx} placeholder="Zip Code" />
        </Box>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2.5 }}>
          <CustomButton
            variant="text"
            customColor="#64748b"
            onClick={handleClose}
            sx={{ textTransform: 'none', fontWeight: 600 }}
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
            }}
          >
            Save Customer
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCustomerModal;
