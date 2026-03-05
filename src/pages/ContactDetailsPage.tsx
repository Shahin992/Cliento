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
  ArrowBack,
  CameraAltOutlined,
  DeleteOutlineOutlined,
  EmailOutlined,
  EditOutlined,
  LocationOnOutlined,
  MoreHoriz,
  SellOutlined,
} from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAppSelector } from '../app/hooks';
import AddContactModal from '../components/contacts/modals/AddContactModal';
import ContactDealsSection from '../components/contacts/details/ContactDealsSection';
import ContactNotesSection from '../components/contacts/details/ContactNotesSection';
import ContactEmailConversation from '../components/contacts/details/ContactEmailConversation';
import EmailComposerDrawer from '../components/mail/EmailComposerDrawer';
import ConfirmationAlertModal from '../common/ConfirmationAlertModal';
import { useToast } from '../common/ToastProvider';
import { type ContactDetails } from '../hooks/contacts/contactTypes';
import { useConversationsInfiniteQuery } from '../hooks/contacts/useConversationsInfiniteQuery';
import type { SendGoogleMailPayload } from '../hooks/mail/useMailMutations';
import { useSendGoogleMailMutation } from '../hooks/mail/useMailMutations';
import { useContactByIdQuery } from '../hooks/contacts/useContactsQueries';
import { useDeleteContactMutation } from '../hooks/contacts/useContactsMutations';

const borderColor = '#e6eaf1';
const mutedText = '#7e8796';
const primary = '#6d28ff';

type ContactTabKey = 'deals' | 'notes' | 'conversation' | 'inbox' | 'tasks';

const contactTabs: Array<{ key: ContactTabKey; label: string; enabled: boolean }> = [
  { key: 'conversation', label: 'Conversation', enabled: true },
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

const formatConversationDate = (value?: string | null) => {
  if (!value) {
    return { day: '-', time: '-' };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { day: '-', time: '-' };
  }

  return {
    day: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
  };
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
  const [activeTab, setActiveTab] = useState<ContactTabKey>('conversation');
  const [dealStatusFilter, setDealStatusFilter] = useState<'open' | 'won' | 'lost'>('open');
  const [associatedDealsCount, setAssociatedDealsCount] = useState(0);
  const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isMailConnectionAlertOpen, setIsMailConnectionAlertOpen] = useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const isActionsMenuOpen = Boolean(actionsMenuAnchorEl);
  const { showToast } = useToast();
  const authUser = useAppSelector((state) => state.auth.user);
  const {
    contact: queriedContact,
    loading: isLoading,
    errorMessage,
  } = useContactByIdQuery(contactId);
  const contact = queriedContact ?? null;
  const { deleteContact, loading: isDeletingContact } = useDeleteContactMutation();
  const { sendMail, loading: isSendingMail } = useSendGoogleMailMutation();
  const {
    conversations,
    initialLoading: isConversationInitialLoading,
    refreshing: isConversationRefreshing,
    loadingMore: isConversationLoadingMore,
    hasNextPage: hasNextConversationsPage,
    fetchNextPage: fetchNextConversationsPage,
    errorMessage: conversationErrorMessage,
  } = useConversationsInfiniteQuery(contactId, 10, activeTab === 'conversation' && Boolean(contactId));

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
  const connectedEmails = useMemo(
    () => authUser?.connectedEmails?.map((email) => email.trim()).filter(Boolean) ?? [],
    [authUser?.connectedEmails]
  );
  const hasConnectedEmails =
    (authUser?.connectedEmailCount ?? connectedEmails.length) > 0 && connectedEmails.length > 0;

  const contactTags = useMemo(
    () => (contact?.tags ?? []).map((tag) => tag?.trim()).filter((tag): tag is string => Boolean(tag)),
    [contact]
  );
  const authUserInitials = useMemo(() => {
    const name = authUser?.fullName?.trim() ?? '';
    if (!name) return 'U';
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts[1]?.[0] ?? '';
    return `${first}${last}`.toUpperCase() || first.toUpperCase() || 'U';
  }, [authUser?.fullName]);
  const conversationMessages = useMemo(
    () =>
      conversations.map((item) => {
        const rawBody = item.body?.trim() ?? '';
        const normalizedBody = rawBody
          ? new DOMParser().parseFromString(rawBody, 'text/html').body.textContent?.trim() || rawBody
          : '';
        const { day, time } = formatConversationDate(item.sentAt);
        const isOutgoing = item.direction === 'outgoing';

        return {
          id: item._id,
          role: isOutgoing ? 'sender' : 'receiver',
          avatarSrc: isOutgoing ? authUser?.profilePhoto ?? null : contact?.photoUrl ?? null,
          avatarLabel: isOutgoing ? authUserInitials : initials,
          subject: item.subject?.trim() || '(No subject)',
          from: item.from || '-',
          to: item.to.length ? item.to.join(', ') : '-',
          text: normalizedBody || 'No message body',
          day,
          time,
        } as const;
      }),
    [authUser?.profilePhoto, authUserInitials, contact?.photoUrl, conversations, initials]
  );

  const handleEmailClick = () => {
    if (!contact?.emails?.[0]) {
      showToast({
        message: 'This contact does not have an email address.',
        severity: 'error',
      });
      return;
    }

    if (!hasConnectedEmails) {
      setIsMailConnectionAlertOpen(true);
      return;
    }

    setIsEmailDrawerOpen(true);
  };

  const handleSendEmail = async (payload: SendGoogleMailPayload) => {
    try {
      const response = await sendMail(payload);
      showToast({
        message: response.message || 'Email sent successfully.',
        severity: 'success',
      });
      setIsEmailDrawerOpen(false);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to send email.',
        severity: 'error',
      });
    }
  };

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
                <Button
                  variant="contained"
                  startIcon={<EmailOutlined sx={{ fontSize: 16 }} />}
                  onClick={handleEmailClick}
                  sx={{
                    textTransform: 'none',
                    minWidth: { xs: 120, sm: 132 },
                    bgcolor: primary,
                    '&:hover': { bgcolor: '#5b21d7' },
                  }}
                >
                  Send Email
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
              ) : activeTab === 'conversation' ? (
                <ContactEmailConversation
                  messages={conversationMessages}
                  isInitialLoading={isConversationInitialLoading}
                  isRefreshing={isConversationRefreshing}
                  isLoadingMore={isConversationLoadingMore}
                  hasNextPage={Boolean(hasNextConversationsPage)}
                  errorMessage={conversationErrorMessage}
                  onLoadMore={() => {
                    if (hasNextConversationsPage && !isConversationLoadingMore) {
                      void fetchNextConversationsPage();
                    }
                  }}
                />
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

      {contact ? (
        <EmailComposerDrawer
          contactId={contact._id}
          open={isEmailDrawerOpen}
          fromEmails={connectedEmails}
          initialTo={contact.emails?.[0] ?? ''}
          title={`Email ${fullName}`}
          subtitle="Use one of your connected mailboxes to draft a message."
          isSubmitting={isSendingMail}
          onClose={() => setIsEmailDrawerOpen(false)}
          onSubmit={handleSendEmail}
        />
      ) : null}

      <ConfirmationAlertModal
        open={isMailConnectionAlertOpen}
        variant="warning"
        title="Connect an email first"
        message="No connected email was found for your account. Connect an email to start sending messages from contact details."
        confirmText="Connect Email"
        cancelText="Not now"
        onClose={() => setIsMailConnectionAlertOpen(false)}
        onConfirm={() => {
          setIsMailConnectionAlertOpen(false);
          navigate('/settings/mail');
        }}
      />

      {isDeleteConfirmOpen && (
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
