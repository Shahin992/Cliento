import { Box, Stack, Typography } from '@mui/material';

import BasicInput from '../../common/BasicInput';
import BasicSelect from '../../common/BasicSelect';
import { CustomButton } from '../../common/CustomButton';
import { cardSx, labelSx, mutedText } from './profileStyles';
import type { ProfileState } from './types';

interface AccountDetailsSectionProps {
  profile: Pick<
    ProfileState,
    'fullName' | 'companyName' | 'email' | 'phoneNumber' | 'location' | 'timeZone'
  >;
  isSaving?: boolean;
  onFieldChange: (
    field: 'fullName' | 'companyName' | 'email' | 'phoneNumber' | 'location' | 'timeZone',
    value: string
  ) => void;
  isEditing: boolean;
  isDirty: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const AccountDetailsSection = ({
  profile,
  isSaving = false,
  onFieldChange,
  isEditing,
  isDirty,
  onEdit,
  onCancel,
  onSave,
}: AccountDetailsSectionProps) => (
  <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
    >
      <Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Account Details</Typography>
        <Typography sx={{ color: mutedText, mt: 0.5 }}>
          Keep your contact, company, and access details current.
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
        {isEditing ? (
          <>
            <CustomButton
              variant="text"
              customColor="#64748b"
              sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
              onClick={onCancel}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              sx={{
                borderRadius: 999,
                px: 2.5,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
              }}
              disabled={!isDirty || isSaving}
              onClick={onSave}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </CustomButton>
          </>
        ) : (
          <CustomButton
            variant="outlined"
            customColor="#94a3b8"
            sx={{
              borderRadius: 999,
              px: 2.5,
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
            }}
            onClick={onEdit}
          >
            Edit
          </CustomButton>
        )}
      </Stack>
    </Stack>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        gap: 1.5,
      }}
    >
      <Box>
        <Typography sx={labelSx}>Full Name</Typography>
        <BasicInput
          fullWidth
          value={profile.fullName}
          disabled={!isEditing}
          onChange={(event) => onFieldChange('fullName', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Company Name</Typography>
        <BasicInput
          fullWidth
          value={profile.companyName}
          disabled={!isEditing}
          onChange={(event) => onFieldChange('companyName', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Email</Typography>
        <BasicInput
          fullWidth
          type="email"
          value={profile.email}
          disabled
          onChange={(event) => onFieldChange('email', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Phone Number</Typography>
        <BasicInput
          fullWidth
          value={profile.phoneNumber}
          disabled={!isEditing}
          onChange={(event) => onFieldChange('phoneNumber', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Location</Typography>
        <BasicInput
          fullWidth
          value={profile.location ?? ''}
          disabled={!isEditing}
          onChange={(event) => onFieldChange('location', event.target.value)}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Time Zone</Typography>
        <BasicSelect
          options={[
            { label: 'Pacific Time (US)', value: 'America/Los_Angeles' },
            { label: 'Mountain Time (US)', value: 'America/Denver' },
            { label: 'Central Time (US)', value: 'America/Chicago' },
            { label: 'Eastern Time (US)', value: 'America/New_York' },
            { label: 'Alaska Time (US)', value: 'America/Anchorage' },
            { label: 'Hawaii Time (US)', value: 'Pacific/Honolulu' },
            { label: 'Atlantic Time (Canada)', value: 'America/Halifax' },
            { label: 'Newfoundland Time (Canada)', value: 'America/St_Johns' },
            { label: 'Mexico City', value: 'America/Mexico_City' },
            { label: 'Bogotá', value: 'America/Bogota' },
            { label: 'São Paulo', value: 'America/Sao_Paulo' },
            { label: 'London', value: 'Europe/London' },
            { label: 'Paris', value: 'Europe/Paris' },
            { label: 'Berlin', value: 'Europe/Berlin' },
            { label: 'Cairo', value: 'Africa/Cairo' },
            { label: 'Johannesburg', value: 'Africa/Johannesburg' },
            { label: 'Dubai', value: 'Asia/Dubai' },
            { label: 'Mumbai', value: 'Asia/Kolkata' },
            { label: 'Singapore', value: 'Asia/Singapore' },
            { label: 'Tokyo', value: 'Asia/Tokyo' },
            { label: 'Sydney', value: 'Australia/Sydney' },
          ]}
          mapping={{ label: 'label', value: 'value' }}
          value={profile.timeZone ?? ''}
          disabled={!isEditing}
          defaultText="Select time zone"
          onChange={(event) => onFieldChange('timeZone', event.target.value as string)}
        />
      </Box>
    </Box>
  </Box>
);

export default AccountDetailsSection;
