import type { RadioGroupProps } from '@mui/material';
import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

// ✅ Styled Radio to look consistent with BasicSelect
const StyledRadio = styled(Radio)(() => ({
  color: '#6c5ce7',
  '&.Mui-checked': {
    color: '#6c5ce7',
  },
  '&:hover': {
    backgroundColor: 'rgba(108, 92, 231, 0.08)',
  },
}));

type BasicRadioOption = Record<string, string | number>;

interface BasicRadioOptionsProps {
  options?: BasicRadioOption[];
  mapping?: { label: string; value: string };
  name?: string;
  value?: RadioGroupProps['value'];
  onChange?: RadioGroupProps['onChange'];
  row?: boolean;
  error?: string;
  disabled?: boolean;
}

const BasicRadioOptions = ({
  options = [],
  mapping = { label: 'title', value: 'value' },
  name = 'basic-radio',
  value = '',
  onChange,
  row = true,
  error = '',
  disabled = false,
}: BasicRadioOptionsProps) => (
  <FormControl
    component="fieldset"
    error={Boolean(error)}
    sx={{ width: '100%' }}
    disabled={disabled}
  >
    <RadioGroup row={row} name={name} value={value} onChange={onChange}>
      {options.map((option, index) => (
        <FormControlLabel
          key={index}
          value={option[mapping.value]}
          control={<StyledRadio />}
          label={String(option[mapping.label])}
        />
      ))}
    </RadioGroup>
    {error ? (
      <FormHelperText sx={{ mt: '-4px' }}>{error}</FormHelperText>
    ) : null}
  </FormControl>
);

export default BasicRadioOptions;
