import { useState } from 'react';
import { Box, Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import {
  DeleteOutline,
  EmailOutlined,
  LinkOff,
  MarkEmailReadOutlined,
  RefreshOutlined,
} from '@mui/icons-material';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import { useToast } from '../common/ToastProvider';
import ConfirmationAlertModal from '../common/ConfirmationAlertModal';
import {
  useGoogleMailAccountsQuery,
  type GoogleMailbox,
} from '../hooks/mail/useMailQueries';
import {
  useDeleteGoogleMailboxMutation,
  useDisconnectGoogleMailboxMutation,
  useMakeDefaultGoogleMailboxMutation,
} from '../hooks/mail/useMailMutations';
import { AppHttpError } from '../hooks/useAppQuery';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const primary = '#6d28ff';

const cardSx = {
  borderRadius: 4,
  border: `1px solid ${borderColor}`,
  backgroundColor: 'white',
  px: { xs: 1.5, sm: 2.5 },
  py: { xs: 2, sm: 2.5 },
};

const getActionErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AppHttpError && error.statusCode === 401) {
    return 'Please login again.';
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

const MailIntegrationPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [disconnectTarget, setDisconnectTarget] = useState<GoogleMailbox | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GoogleMailbox | null>(null);
  const { showToast } = useToast();

  const { accounts, loading, errorMessage, error, refetch } = useGoogleMailAccountsQuery(true);
  const { disconnectMailbox, loading: disconnectLoading } = useDisconnectGoogleMailboxMutation();
  const { deleteMailbox, loading: deleteLoading } = useDeleteGoogleMailboxMutation();
  const { makeDefaultMailbox, loading: makeDefaultLoading } = useMakeDefaultGoogleMailboxMutation();

  const isActionLoading = disconnectLoading || deleteLoading || makeDefaultLoading;

  const loadAccounts = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleConnectEmail = () => {
    if (!accounts?.authUrl) {
      showToast({
        message: 'Google authorization URL is missing. Please refresh and try again.',
        severity: 'error',
      });
      return;
    }

    window.location.href = accounts.authUrl;
  };

  const handleConfirmDisconnect = async () => {
    if (!disconnectTarget?._id) return;
    try {
      const response = await disconnectMailbox(disconnectTarget._id);
      showToast({
        message: response.message || 'Google mailbox disconnected.',
        severity: 'success',
      });
      await refetch();
    } catch (error) {
      showToast({
        message: getActionErrorMessage(error, 'Failed to disconnect Gmail mailbox.'),
        severity: 'error',
      });
    } finally {
      setDisconnectTarget(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      const response = await deleteMailbox(deleteTarget._id);
      showToast({
        message: response.message || 'Google mailbox deleted.',
        severity: 'success',
      });
      await refetch();
    } catch (error) {
      showToast({
        message: getActionErrorMessage(error, 'Failed to delete Gmail mailbox.'),
        severity: 'error',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleMakeDefault = async (mailbox: GoogleMailbox) => {
    try {
      const response = await makeDefaultMailbox(mailbox._id);
      showToast({
        message: response.message || 'Default mailbox updated.',
        severity: 'success',
      });
      await refetch();
    } catch (error) {
      showToast({
        message: getActionErrorMessage(error, 'Failed to update default mailbox.'),
        severity: 'error',
      });
    }
  };

  const connectedCount = accounts?.connectedCount ?? 0;
  const mailboxes = accounts?.mailboxes ?? [];
  const canConnect = Boolean(accounts?.authUrl) && !loading;
  const totalCount = accounts?.total ?? 0;
  const deletedCount = mailboxes.filter((item) => item.isDeleted).length;
  const loadErrorMessage =
    error instanceof AppHttpError && error.statusCode === 401
      ? 'Please login again.'
      : errorMessage;

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
      <PageHeader
        title="Mail Settings"
        subtitle="Modern mailbox management for Gmail integration."
        action={
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <CustomButton
              variant="outlined"
              startIcon={<RefreshOutlined />}
              onClick={() => void loadAccounts()}
              disabled={loading || isRefreshing || isActionLoading}
              sx={{ textTransform: 'none', borderRadius: 999 }}
            >
              Refresh
            </CustomButton>
            <CustomButton
              variant="contained"
              startIcon={<EmailOutlined />}
              onClick={handleConnectEmail}
              disabled={!canConnect || isActionLoading}
              sx={{
                textTransform: 'none',
                borderRadius: 999,
                bgcolor: primary,
                '&:hover': { bgcolor: '#5b21d7' },
              }}
            >
              Connect Email
            </CustomButton>
          </Stack>
        }
      />

      <Box sx={cardSx}>
        {loading ? (
          <Stack spacing={1.5} alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={26} />
            <Typography sx={{ color: mutedText }}>Loading Gmail accounts...</Typography>
          </Stack>
        ) : null}

        {!loading && loadErrorMessage ? (
          <Stack spacing={2}>
            <Typography sx={{ color: '#b91c1c', fontWeight: 700 }}>
              Could not load mailbox status
            </Typography>
            <Typography sx={{ color: mutedText }}>{loadErrorMessage}</Typography>
            <Box>
              <CustomButton
                variant="contained"
                onClick={() => void loadAccounts()}
                sx={{ textTransform: 'none', borderRadius: 999 }}
              >
                Retry
              </CustomButton>
            </Box>
          </Stack>
        ) : null}

        {!loading && !errorMessage && accounts ? (
          <Stack spacing={2}>
            <Box
              sx={{
                border: `1px solid ${borderColor}`,
                borderRadius: 3,
                p: { xs: 1.5, sm: 2 },
                background:
                  'linear-gradient(135deg, rgba(109,40,255,0.10) 0%, rgba(59,130,246,0.04) 100%)',
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} justifyContent="space-between">
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: '#ffffff',
                      border: `1px solid ${borderColor}`,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <MarkEmailReadOutlined sx={{ color: primary }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#0f172a', fontWeight: 800 }}>Gmail Accounts</Typography>
                    <Typography sx={{ color: mutedText, fontSize: 13 }}>
                      Review mailbox status and manage connection actions.
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={`Total ${totalCount}`} sx={{ bgcolor: '#fff', color: '#111827', fontWeight: 700 }} />
                  <Chip
                    label={`Connected ${connectedCount}`}
                    sx={{ bgcolor: '#ecfdf3', color: '#047857', fontWeight: 700 }}
                  />
                  <Chip
                    label={`Deleted ${deletedCount}`}
                    sx={{ bgcolor: '#fef2f2', color: '#b91c1c', fontWeight: 700 }}
                  />
                </Stack>
              </Stack>
            </Box>

            {connectedCount === 0 && mailboxes.length === 0 ? (
              <Box
                sx={{
                  border: `1px dashed ${borderColor}`,
                  borderRadius: 3,
                  p: { xs: 2.5, sm: 4 },
                  textAlign: 'center',
                  backgroundColor: '#fbfcff',
                }}
              >
                <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>No connected Gmail account</Typography>
                <Typography sx={{ color: mutedText, mt: 0.5, mb: 1.5 }}>
                  Connect your Gmail account to continue.
                </Typography>
                <CustomButton
                  variant="contained"
                  startIcon={<EmailOutlined />}
                  onClick={handleConnectEmail}
                  disabled={!canConnect || isActionLoading}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 999,
                    bgcolor: primary,
                    '&:hover': { bgcolor: '#5b21d7' },
                  }}
                >
                  Connect Email
                </CustomButton>
              </Box>
            ) : null}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
                gap: 1.5,
              }}
            >
              {mailboxes.map((mailbox) => {
                const canDisconnect = mailbox.connected && !mailbox.isDisconnected && !mailbox.isDeleted;
                const canDelete = !mailbox.isDeleted;
                const canMakeDefault =
                  mailbox.isDefault === false && !mailbox.isDeleted && mailbox.connected;
                const canReconnect = mailbox.isDisconnected && !mailbox.isDeleted;

                return (
                <Box
                  key={mailbox._id}
                  sx={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: 3,
                    p: { xs: 1.5, sm: 2 },
                    transition: 'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
                    '&:hover': {
                      borderColor: '#d8dff0',
                      boxShadow: '0 14px 28px rgba(15, 23, 42, 0.08)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ color: '#0f172a', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {mailbox.googleEmail}
                        </Typography>
                        <Typography sx={{ color: mutedText, fontSize: 12 }}>
                          ID: {mailbox._id}
                        </Typography>
                      </Box>
                      {mailbox.isDefault ? (
                        <Chip
                          size="small"
                          label="Default"
                          sx={{ bgcolor: '#ede9fe', color: primary, fontWeight: 700 }}
                        />
                      ) : null}
                    </Stack>

                    <Stack direction="row" spacing={0.75} flexWrap="wrap">
                      {mailbox.connected ? (
                        <Chip
                          size="small"
                          label="Connected"
                          sx={{ bgcolor: '#ecfdf3', color: '#047857', fontWeight: 700 }}
                        />
                      ) : null}
                      {mailbox.isDisconnected ? (
                        <Chip size="small" label="Disconnected" sx={{ bgcolor: '#fff7ed', color: '#c2410c' }} />
                      ) : null}
                      {mailbox.isDeleted ? (
                        <Chip size="small" label="Deleted" sx={{ bgcolor: '#fef2f2', color: '#b91c1c' }} />
                      ) : null}
                    </Stack>

                    <Divider />

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {canReconnect ? (
                        <CustomButton
                          variant="contained"
                          startIcon={<EmailOutlined />}
                          onClick={handleConnectEmail}
                          disabled={!canConnect || isActionLoading}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 999,
                            bgcolor: primary,
                            '&:hover': { bgcolor: '#5b21d7' },
                          }}
                        >
                          Connect
                        </CustomButton>
                      ) : null}
                      {canMakeDefault ? (
                        <CustomButton
                          variant="contained"
                          onClick={() => void handleMakeDefault(mailbox)}
                          disabled={isActionLoading}
                          customColor={primary}
                          sx={{ textTransform: 'none', borderRadius: 999 }}
                        >
                          Make Default
                        </CustomButton>
                      ) : null}
                      {canDisconnect ? (
                        <CustomButton
                          variant="outlined"
                          startIcon={<LinkOff />}
                          onClick={() => setDisconnectTarget(mailbox)}
                          disabled={isActionLoading}
                          sx={{ textTransform: 'none', borderRadius: 999 }}
                        >
                          Disconnect
                        </CustomButton>
                      ) : null}
                      <CustomButton
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteOutline />}
                        onClick={() => setDeleteTarget(mailbox)}
                        disabled={isActionLoading || !canDelete}
                        sx={{ textTransform: 'none', borderRadius: 999 }}
                      >
                        Delete
                      </CustomButton>
                    </Box>
                  </Stack>
                </Box>
                );
              })}
            </Box>
          </Stack>
        ) : null}
      </Box>

      <ConfirmationAlertModal
        open={Boolean(disconnectTarget)}
        variant="warning"
        title="Disconnect Gmail account?"
        message="This will disconnect this Gmail account."
        confirmText="Disconnect"
        isConfirmLoading={disconnectLoading}
        onClose={() => {
          if (!disconnectLoading) setDisconnectTarget(null);
        }}
        onConfirm={handleConfirmDisconnect}
      />

      <ConfirmationAlertModal
        open={Boolean(deleteTarget)}
        variant="delete"
        title="Delete Gmail account?"
        message="This will mark this Gmail account as deleted."
        confirmText="Delete"
        isConfirmLoading={deleteLoading}
        onClose={() => {
          if (!deleteLoading) setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default MailIntegrationPage;
