import type { SelectChangeEvent } from '@mui/material';
import { Box, Typography } from '@mui/material';

import BasicSelect from '../../common/BasicSelect';
import { cardSx, labelSx, mutedText } from './profileStyles';
import type { ProfileState } from './types';

interface PreferencesSectionProps {
  profile: ProfileState;
  onFieldChange: (field: keyof ProfileState, value: string) => void;
}

const timezoneOptions = [
  { label: 'Pacific Time (US)', value: 'America/Los_Angeles' },
  { label: 'Mountain Time (US)', value: 'America/Denver' },
  { label: 'Central Time (US)', value: 'America/Chicago' },
  { label: 'Eastern Time (US)', value: 'America/New_York' },
];

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
];

const dateFormatOptions = [
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
];

const currencyOptions = [
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'GBP - British Pound', value: 'GBP' },
];

const pipelineOptions = [
  { label: 'Enterprise', value: 'Enterprise' },
  { label: 'Mid-Market', value: 'Mid-Market' },
  { label: 'SMB', value: 'SMB' },
];

const PreferencesSection = ({ profile, onFieldChange }: PreferencesSectionProps) => {
  const handleSelectChange =
    (field: keyof ProfileState) => (event: SelectChangeEvent<unknown>) => {
      onFieldChange(field, event.target.value as string);
    };

  return (
    <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Preferences</Typography>
        <Typography sx={{ color: mutedText, mt: 0.5 }}>
          Set your defaults for localization and workflow.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 1.5,
        }}
      >
        <Box>
          <Typography sx={labelSx}>Timezone</Typography>
          <BasicSelect
            options={timezoneOptions}
            mapping={{ label: 'label', value: 'value' }}
            value={profile.timezone}
            onChange={handleSelectChange('timezone')}
          />
        </Box>
        <Box>
          <Typography sx={labelSx}>Language</Typography>
          <BasicSelect
            options={languageOptions}
            mapping={{ label: 'label', value: 'value' }}
            value={profile.language}
            onChange={handleSelectChange('language')}
          />
        </Box>
        <Box>
          <Typography sx={labelSx}>Date Format</Typography>
          <BasicSelect
            options={dateFormatOptions}
            mapping={{ label: 'label', value: 'value' }}
            value={profile.dateFormat}
            onChange={handleSelectChange('dateFormat')}
          />
        </Box>
        <Box>
          <Typography sx={labelSx}>Currency</Typography>
          <BasicSelect
            options={currencyOptions}
            mapping={{ label: 'label', value: 'value' }}
            value={profile.currency}
            onChange={handleSelectChange('currency')}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / span 2' } }}>
          <Typography sx={labelSx}>Default Pipeline</Typography>
          <BasicSelect
            options={pipelineOptions}
            mapping={{ label: 'label', value: 'value' }}
            value={profile.defaultPipeline}
            onChange={handleSelectChange('defaultPipeline')}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PreferencesSection;
