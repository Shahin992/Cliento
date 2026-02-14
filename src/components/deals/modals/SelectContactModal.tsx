import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Box, Modal, Skeleton, Stack, Typography } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { CloseOutlined, ChevronRightOutlined } from '@mui/icons-material';

import { inputSx, mutedText, primary } from './dealModalStyles';
import {
  useContactOptionsInfiniteQuery,
  type ContactOption,
} from '../../../hooks/contacts/useContactOptionsInfiniteQuery';

interface SelectContactModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (contact: ContactOption) => void;
}

const SelectContactModal = ({
  open,
  onClose,
  onSelect,
}: SelectContactModalProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const {
    contacts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useContactOptionsInfiniteQuery(debouncedQuery, 10, open);

  const canLoadMore = Boolean(hasNextPage) && !isFetchingNextPage;

  const handleScroll = () => {
    const element = listRef.current;
    if (!element || !canLoadMore) return;

    const threshold = 24;
    const reachedBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight <= threshold;

    if (reachedBottom) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (!open) return;
    const element = listRef.current;
    if (!element) return;
    element.scrollTop = 0;
  }, [open, debouncedQuery]);

  const contactItems = useMemo(() => contacts, [contacts]);
  const isInitialLoading = isLoading && contactItems.length === 0;
  const isSearchLoading = !isLoading && isFetching && !isFetchingNextPage;
  const isBlockingLoading = isInitialLoading || isSearchLoading;
  const showEmptyState = !isBlockingLoading && !isError && contactItems.length === 0;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="select-contact-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92vw', sm: 360 },
          maxWidth: '92vw',
          minHeight: { xs: 480, sm: 520 },
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22)',
          p: 2.5,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="select-contact-title" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Select Contact
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
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
          </Stack>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box
            component="input"
            sx={inputSx}
            placeholder="Search contact"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Box>

        {isBlockingLoading ? (
          <Box
            sx={{
              mt: 2,
              minHeight: 280,
              maxHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
              overflow: 'hidden',
              borderRadius: 2,
              backgroundColor: '#f8fbff',
              p: 1.25,
            }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Stack key={index} direction="row" spacing={1.25} alignItems="center">
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="65%" height={18} />
                  <Skeleton variant="text" width="45%" height={14} />
                </Box>
              </Stack>
            ))}
          </Box>
        ) : (
          <Stack
            ref={listRef}
            spacing={1.25}
            sx={{ mt: 2, minHeight: 280, maxHeight: 320, overflowY: 'auto', pr: 0.5 }}
            onScroll={handleScroll}
          >
            {contactItems.map((contact) => (
              <Stack
                key={contact._id}
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{
                  p: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f8fbff' },
                }}
                onClick={() => onSelect?.(contact)}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: '#e8f0ff',
                    color: primary,
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                  src={contact.photoUrl ?? undefined}
                >
                  {contact.name
                    .split(' ')
                    .map((part) => part[0] ?? '')
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {contact.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: mutedText }}>
                    {contact.email?.trim() || contact.phone?.trim() || 'No email or phone'}
                  </Typography>
                </Box>
                <ChevronRightOutlined sx={{ color: primary, fontSize: 18 }} />
              </Stack>
            ))}
            {isError ? (
              <Typography variant="caption" sx={{ color: '#dc2626', textAlign: 'center', py: 1 }}>
                {error?.message ?? 'Failed to load contacts.'}
              </Typography>
            ) : null}
            {showEmptyState ? (
              <Typography variant="caption" sx={{ color: mutedText, textAlign: 'center' }}>
                No contacts found.
              </Typography>
            ) : null}
            {isFetchingNextPage ? (
              <Stack spacing={1} sx={{ py: 1 }}>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Stack key={index} direction="row" spacing={1.25} alignItems="center">
                    <Skeleton variant="circular" width={36} height={36} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="58%" height={18} />
                      <Skeleton variant="text" width="38%" height={14} />
                    </Box>
                  </Stack>
                ))}
              </Stack>
            ) : null}
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default SelectContactModal;
