import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const accent = '#6d28ff';
const mutedText = '#8b95a7';
const borderColor = '#eef2f7';

const tasks = [
  { id: 1, date: '30 Nov 2021', title: 'Meeting with partners', color: '#ef4444' },
  { id: 2, date: '24 Dec 2021', title: 'Web conference agenda', color: '#f97316' },
  { id: 3, date: '24 Oct 2022', title: 'Lunch with Steve', color: '#64748b' },
  { id: 4, date: '24 Nov 2022', title: 'Meeting with partners', color: '#64748b' },
  { id: 5, date: '24 Nov 2022', title: 'Weekly meeting', color: '#64748b' },
  { id: 6, date: '24 Nov 2022', title: 'Add new services', color: '#64748b' },
];

export const TasksCard = () => (
  <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'white', border: `1px solid ${borderColor}` }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2937' }}>
        Tasks To Do
      </Typography>
      <Typography
        variant="caption"
        component={Link}
        to="/tasks"
        sx={{ color: accent, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
      >
        View All
      </Typography>
    </Stack>
    <Stack spacing={2} sx={{ mt: 2 }}>
      {tasks.map((task) => (
        <Stack key={task.id} direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: task.color,
              mt: '6px',
            }}
          />
          <Box>
            <Typography variant="caption" sx={{ color: mutedText }}>
              {task.date}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
              {task.title}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
    <Divider sx={{ my: 2, borderColor }} />
    <Button
      variant="text"
      size="small"
      endIcon={<ArrowForward fontSize="small" />}
      sx={{ textTransform: 'none', color: accent, fontWeight: 600 }}
    >
      Add new task
    </Button>
  </Box>
);
