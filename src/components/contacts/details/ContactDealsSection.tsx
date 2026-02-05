import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { AddOutlined } from '@mui/icons-material';

import type { Contact } from '../../../data/contacts';
import { borderColor, mutedText, primary, railBg, sectionCardSx } from './contactStyles';

interface ContactDealsSectionProps {
  contact: Contact;
}

const ContactDealsSection = ({ contact }: ContactDealsSectionProps) => (
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
        {contact.recentDeals.map((deal, index) => (
          <Box key={deal.id}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#e8f0ff',
                  color: primary,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {contact.avatar}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#0f172a',
                    fontSize: 13.5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {deal.title}
                </Typography>
                <Typography variant="caption" sx={{ color: mutedText }}>
                  {deal.date} {deal.time} &nbsp;•&nbsp; {deal.amount}
                </Typography>
              </Box>
            </Stack>
            {index < contact.recentDeals.length - 1 ? (
              <Divider sx={{ mt: 1.4, borderColor }} />
            ) : null}
          </Box>
        ))}
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 0.5 }}>
        <Typography
          variant="caption"
          sx={{ color: primary, fontWeight: 800, cursor: 'pointer' }}
        >
          Load More
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default ContactDealsSection;

