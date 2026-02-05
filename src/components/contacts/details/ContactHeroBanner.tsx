import { Avatar, Box } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { EditOutlined } from '@mui/icons-material';

import type { Contact } from '../../../data/contacts';
import { primary, sectionCardSx } from './contactStyles';

interface ContactHeroBannerProps {
  contact: Contact;
}

const ContactHeroBanner = ({ contact }: ContactHeroBannerProps) => (
  <Box
    sx={{
      height: { xs: 112, sm: 132, lg: 138 },
      ...sectionCardSx,
      backgroundColor: '#f8fbff',
      backgroundImage:
        "url('/contact-banner.png'), radial-gradient(1200px 300px at -10% -20%, #e9efff 0%, #f8fbff 55%, #ffffff 100%)",
      backgroundSize: 'cover, cover',
      backgroundPosition: 'center, center',
      backgroundRepeat: 'no-repeat, no-repeat',
      position: 'relative',
      px: { xs: 2, sm: 3 },
      py: { xs: 2, sm: 2.5 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}
  >
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Avatar
        sx={{
          width: 68,
          height: 68,
          bgcolor: 'white',
          color: primary,
          border: '3px solid white',
          boxShadow: '0 10px 24px rgba(15, 23, 42, 0.10)',
          fontWeight: 800,
          fontSize: 22,
        }}
      >
        {contact.avatar}
      </Avatar>
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          right: -1,
          bottom: -1,
          width: 24,
          height: 24,
          borderRadius: 999,
          backgroundColor: primary,
          color: 'white',
          border: '2px solid white',
          '&:hover': { backgroundColor: primary },
        }}
      >
        <EditOutlined sx={{ fontSize: 13 }} />
      </IconButton>
    </Box>

    <IconButton
      size="small"
      sx={{
        width: 34,
        height: 34,
        borderRadius: 999,
        border: '1px solid #e7edf6',
        backgroundColor: 'white',
        color: '#64748b',
      }}
    >
      <EditOutlined sx={{ fontSize: 18 }} />
    </IconButton>
  </Box>
);

export default ContactHeroBanner;

