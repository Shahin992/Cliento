import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { Box, Stack, Typography } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';

import BasicInput from '../../common/BasicInput';
import BasicSelect from '../../common/BasicSelect';
import CustomModal from '../../common/CustomModal';
import { normalizePhoneToE164 } from './utils';

export type UserModalMode = 'create' | 'edit';

export type UserFormState = {
  fullName: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  phoneNumber: string;
};

type RoleOption = {
  id: string;
  title: string;
};

type UserManagementFormModalProps = {
  open: boolean;
  mode: UserModalMode;
  selectedUserName?: string | null;
  form: UserFormState;
  roleOptions: RoleOption[];
  canAssignAdminRole: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  setForm: React.Dispatch<React.SetStateAction<UserFormState>>;
};

const UserManagementFormModal = ({
  open,
  mode,
  selectedUserName,
  form,
  roleOptions,
  canAssignAdminRole,
  loading,
  onClose,
  onSubmit,
  setForm,
}: UserManagementFormModalProps) => (
  <CustomModal
    open={open}
    handleClose={onClose}
    handleSubmit={onSubmit}
    title={mode === 'create' ? 'Add User' : 'Edit User'}
    description={
      mode === 'create'
        ? 'Create a new team user and assign a role.'
        : `Update ${selectedUserName || 'user'} details.`
    }
    icon={<ManageAccountsOutlinedIcon sx={{ width: 28, height: 28 }} />}
    submitButtonText={
      mode === 'create' ? (loading ? 'Adding...' : 'Add User') : loading ? 'Saving...' : 'Save Changes'
    }
    submitDisabled={loading || !form.fullName.trim() || !form.email.trim()}
  >
    <Stack spacing={2}>
      <Box>
        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Full name</Typography>
        <BasicInput
          fullWidth
          placeholder="John Doe"
          value={form.fullName}
          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
        />
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Email</Typography>
        <BasicInput
          fullWidth
          type="email"
          placeholder="john@example.com"
          value={form.email}
          disabled={mode === 'edit'}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Role</Typography>
        <BasicSelect
          options={roleOptions}
          mapping={{ label: 'title', value: 'id' }}
          value={form.role}
          disabled={!canAssignAdminRole}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              role: canAssignAdminRole && event.target.value === 'ADMIN' ? 'ADMIN' : 'MEMBER',
            }))
          }
        />
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Phone number (optional)</Typography>
        <MuiTelInput
          defaultCountry="US"
          fullWidth
          value={form.phoneNumber}
          onChange={(value) => setForm((prev) => ({ ...prev, phoneNumber: value.replace(/[^\d+]/g, '') }))}
          onBlur={() =>
            setForm((prev) => ({
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
);

export default UserManagementFormModal;
