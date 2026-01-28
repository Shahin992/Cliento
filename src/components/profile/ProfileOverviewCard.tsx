import type { ChangeEvent, MouseEvent } from 'react';
import { useMemo } from 'react';
import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';

import { CustomButton } from '../../common/CustomButton';
import { bgSoft, borderColor, cardSx, mutedText, primary } from './profileStyles';
import type { ProfileState } from './types';

interface ProfileOverviewCardProps {
  profile: ProfileState;
  avatarPreview: string | null;
  onAvatarChange: (file: File | null) => void;
}

const ProfileOverviewCard = ({
  profile,
  avatarPreview,
  onAvatarChange,
}: ProfileOverviewCardProps) => {
  const initials = useMemo(() => {
    const first = profile.firstName?.[0] ?? '';
    const last = profile.lastName?.[0] ?? '';
    return `${first}${last}`.toUpperCase() || 'ME';
  }, [profile.firstName, profile.lastName]);

  return (
    <Box sx={cardSx}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={avatarPreview ?? undefined}
            sx={{
              width: 64,
              height: 64,
              bgcolor: '#eef2ff',
              color: primary,
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography sx={{ color: mutedText }}>{profile.title}</Typography>
            <Typography sx={{ color: mutedText, fontSize: 12 }}>
              {profile.location} • {profile.timezone}
            </Typography>
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <CustomButton
            component="label"
            variant="outlined"
            customColor="#94a3b8"
            sx={{
              borderRadius: 999,
              px: 2.5,
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Upload Photo
            <Box
              component="input"
              type="file"
              accept="image/*"
              sx={{ display: 'none' }}
              onClick={(event: MouseEvent<HTMLInputElement>) => {
                (event.target as HTMLInputElement).value = '';
              }}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0] ?? null;
                onAvatarChange(file);
              }}
            />
          </CustomButton>
          <CustomButton
            variant="text"
            customColor="#64748b"
            sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
            onClick={() => onAvatarChange(null)}
          >
            Remove
          </CustomButton>
        </Stack>

        <Divider />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 1.5,
          }}
        >
          {[
            { label: 'Open Deals', value: '24' },
            { label: 'Tasks Due', value: '6' },
            { label: 'Win Rate', value: '62%' },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{
                borderRadius: 2,
                border: `1px solid ${borderColor}`,
                px: 1.5,
                py: 1.25,
                backgroundColor: bgSoft,
              }}
            >
              <Typography sx={{ fontSize: 12, color: mutedText }}>{stat.label}</Typography>
              <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{stat.value}</Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

export default ProfileOverviewCard;
