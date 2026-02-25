import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';

import { CustomIconButton } from '../../common/CustomIconButton';
import type { ContactNote } from '../../hooks/contacts/useContactNotesQueries';

interface NoteCardProps {
  note: ContactNote;
  disabled?: boolean;
  onEdit: (note: ContactNote) => void;
  onDelete: (note: ContactNote) => void;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const NoteCard = ({ note, disabled = false, onEdit, onDelete }: NoteCardProps) => (
  <Box
    sx={{
      position: 'relative',
      height: 148,
      overflow: 'hidden',
      borderRadius: 2.5,
      border: '1px solid #dbe5f3',
      px: 1.4,
      py: 1.25,
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
      transition: 'all .2s ease',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 14px 26px rgba(15, 23, 42, 0.1)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 10,
        bottom: 10,
        width: 3,
        borderRadius: 999,
        backgroundColor: '#3b82f6',
      },
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ height: '100%' }}>
      <Box sx={{ minWidth: 0, pl: 0.6, flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography
          sx={{
            display: 'inline-flex',
            px: 0.9,
            py: 0.25,
            borderRadius: 999,
            bgcolor: '#eef4ff',
            color: '#1e40af',
            fontSize: 11,
            fontWeight: 700,
            mb: 0.6,
          }}
        >
          {formatDateTime(note.updatedAt || note.createdAt)}
        </Typography>
        <Box sx={{ overflowY: 'auto', pr: 0.35 }}>
          <Typography
            sx={{
              color: '#0f172a',
              fontSize: 13.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.45,
            }}
          >
            {note.body}
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" spacing={0.15}>
        <Tooltip title="Edit note">
          <span>
            <CustomIconButton
              size="small"
              customColor="#334155"
              disabled={disabled}
              onClick={() => onEdit(note)}
              sx={{
                border: '1px solid #dbe5f3',
                borderRadius: 1.8,
                bgcolor: '#ffffff',
              }}
            >
              <EditOutlined sx={{ fontSize: 15 }} />
            </CustomIconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete note">
          <span>
            <CustomIconButton
              size="small"
              customColor="#dc2626"
              disabled={disabled}
              onClick={() => onDelete(note)}
              sx={{
                border: '1px solid #fee2e2',
                borderRadius: 1.8,
                bgcolor: '#fff7f7',
              }}
            >
              <DeleteOutlineOutlined sx={{ fontSize: 15 }} />
            </CustomIconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  </Box>
);

export default NoteCard;
