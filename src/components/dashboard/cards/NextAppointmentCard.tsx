import { Box, Button, Stack, Typography } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';

export const NextAppointmentCard = () => (
  <Box
    sx={{
      p: 2.5,
      borderRadius: 3,
      color: 'white',
      background: 'linear-gradient(160deg, #6d28ff 0%, #4f46e5 60%, #4338ca 100%)',
      boxShadow: '0 12px 24px rgba(99, 102, 241, 0.28)',
    }}
  >
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
          Next Appointment
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
          319 Haul Road
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Glenrock, WY 12345
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <CalendarToday sx={{ fontSize: 16, opacity: 0.9 }} />
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Appointment Date
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Nov 18 2021, 17:00
      </Typography>

      <Stack direction="row" spacing={3}>
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Room Area
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            100 M2
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            People
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            10
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Price
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            $5750
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: 'none',
            bgcolor: 'white',
            color: '#4f46e5',
            borderRadius: 999,
            fontWeight: 600,
            '&:hover': { bgcolor: '#f3f4ff' },
          }}
        >
          See Detail
        </Button>
      </Stack>
    </Stack>
  </Box>
);
