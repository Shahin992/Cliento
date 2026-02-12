import { Box, Typography } from '@mui/material';

import type { ContactDetails } from '../../../services/contacts';
import { labelSx, sectionCardSx, valueBoxSx } from './contactStyles';

interface ContactInfoSectionProps {
  contact: ContactDetails;
}

const ContactInfoSection = ({ contact }: ContactInfoSectionProps) => {
  const addressLine = [contact.address?.street].filter(Boolean).join(', ') || '-';

  return (
    <Box
      sx={{
        ...sectionCardSx,
        p: { xs: 1.5, sm: 2 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1.75,
        flex: 1,
        minHeight: 0,
      }}
    >
      <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
        Contact Information
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          columnGap: 1.75,
          rowGap: 1.6,
        }}
      >
        <Box>
          <Box sx={labelSx}>First Name</Box>
          <Box sx={valueBoxSx}>{contact.firstName || '-'}</Box>
        </Box>
        <Box>
          <Box sx={labelSx}>Last Name</Box>
          <Box sx={valueBoxSx}>{contact.lastName || '-'}</Box>
        </Box>
        <Box>
          <Box sx={labelSx}>Email</Box>
          <Box sx={valueBoxSx}>{contact.emails?.[0] || '-'}</Box>
        </Box>
        <Box>
          <Box sx={labelSx}>Phone</Box>
          <Box sx={valueBoxSx}>{contact.phones?.[0] || '-'}</Box>
        </Box>
      </Box>

      <Box>
        <Box sx={labelSx}>Address</Box>
        <Box sx={valueBoxSx}>{addressLine}</Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
          gap: 1.75,
        }}
      >
        <Box>
          <Box sx={labelSx}>City</Box>
          <Box sx={valueBoxSx}>{contact.address?.city || '-'}</Box>
        </Box>
        <Box>
          <Box sx={labelSx}>State / Province</Box>
          <Box sx={valueBoxSx}>{contact.address?.state || '-'}</Box>
        </Box>
        <Box>
          <Box sx={labelSx}>Zip Code</Box>
          <Box sx={valueBoxSx}>{contact.address?.postalCode || '-'}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactInfoSection;
