import { Box, Typography } from '@mui/material';

import CustomModal from '../../../common/CustomModal';

type DeleteDealModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const DeleteDealModal = ({ open, onClose, onSubmit }: DeleteDealModalProps) => (
  <CustomModal
    open={open}
    handleClose={onClose}
    handleSubmit={onSubmit}
    title="Delete Deal"
    description="Are you sure you want to delete this deal?"
    submitButtonText="Delete"
  >
    <Box
      sx={{
        borderRadius: 2,
        border: '1px solid #fecaca',
        backgroundColor: '#fff7f7',
        px: 1.5,
        py: 1.25,
      }}
    >
      <Typography sx={{ color: '#991b1b', fontWeight: 600, fontSize: 13 }}>
        This action cannot be undone.
      </Typography>
    </Box>
  </CustomModal>
);

export default DeleteDealModal;
