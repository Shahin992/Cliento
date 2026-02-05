import { Box, Modal, Stack, Typography } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { CloseOutlined } from '@mui/icons-material';

import { CustomButton } from '../../../common/CustomButton';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
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

const AddTaskModal = ({ open, onClose, onSave }: AddTaskModalProps) => (
  <Modal open={open} onClose={onClose} aria-labelledby="add-task-title">
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '92vw', sm: 360 },
        maxWidth: '92vw',
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22)',
        p: 2.5,
        outline: 'none',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography id="add-task-title" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Add New Task
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
        <Box component="textarea" rows={3} placeholder="Enter task description" sx={inputSx} />
        <Box>
          <Typography sx={labelSx}>Due Date</Typography>
          <Box component="input" type="date" sx={{ ...inputSx, mt: 1 }} />
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2.5 }}>
        <CustomButton
          variant="text"
          customColor="#64748b"
          onClick={onClose}
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
          Save Task
        </CustomButton>
      </Box>
    </Box>
  </Modal>
);

export default AddTaskModal;

