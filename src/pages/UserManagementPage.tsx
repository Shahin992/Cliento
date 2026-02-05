import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DeleteOutline, EditOutlined, ManageAccountsOutlined, PersonAddAlt } from '@mui/icons-material';

import PageHeader from '../components/PageHeader';
import BasicInput from '../common/BasicInput';
import BasicSelect from '../common/BasicSelect';
import CustomModal from '../common/CustomModal';
import { CustomButton } from '../common/CustomButton';

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: string[];
};

const roles = [
  { id: 'admin', title: 'Admin' },
  { id: 'manager', title: 'Manager' },
  { id: 'member', title: 'Member' },
];

const statuses = [
  { id: 'active', title: 'Active' },
  { id: 'invited', title: 'Invited' },
  { id: 'disabled', title: 'Disabled' },
];

const permissionOptions = [
  'Deals',
  'Contacts',
  'Tasks',
  'Billing',
  'Settings',
];

const emptyForm: UserRecord = {
  id: '',
  name: '',
  email: '',
  role: 'member',
  status: 'invited',
  permissions: ['Deals', 'Contacts'],
};

const UserManagementPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'u-1',
      name: 'Ava Nguyen',
      email: 'ava@cliento.com',
      role: 'admin',
      status: 'active',
      permissions: ['Deals', 'Contacts', 'Tasks', 'Billing', 'Settings'],
    },
    {
      id: 'u-2',
      name: 'Jordan Fields',
      email: 'jordan@cliento.com',
      role: 'manager',
      status: 'active',
      permissions: ['Deals', 'Contacts', 'Tasks'],
    },
    {
      id: 'u-3',
      name: 'Priya Patel',
      email: 'priya@cliento.com',
      role: 'member',
      status: 'invited',
      permissions: ['Deals', 'Contacts'],
    },
  ]);

  const [formData, setFormData] = useState<UserRecord>(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const isEditing = useMemo(
    () => Boolean(formData.id && users.find((user) => user.id === formData.id)),
    [formData.id, users]
  );

  const handleOpenCreate = () => {
    setFormData({ ...emptyForm });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserRecord) => {
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setSelectedUserId(null);
  };

  const handleSaveUser = () => {
    if (isEditing) {
      setUsers((prev) => prev.map((user) => (user.id === formData.id ? formData : user)));
    } else {
      const newUser = { ...formData, id: `u-${Date.now()}` };
      setUsers((prev) => [newUser, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (!selectedUserId) return;
    setUsers((prev) => prev.filter((user) => user.id !== selectedUserId));
    handleCloseDelete();
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permission);
      const permissions = exists
        ? prev.permissions.filter((item) => item !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions };
    });
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
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <PageHeader
          title="User Management"
          subtitle="Create users, edit details, and manage permissions."
        />
        <CustomButton
          variant="contained"
          customColor="#346fef"
          onClick={handleOpenCreate}
          startIcon={<PersonAddAlt sx={{ width: 18, height: 18 }} />}
          sx={{ height: 40 }}
        >
          Add user
        </CustomButton>
      </Stack>

      {isMobile ? (
        <Stack spacing={1.5}>
          {users.map((user) => (
            <Box
              key={user.id}
              sx={{
                borderRadius: 3,
                border: '1px solid #e7edf6',
                bgcolor: 'white',
                p: 2,
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: '#dbeafe', color: '#1e40af', width: 36, height: 36 }}>
                    {user.name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {user.name}
                    </Typography>
                    <Typography sx={{ color: '#64748b' }}>{user.email}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={user.role} sx={{ textTransform: 'capitalize' }} />
                  <Chip
                    label={user.status}
                    sx={{
                      textTransform: 'capitalize',
                      bgcolor: user.status === 'active' ? '#dcfce7' : '#fef9c3',
                      color: '#0f172a',
                    }}
                  />
                </Stack>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {user.permissions.map((permission) => (
                    <Chip key={permission} label={permission} size="small" />
                  ))}
                </Stack>
                <Stack direction="row" spacing={1}>
                  <CustomButton
                    variant="outlined"
                    customColor="#334155"
                    onClick={() => handleOpenEdit(user)}
                    startIcon={<EditOutlined sx={{ width: 18, height: 18 }} />}
                  >
                    Edit
                  </CustomButton>
                  <CustomButton
                    variant="outlined"
                    customColor="#ef4444"
                    onClick={() => handleOpenDelete(user.id)}
                    startIcon={<DeleteOutline sx={{ width: 18, height: 18 }} />}
                  >
                    Delete
                  </CustomButton>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : (
        <TableContainer
          sx={{
            borderRadius: 3,
            border: '1px solid #e7edf6',
            bgcolor: 'white',
            overflowX: 'auto',
          }}
        >
          <Table size="small" sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Permissions</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: '#dbeafe', color: '#1e40af', width: 36, height: 36 }}>
                        {user.name
                          .split(' ')
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {user.name}
                        </Typography>
                        <Typography sx={{ color: '#64748b' }}>{user.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={user.role} sx={{ textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={user.status}
                      sx={{
                        textTransform: 'capitalize',
                        bgcolor: user.status === 'active' ? '#dcfce7' : '#fef9c3',
                        color: '#0f172a',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="center">
                      {user.permissions.slice(0, 3).map((permission) => (
                        <Chip key={permission} label={permission} size="small" />
                      ))}
                      {user.permissions.length > 3 ? (
                        <Chip label={`+${user.permissions.length - 3}`} size="small" />
                      ) : null}
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <CustomButton
                        variant="outlined"
                        customColor="#334155"
                        onClick={() => handleOpenEdit(user)}
                        startIcon={<EditOutlined sx={{ width: 18, height: 18 }} />}
                      >
                        Edit
                      </CustomButton>
                      <CustomButton
                        variant="outlined"
                        customColor="#ef4444"
                        onClick={() => handleOpenDelete(user.id)}
                        startIcon={<DeleteOutline sx={{ width: 18, height: 18 }} />}
                      >
                        Delete
                      </CustomButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CustomModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        handleSubmit={handleSaveUser}
        title={isEditing ? 'Edit user' : 'Create user'}
        description="Manage user details and permissions."
        icon={<ManageAccountsOutlined sx={{ width: 28, height: 28 }} />}
        submitButtonText={isEditing ? 'Save changes' : 'Create user'}
        submitDisabled={!formData.name || !formData.email}
      >
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Full name</Typography>
            <BasicInput
              fullWidth
              placeholder="Full name"
              value={formData.name}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, name: event.target.value }))
              }
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Email</Typography>
            <BasicInput
              fullWidth
              placeholder="name@company.com"
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Role</Typography>
            <BasicSelect
              options={roles}
              mapping={{ label: 'title', value: 'id' }}
              value={formData.role}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, role: event.target.value as string }))
              }
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Status</Typography>
            <BasicSelect
              options={statuses}
              mapping={{ label: 'title', value: 'id' }}
              value={formData.status}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, status: event.target.value as string }))
              }
            />
          </Box>
          <Divider />
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Permissions</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {permissionOptions.map((permission) => (
                <FormControlLabel
                  key={permission}
                  control={
                    <Checkbox
                      checked={formData.permissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                    />
                  }
                  label={permission}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </CustomModal>

      <CustomModal
        open={isDeleteOpen}
        handleClose={handleCloseDelete}
        handleSubmit={handleDeleteUser}
        title="Delete user"
        description="This action cannot be undone."
        submitButtonText="Delete"
        closeButtonText="Cancel"
      >
        <Typography>Are you sure you want to delete this user?</Typography>
      </CustomModal>
    </Box>
  );
};

export default UserManagementPage;
