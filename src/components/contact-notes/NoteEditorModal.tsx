import { Box, Modal, Stack, TextField, Typography } from '@mui/material';

import { CustomButton } from '../../common/CustomButton';

type NoteEditorMode = 'create' | 'edit';

interface NoteEditorModalProps {
  open: boolean;
  mode: NoteEditorMode;
  value: string;
  error: string | null;
  maxLength: number;
  isLoading: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const NoteEditorModal = ({
  open,
  mode,
  value,
  error,
  maxLength,
  isLoading,
  onChange,
  onClose,
  onSubmit,
}: NoteEditorModalProps) => (
  <Modal open={open} onClose={onClose} aria-labelledby="note-editor-modal-title">
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '92vw', sm: 560 },
        maxWidth: '92vw',
        bgcolor: 'white',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        p: { xs: 2, sm: 2.25 },
        outline: 'none',
        boxShadow: '0 24px 48px rgba(15, 23, 42, 0.22)',
      }}
    >
      <Typography id="note-editor-modal-title" sx={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
        {mode === 'create' ? 'Add Note' : 'Edit Note'}
      </Typography>
      <Typography sx={{ color: '#64748b', mt: 0.5, fontSize: 13 }}>
        Keep context clear with concise notes.
      </Typography>

      <TextField
        multiline
        minRows={5}
        maxRows={10}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Type note details..."
        fullWidth
        error={Boolean(error)}
        helperText={error ?? `${value.trim().length}/${maxLength}`}
        sx={{
          mt: 2,
          '& .MuiInputBase-root': {
            borderRadius: 2,
            fontSize: 14,
          },
        }}
      />

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
        <CustomButton
          variant="outlined"
          customColor="#94a3b8"
          onClick={onClose}
          disabled={isLoading}
          sx={{ borderRadius: 999, textTransform: 'none', px: 2 }}
        >
          Cancel
        </CustomButton>
        <CustomButton
          variant="contained"
          customColor="#2563eb"
          onClick={onSubmit}
          disabled={isLoading}
          sx={{ borderRadius: 999, textTransform: 'none', px: 2 }}
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Save Note' : 'Update Note'}
        </CustomButton>
      </Stack>
    </Box>
  </Modal>
);

export default NoteEditorModal;
