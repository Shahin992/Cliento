import { useMemo, useState, type MouseEvent } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import {
  AlternateEmailOutlined,
  ArrowBack,
  CameraAltOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  LocationOnOutlined,
  MoreHoriz,
  SellOutlined,
} from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';

import AddContactModal from '../components/contacts/modals/AddContactModal';
import ContactDealsSection from '../components/contacts/details/ContactDealsSection';
import ContactNotesSection from '../components/contacts/details/ContactNotesSection';
import ConfirmationAlertModal from '../common/ConfirmationAlertModal';
import { useToast } from '../common/ToastProvider';
import { type ContactDetails } from '../hooks/contacts/contactTypes';
import { useContactByIdQuery } from '../hooks/contacts/useContactsQueries';
import { useDeleteContactMutation } from '../hooks/contacts/useContactsMutations';

const borderColor = '#e6eaf1';
const mutedText = '#7e8796';
const primary = '#6d28ff';

type ContactTabKey = 'deals' | 'notes' | 'inbox' | 'tasks';

const contactTabs: Array<{ key: ContactTabKey; label: string; enabled: boolean }> = [
  { key: 'deals', label: 'Deals', enabled: true },
  { key: 'notes', label: 'Notes', enabled: true },
  { key: 'inbox', label: 'Inbox', enabled: false },
  { key: 'tasks', label: 'Tasks', enabled: false },
];

const detailLabelSx = { color: mutedText, fontSize: 13, minWidth: { xs: 'auto', lg: 104 }, flexShrink: 0 };
const detailValueContainerSx = {
  flex: { xs: '0 1 auto', lg: 1 },
  minWidth: 0,
  textAlign: { xs: 'right', lg: 'left' },
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
};

const formatAddress = (contact: ContactDetails) => {
  const parts = [
    contact.address?.street,
    contact.address?.city,
    contact.address?.state,
    contact.address?.postalCode,
    contact.address?.country,
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : '-';
};

const ContactDetailsSkeleton = () => (
  <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: 3, backgroundColor: 'white', overflow: 'hidden' }}>
    <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
      <Skeleton variant="text" width={90} height={24} />
      <Stack direction="row" spacing={1.5} alignItems="center" mt={1.2}>
        <Skeleton variant="circular" width={56} height={56} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={180} height={32} />
          <Skeleton variant="text" width="100%" height={22} />
        </Box>
      </Stack>
    </Box>
    <Divider />
    <Box sx={{ p: 2.5 }}>
      <Skeleton variant="rounded" height={460} sx={{ borderRadius: 2.5 }} />
    </Box>
  </Box>
);

const ContactDetailsPage = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();
  const [activeTab, setActiveTab] = useState<ContactTabKey>('deals');
  const [dealStatusFilter, setDealStatusFilter] = useState<'open' | 'won' | 'lost'>('open');
  const [associatedDealsCount, setAssociatedDealsCount] = useState(0);
  const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const isActionsMenuOpen = Boolean(actionsMenuAnchorEl);
  const { showToast } = useToast();
  const {
    contact: queriedContact,
    loading: isLoading,
    errorMessage,
  } = useContactByIdQuery(contactId);
  const contact = queriedContact ?? null;
  const { deleteContact, loading: isDeletingContact } = useDeleteContactMutation();

  const handleOpenActionsMenu = (event: MouseEvent<HTMLElement>) => {
    setActionsMenuAnchorEl(event.currentTarget);
  };

  const handleCloseActionsMenu = () => {
    setActionsMenuAnchorEl(null);
  };

  const handleEditContact = () => {
    handleCloseActionsMenu();
    setIsEditModalOpen(true);
  };

  const handleDeleteContact = () => {
    handleCloseActionsMenu();
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteContact = async () => {
    if (!contact) {
      setIsDeleteConfirmOpen(false);
      return;
    }

    try {
      await deleteContact(contact._id);

      showToast({
        message: 'Contact deleted successfully.',
        severity: 'success',
      });
      setIsDeleteConfirmOpen(false);
      navigate('/contacts');
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to delete contact.',
        severity: 'error',
      });
    }
  };

  const fullName = useMemo(() => {
    if (!contact) return '';
    return [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'Unnamed Contact';
  }, [contact]);

  const initials = useMemo(() => {
    if (!contact) return 'C';
    const first = contact.firstName?.trim()?.[0] ?? '';
    const last = contact.lastName?.trim()?.[0] ?? '';
    return `${first}${last}`.toUpperCase() || 'C';
  }, [contact]);

  const emailCount = contact?.emails?.length ?? 0;
  const phoneCount = contact?.phones?.length ?? 0;
  const primaryEmail = contact?.emails?.[0] || '-';

  const contactTags = useMemo(
    () => (contact?.tags ?? []).map((tag) => tag?.trim()).filter((tag): tag is string => Boolean(tag)),
    [contact]
  );

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 1.5, sm: 2, md: 3 },
        pb: 4,
        minHeight: { xs: 'calc(100vh - 96px)', sm: 'calc(100vh - 110px)' },
      }}
    >
      {isLoading ? <ContactDetailsSkeleton /> : null}

      {!isLoading && !contact ? (
        <Box
          sx={{
            borderRadius: 3,
            border: `1px solid ${borderColor}`,
            backgroundColor: 'white',
            px: { xs: 2, sm: 3 },
            py: { xs: 4, sm: 5 },
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>Contact unavailable</Typography>
          <Typography sx={{ color: mutedText }}>{errorMessage || 'No contact data found.'}</Typography>
          <Typography
            component={Link}
            to="/contacts"
            sx={{ mt: 2, display: 'inline-block', color: primary, textDecoration: 'none', fontWeight: 700 }}
          >
            Back to Contacts
          </Typography>
        </Box>
      ) : null}

      {!isLoading && contact ? (
        <Box
          sx={{
            border: `1px solid ${borderColor}`,
            borderRadius: 3,
            backgroundColor: 'white',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: { xs: 1.5, sm: 2.5 }, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
              onClick={() => navigate(-1)}
              sx={{ textTransform: 'none', color: '#4b5563', minWidth: 0, px: 0.5 }}
            >
              Back
            </Button>
            <Button
              onClick={handleOpenActionsMenu}
              sx={{ minWidth: 30, width: 30, height: 30, borderRadius: 1.5, border: `1px solid ${borderColor}` }}
            >
              <MoreHoriz sx={{ color: '#4b5563', fontSize: 18 }} />
            </Button>
          </Box>

          <Box sx={{ px: { xs: 1.5, sm: 2.5 }, pb: 1.5 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.3} alignItems="center">
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <Avatar
                    src={contact.photoUrl || undefined}
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: '#eef2ff',
                      color: primary,
                      fontWeight: 800,
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      right: -2,
                      bottom: -2,
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      border: '2px solid white',
                      backgroundColor: primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <CameraAltOutlined sx={{ fontSize: 12, color: 'white' }} />
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#111827', fontSize: 24 }}>{fullName}</Typography>
                  <Typography sx={{ color: mutedText, fontSize: 13 }}>
                    {primaryEmail} • {contact.companyName || 'No company'}
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" mt={0.75}>
                    <Chip size="small" label={contact.status || 'Lead'} sx={{ bgcolor: '#ecfdf3', color: '#047857', fontWeight: 700 }} />
                    <Chip size="small" label={contact.leadSource || 'manual'} sx={{ bgcolor: '#f3f4f6', color: '#374151', textTransform: 'capitalize' }} />
                    {contactTags.length > 0 ? (
                      contactTags.map((tag) => (
                        <Chip key={`header-tag-${tag}`} size="small" label={tag} sx={{ bgcolor: '#f3f4f6', color: '#374151' }} />
                      ))
                    ) : (
                      <Chip size="small" label="No tags" sx={{ bgcolor: '#f3f4f6', color: '#6b7280' }} />
                    )}
                  </Stack>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button variant="outlined" startIcon={<AlternateEmailOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', borderColor, color: '#111827', minWidth: { xs: 90, sm: 96 } }}>
                  Email
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Menu
            anchorEl={actionsMenuAnchorEl}
            open={isActionsMenuOpen}
            onClose={handleCloseActionsMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 0.5,
                  borderRadius: 2,
                  minWidth: 190,
                  boxShadow: '0 16px 30px rgba(15, 23, 42, 0.14)',
                  border: `1px solid ${borderColor}`,
                },
              },
            }}
          >
            <MenuItem onClick={handleEditContact}>
              <ListItemIcon>
                <EditOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Edit Contact" />
            </MenuItem>
            <MenuItem onClick={handleDeleteContact} sx={{ color: '#dc2626' }}>
              <ListItemIcon>
                <DeleteOutlineOutlined fontSize="small" sx={{ color: '#dc2626' }} />
              </ListItemIcon>
              <ListItemText primary="Delete Contact" />
            </MenuItem>
          </Menu>

          <Divider />

          <Box sx={{ px: { xs: 1.5, sm: 2.5 }, borderBottom: `1px solid ${borderColor}` }}>
            <Stack direction="row" spacing={2.25} sx={{ overflowX: 'auto', py: 1.2 }}>
              {contactTabs.filter((tab) => tab.enabled).map((tab) => (
                <Typography
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  sx={{
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: 13,
                    fontWeight: activeTab === tab.key ? 700 : 500,
                    color: activeTab === tab.key ? '#111827' : mutedText,
                    borderBottom: activeTab === tab.key ? `2px solid ${primary}` : '2px solid transparent',
                    pb: 0.8,
                  }}
                >
                  {tab.label}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'minmax(0, 1.55fr) minmax(240px, 320px)',
                lg: 'minmax(0, 1.9fr) minmax(260px, 340px)',
              },
              minHeight: 520,
            }}
          >
            <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRight: { xs: 'none', lg: `1px solid ${borderColor}` } }}>
              {activeTab === 'deals' ? (
                <ContactDealsSection
                  contact={contact}
                  contactId={contactId}
                  dealStatusFilter={dealStatusFilter}
                  onDealStatusFilterChange={setDealStatusFilter}
                  onDealsCountChange={setAssociatedDealsCount}
                />
              ) : activeTab === 'notes' ? (
                <ContactNotesSection contactId={contactId} />
              ) : (
                <Box sx={{ border: `1px dashed ${borderColor}`, borderRadius: 2, p: 2.5 }}>
                  <Typography sx={{ fontWeight: 700, color: '#111827', textTransform: 'capitalize' }}>
                    {activeTab}
                  </Typography>
                  <Typography sx={{ color: mutedText, mt: 0.75 }}>
                    Content for {activeTab} can be added here.
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack spacing={2}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: 14, mb: 1 }}>Details</Typography>
                  <Stack spacing={1.15}>
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      spacing={{ xs: 0.75, lg: 1 }}
                    >
                      <Typography sx={detailLabelSx}>Type</Typography>
                      <Chip
                        size="small"
                        label={contact.status || 'Lead'}
                        sx={{
                          height: 22,
                          fontWeight: 700,
                          bgcolor: '#f3f4f6',
                          alignSelf: 'flex-start',
                        }}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={{ xs: 0.75, lg: 1 }}>
                      <Typography sx={detailLabelSx}>Tags</Typography>
                      <Box
                        sx={{
                          ...detailValueContainerSx,
                          display: 'flex',
                          gap: 0.6,
                          flexWrap: 'wrap',
                          justifyContent: { xs: 'flex-end', lg: 'flex-start' },
                        }}
                      >
                        {contactTags.length > 0 ? (
                          contactTags.map((tag) => (
                            <Chip
                              key={`details-tag-${tag}`}
                              size="small"
                              label={tag}
                              sx={{ height: 22, bgcolor: '#f3e8ff', color: '#6b21a8', fontWeight: 600 }}
                            />
                          ))
                        ) : (
                          <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>-</Typography>
                        )}
                      </Box>
                    </Stack>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={{ xs: 0.75, lg: 1 }}>
                      <Typography sx={detailLabelSx}>Emails</Typography>
                      <Stack spacing={0.4} alignItems={{ xs: 'flex-end', lg: 'flex-start' }} sx={detailValueContainerSx}>
                        {emailCount > 0 ? (
                          contact.emails.map((email, index) => (
                            <Typography
                              key={`details-email-${index}`}
                              sx={{ color: '#111827', fontSize: 13, fontWeight: 600, wordBreak: 'break-all' }}
                            >
                              {email}
                            </Typography>
                          ))
                        ) : (
                          <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>-</Typography>
                        )}
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={{ xs: 0.75, lg: 1 }}>
                      <Typography sx={detailLabelSx}>Phone numbers</Typography>
                      <Stack spacing={0.4} alignItems={{ xs: 'flex-end', lg: 'flex-start' }} sx={detailValueContainerSx}>
                        {phoneCount > 0 ? (
                          contact.phones.map((phone, index) => (
                            <Typography
                              key={`details-phone-${index}`}
                              sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}
                            >
                              {phone}
                            </Typography>
                          ))
                        ) : (
                          <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>-</Typography>
                        )}
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={{ xs: 0.75, lg: 1 }}>
                      <Typography sx={detailLabelSx}>Location</Typography>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="flex-start"
                        justifyContent={{ xs: 'flex-end', lg: 'flex-start' }}
                        sx={detailValueContainerSx}
                      >
                        <LocationOnOutlined sx={{ fontSize: 14, color: mutedText, mt: 0.1 }} />
                        <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600, wordBreak: 'break-word' }}>
                          {formatAddress(contact)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: 14, mb: 1 }}>Enriched data</Typography>
                  <Stack spacing={1.15}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={{ xs: 0.75, lg: 1 }}>
                      <Typography sx={detailLabelSx}>Ownership</Typography>
                      <Typography sx={{ ...detailValueContainerSx, color: '#111827', fontSize: 13, fontWeight: 600 }}>
                        {contact.ownerDetails?.fullName || 'Home owner'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={{ xs: 0.75, lg: 1 }}>
                      <Typography sx={detailLabelSx}>Associated deals</Typography>
                      <Stack
                        direction="row"
                        spacing={0.55}
                        alignItems="center"
                        justifyContent={{ xs: 'flex-end', lg: 'flex-start' }}
                        sx={detailValueContainerSx}
                      >
                        <SellOutlined sx={{ fontSize: 14, color: '#111827' }} />
                        <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>
                          {associatedDealsCount} {dealStatusFilter} {associatedDealsCount === 1 ? 'deal' : 'deals'}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={{ xs: 0.75, lg: 1 }}>
                      <Typography sx={detailLabelSx}>Created</Typography>
                      <Typography sx={{ ...detailValueContainerSx, color: '#111827', fontSize: 13, fontWeight: 600 }}>
                        {formatDateTime(contact.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      ) : null}

      {contact ? (
        <AddContactModal
          open={isEditModalOpen}
          mode="edit"
          initialData={contact}
          onClose={() => setIsEditModalOpen(false)}
          onSave={() => {
            setIsEditModalOpen(false);
          }}
        />
      ) : null}

     { isDeleteConfirmOpen && ( 
      <ConfirmationAlertModal
        open={isDeleteConfirmOpen}
        variant="delete"
        title="Delete contact?"
        message="This action cannot be undone. Do you want to continue?"
        confirmText="Yes, delete"
        cancelText="No, keep it"
        isConfirmLoading={isDeletingContact}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDeleteContact}
      />
      )}
    </Box>
  );
};

export default ContactDetailsPage;
