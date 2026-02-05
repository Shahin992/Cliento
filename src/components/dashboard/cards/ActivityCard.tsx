import { Avatar, Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';

const accent = '#6d28ff';
const mutedText = '#8b95a7';
const borderColor = '#eef2f7';

const pillSx = {
  fontSize: 10,
  height: 20,
  borderRadius: 999,
  bgcolor: '#ede9fe',
  color: '#5b21d6',
  fontWeight: 600,
};

const activityItems = [
  { id: 1, date: '17 Nov 2021', title: 'Installation of the new air conditioning system' },
  { id: 2, date: '17 Nov 2021', title: 'Installation of the new air conditioning system' },
];

export const ActivityCard = () => (
  <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'white', border: `1px solid ${borderColor}` }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#ede9fe', color: accent, fontWeight: 700 }}>
          7
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1f2937' }}>
            1824 Turkey Pen Road
          </Typography>
          <Typography variant="caption" sx={{ color: mutedText }}>
            Cleveland, OH 12345
          </Typography>
        </Box>
      </Stack>
      <Chip label="IN PROGRESS" sx={pillSx} />
    </Stack>
    <Divider sx={{ my: 2, borderColor }} />
    <Stack spacing={2}>
      {activityItems.map((item) => (
        <Stack key={item.id} direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: accent,
              mt: '6px',
            }}
          />
          <Box>
            <Typography variant="caption" sx={{ color: mutedText }}>
              {item.date}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
              {item.title}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
    <Button
      variant="text"
      size="small"
      sx={{ mt: 2, textTransform: 'none', color: accent, fontWeight: 600 }}
    >
      Load More
    </Button>
  </Box>
);
