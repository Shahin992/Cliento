import { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { CustomIconButton as IconButton } from '../common/CustomIconButton';
import {
  Box,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import {
  CheckCircleOutlined,
  EditOutlined,
  ErrorOutline,
  FilterAltOutlined,
  HourglassEmptyOutlined,
} from '@mui/icons-material';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import { tasks } from '../data/tasks';
import AddTaskModal from '../components/tasks/modals/AddTaskModal';
import EditTaskModal from '../components/tasks/modals/EditTaskModal';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const bgSoft = '#f8fbff';

const statusIconMap: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  warning: {
    icon: <ErrorOutline sx={{ fontSize: 16 }} />,
    color: '#ef4444',
    bg: '#fee2e2',
  },
  overdue: {
    icon: <HourglassEmptyOutlined sx={{ fontSize: 16 }} />,
    color: '#f97316',
    bg: '#ffedd5',
  },
  complete: {
    icon: <CheckCircleOutlined sx={{ fontSize: 16 }} />,
    color: '#10b981',
    bg: '#d1fae5',
  },
  default: {
    icon: <CheckCircleOutlined sx={{ fontSize: 16 }} />,
    color: '#94a3b8',
    bg: '#e2e8f0',
  },
};

const TasksPage = () => {
  const [sortBy, setSortBy] = useState('due-date');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;

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
      <PageHeader
        title="Tasks"
        subtitle="Manage your tasks list"
        action={
          <CustomButton
            variant="contained"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
            onClick={() => setIsAddTaskOpen(true)}
          >
            Add Task
          </CustomButton>
        }
      />

      <Box
        sx={{
          width: '100%',
          borderRadius: 3,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{
            px: { xs: 1.5, sm: 2.5 },
            py: 2,
            gap: 1.5,
            borderBottom: `1px solid ${borderColor}`,
            backgroundColor: bgSoft,
          }}
        >
          <Typography sx={{ fontWeight: 600, color: '#111827' }}>
            Total: {tasks.length} tasks
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Select
              size="small"
              value={sortBy}
              onChange={(event: SelectChangeEvent) =>
                setSortBy(event.target.value as string)
              }
              sx={{
                minWidth: { xs: '100%', sm: 160 },
                height: 36,
                bgcolor: 'white',
                borderRadius: 999,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  pl: 2,
                  py: 0.75,
                },
                '& fieldset': {
                  borderColor,
                },
              }}
            >
              <MenuItem value="due-date">Sort by: Due Date</MenuItem>
              <MenuItem value="status">Sort by: Status</MenuItem>
            </Select>
            <CustomButton
              variant="outlined"
              customColor="#64748b"
              startIcon={<FilterAltOutlined fontSize="small" />}
              sx={{
                height: 36,
                borderRadius: 999,
                px: 2,
                minWidth: 96,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Filter
            </CustomButton>
          </Stack>
        </Stack>

        <Box sx={{ overflowX: { xs: 'visible', md: 'hidden' } }}>
          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns: 'minmax(280px, 1.8fr) 140px 64px',
              px: 2.5,
              py: 1.5,
              color: mutedText,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            <Box>Task</Box>
            <Box>Due Date</Box>
            <Box textAlign="center">Edit</Box>
          </Box>

          <Box>
            {tasks.map((task, index) => {
              const status = statusIconMap[task.status];
              return (
                <Box
                  key={task.id}
                  sx={{
                    display: { xs: 'flex', md: 'grid' },
                    flexDirection: { xs: 'column', md: 'unset' },
                    gridTemplateColumns: 'minmax(280px, 1.8fr) 140px 64px',
                    px: { xs: 1.5, sm: 2.5 },
                    py: { xs: 1.5, sm: 1.75 },
                    gap: { xs: 1.25, sm: 0 },
                    alignItems: { md: 'center' },
                    borderBottom:
                      index === tasks.length - 1 ? 'none' : `1px solid ${borderColor}`,
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: 'flex', md: 'block' },
                      justifyContent: { xs: 'space-between', md: 'flex-start' },
                      alignItems: { xs: 'center', md: 'flex-start' },
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: mutedText, display: { xs: 'block', md: 'none' } }}
                    >
                      Task
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                      {task.title}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: { xs: 'flex', md: 'block' },
                      justifyContent: { xs: 'space-between', md: 'flex-start' },
                      alignItems: { xs: 'center', md: 'flex-start' },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: mutedText, display: { xs: 'block', md: 'none' } }}
                    >
                      Due Date
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: status.bg,
                          color: status.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {status.icon}
                      </Box>
                      <Typography sx={{ fontWeight: 600, color: status.color }}>
                        {task.dueDate}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'flex-end', md: 'center' },
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        border: `1px solid ${borderColor}`,
                        color: '#64748b',
                        backgroundColor: 'white',
                      }}
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <EditOutlined sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
          <CustomButton
            variant="outlined"
            customColor="#94a3b8"
            sx={{ borderRadius: 999, px: 3, textTransform: 'none' }}
          >
            Load More
          </CustomButton>
        </Box>
      </Box>

      <AddTaskModal
        open={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSave={() => setIsAddTaskOpen(false)}
      />
      <EditTaskModal
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTaskId(null)}
        task={selectedTask}
      />
    </Box>
  );
};

export default TasksPage;
