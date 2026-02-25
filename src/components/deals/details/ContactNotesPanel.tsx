import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
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
import ContactQuickDetails from './ContactQuickDetails';

type ContactTab = 'details' | 'notes';
type NoteModalMode = 'create' | 'edit';

interface ContactNotesPanelProps {
  contactId?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName?: string;
  initials: string;
}

const NOTE_BODY_MAX_LENGTH = 1000;

const ContactNotesPanel = ({
  contactId,
  contactName,
  contactEmail,
  contactPhone,
  companyName,
  initials,
}: ContactNotesPanelProps) => {
  const normalizedContactId = (contactId ?? '').trim();
  const canManageNotes = Boolean(normalizedContactId);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ContactTab>('details');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteModalMode, setNoteModalMode] = useState<NoteModalMode>('create');
  const [noteBody, setNoteBody] = useState('');
  const [noteBodyError, setNoteBodyError] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<ContactNote | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const {
    notes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useContactNotesInfiniteQuery(normalizedContactId, 10, activeTab === 'notes' && canManageNotes);

  const { createContactNote, loading: creatingNote } = useCreateContactNoteMutation();
  const { updateContactNote, loading: updatingNote } = useUpdateContactNoteMutation();
  const { deleteContactNote, loading: deletingNote } = useDeleteContactNoteMutation();

  const isNoteSubmitLoading = creatingNote || updatingNote;
  const canLoadMore = Boolean(hasNextPage) && !isFetchingNextPage;
  const isInitialLoading = isLoading && notes.length === 0;
  const isRefreshing = !isLoading && isFetching && !isFetchingNextPage;

  const openCreateModal = () => {
    setNoteModalMode('create');
    setSelectedNote(null);
    setNoteBody('');
    setNoteBodyError(null);
    setIsNoteModalOpen(true);
  };

  const openEditModal = (note: ContactNote) => {
    setNoteModalMode('edit');
    setSelectedNote(note);
    setNoteBody(note.body ?? '');
    setNoteBodyError(null);
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setNoteBody('');
    setNoteBodyError(null);
    setSelectedNote(null);
  };

  const closeDeleteModal = () => {
    setDeleteConfirmOpen(false);
    setSelectedNote(null);
  };

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
    if (activeTab !== 'notes') return;
    const element = listRef.current;
    if (!element) return;
    element.scrollTop = 0;
  }, [activeTab]);

  const submitNote = async () => {
    if (!canManageNotes) {
      showToast({ message: 'This deal has no linked contact.', severity: 'error' });
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
      if (noteModalMode === 'create') {
        await createContactNote({ contactId: normalizedContactId, body: normalizedBody });
        showToast({ message: 'Note added successfully.', severity: 'success' });
      } else {
        const noteId = selectedNote?._id?.trim();
        if (!noteId) {
          setNoteBodyError('Unable to edit this note.');
          return;
        }
        await updateContactNote({ noteId, contactId: normalizedContactId, body: normalizedBody });
        showToast({ message: 'Note updated successfully.', severity: 'success' });
      }
      closeNoteModal();
    } catch (submitError) {
      showToast({
        message: submitError instanceof Error ? submitError.message : 'Failed to save note.',
        severity: 'error',
      });
    }
  };

  const confirmDeleteNote = async () => {
    const noteId = selectedNote?._id?.trim();
    if (!noteId || !canManageNotes) {
      closeDeleteModal();
      return;
    }

    try {
      await deleteContactNote({ noteId, contactId: normalizedContactId });
      showToast({ message: 'Note deleted successfully.', severity: 'success' });
      closeDeleteModal();
    } catch (submitError) {
      showToast({
        message: submitError instanceof Error ? submitError.message : 'Failed to delete note.',
        severity: 'error',
      });
    }
  };

  const notesCountLabel = useMemo(() => (canManageNotes ? String(notes.length) : '0'), [canManageNotes, notes.length]);

  return (
    <>
      <Box sx={{ border: '1px solid #e7edf6', borderRadius: 3, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography sx={{ fontWeight: 700, color: '#1f2937' }}>Contact</Typography>
          {activeTab === 'notes' ? (
            <CustomButton
              variant="contained"
              customColor="#2563eb"
              startIcon={<AddOutlined sx={{ fontSize: 16 }} />}
              onClick={openCreateModal}
              disabled={!canManageNotes || isNoteSubmitLoading}
              sx={{
                borderRadius: 999,
                textTransform: 'none',
                px: 1.6,
                py: 0.35,
                minWidth: 0,
                fontSize: 13,
                height: 34,
              }}
            >
              Add Note
            </CustomButton>
          ) : null}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 1.25 }}>
          <Box
            component="button"
            type="button"
            onClick={() => setActiveTab('details')}
            sx={{
              border: '1px solid',
              borderColor: activeTab === 'details' ? '#93c5fd' : '#e2e8f0',
              backgroundColor: activeTab === 'details' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'details' ? '#1e3a8a' : '#475569',
              borderRadius: 999,
              px: 1.25,
              py: 0.5,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Details
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => setActiveTab('notes')}
            sx={{
              border: '1px solid',
              borderColor: activeTab === 'notes' ? '#93c5fd' : '#e2e8f0',
              backgroundColor: activeTab === 'notes' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'notes' ? '#1e3a8a' : '#475569',
              borderRadius: 999,
              px: 1.25,
              py: 0.5,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Notes ({notesCountLabel})
          </Box>
        </Stack>

        {activeTab === 'details' ? (
          <ContactQuickDetails
            initials={initials}
            name={contactName}
            companyName={companyName}
            email={contactEmail}
            phone={contactPhone}
          />
        ) : (
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
            maxHeight={320}
            noAccessTitle="No linked contact"
            noAccessDescription="Link a contact to this deal to manage notes."
            emptyTitle="No notes yet"
            emptyDescription="Capture call outcomes, objections, and next steps."
          />
        )}
      </Box>

      <NoteEditorModal
        open={isNoteModalOpen}
        mode={noteModalMode}
        value={noteBody}
        error={noteBodyError}
        maxLength={NOTE_BODY_MAX_LENGTH}
        isLoading={isNoteSubmitLoading}
        onChange={(value) => {
          setNoteBody(value);
          if (noteBodyError) setNoteBodyError(null);
        }}
        onClose={closeNoteModal}
        onSubmit={() => {
          void submitNote();
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
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteNote}
      />
    </>
  );
};

export default ContactNotesPanel;
