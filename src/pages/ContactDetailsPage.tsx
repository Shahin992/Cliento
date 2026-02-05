import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import ContactDealsSection from '../components/contacts/details/ContactDealsSection';
import ContactHeroBanner from '../components/contacts/details/ContactHeroBanner';
import ContactInfoSection from '../components/contacts/details/ContactInfoSection';
import { contacts } from '../data/contacts';
import { borderColor } from '../components/contacts/details/contactStyles';


const ContactDetailsPage = () => {
  const { contactId } = useParams();
  const contact = contacts.find((item) => item.id === contactId) ?? contacts[0];

  if (!contact) {
    return (
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 4 }}>
        <Typography sx={{ color: '#64748b' }}>Contact not found.</Typography>
      </Box>
    );
  }

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
      <Box
        sx={{
          borderRadius: 3,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          overflow: 'hidden',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'minmax(0, 2.35fr) minmax(260px, 0.95fr)',
            },
            gap: 0,
            px: 0,
            py: 0,
            backgroundColor: 'white',
            alignItems: 'stretch',
            flex: 1,
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              px: { xs: 1.5, sm: 2.5, lg: 3 },
              pb: { xs: 2.5, sm: 3 },
              pt: { xs: 2, sm: 2.5, lg: 3 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                minHeight: 0,
                height: '100%',
              }}
            >
            <ContactHeroBanner contact={contact} />
            <ContactInfoSection contact={contact} />
          </Box>

          <ContactDealsSection contact={contact} />
        </Box>
      </Box>
    </Box>
  );
};

export default ContactDetailsPage;
