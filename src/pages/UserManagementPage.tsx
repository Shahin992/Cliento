import { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import { useToast } from '../common/ToastProvider';
import { useAppSelector } from '../app/hooks';
import { type TeamUser, useTeamUsersQuery } from '../hooks/user/useUserQueries';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from '../hooks/user/useUserMutations';
import UserManagementDeleteDialog from '../components/user-management-page/UserManagementDeleteDialog';
import UserManagementEmptyState from '../components/user-management-page/UserManagementEmptyState';
import UserManagementErrorState from '../components/user-management-page/UserManagementErrorState';
import UserManagementFormModal, {
  type UserFormState,
  type UserModalMode,
} from '../components/user-management-page/UserManagementFormModal';
import UserManagementLoadingState from '../components/user-management-page/UserManagementLoadingState';
import UserManagementSummarySection from '../components/user-management-page/UserManagementSummarySection';
import UserManagementUsersSection from '../components/user-management-page/UserManagementUsersSection';

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
        if (!selectedUserId) {
          return;
        }
        setIsUserModalOpen(false);
        setUserForm(emptyUserForm);
        setSelectedUser(null);
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
       setDeleteCandidate(null);
      showToast({
        message: 'User deleted successfully.',
        severity: 'success',
      });
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

      {loading ? <UserManagementLoadingState /> : null}

      {!loading && <UserManagementSummarySection summary={summary} />}

      {!loading && errorMessage ? <UserManagementErrorState errorMessage={errorMessage} /> : null}

      {!loading && !errorMessage && users.length === 0 ? <UserManagementEmptyState /> : null}

      {!loading && !errorMessage && users.length > 0 ? (
        <UserManagementUsersSection
          users={users}
          authUserId={authUser?._id}
          canManageUserActions={canManageUserActions}
          onEdit={openEditModal}
          onDelete={openDeleteConfirm}
        />
      ) : null}

      <UserManagementFormModal
        open={isUserModalOpen}
        mode={modalMode}
        selectedUserName={selectedUser?.fullName}
        form={userForm}
        roleOptions={roleOptions}
        canAssignAdminRole={canAssignAdminRole}
        loading={creatingUser || updatingUser}
        onClose={closeUserModal}
        onSubmit={handleSubmitUserModal}
        setForm={setUserForm}
      />

      <UserManagementDeleteDialog
        deleteCandidate={deleteCandidate}
        deletingUser={deletingUser}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDeleteUser}
      />
    </Box>
  );
};

export default UserManagementPage;
