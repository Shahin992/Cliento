import type { RefObject } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { DescriptionOutlined } from '@mui/icons-material';

import type { ContactNote } from '../../hooks/contacts/useContactNotesQueries';
import NoteCard from './NoteCard';

interface NotesListProps {
  canManageNotes: boolean;
  notes: ContactNote[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  errorMessage: string;
  isFetchingNextPage: boolean;
  onScroll: () => void;
  listRef: RefObject<HTMLDivElement | null>;
  onEditNote: (note: ContactNote) => void;
  onDeleteNote: (note: ContactNote) => void;
  actionDisabled?: boolean;
  maxHeight?: number;
  minHeight?: number;
  noAccessTitle?: string;
  noAccessDescription?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

const NotesList = ({
  canManageNotes,
  notes,
  isInitialLoading,
  isRefreshing,
  isError,
  errorMessage,
  isFetchingNextPage,
  onScroll,
  listRef,
  onEditNote,
  onDeleteNote,
  actionDisabled = false,
  maxHeight = 520,
  minHeight,
  noAccessTitle = 'No contact linked',
  noAccessDescription = 'Link a contact to manage notes.',
  emptyTitle = 'No notes yet',
  emptyDescription = 'Add your first note to capture context.',
}: NotesListProps) => {
  const showEmpty = !isInitialLoading && !isRefreshing && !isError && notes.length === 0;

  return (
    <Box
      ref={listRef}
      onScroll={onScroll}
      sx={{
        border: '1px solid #e6eaf1',
        borderRadius: 2.5,
        p: 1.2,
        maxHeight,
        minHeight,
        overflowY: 'auto',
        bgcolor: '#ffffff',
      }}
    >
      {!canManageNotes ? (
        <Stack alignItems="center" justifyContent="center" textAlign="center" spacing={1} sx={{ py: 6 }}>
          <DescriptionOutlined sx={{ color: '#94a3b8' }} />
          <Typography sx={{ color: '#334155', fontWeight: 700 }}>{noAccessTitle}</Typography>
          <Typography sx={{ color: '#7e8796', fontSize: 13 }}>{noAccessDescription}</Typography>
        </Stack>
      ) : null}

      {canManageNotes && isInitialLoading ? (
        <Stack spacing={1.15}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Box
              key={`note-skeleton-${index}`}
              sx={{ border: '1px solid #e6eaf1', borderRadius: 2.5, p: 1.25, height: 148 }}
            >
              <Skeleton variant="text" width="40%" height={18} />
              <Skeleton variant="rounded" width="100%" height={90} />
            </Box>
          ))}
        </Stack>
      ) : null}

      {canManageNotes && !isInitialLoading && notes.length > 0 ? (
        <Stack spacing={1.15}>
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              disabled={actionDisabled}
              onEdit={onEditNote}
              onDelete={onDeleteNote}
            />
          ))}
        </Stack>
      ) : null}

      {canManageNotes && showEmpty ? (
        <Stack alignItems="center" justifyContent="center" textAlign="center" spacing={1} sx={{ py: 6 }}>
          <DescriptionOutlined sx={{ color: '#94a3b8' }} />
          <Typography sx={{ color: '#334155', fontWeight: 700 }}>{emptyTitle}</Typography>
          <Typography sx={{ color: '#7e8796', fontSize: 13 }}>{emptyDescription}</Typography>
        </Stack>
      ) : null}

      {canManageNotes && isError ? (
        <Typography sx={{ color: '#dc2626', textAlign: 'center', py: 1.5 }}>
          {errorMessage || 'Failed to load notes.'}
        </Typography>
      ) : null}

      {canManageNotes && isFetchingNextPage ? (
        <Stack spacing={1.1} sx={{ pt: 1 }}>
          {Array.from({ length: 2 }).map((_, index) => (
            <Box
              key={`note-more-${index}`}
              sx={{ border: '1px solid #e6eaf1', borderRadius: 2.5, p: 1.25, height: 148 }}
            >
              <Skeleton variant="text" width="45%" height={18} />
              <Skeleton variant="rounded" width="100%" height={90} />
            </Box>
          ))}
        </Stack>
      ) : null}
    </Box>
  );
};

export default NotesList;
