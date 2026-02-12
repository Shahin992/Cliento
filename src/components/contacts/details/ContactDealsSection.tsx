import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { AddOutlined } from '@mui/icons-material';

import type { ContactDetails } from '../../../services/contacts';
import { borderColor, mutedText, primary, railBg, sectionCardSx } from './contactStyles';

interface ContactDealsSectionProps {
  contact: ContactDetails;
}

const ContactDealsSection = ({ contact }: ContactDealsSectionProps) => {
  const initials = `${contact.firstName?.trim()?.[0] ?? ''}${contact.lastName?.trim()?.[0] ?? ''}`
    .toUpperCase()
    .trim() || 'C';

  return (
    <Box
      sx={{
        backgroundColor: railBg,
        borderLeft: { xs: 'none', lg: `1px solid ${borderColor}` },
        px: { xs: 1.5, sm: 2.25 },
        py: { xs: 2, sm: 2.5, lg: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1.75,
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          ...sectionCardSx,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.75,
          flex: 1,
          minHeight: 0,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            size="small"
            sx={{
              width: 34,
              height: 34,
              borderRadius: 999,
              backgroundColor: primary,
              color: 'white',
              '&:hover': { backgroundColor: primary },
            }}
          >
            <AddOutlined sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
          Recent Deals
        </Typography>

        <Stack spacing={1.6} sx={{ flexGrow: 1 }}>
          <Box>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                src={contact.photoUrl || undefined}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#e8f0ff',
                  color: primary,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#0f172a',
                    fontSize: 13.5,
                  }}
                >
                  No deals found
                </Typography>
                <Typography variant="caption" sx={{ color: mutedText }}>
                  This contact has no linked deals yet.
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mt: 1.4, borderColor }} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ContactDealsSection;
