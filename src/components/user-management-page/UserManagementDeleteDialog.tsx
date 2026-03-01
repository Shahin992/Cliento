import ConfirmationAlertModal from '../../common/ConfirmationAlertModal';
import type { TeamUser } from '../../hooks/user/useUserQueries';

type UserManagementDeleteDialogProps = {
  deleteCandidate: TeamUser | null;
  deletingUser: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const UserManagementDeleteDialog = ({
  deleteCandidate,
  deletingUser,
  onClose,
  onConfirm,
}: UserManagementDeleteDialogProps) => (
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
    onClose={onClose}
    onConfirm={onConfirm}
  />
);

export default UserManagementDeleteDialog;
