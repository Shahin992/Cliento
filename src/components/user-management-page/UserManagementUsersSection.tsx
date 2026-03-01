import {
  Avatar,
  Badge,
  Box,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { CustomButton } from '../../common/CustomButton';
import type { TeamUser } from '../../hooks/user/useUserQueries';
import {
  borderColor,
  getAvatarAccent,
  getStatusChipSx,
  getUserInitials,
  getUserState,
  mutedText,
  toTitleCase,
} from './utils';

type UserManagementUsersSectionProps = {
  users: TeamUser[];
  authUserId?: string | null;
  canManageUserActions: boolean;
  onEdit: (user: TeamUser) => void;
  onDelete: (user: TeamUser) => void;
};

const UserManagementUsersSection = ({
  users,
  authUserId,
  canManageUserActions,
  onEdit,
  onDelete,
}: UserManagementUsersSectionProps) => (
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
      const isLoggedInUser = (authUserId ?? '').trim() === (user._id ?? '').trim();
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
            background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,252,255,0.75) 100%)',
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
                  onClick={() => onEdit(user)}
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
                  onClick={() => onDelete(user)}
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
);

export default UserManagementUsersSection;
