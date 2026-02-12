import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Box, Modal, Stack, Typography } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { AddOutlined, CloseOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { MuiTelInput } from 'mui-tel-input';

import { CustomButton } from '../../../common/CustomButton';
import { createContact } from '../../../services/contacts';
import { uploadPhoto } from '../../../services/upload';
import { useToast } from '../../../common/ToastProvider';
import { validateAddCustomerPayload } from './addCustomerValidation';

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void | Promise<void>;
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

const removeIconSx = {
  width: 32,
  height: 32,
  borderRadius: 999,
  border: '1px solid #ef4444',
  color: '#ef4444',
  backgroundColor: 'transparent',
  flexShrink: 0,
  '&:hover': {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
};

const phoneInputSx = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: 36,
    borderRadius: 2,
    backgroundColor: '#f8fbff',
    '& fieldset': {
      borderColor: '#eef2f7',
    },
    '&:hover fieldset': {
      borderColor: '#e2e8f0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
      boxShadow: 'none',
    },
  },
  '& .MuiOutlinedInput-input': {
    fontSize: 12,
    color: '#0f172a',
  },
  '& .MuiInputAdornment-positionStart .MuiButtonBase-root': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
};

const AddCustomerModal = ({ open, onClose, onSave }: AddCustomerModalProps) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [emails, setEmails] = useState<string[]>(['']);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

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
    setUploadedPhotoUrl(undefined);
    setFirstName('');
    setLastName('');
    setCompanyName('');
    setEmails(['']);
    setPhoneNumbers(['']);
    setStreet('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('');
    onClose();
  };

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (file: File | null) => {
    setAvatarFile(file);
    setUploadedPhotoUrl(undefined);

    if (!file) {
      return;
    }

    setIsPhotoUploading(true);
    try {
      const uploadResponse = await uploadPhoto({ file, folder: 'contacts' });

      if (!uploadResponse.success || !uploadResponse.data?.url) {
        showToast({
          message: uploadResponse.message || 'Photo upload failed.',
          severity: 'error',
        });
        return;
      }

      setUploadedPhotoUrl(uploadResponse.data.url.trim());
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Photo upload failed.',
        severity: 'error',
      });
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const updateEmail = (index: number, value: string) => {
    setEmails((prev) => prev.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const addEmail = () => {
    if (emails.length >= 10) {
      showToast({ message: 'You can add up to 10 emails.', severity: 'error' });
      return;
    }
    setEmails((prev) => [...prev, '']);
  };

  const removeEmail = (index: number) => {
    setEmails((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const updatePhoneNumber = (index: number, value: string) => {
    setPhoneNumbers((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  };

  const addPhoneNumber = () => {
    if (phoneNumbers.length >= 10) {
      showToast({ message: 'You can add up to 10 phone numbers.', severity: 'error' });
      return;
    }
    setPhoneNumbers((prev) => [...prev, '']);
  };

  const removePhoneNumber = (index: number) => {
    setPhoneNumbers((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSave = async () => {
    if (isPhotoUploading) {
      showToast({
        message: 'Photo is still uploading. Please wait.',
        severity: 'error',
      });
      return;
    }

    if (avatarFile && !uploadedPhotoUrl) {
      showToast({
        message: 'Photo upload failed. Please select the photo again.',
        severity: 'error',
      });
      return;
    }

    setIsSaving(true);

    try {
      const validation = validateAddCustomerPayload({
        firstName,
        lastName,
        companyName,
        photoUrl: uploadedPhotoUrl,
        emails,
        phones: phoneNumbers,
        address: {
          street,
          city,
          state,
          postalCode,
          zipCode: '',
          country,
        },
      });

      if (!validation.success) {
        showToast({ message: validation.message, severity: 'error' });
        return;
      }

      const response = await createContact(validation.payload);
      if (!response.success) {
        showToast({
          message: response.message || 'Failed to create contact.',
          severity: 'error',
        });
        return;
      }

      showToast({ message: response.message || 'Contact created successfully.', severity: 'success' });
      await onSave?.();
      handleClose();
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to save customer.',
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
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

        <Stack spacing={1.5} sx={{ mt: 2, maxHeight: '62vh', overflowY: 'auto', pr: 0.5 }}>
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
                  disabled={isPhotoUploading}
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
                  {isPhotoUploading ? 'Uploading...' : 'Upload Photo'}
                </CustomButton>
              <Box
                component="input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  void handleAvatarChange(file);
                }}
                sx={{ display: 'none' }}
              />
            </Stack>
          </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Box>
            <Typography sx={labelSx}>First Name</Typography>
            <Box
              component="input"
              sx={inputSx}
              placeholder="Barbara"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              maxLength={30}
            />
          </Box>
          <Box>
            <Typography sx={labelSx}>Last Name</Typography>
            <Box
              component="input"
              sx={inputSx}
              placeholder="Anderson"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              maxLength={30}
            />
          </Box>
        </Box>

        <Box>
          <Typography sx={labelSx}>Company Name</Typography>
          <Box
            component="input"
            sx={inputSx}
            placeholder="Acme Inc."
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            maxLength={60}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
          <Box>
            <Typography sx={labelSx}>Email</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {emails.map((email, index) => (
                <Stack key={`email-${index}`} direction="row" spacing={1} alignItems="center">
                  <Box
                    component="input"
                    sx={inputSx}
                    placeholder="banderson@gmail.com"
                    value={email}
                    onChange={(event) => updateEmail(index, event.target.value)}
                  />
                  {emails.length > 1 ? (
                    <IconButton size="small" onClick={() => removeEmail(index)} sx={removeIconSx}>
                      <DeleteOutlineOutlined sx={{ fontSize: 16, color: '#ef4444' }} />
                    </IconButton>
                  ) : null}
                </Stack>
              ))}
              <CustomButton
                variant="outlined"
                customColor="#64748b"
                startIcon={<AddOutlined sx={{ fontSize: 16 }} />}
                onClick={addEmail}
                sx={{
                  width: 'fit-content',
                  minWidth: 110,
                  height: 32,
                  borderRadius: 999,
                  px: 1.25,
                  textTransform: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Add Email
              </CustomButton>
            </Stack>
          </Box>
        </Box>

        <Box>
          <Typography sx={labelSx}>Phone</Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {phoneNumbers.map((phone, index) => (
              <Stack key={`phone-${index}`} direction="row" spacing={1} alignItems="center">
                <MuiTelInput
                  value={phone}
                  onChange={(value) => updatePhoneNumber(index, value)}
                  defaultCountry="US"
                  forceCallingCode
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={phoneInputSx}
                />
                {phoneNumbers.length > 1 ? (
                  <IconButton
                    size="small"
                    onClick={() => removePhoneNumber(index)}
                    sx={removeIconSx}
                  >
                    <DeleteOutlineOutlined sx={{ fontSize: 16, color: '#ef4444' }} />
                  </IconButton>
                ) : null}
              </Stack>
            ))}
            <CustomButton
              variant="outlined"
              customColor="#64748b"
              startIcon={<AddOutlined sx={{ fontSize: 16 }} />}
              onClick={addPhoneNumber}
              sx={{
                width: 'fit-content',
                minWidth: 120,
                height: 32,
                borderRadius: 999,
                px: 1.25,
                textTransform: 'none',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Add Number
            </CustomButton>
          </Stack>
        </Box>

        <Box>
          <Typography sx={labelSx}>Address</Typography>
          <Box
            component="input"
            sx={inputSx}
            placeholder="Street Address"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
            maxLength={100}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Box
            component="input"
            sx={inputSx}
            placeholder="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            maxLength={50}
          />
          <Box
            component="input"
            sx={inputSx}
            placeholder="State / Province"
            value={state}
            onChange={(event) => setState(event.target.value)}
            maxLength={50}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Box
            component="input"
            sx={inputSx}
            placeholder="Postal Code"
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            maxLength={10}
          />
          <Box
            component="input"
            sx={inputSx}
            placeholder="Country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            maxLength={25}
          />
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
            onClick={handleSave}
            disabled={isSaving || isPhotoUploading}
            sx={{
              borderRadius: 999,
              px: 2.5,
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            {isSaving ? 'Saving...' : 'Save Customer'}
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCustomerModal;
