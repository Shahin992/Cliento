import { useEffect, useState } from 'react';
import { CustomIconButton } from '../common/CustomIconButton';
import {
  Avatar,
  Box,
  InputAdornment,
  MenuItem,
  Pagination,
  Skeleton,
  Select,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  AddOutlined,
  Close,
  DeleteOutlineOutlined,
  EditOutlined,
  LocalOfferOutlined,
  PersonOffOutlined,
  SearchOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import BasicInput from '../common/BasicInput';
import { CustomButton } from '../common/CustomButton';
import ConfirmationAlertModal from '../common/ConfirmationAlertModal';
import { useToast } from '../common/ToastProvider';
import AddContactModal from '../components/contacts/modals/AddContactModal';
import { type ContactListItem } from '../services/contacts';
import { useContactsQuery } from '../hooks/contacts/useContactsQueries';
import { useDeleteContactMutation } from '../hooks/contacts/useContactsMutations';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const primary = '#346fef';
const bgSoft = '#f8fbff';
const DEFAULT_PAGE_SIZE = 10;
const PAGE_LIMIT_OPTIONS = [10, 25, 50, 100];

const getContactInitials = (contact: ContactListItem) => {
  const first = contact.firstName?.trim()?.[0] ?? '';
  const last = contact.lastName?.trim()?.[0] ?? '';
  const fromName = `${first}${last}`.toUpperCase();

  if (fromName.length > 0) {
    return fromName;
  }

  const fallback = contact.emails?.[0]?.trim()?.[0] ?? 'C';
  return fallback.toUpperCase();
};

const ContactRowSkeleton = () => (
  <Box
    sx={{
      display: { xs: 'flex', lg: 'grid' },
      flexDirection: { xs: 'column', lg: 'unset' },
      gridTemplateColumns:
        'minmax(240px, 2.2fr) minmax(220px, 1.9fr) minmax(160px, 1.2fr) minmax(180px, 1.4fr) minmax(130px, 1fr)',
      px: { xs: 1.5, sm: 2.5 },
      py: { xs: 1.5, sm: 1.75 },
      gap: { xs: 1.25, sm: 0 },
      alignItems: { lg: 'center' },
      borderRadius: { xs: 2, lg: 0 },
      backgroundColor: { xs: '#f8fbff', lg: 'transparent' },
      border: { xs: `1px solid ${borderColor}`, lg: 'none' },
      mb: { xs: 1.25, lg: 0 },
      borderBottom: `1px solid ${borderColor}`,
    }}
  >
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Skeleton variant="circular" width={36} height={36} />
      <Skeleton variant="text" width={150} height={24} />
    </Stack>
    <Skeleton variant="text" width={170} height={24} />
    <Skeleton variant="text" width={120} height={24} />
    <Skeleton variant="text" width={120} height={24} />
    <Stack direction="row" spacing={0.75} justifyContent={{ xs: 'flex-start', lg: 'center' }}>
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="circular" width={32} height={32} />
    </Stack>
  </Box>
);

const ContactsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState<ContactListItem | null>(null);
  const [selectedContactForDelete, setSelectedContactForDelete] = useState<ContactListItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const isMobileViewport = useMediaQuery('(max-width:599.95px)');
  const { showToast } = useToast();
  const { deleteContact, loading: isDeletingContact } = useDeleteContactMutation();
  const {
    contacts,
    pagination,
    loading: isLoadingContacts,
    errorMessage: contactsError,
  } = useContactsQuery(page, limit, debouncedSearchQuery || undefined);

  const openAddContactModal = () => {
    setSelectedContactForEdit(null);
    setIsAddContactOpen(true);
  };

  const openEditContactModal = (contact: ContactListItem) => {
    setSelectedContactForEdit(contact);
    setIsAddContactOpen(true);
  };

  const openDeleteContactModal = (contact: ContactListItem) => {
    setSelectedContactForDelete(contact);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteContact = async () => {
    const contactId = selectedContactForDelete?._id?.trim();
    if (!contactId) {
      setIsDeleteConfirmOpen(false);
      setSelectedContactForDelete(null);
      return;
    }

    try {
      await deleteContact(contactId);

      showToast({
        message: 'Contact deleted successfully.',
        severity: 'success',
      });
      setIsDeleteConfirmOpen(false);
      setSelectedContactForDelete(null);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to delete contact.',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [limit]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    const serverPage = Math.max(1, Number(pagination?.page) || page);
    if (serverPage !== page) {
      setPage(serverPage);
    }
  }, [pagination?.page, page]);

  const totalContacts = Math.max(0, Number(pagination?.total) || 0);
  const totalPages = Math.max(1, Number(pagination?.totalPages) || 1);
  const serverLimit = Math.max(1, Number(pagination?.limit) || limit);
  const pageStart = totalContacts === 0 ? 0 : (page - 1) * serverLimit + 1;
  const pageEnd =
    totalContacts === 0 ? 0 : Math.min((page - 1) * serverLimit + contacts.length, totalContacts);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 1.5, sm: 2, md: 3 },
        pb: { xs: 12, sm: 0 },
        height: { xs: 'auto', sm: 'calc(100vh - 112px)' },
        minHeight: 0,
        overflow: { xs: 'visible', sm: 'hidden' },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <PageHeader
        title="Contacts"
        subtitle="Manage your contact list"
        stackOnMobile={false}
        actionFullWidthOnMobile={false}
        action={
          <>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="flex-end"
              sx={{ display: { xs: 'flex', sm: 'none' }, minWidth: 90 }}
            >
              {!isMobileSearchOpen ? (
                <CustomIconButton
                  size="small"
                  onClick={() => setIsMobileSearchOpen(true)}
                  customColor={mutedText}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    border: `1px solid ${borderColor}`,
                    backgroundColor: 'white',
                  }}
                >
                  <SearchOutlined sx={{ fontSize: 20 }} />
                </CustomIconButton>
              ) : null}
              <CustomIconButton
                size="small"
                onClick={openAddContactModal}
                customColor="white"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  backgroundColor: `${primary} !important`,
                  '&:hover': {
                    backgroundColor: '#346fef !important',
                  },
                  '&:focus, &:focus-visible': {
                    backgroundColor: `${primary} !important`,
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: `${primary} !important`,
                  },
                }}
              >
                <AddOutlined sx={{ fontSize: 20 }} />
              </CustomIconButton>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: 'none', sm: 'flex' }, width: { sm: 'auto' }, flexWrap: 'nowrap' }}
            >
              <BasicInput
                fullWidth
                placeholder="Search contacts"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                minWidth={240}
                sx={{
                  height: 40,
                  borderRadius: 999,
                  borderColor: '#d6dee9',
                  minWidth: { sm: 240, md: 280 },
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchOutlined sx={{ color: mutedText, fontSize: 20 }} />
                  </InputAdornment>
                }
              />
              <CustomButton
                variant="contained"
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  textTransform: 'none',
                  minWidth: { sm: 132, md: 148 },
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
                onClick={openAddContactModal}
              >
                Add Contact
              </CustomButton>
            </Stack>
          </>
        }
      />
      <Box sx={{ mt: -1, mb: 1, display: { xs: isMobileSearchOpen ? 'block' : 'none', sm: 'none' } }}>
        <BasicInput
          autoFocus={isMobileSearchOpen}
          fullWidth
          placeholder="Search contacts"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          minWidth={0}
          sx={{
            height: 40,
            borderRadius: 999,
            borderColor: '#d6dee9',
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchOutlined sx={{ color: mutedText, fontSize: 20 }} />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <CustomIconButton
                size="small"
                onClick={() => {
                  if (isMobileViewport) {
                    setIsMobileSearchOpen(false);
                    return;
                  }
                  setSearchQuery('');
                }}
                customColor={mutedText}
              >
                <Close fontSize="small" />
              </CustomIconButton>
            </InputAdornment>
          }
        />
      </Box>

        <Box
          sx={{
            width: '100%',
            borderRadius: 3,
            border: `1px solid ${borderColor}`,
            backgroundColor: 'white',
          overflow: 'hidden',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{
            px: { xs: 1.5, sm: 2.5 },
            py: 2,
            gap: 1.5,
            borderBottom: `1px solid ${borderColor}`,
            backgroundColor: bgSoft,
          }}
        >
          {!isLoadingContacts ? (
            <Typography sx={{ fontWeight: 600, color: '#111827' }}>
              Total: {totalContacts} contacts
            </Typography>
          ) : null}
        </Stack>

        <Box
          sx={{
            overflowX: 'hidden',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', lg: 'grid' },
              gridTemplateColumns:
                'minmax(240px, 2.2fr) minmax(220px, 1.9fr) minmax(160px, 1.2fr) minmax(180px, 1.4fr) minmax(130px, 1fr)',
              px: 2.5,
              py: 1.5,
              color: mutedText,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderBottom: `1px solid ${borderColor}`,
              alignItems: 'center',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalOfferOutlined sx={{ fontSize: 16, color: mutedText }} />
              <Box>Name</Box>
            </Stack>
            <Box>Email</Box>
            <Box>Phone</Box>
            <Box>Company</Box>
            <Box textAlign="center">Actions</Box>
          </Box>

          <Box
            sx={{
              flex: { xs: 'unset', sm: 1 },
              minHeight: { xs: 'auto', sm: 0 },
              overflowY: { xs: 'visible', sm: 'auto' },
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {isLoadingContacts ? (
              <Box sx={{ px: { xs: 0, lg: 0 }, py: { xs: 0.5, lg: 0 } }}>
                {Array.from({ length: Math.max(3, Math.min(limit, 8)) }).map((_, index) => (
                  <ContactRowSkeleton key={`contact-skeleton-${index}`} />
                ))}
              </Box>
            ) : null}
            {!isLoadingContacts
              ? contacts.map((contact, index) => {
                  const displayName =
                    [contact.firstName, contact.lastName].filter(Boolean).join(' ') || '-';
                  const displayEmail = contact.emails?.[0] || '-';
                  const displayPhone = contact.phones?.[0] || '-';

                  return (
                    <Box
                      key={`${contact._id}-${index}`}
                      sx={{
                        display: { xs: 'flex', lg: 'grid' },
                        flexDirection: { xs: 'column', lg: 'unset' },
                        gridTemplateColumns:
                          'minmax(240px, 2.2fr) minmax(220px, 1.9fr) minmax(160px, 1.2fr) minmax(180px, 1.4fr) minmax(130px, 1fr)',
                        px: { xs: 1.5, sm: 2.5 },
                        py: { xs: 1.5, sm: 1.75 },
                        gap: { xs: 1.5, sm: 0 },
                        alignItems: { lg: 'center' },
                        borderRadius: { xs: 2, lg: 0 },
                        backgroundColor: { xs: '#f8fbff', lg: 'transparent' },
                        borderBottom:
                          index === contacts.length - 1
                            ? 'none'
                            : `1px solid ${borderColor}`,
                        boxShadow: {
                          xs: '0 10px 20px rgba(15, 23, 42, 0.08)',
                          lg: 'none',
                        },
                        border: { xs: `1px solid ${borderColor}`, lg: 'none' },
                        mb: { xs: 1.25, lg: 0 },
                      }}
                    >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={contact.photoUrl || undefined}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#eef2ff',
                      color: primary,
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {getContactInitials(contact)}
                  </Avatar>
                  <Tooltip
                    title={displayName}
                    arrow
                    disableHoverListener={displayName.length <= 26}
                  >
                    <Typography
                      component={Link}
                      to={`/contacts/${contact._id}`}
                      sx={{
                        fontWeight: 600,
                        color: '#1f2937',
                        textDecoration: 'none',
                        display: 'inline-block',
                        maxWidth: { xs: 'calc(100vw - 140px)', lg: 220 },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        '&:hover': { color: primary },
                      }}
                    >
                      {displayName}
                    </Typography>
                  </Tooltip>
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    display: { xs: 'flex', lg: 'block' },
                    justifyContent: { xs: 'space-between', lg: 'flex-start' },
                    alignItems: { xs: 'center', lg: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', lg: 'none' } }}
                  >
                    Email
                  </Typography>
                  <Tooltip
                    title={displayEmail}
                    arrow
                    disableHoverListener={displayEmail.length <= 28}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: '#1f2937',
                        maxWidth: { xs: '65%', lg: 240 },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayEmail}
                    </Typography>
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'flex', lg: 'block' },
                    justifyContent: { xs: 'space-between', lg: 'flex-start' },
                    alignItems: { xs: 'center', lg: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', lg: 'none' } }}
                  >
                    Phone
                  </Typography>
                  <Tooltip
                    title={displayPhone}
                    arrow
                    disableHoverListener={displayPhone.length <= 18}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: '#1f2937',
                        maxWidth: { xs: '65%', lg: 180 },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayPhone}
                    </Typography>
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'flex', lg: 'block' },
                    justifyContent: { xs: 'space-between', lg: 'flex-start' },
                    alignItems: { xs: 'center', lg: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', lg: 'none' } }}
                  >
                    Company
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1f2937', wordBreak: 'break-word' }}>
                    {contact.companyName || '-'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-end', lg: 'center' },
                  }}
                >
                  <Stack direction="row" spacing={0.75}>
                    <Tooltip title="Edit contact" arrow>
                      <CustomIconButton
                        size="small"
                        onClick={() => openEditContactModal(contact)}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 999,
                          border: `1px solid ${borderColor}`,
                          color: '#64748b',
                          backgroundColor: 'white',
                        }}
                      >
                        <EditOutlined sx={{ fontSize: 16 }} />
                      </CustomIconButton>
                    </Tooltip>
                    <Tooltip title="Delete contact" arrow>
                      <CustomIconButton
                        size="small"
                        onClick={() => openDeleteContactModal(contact)}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 999,
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          backgroundColor: 'white',
                          '&:hover': {
                            backgroundColor: '#fef2f2',
                            borderColor: '#fecaca',
                            color: '#dc2626',
                          },
                          '&:focus, &:focus-visible': {
                            backgroundColor: '#fef2f2',
                            borderColor: '#fecaca',
                            color: '#dc2626',
                          },
                          '&.Mui-focusVisible': {
                            backgroundColor: '#fef2f2',
                            borderColor: '#fecaca',
                            color: '#dc2626',
                          },
                        }}
                      >
                        <DeleteOutlineOutlined sx={{ fontSize: 16, color: '#dc2626' }} />
                      </CustomIconButton>
                    </Tooltip>
                  </Stack>
                </Box>
                    </Box>
                  );
                })
              : null}
            {!isLoadingContacts && contactsError ? (
              <Box sx={{ px: 2.5, py: 4 }}>
                <Typography sx={{ color: '#ef4444' }}>{contactsError}</Typography>
              </Box>
            ) : null}
            {!isLoadingContacts && !contactsError && contacts.length === 0 ? (
              <Box
                sx={{
                  px: 2.5,
                  py: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 1,
                }}
              >
                <PersonOffOutlined sx={{ fontSize: 40, color: '#94a3b8' }} />
                <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                  No contacts found
                </Typography>
                <Typography sx={{ color: mutedText, maxWidth: 420 }}>
                  {searchQuery.trim()
                    ? 'Try a different name, email, or phone search.'
                    : 'Create your first contact to get started.'}
                </Typography>
                <CustomButton
                  variant="contained"
                  sx={{ borderRadius: 999, px: 2.25, mt: 1, textTransform: 'none' }}
                  onClick={openAddContactModal}
                >
                  Add Contact
                </CustomButton>
              </Box>
            ) : null}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 1.25, sm: 2 },
            borderTop: `1px solid ${borderColor}`,
            backgroundColor: 'white',
            flexWrap: 'nowrap',
            overflowX: 'auto',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
            <Typography sx={{ color: mutedText, fontSize: 13, display: { xs: 'none', sm: 'block' } }}>
              Rows per page
            </Typography>
            <Select
              size="small"
              value={String(limit)}
              onChange={(event) => setLimit(Number(event.target.value))}
              disabled={isLoadingContacts}
              sx={{
                minWidth: 84,
                height: 32,
                borderRadius: 999,
                '& .MuiSelect-select': {
                  py: 0.5,
                  px: 1.25,
                },
              }}
            >
              {PAGE_LIMIT_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ ml: 'auto', flexShrink: 0 }}
          >
            {!isLoadingContacts ? (
              <Typography sx={{ color: mutedText, fontSize: 13 }}>
                {totalContacts === 0
                  ? '0 results'
                  : `${pageStart}-${pageEnd} of ${totalContacts}`}
              </Typography>
            ) : null}
            {!isLoadingContacts ? (
              <Pagination
                page={page}
                count={totalPages}
                onChange={(_, value) => {
                  if (value !== page) {
                    setPage(value);
                  }
                }}
                disabled={isLoadingContacts || totalPages <= 1}
                shape="rounded"
                size="small"
                color="primary"
                siblingCount={0}
                boundaryCount={1}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 999,
                  },
                }}
              />
            ) : null}
          </Stack>
        </Box>
      </Box>

     {isAddContactOpen && ( 
      <AddContactModal
        open={isAddContactOpen}
        mode={selectedContactForEdit ? 'edit' : 'add'}
        initialData={selectedContactForEdit}
        onClose={() => {
          setIsAddContactOpen(false);
          setSelectedContactForEdit(null);
        }}
        onSave={() => {
          setIsAddContactOpen(false);
          if (!selectedContactForEdit) {
            setPage(1);
          }
          setSelectedContactForEdit(null);
        }}
      />)}

      <ConfirmationAlertModal
        open={isDeleteConfirmOpen}
        variant="delete"
        title="Delete contact?"
        message="This action cannot be undone. Do you want to continue?"
        confirmText="Yes, delete"
        cancelText="No, keep it"
        isConfirmLoading={isDeletingContact}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSelectedContactForDelete(null);
        }}
        onConfirm={handleConfirmDeleteContact}
      />
    </Box>
  );
};

export default ContactsPage;
