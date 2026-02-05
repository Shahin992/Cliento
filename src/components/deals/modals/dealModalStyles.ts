export const borderColor = '#e7edf6';
export const mutedText = '#94a3b8';
export const primary = '#6d28ff';
export const bgSoft = '#f8fbff';

export const labelSx = {
  fontSize: 12,
  fontWeight: 700,
  color: '#0f172a',
  mb: 0.75,
};

export const inputSx = {
  width: '100%',
  height: 36,
  px: 1.5,
  borderRadius: 2,
  border: `1px solid ${borderColor}`,
  backgroundColor: bgSoft,
  fontSize: 12,
  color: '#0f172a',
  outline: 'none',
  '&::placeholder': {
    color: mutedText,
    opacity: 1,
  },
};

