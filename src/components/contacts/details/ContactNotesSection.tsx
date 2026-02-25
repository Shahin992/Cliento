import { useEffect, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';

import { CustomButton } from '../../../common/CustomButton';
import ConfirmationAlertModal from '../../../common/ConfirmationAlertModal';
import { useToast } from '../../../common/ToastProvider';
import {
  useCreateContactNoteMutation,
  useDeleteContactNoteMutation,
  useUpdateContactNoteMutation,
} from '../../../hooks/contacts/useContactNotesMutations';
import {
  type ContactNote,
  useContactNotesInfiniteQuery,
} from '../../../hooks/contacts/useContactNotesQueries';
import NoteEditorModal from '../../contact-notes/NoteEditorModal';
import NotesList from '../../contact-notes/NotesList';

const NOTE_BODY_MAX_LENGTH = 1000;

interface ContactNotesSectionProps {
  contactId?: string;
}

const ContactNotesSection = ({ contactId }: ContactNotesSectionProps) => {
  const normalizedContactId = (contactId ?? '').trim();
  const canManageNotes = Boolean(normalizedContactId);
  const listRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteBody, setNoteBody] = useState('');
  const [noteBodyError, setNoteBodyError] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<ContactNote | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ContactNote | null>(null);

  const {
    notes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useContactNotesInfiniteQuery(normalizedContactId, 10, canManageNotes);

  const { createContactNote, loading: creatingNote } = useCreateContactNoteMutation();
  const { updateContactNote, loading: updatingNote } = useUpdateContactNoteMutation();
  const { deleteContactNote, loading: deletingNote } = useDeleteContactNoteMutation();

  const isSubmitLoading = creatingNote || updatingNote;
  const isInitialLoading = isLoading && notes.length === 0;
  const isRefreshing = !isLoading && isFetching && !isFetchingNextPage;
  const canLoadMore = Boolean(hasNextPage) && !isFetchingNextPage;

  const handleScroll = () => {
    const element = listRef.current;
    if (!element || !canLoadMore) return;
    const threshold = 32;
    const reachedBottom = element.scrollHeight - element.scrollTop - element.clientHeight <= threshold;
    if (reachedBottom) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const element = listRef.current;
    if (!element) return;
    element.scrollTop = 0;
  }, [normalizedContactId]);

  const openCreateModal = () => {
    setEditingNote(null);
    setNoteBody('');
    setNoteBodyError(null);
    setIsNoteModalOpen(true);
  };

  const openEditModal = (note: ContactNote) => {
    setEditingNote(note);
    setNoteBody(note.body ?? '');
    setNoteBodyError(null);
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
    setNoteBody('');
    setNoteBodyError(null);
  };

  const handleSubmitNote = async () => {
    if (!canManageNotes) {
      showToast({ message: 'Contact id is missing.', severity: 'error' });
      return;
    }

    const normalizedBody = noteBody.trim();
    if (!normalizedBody) {
      setNoteBodyError('Note cannot be empty.');
      return;
    }

    if (normalizedBody.length > NOTE_BODY_MAX_LENGTH) {
      setNoteBodyError(`Note must be ${NOTE_BODY_MAX_LENGTH} characters or less.`);
      return;
    }

    try {
      if (editingNote?._id) {
        await updateContactNote({
          noteId: editingNote._id,
          contactId: normalizedContactId,
          body: normalizedBody,
        });
        showToast({ message: 'Note updated successfully.', severity: 'success' });
      } else {
        await createContactNote({
          contactId: normalizedContactId,
          body: normalizedBody,
        });
        showToast({ message: 'Note added successfully.', severity: 'success' });
      }
      closeNoteModal();
    } catch (submitError) {
      showToast({
        message: submitError instanceof Error ? submitError.message : 'Failed to save note.',
        severity: 'error',
      });
    }
  };

  const handleConfirmDelete = async () => {
    const noteId = selectedNote?._id?.trim();
    if (!noteId || !canManageNotes) {
      setDeleteConfirmOpen(false);
      setSelectedNote(null);
      return;
    }

    try {
      await deleteContactNote({ noteId, contactId: normalizedContactId });
      showToast({ message: 'Note deleted successfully.', severity: 'success' });
      setDeleteConfirmOpen(false);
      setSelectedNote(null);
    } catch (submitError) {
      showToast({
        message: submitError instanceof Error ? submitError.message : 'Failed to delete note.',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ color: '#111827', fontWeight: 800, fontSize: 15 }}>
            Notes
          </Typography>
          <CustomButton
            variant="contained"
            customColor="#2563eb"
            startIcon={<AddOutlined sx={{ fontSize: 16 }} />}
            onClick={openCreateModal}
            disabled={!canManageNotes || isSubmitLoading}
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              px: 1.8,
              py: 0.45,
              minWidth: 0,
              fontSize: 13,
              height: 34,
            }}
          >
            Add Note
          </CustomButton>
        </Stack>

        <NotesList
          canManageNotes={canManageNotes}
          notes={notes}
          isInitialLoading={isInitialLoading}
          isRefreshing={isRefreshing}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : 'Failed to load notes.'}
          isFetchingNextPage={isFetchingNextPage}
          onScroll={handleScroll}
          listRef={listRef}
          onEditNote={openEditModal}
          onDeleteNote={(note) => {
            setSelectedNote(note);
            setDeleteConfirmOpen(true);
          }}
          actionDisabled={deletingNote || updatingNote}
          maxHeight={520}
          noAccessTitle="No contact id found"
          noAccessDescription="Unable to load notes for this contact."
          emptyTitle="No notes yet"
          emptyDescription="Add your first note for this contact."
        />
      </Stack>

      <NoteEditorModal
        open={isNoteModalOpen}
        mode={editingNote ? 'edit' : 'create'}
        value={noteBody}
        error={noteBodyError}
        maxLength={NOTE_BODY_MAX_LENGTH}
        isLoading={isSubmitLoading}
        onChange={(value) => {
          setNoteBody(value);
          if (noteBodyError) setNoteBodyError(null);
        }}
        onClose={closeNoteModal}
        onSubmit={() => {
          void handleSubmitNote();
        }}
      />

      <ConfirmationAlertModal
        open={deleteConfirmOpen}
        variant="delete"
        title="Delete note?"
        message="This note will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        isConfirmLoading={deletingNote}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setSelectedNote(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ContactNotesSection;
