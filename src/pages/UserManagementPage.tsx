import { useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

import PageHeader from '../components/PageHeader';
import BasicInput from '../common/BasicInput';
import BasicSelect from '../common/BasicSelect';
import ConfirmationAlertModal from '../common/ConfirmationAlertModal';
import CustomModal from '../common/CustomModal';
import { CustomButton } from '../common/CustomButton';
import { useToast } from '../common/ToastProvider';
import { useAppSelector } from '../app/hooks';
import { type TeamUser, useTeamUsersQuery } from '../hooks/user/useUserQueries';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from '../hooks/user/useUserMutations';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';

const toTitleCase = (value?: string | null) => {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (!normalized) return 'Unknown';
  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
};

const getUserInitials = (user: TeamUser) => {
  const fromName = user.fullName
    ?.split(' ')
    .map((part) => part.trim()?.[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (fromName) return fromName;
  return user.email?.trim()?.[0]?.toUpperCase() ?? 'U';
};

const isAccessExpired = (accessExpiresAt?: string | null) => {
  if (!accessExpiresAt) return false;
  const expiresAt = new Date(accessExpiresAt);
  if (Number.isNaN(expiresAt.getTime())) return false;
  return expiresAt.getTime() < Date.now();
};

type UserState = 'active' | 'inactive' | 'system';

const getUserState = (user: TeamUser): UserState => {
  const normalizedRole = user.role?.trim().toLowerCase() ?? '';

  if (normalizedRole === 'owner' || normalizedRole === 'system') {
    return 'system';
  }

  return isAccessExpired(user.accessExpiresAt) ? 'inactive' : 'active';
};

const getStatusChipSx = (status: UserState) => {
  if (status === 'system') {
    return {
      bgcolor: '#ede9fe',
      color: '#5b21b6',
    };
  }

  if (status === 'active') {
    return {
      bgcolor: '#ecfdf3',
      color: '#166534',
    };
  }

  return {
    bgcolor: '#fff1f2',
    color: '#be123c',
  };
};

const getAvatarAccent = (status: UserState) => {
  if (status === 'system') {
    return { border: '#c4b5fd', dot: '#7c3aed' };
  }
  if (status === 'active') {
    return { border: '#86efac', dot: '#16a34a' };
  }
  return { border: '#fda4af', dot: '#e11d48' };
};

const normalizePhoneToE164 = (value: string) => {
  let cleaned = value.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('00')) {
    cleaned = `+${cleaned.slice(2)}`;
  }

  if (cleaned.startsWith('+')) {
    cleaned = `+${cleaned.slice(1).replace(/\D/g, '')}`;
    return cleaned;
  }

  const digits = cleaned.replace(/\D/g, '');
  if (digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }

  return digits;
};

const UserRowSkeleton = () => (
  <Box
    sx={{
      borderRadius: 3,
      border: `1px solid ${borderColor}`,
      p: { xs: 1.5, sm: 2 },
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1.4fr 0.7fr 0.9fr 1fr' },
      gap: { xs: 1.25, md: 1.5 },
      alignItems: 'center',
    }}
  >
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Skeleton variant="circular" width={38} height={38} />
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="text" width={170} height={24} />
        <Skeleton variant="text" width={220} height={20} />
      </Box>
    </Stack>
    <Skeleton variant="rounded" height={28} width={110} />
    <Skeleton variant="rounded" height={28} width={120} />
    <Skeleton variant="text" width={170} height={22} />
  </Box>
);

const UserManagementPageSkeleton = () => (
  <Stack spacing={1.25}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 1.25,
      }}
    >
      <Skeleton variant="rounded" height={104} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={104} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={104} sx={{ borderRadius: 3 }} />
    </Box>
    <UserRowSkeleton />
    <UserRowSkeleton />
    <UserRowSkeleton />
  </Stack>
);

type UserModalMode = 'create' | 'edit';

type UserFormState = {
  fullName: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  phoneNumber: string;
};

const emptyUserForm: UserFormState = {
  fullName: '',
  email: '',
  role: 'MEMBER',
  phoneNumber: '',
};

const UserManagementPage = () => {
  const { showToast } = useToast();
  const authUser = useAppSelector((state) => state.auth.user);
  const { teamUsersData, users, loading, errorMessage } = useTeamUsersQuery();
  const { createUser, loading: creatingUser } = useCreateUserMutation();
  const { updateUser, loading: updatingUser } = useUpdateUserMutation();
  const { deleteUser, loading: deletingUser } = useDeleteUserMutation();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<UserModalMode>('create');
  const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<TeamUser | null>(null);
  const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm);

  const currentUserRole = (authUser?.role ?? '').trim().toUpperCase();
  const canAssignAdminRole = currentUserRole === 'OWNER';
  const canManageUserActions = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const roleOptions = useMemo(
    () =>
      canAssignAdminRole
        ? [
            { id: 'ADMIN', title: 'Admin' },
            { id: 'MEMBER', title: 'Member' },
          ]
        : [{ id: 'MEMBER', title: 'Member' }],
    [canAssignAdminRole],
  );

  const summary = useMemo(
    () => ({
      totalAllowedUsers: teamUsersData?.totalAllowedUsers ?? 0,
      usedUsers: teamUsersData?.usedUsers ?? users.length,
      remainingUsers: teamUsersData?.remainingUsers ?? 0,
      canCreateMoreUsers: Boolean(teamUsersData?.canCreateMoreUsers),
    }),
    [teamUsersData, users.length],
  );

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    setUserForm(emptyUserForm);
    setIsUserModalOpen(true);
  };

  const openEditModal = (user: TeamUser) => {
    if (!canManageUserActions) {
      return;
    }

    setModalMode('edit');
    setSelectedUser(user);
    setUserForm({
      fullName: user.fullName?.trim() ?? '',
      email: user.email?.trim() ?? '',
      role:
        canAssignAdminRole && user.role?.trim().toUpperCase() === 'ADMIN'
          ? 'ADMIN'
          : 'MEMBER',
      phoneNumber: user.phoneNumber?.trim() ?? '',
    });
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    if (creatingUser || updatingUser) return;
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmitUserModal = async () => {
    const fullName = userForm.fullName.trim();
    const email = userForm.email.trim();
    const phoneNumber = userForm.phoneNumber.trim();

    if (!fullName || !email) {
      showToast({
        message: 'Full name and email are required.',
        severity: 'error',
      });
      return;
    }

    if (!canAssignAdminRole && userForm.role === 'ADMIN') {
      showToast({
        message: 'Admin can only create or update users with Member role.',
        severity: 'error',
      });
      return;
    }

    const selectedUserId = selectedUser?._id?.trim();
    if (modalMode === 'edit' && !selectedUserId) {
      showToast({
        message: 'Unable to update this user.',
        severity: 'error',
      });
      return;
    }

    try {
      if (modalMode === 'create') {
        await createUser({
          fullName,
          email,
          role: userForm.role,
          ...(phoneNumber ? { phoneNumber } : {}),
        });
        showToast({
          message: 'User created successfully.',
          severity: 'success',
        });
      } else {
        await updateUser(selectedUserId, {
          fullName,
          role: userForm.role,
          ...(phoneNumber ? { phoneNumber } : {}),
        });
        showToast({
          message: 'User updated successfully.',
          severity: 'success',
        });
      }
      setIsUserModalOpen(false);
      setUserForm(emptyUserForm);
      setSelectedUser(null);
    } catch (submitError) {
      showToast({
        message:
          submitError instanceof Error
            ? submitError.message
            : modalMode === 'create'
              ? 'Failed to create user.'
              : 'Failed to update user.',
        severity: 'error',
      });
    }
  };

  const openDeleteConfirm = (user: TeamUser) => {
    if (!canManageUserActions) {
      return;
    }

    const isOwner = user.role?.trim().toUpperCase() === 'OWNER';
    const isLoggedInUser = (authUser?._id ?? '').trim() === (user._id ?? '').trim();

    if (isOwner || isLoggedInUser) {
      return;
    }

    setDeleteCandidate(user);
  };

  const closeDeleteConfirm = () => {
    if (deletingUser) return;
    setDeleteCandidate(null);
  };

  const confirmDeleteUser = async () => {
    const userId = deleteCandidate?._id?.trim();
    if (!userId) {
      setDeleteCandidate(null);
      return;
    }

    try {
      await deleteUser(userId);
      showToast({
        message: 'User deleted successfully.',
        severity: 'success',
      });
      setDeleteCandidate(null);
    } catch (submitError) {
      showToast({
        message: submitError instanceof Error ? submitError.message : 'Failed to delete user.',
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
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <PageHeader
        title="User Management"
        subtitle="Team members and user usage from your subscription."
        action={
          <CustomButton
            variant="contained"
            customColor="#346fef"
            onClick={openCreateModal}
            disabled={!summary.canCreateMoreUsers}
            startIcon={<PersonAddAltRoundedIcon sx={{ width: 18, height: 18 }} />}
            sx={{
              borderRadius: 999,
              px: 2.4,
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Add User
          </CustomButton>
        }
      />

      {loading ? <UserManagementPageSkeleton /> : null}

      {!loading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 1.25,
          }}
        >
          {[
          {
            label: 'Total Users',
            value: summary.totalAllowedUsers,
            icon: <Diversity3RoundedIcon sx={{ color: '#1d4ed8', fontSize: 19 }} />,
            bg: '#eff6ff',
          },
          {
            label: 'Active Users',
            value: summary.usedUsers,
            icon: <PeopleAltRoundedIcon sx={{ color: '#0369a1', fontSize: 19 }} />,
            bg: '#ecfeff',
          },
          {
            label: 'Available Users',
            value: summary.remainingUsers,
            icon: <GroupRoundedIcon sx={{ color: '#166534', fontSize: 19 }} />,
            bg: '#ecfdf3',
          },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                borderRadius: 3,
                border: `1px solid ${borderColor}`,
                background:
                  'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.65) 100%)',
                p: { xs: 1.5, sm: 1.75 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box>
                <Typography sx={{ color: mutedText, fontSize: 12 }}>{item.label}</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 26, color: '#0f172a', lineHeight: 1.1 }}>
                  {item.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: item.bg,
                  border: '1px solid #dbeafe',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {!loading && errorMessage ? (
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid #fecaca',
            bgcolor: '#fff1f2',
            p: 2,
          }}
        >
          <Typography sx={{ color: '#be123c', fontWeight: 700 }}>Failed to load team users.</Typography>
          <Typography sx={{ color: '#be123c', mt: 0.5 }}>{errorMessage}</Typography>
        </Box>
      ) : null}

      {!loading && !errorMessage && users.length === 0 ? (
        <Box
          sx={{
            borderRadius: 3,
            border: `1px dashed ${borderColor}`,
            bgcolor: '#f8fbff',
            p: { xs: 2.5, sm: 4 },
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>No team users found.</Typography>
          <Typography sx={{ color: mutedText, mt: 0.5 }}>
            Team members will appear here once users are added.
          </Typography>
        </Box>
      ) : null}

      {!loading && !errorMessage && users.length > 0 ? (
        <Box
          sx={{
            borderRadius: 3,
            border: `1px solid ${borderColor}`,
            backgroundColor: 'white',
            p: { xs: 1.25, sm: 1.5 },
            display: 'grid',
            gap: 1,
          }}
        >
          {users.map((user) => {
            const status = getUserState(user);
            const avatarAccent = getAvatarAccent(status);
            const normalizedUserRole = user.role?.trim().toUpperCase() ?? '';
            const isOwnerUser = normalizedUserRole === 'OWNER';
            const isLoggedInUser = (authUser?._id ?? '').trim() === (user._id ?? '').trim();
            const canEditUser = canManageUserActions && !isOwnerUser;
            const canDeleteUser = canManageUserActions && !isOwnerUser && !isLoggedInUser;

            return (
              <Box
                key={user._id}
                sx={{
                  borderRadius: 2.5,
                  border: `1px solid ${borderColor}`,
                  px: { xs: 1.25, sm: 1.5 },
                  py: { xs: 1.25, sm: 1.4 },
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1.45fr 0.8fr auto' },
                  gap: { xs: 1.15, md: 1.5 },
                  alignItems: 'center',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,252,255,0.75) 100%)',
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: avatarAccent.dot,
                          boxShadow: '0 0 0 2px #ffffff',
                        }}
                      />
                    }
                  >
                    <Avatar
                      src={user.profilePhoto ?? undefined}
                      sx={{
                        width: 38,
                        height: 38,
                        bgcolor: '#dbeafe',
                        color: '#1e40af',
                        fontWeight: 700,
                        flexShrink: 0,
                        border: `2px solid ${avatarAccent.border}`,
                      }}
                    >
                      {getUserInitials(user)}
                    </Avatar>
                  </Badge>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a' }} noWrap>
                      {user.fullName || 'Unnamed user'}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: 13 }} noWrap>
                      {user.email}
                    </Typography>
                    <Typography sx={{ color: mutedText, fontSize: 12 }} noWrap>
                      {user.phoneNumber?.trim() || 'No phone'}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={0.75} flexWrap="wrap" alignItems="center">
                  <Chip
                    label={toTitleCase(status)}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 999,
                      ...getStatusChipSx(status),
                    }}
                  />
                  <Chip
                    label={toTitleCase(user.role)}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: '#f1f5f9',
                      color: '#334155',
                      borderRadius: 999,
                    }}
                  />
                </Stack>

                {canEditUser || canDeleteUser ? (
                  <Stack
                    direction={{ xs: 'row', sm: 'row' }}
                    spacing={1}
                    justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                  >
                    {canEditUser ? (
                      <CustomButton
                        variant="outlined"
                        customColor="#334155"
                        startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          borderRadius: 999,
                          textTransform: 'none',
                          px: 1.6,
                          fontSize: 12,
                          minWidth: 0,
                        }}
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </CustomButton>
                    ) : null}
                    {canDeleteUser ? (
                      <CustomButton
                        variant="outlined"
                        customColor="#ef4444"
                        startIcon={<DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          borderRadius: 999,
                          textTransform: 'none',
                          px: 1.6,
                          fontSize: 12,
                          minWidth: 0,
                        }}
                        onClick={() => openDeleteConfirm(user)}
                      >
                        Delete
                      </CustomButton>
                    ) : null}
                  </Stack>
                ) : null}
              </Box>
            );
          })}
        </Box>
      ) : null}

      <CustomModal
        open={isUserModalOpen}
        handleClose={closeUserModal}
        handleSubmit={handleSubmitUserModal}
        title={modalMode === 'create' ? 'Add User' : 'Edit User'}
        description={
          modalMode === 'create'
            ? 'Create a new team user and assign a role.'
            : `Update ${selectedUser?.fullName || 'user'} details.`
        }
        icon={<ManageAccountsOutlinedIcon sx={{ width: 28, height: 28 }} />}
        submitButtonText={
          modalMode === 'create'
            ? creatingUser
              ? 'Adding...'
              : 'Add User'
            : updatingUser
              ? 'Saving...'
              : 'Save Changes'
        }
        submitDisabled={(creatingUser || updatingUser) || !userForm.fullName.trim() || !userForm.email.trim()}
      >
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Full name</Typography>
            <BasicInput
              fullWidth
              placeholder="John Doe"
              value={userForm.fullName}
              onChange={(event) =>
                setUserForm((prev) => ({ ...prev, fullName: event.target.value }))
              }
            />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Email</Typography>
            <BasicInput
              fullWidth
              type="email"
              placeholder="john@example.com"
              value={userForm.email}
              disabled={modalMode === 'edit'}
              onChange={(event) =>
                setUserForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Role</Typography>
            <BasicSelect
              options={roleOptions}
              mapping={{ label: 'title', value: 'id' }}
              value={userForm.role}
              disabled={!canAssignAdminRole}
              onChange={(event) =>
                setUserForm((prev) => ({
                  ...prev,
                  role:
                    canAssignAdminRole && event.target.value === 'ADMIN'
                      ? 'ADMIN'
                      : 'MEMBER',
                }))
              }
            />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Phone number (optional)</Typography>
            <MuiTelInput
              defaultCountry="US"
              fullWidth
              value={userForm.phoneNumber}
              onChange={(value) =>
                setUserForm((prev) => ({ ...prev, phoneNumber: value.replace(/[^\d+]/g, '') }))
              }
              onBlur={() =>
                setUserForm((prev) => ({
                  ...prev,
                  phoneNumber: normalizePhoneToE164(prev.phoneNumber),
                }))
              }
              size="small"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  '& fieldset': {
                    borderColor: '#ced4da',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ced4da',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ced4da',
                    boxShadow: 'none',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: 15,
                },
                '& .MuiInputAdornment-positionStart .MuiButtonBase-root': {
                  borderRadius: '4px',
                  border: 'none',
                  boxShadow: 'none',
                  backgroundColor: 'transparent',
                },
                '& .MuiInputAdornment-positionStart .MuiButtonBase-root:hover': {
                  backgroundColor: 'transparent',
                },
                '& .MuiInputAdornment-positionStart .MuiButtonBase-root:focus': {
                  backgroundColor: 'transparent',
                },
                '& .MuiInputAdornment-positionStart .MuiButtonBase-root:focus-visible': {
                  outline: 'none',
                },
              }}
            />
          </Box>

        </Stack>
      </CustomModal>

      <ConfirmationAlertModal
        open={Boolean(deleteCandidate)}
        variant="delete"
        title="Delete user?"
        message={
          deleteCandidate
            ? `${deleteCandidate.fullName || deleteCandidate.email} will be removed from your team. This action cannot be undone.`
            : 'This action cannot be undone.'
        }
        confirmText="Delete"
        cancelText="Cancel"
        isConfirmLoading={deletingUser}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDeleteUser}
      />
    </Box>
  );
};

export default UserManagementPage;
