import type { ChangeEvent, MouseEvent } from 'react';
import { useMemo } from 'react';
import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import PhotoCameraOutlined from '@mui/icons-material/PhotoCameraOutlined';

import { CustomButton } from '../../common/CustomButton';
import { bgSoft, borderColor, cardSx, mutedText } from './profileStyles';
import type { ProfileState } from './types';

const TIME_ZONE_LABELS: Record<string, string> = {
  'America/Los_Angeles': 'Pacific Time (US)',
  'America/Denver': 'Mountain Time (US)',
  'America/Chicago': 'Central Time (US)',
  'America/New_York': 'Eastern Time (US)',
  'America/Anchorage': 'Alaska Time (US)',
  'Pacific/Honolulu': 'Hawaii Time (US)',
  'America/Halifax': 'Atlantic Time (Canada)',
  'America/St_Johns': 'Newfoundland Time (Canada)',
  'America/Mexico_City': 'Mexico City',
  'America/Bogota': 'Bogotá',
  'America/Sao_Paulo': 'São Paulo',
  'Europe/London': 'London',
  'Europe/Paris': 'Paris',
  'Europe/Berlin': 'Berlin',
  'Africa/Cairo': 'Cairo',
  'Africa/Johannesburg': 'Johannesburg',
  'Asia/Dubai': 'Dubai',
  'Asia/Kolkata': 'Mumbai',
  'Asia/Singapore': 'Singapore',
  'Asia/Tokyo': 'Tokyo',
  'Australia/Sydney': 'Sydney',
};

interface ProfileOverviewCardProps {
  profile: ProfileState;
  isUploading: boolean;
  onAvatarChange: (file: File | null) => void;
}

const ProfileOverviewCard = ({
  profile,
  isUploading,
  onAvatarChange,
}: ProfileOverviewCardProps) => {
  const initials = useMemo(() => {
    const parts = profile.fullName.trim().split(' ').filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${first}${last}`.toUpperCase() || 'ME';
  }, [profile.fullName]);

  const timeZoneLabel = profile.timeZone
    ? TIME_ZONE_LABELS[profile.timeZone] ?? profile.timeZone
    : 'Not set';

  return (
    <Box
      sx={{
        ...cardSx,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(140deg, #f8fafc 0%, #eef2ff 100%)',
        borderColor: 'transparent',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
        px: { xs: 1.5, sm: 3 },
        py: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top left, rgba(99, 102, 241, 0.15), transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profile.profilePhoto ?? undefined}
              sx={{
                width: { xs: 64, sm: 72 },
                height: { xs: 64, sm: 72 },
                bgcolor: '#111827',
                color: '#fff',
                fontWeight: 700,
                fontSize: { xs: 18, sm: 22 },
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.25)',
                border: '3px solid #fff',
              }}
            >
              {initials}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                right: -2,
                bottom: -2,
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                border: '2px solid #fff',
              }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: 18, sm: 20 },
                color: '#0f172a',
                wordBreak: 'break-word',
              }}
            >
              {profile.fullName}
            </Typography>
            <Typography
              sx={{
                color: '#6366f1',
                fontSize: 12,
                fontWeight: 600,
                wordBreak: 'break-word',
              }}
            >
              {profile.email}
            </Typography>
          </Box>
          <Box
            sx={{
              alignSelf: { xs: 'stretch', sm: 'center' },
              backgroundColor: '#111827',
              color: '#fff',
              borderRadius: 999,
              px: 2,
              py: 0.6,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {profile.companyName || 'Company'}
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 2.5,
            p: 1.5,
            border: `1px solid ${borderColor}`,
          }}
        >
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
            disabled={isUploading}
            startIcon={<PhotoCameraOutlined />}
          >
            {isUploading ? 'Uploading...' : 'Change Photo'}
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
        </Stack>
        <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.35)' }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 1.25,
          }}
        >
          {[
            { label: 'Phone', value: profile.phoneNumber },
            { label: 'Time Zone', value: timeZoneLabel },
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
