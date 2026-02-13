import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const accent = '#6d28ff';
const mutedText = '#8b95a7';
const borderColor = '#eef2f7';

const contacts = [
  { id: 1, name: 'Deanna Annis', email: 'deannaanis@gmail.com' },
  { id: 2, name: 'Andrea Willis', email: 'andreawillis@gmail.com' },
  { id: 3, name: 'Brent Rodrigues', email: 'brodrigues@gmail.com' },
];

export const ContactsCard = () => (
  <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'white', border: `1px solid ${borderColor}` }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2937' }}>
        Contacts
      </Typography>
      <Typography
        variant="caption"
        component={Link}
        to="/contacts"
        sx={{ color: accent, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
      >
        View All
      </Typography>
    </Stack>
    <Stack spacing={2} sx={{ mt: 2 }}>
      {contacts.map((contact, index) => (
        <Box key={contact.id}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: index === 0 ? '#e2e8f0' : '#c7d2fe',
                  color: index === 0 ? '#64748b' : '#312e81',
                }}
              >
                {contact.name.slice(0, 1)}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {contact.name}
                </Typography>
                <Typography variant="caption" sx={{ color: mutedText }}>
                  {contact.email}
                </Typography>
              </Box>
            </Stack>
            <EditOutlined sx={{ fontSize: 18, color: mutedText }} />
          </Stack>
          {index < contacts.length - 1 ? <Divider sx={{ mt: 2, borderColor }} /> : null}
        </Box>
      ))}
    </Stack>
  </Box>
);
