import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const accent = '#6d28ff';
const mutedText = '#8b95a7';
const borderColor = '#eef2f7';

const recentDeals = [
  { id: 1, name: '319 Haul Road', location: 'Glenrock, WY', price: '$5750', date: 'Nov 14, 07:00 AM' },
  { id: 2, name: '47 Spruce Drive', location: 'Quantico, VA', price: '$5750', date: 'Nov 15, 08:00 AM' },
  { id: 3, name: '165 Belmont Drive', location: 'Parowan, UT', price: '$5750', date: 'Nov 16, 09:00 AM' },
  { id: 4, name: '1538 Hammer Road', location: 'Cleveland, OH', price: '$5750', date: 'Nov 17, 10:00 AM' },
];



export const RecentDealsCard = () => (
  <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'white', border: `1px solid ${borderColor}` }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2937' }}>
        Recent Deals
      </Typography>
      <Typography
        variant="caption"
        component={Link}
        to="/deals"
        sx={{ color: accent, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
      >
        View All
      </Typography>
    </Stack>
    <Stack spacing={2} sx={{ mt: 2 }}>
      {recentDeals.map((deal, index) => (
        <Box key={deal.id}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#e2e8f0', color: '#64748b' }}>
                {deal.name.slice(0, 1)}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {deal.name}
                </Typography>
                <Typography variant="caption" sx={{ color: mutedText }}>
                  {deal.location}
                </Typography>
              </Box>
            </Stack>
            <Box textAlign="right">
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1f2937' }}>
                {deal.price}
              </Typography>
              <Typography variant="caption" sx={{ color: mutedText }}>
                {deal.date}
              </Typography>
            </Box>
          </Stack>
          {index < recentDeals.length - 1 ? <Divider sx={{ mt: 2, borderColor }} /> : null}
        </Box>
      ))}
    </Stack>
  </Box>
);
