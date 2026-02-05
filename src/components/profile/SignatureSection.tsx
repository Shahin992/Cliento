import { Box, Typography } from '@mui/material';

import BasicInput from '../../common/BasicInput';
import { cardSx, mutedText } from './profileStyles';
import type { ProfileState } from './types';

interface SignatureSectionProps {
  signature: ProfileState['signature'];
  onChange: (value: string) => void;
}

const SignatureSection = ({ signature, onChange }: SignatureSectionProps) => (
  <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Signature</Typography>
      <Typography sx={{ color: mutedText, mt: 0.5 }}>
        Used for outbound emails and proposals.
      </Typography>
    </Box>
    <BasicInput
      fullWidth
      multiline
      minRows={6}
      height="auto"
      sx={{ alignItems: 'flex-start', py: 1 }}
      value={signature}
      onChange={(event) => onChange(event.target.value)}
    />
  </Box>
);

export default SignatureSection;
