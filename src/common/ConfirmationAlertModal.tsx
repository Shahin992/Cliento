import { Box, Modal, Stack, Typography } from '@mui/material';
import { CloseOutlined, DeleteOutlineOutlined, WarningAmberOutlined } from '@mui/icons-material';

import { CustomButton } from './CustomButton';
import { CustomIconButton } from './CustomIconButton';

type ConfirmationVariant = 'delete' | 'warning';

interface ConfirmationAlertModalProps {
  open: boolean;
  variant?: ConfirmationVariant;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isConfirmLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

const variantStyles: Record<
  ConfirmationVariant,
  {
    iconBg: string;
    iconColor: string;
    confirmColor: string;
    defaultTitle: string;
    defaultMessage: string;
  }
> = {
  delete: {
    iconBg: '#fee2e2',
    iconColor: '#e11d48',
    confirmColor: '#e11d48',
    defaultTitle: 'Delete contact?',
    defaultMessage: 'This action cannot be undone. Do you want to continue?',
  },
  warning: {
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    confirmColor: '#f59e0b',
    defaultTitle: 'Warning',
    defaultMessage: 'Are you sure about this action?',
  },
};

const ConfirmationAlertModal = ({
  open,
  variant = 'warning',
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirmLoading = false,
  onClose,
  onConfirm,
}: ConfirmationAlertModalProps) => {
  const selectedStyle = variantStyles[variant];
  const Icon = variant === 'delete' ? DeleteOutlineOutlined : WarningAmberOutlined;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="confirmation-alert-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92vw', sm: 420 },
          maxWidth: '92vw',
          bgcolor: 'white',
          borderRadius: 2.5,
          border: '1px solid #e5e7eb',
          px: { xs: 2, sm: 3 },
          py: { xs: 2.25, sm: 2.5 },
          outline: 'none',
        }}
      >
        <CustomIconButton
          size="small"
          onClick={onClose}
          customColor="#6b7280"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: 999,
            border: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <CloseOutlined sx={{ fontSize: 14 }} />
        </CustomIconButton>

        <Stack spacing={1.5} alignItems="center" textAlign="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: selectedStyle.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 24, color: selectedStyle.iconColor }} />
          </Box>

          <Typography id="confirmation-alert-title" sx={{ fontWeight: 700, color: '#111827', fontSize: 30 }}>
            {title ?? selectedStyle.defaultTitle}
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: 14 }}>
            {message ?? selectedStyle.defaultMessage}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} mt={2.25}>
          <CustomButton
            variant="contained"
            customColor="#f3f4f6"
            customTextColor="#111827"
            onClick={onClose}
            sx={{ flex: 1, borderRadius: 2.5, textTransform: 'none', height: 38, fontWeight: 600 }}
          >
            {cancelText}
          </CustomButton>
          <CustomButton
            variant="contained"
            customColor={selectedStyle.confirmColor}
            onClick={async () => {
              await onConfirm();
            }}
            disabled={isConfirmLoading}
            sx={{ flex: 1, borderRadius: 2.5, textTransform: 'none', height: 38, fontWeight: 700 }}
          >
            {isConfirmLoading ? 'Please wait...' : confirmText}
          </CustomButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmationAlertModal;
