import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { CallOutlined, EmailOutlined } from '@mui/icons-material';

interface ContactQuickDetailsProps {
  initials: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
}

const ContactQuickDetails = ({
  initials,
  name,
  companyName,
  email,
  phone,
}: ContactQuickDetailsProps) => (
  <>
    <Stack direction="row" spacing={1.25} alignItems="center" mb={1.25}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: '#eaf1ff',
          color: '#1d4ed8',
          fontWeight: 800,
          boxShadow: '0 8px 18px rgba(29, 78, 216, 0.2)',
        }}
      >
        {initials}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: '#0f172a', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {name}
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: 12, textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {companyName || 'No company'}
        </Typography>
      </Box>
    </Stack>
    <Divider sx={{ my: 1.25 }} />
    <Stack spacing={1.1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <EmailOutlined sx={{ fontSize: 16, color: '#64748b' }} />
        <Typography sx={{ color: '#334155', fontSize: 13, wordBreak: 'break-word' }}>{email}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <CallOutlined sx={{ fontSize: 16, color: '#64748b' }} />
        <Typography sx={{ color: '#334155', fontSize: 13 }}>{phone}</Typography>
      </Stack>
    </Stack>
  </>
);

export default ContactQuickDetails;
