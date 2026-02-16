import { useDeferredValue, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  CheckCircleOutlined,
  DeleteOutline,
  EditOutlined,
  ErrorOutline,
  HourglassEmptyOutlined,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  Pagination,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { CustomIconButton } from '../common/CustomIconButton';
import BasicSelect from '../common/BasicSelect';
import ConfirmationAlertModal from '../common/ConfirmationAlertModal';
import { CustomButton } from '../common/CustomButton';
import { useToast } from '../common/ToastProvider';
import CustomTooltip from '../common/CustomTooltip';
import PageHeader from '../components/PageHeader';
import TasksFiltersPopover from '../components/tasks/page/TasksFiltersPopover';
import TasksHeaderActions from '../components/tasks/page/TasksHeaderActions';
import AddTaskModal from '../components/tasks/modals/AddTaskModal';
import EditTaskModal from '../components/tasks/modals/EditTaskModal';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  type TaskPayload,
  useUpdateTaskMutation,
} from '../hooks/tasks/useTasksMutations';
import { useTasksQuery, type TaskListItem } from '../hooks/tasks/useTasksQueries';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const primary = '#346fef';
const bgSoft = '#f8fbff';
const DEFAULT_PAGE_SIZE = 10;
const PAGE_LIMIT_OPTIONS = [10, 25, 50, 100];

const statusIconMap: Record<string, { icon: ReactNode; color: string; bg: string }> = {
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

const isTaskCompleted = (status?: string | null) => {
  const normalized = (status ?? '').trim().toLowerCase();
  return normalized === 'done' || normalized === 'completed';
};

const getDueDateState = (task: TaskListItem) => {
  if (isTaskCompleted(task.status)) return 'complete';

  const parsedDate = new Date(task.dueDate);
  if (Number.isNaN(parsedDate.getTime())) return 'default';

  const now = Date.now();
  const distanceMs = parsedDate.getTime() - now;

  if (distanceMs < 0) return 'overdue';
  if (distanceMs <= 24 * 60 * 60 * 1000) return 'warning';
  return 'default';
};

const formatDueDate = (dueDate?: string | null) => {
  if (!dueDate) return '-';
  const parsedDate = new Date(dueDate);
  if (Number.isNaN(parsedDate.getTime())) return '-';

  return parsedDate.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const resolveTaskId = (task: TaskListItem) => task._id?.trim() || task.id?.trim() || '';

const normalizeTaskStatus = (status?: string | null) => {
  const normalized = (status ?? '').trim().toLowerCase();
  if (normalized === 'in_progress' || normalized === 'in-progress') return 'in_progress';
  if (normalized === 'done' || normalized === 'completed') return 'done';
  return 'todo';
};

const getStatusChipConfig = (status?: string | null) => {
  const normalized = normalizeTaskStatus(status);
  if (normalized === 'in_progress') {
    return { label: 'In Progress', bg: '#dbeafe', color: '#1d4ed8' };
  }
  if (normalized === 'done') {
    return { label: 'Done', bg: '#dcfce7', color: '#15803d' };
  }
  return { label: 'Todo', bg: '#f1f5f9', color: '#475569' };
};

const getPriorityChipConfig = (priority?: string | null) => {
  const normalized = (priority ?? '').trim().toLowerCase();
  if (normalized === 'high') {
    return { label: 'High', bg: '#fee2e2', color: '#b91c1c' };
  }
  if (normalized === 'medium') {
    return { label: 'Medium', bg: '#ffedd5', color: '#c2410c' };
  }
  return { label: 'Low', bg: '#ecfeff', color: '#0f766e' };
};

const TaskRowSkeleton = () => (
  <Box
    sx={{
      display: { xs: 'flex', lg: 'grid' },
      flexDirection: { xs: 'column', lg: 'unset' },
      gridTemplateColumns: 'minmax(280px, 2.2fr) minmax(220px, 1.6fr) minmax(130px, 1fr)',
      px: { xs: 1.5, sm: 2.5 },
      py: { xs: 1.5, sm: 1.75 },
      gap: { xs: 1.1, md: 1, lg: 0 },
      alignItems: { lg: 'center' },
      borderRadius: { xs: 2, lg: 0 },
      backgroundColor: { xs: '#f8fbff', lg: 'transparent' },
      border: { xs: `1px solid ${borderColor}`, lg: 'none' },
      mb: { xs: 1, md: 0.85, lg: 0 },
      borderBottom: `1px solid ${borderColor}`,
    }}
  >
    <Skeleton variant="text" width={200} height={28} />
    <Stack direction="row" spacing={1} alignItems="center">
      <Skeleton variant="circular" width={22} height={22} />
      <Skeleton variant="text" width={130} height={24} />
    </Stack>
    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', lg: 'center' } }}>
      <Skeleton variant="circular" width={32} height={32} />
    </Box>
  </Box>
);

const TasksPage = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);

  const deferredSearchQuery = useDeferredValue(searchQuery.trim());
  const useFilterPopover = useMediaQuery('(max-width:1039.95px)');

  const { showToast } = useToast();
  const {
    tasks,
    pagination,
    loading: loadingTasks,
    errorMessage: loadTasksErrorMessage,
  } = useTasksQuery(
    page,
    limit,
    deferredSearchQuery || undefined,
    statusFilter || undefined,
    priorityFilter || undefined,
  );
  const {
    createTask,
    loading: isCreatingTask,
    errorMessage: createTaskErrorMessage,
  } = useCreateTaskMutation();
  const {
    updateTask,
    loading: isUpdatingTask,
    errorMessage: updateTaskErrorMessage,
  } = useUpdateTaskMutation();
  const { deleteTask, loading: isDeletingTask } = useDeleteTaskMutation();

  const selectedTask =
    tasks.find((task: TaskListItem) => resolveTaskId(task) === selectedTaskId) ?? null;

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks];

    sorted.sort((a, b) => {
      const left = new Date(a.dueDate).getTime();
      const right = new Date(b.dueDate).getTime();

      if (Number.isNaN(left) && Number.isNaN(right)) return 0;
      if (Number.isNaN(left)) return 1;
      if (Number.isNaN(right)) return -1;
      return left - right;
    });

    return sorted;
  }, [tasks]);

  const totalTasks = Math.max(0, Number(pagination?.total) || 0);
  const totalPages = Math.max(1, Number(pagination?.totalPages) || 1);
  const serverLimit = Math.max(1, Number(pagination?.limit) || limit);
  const serverPage = Math.max(1, Number(pagination?.page) || page);
  const pageStart = totalTasks === 0 ? 0 : (serverPage - 1) * serverLimit + 1;
  const pageEnd =
    totalTasks === 0 ? 0 : Math.min((serverPage - 1) * serverLimit + sortedTasks.length, totalTasks);
  const isFilterPopoverOpen = Boolean(filterAnchorEl);

  useEffect(() => {
    if (!useFilterPopover) {
      setFilterAnchorEl(null);
    }
  }, [useFilterPopover]);

  const handleCreateTask = async (payload: TaskPayload) => {
    try {
      await createTask(payload);
      showToast({ message: 'Task created successfully.', severity: 'success' });
      setIsAddTaskOpen(false);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to create task.',
        severity: 'error',
      });
    }
  };

  const handleUpdateTask = async (taskId: string, payload: TaskPayload) => {
    try {
      await updateTask(taskId, payload);
      showToast({ message: 'Task updated successfully.', severity: 'success' });
      setSelectedTaskId(null);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to update task.',
        severity: 'error',
      });
    }
  };

  const handleOpenDeleteConfirm = (taskId: string) => {
    setTaskIdToDelete(taskId);
  };

  const handleConfirmDeleteTask = async () => {
    const normalizedTaskId = (taskIdToDelete ?? '').trim();
    if (!normalizedTaskId) {
      setTaskIdToDelete(null);
      return;
    }

    try {
      await deleteTask(normalizedTaskId);
      showToast({ message: 'Task deleted successfully.', severity: 'success' });
      setTaskIdToDelete(null);
      if (selectedTaskId === normalizedTaskId) {
        setSelectedTaskId(null);
      }
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to delete task.',
        severity: 'error',
      });
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 1.5, sm: 2, md: 3 },
        pb: { xs: 12, sm: 0 },
        height: { xs: 'auto', sm: 'calc(100vh - 112px)' },
        minHeight: 0,
        overflow: { xs: 'visible', sm: 'hidden' },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <PageHeader
        title="Tasks"
        subtitle="Manage your tasks list"
        stackOnMobile={false}
        actionFullWidthOnMobile={false}
        action={
          <TasksHeaderActions
            useFilterPopover={useFilterPopover}
            borderColor={borderColor}
            mutedText={mutedText}
            primary={primary}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            onSearchChange={(value) => {
              setSearchQuery(value);
              setPage(1);
            }}
            onStatusChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            onPriorityChange={(value) => {
              setPriorityFilter(value);
              setPage(1);
            }}
            onOpenFilter={(event) => setFilterAnchorEl(event.currentTarget)}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
          />
        }
      />
      <TasksFiltersPopover
        useFilterPopover={useFilterPopover}
        open={isFilterPopoverOpen}
        anchorEl={filterAnchorEl}
        borderColor={borderColor}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        onPriorityChange={(value) => {
          setPriorityFilter(value);
          setPage(1);
        }}
        onClearFilters={() => {
          setSearchQuery('');
          setStatusFilter('');
          setPriorityFilter('');
          setPage(1);
        }}
        onClose={() => setFilterAnchorEl(null)}
      />

      <Box
        sx={{
          width: '100%',
          borderRadius: 3,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          overflow: 'hidden',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
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
          {!loadingTasks ? (
            <Typography sx={{ fontWeight: 600, color: '#111827' }}>
              Total: {totalTasks} tasks
            </Typography>
          ) : null}

        </Stack>

        <Box
          sx={{
            overflowX: 'hidden',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', lg: 'grid' },
              gridTemplateColumns: 'minmax(280px, 2.2fr) minmax(220px, 1.6fr) minmax(130px, 1fr)',
              px: 2.5,
              py: 1.5,
              color: mutedText,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderBottom: `1px solid ${borderColor}`,
              alignItems: 'center',
            }}
          >
            <Box>Task</Box>
            <Box>Due Date</Box>
            <Box textAlign="center">Actions</Box>
          </Box>

          <Box
            sx={{
              flex: { xs: 'unset', sm: 1 },
              minHeight: { xs: 'auto', sm: 0 },
              overflowY: { xs: 'visible', sm: 'auto' },
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {loadingTasks ? (
              <Box sx={{ px: { xs: 0, lg: 0 }, py: { xs: 0.5, lg: 0 } }}>
                {Array.from({ length: Math.max(3, Math.min(limit, 8)) }).map((_, index) => (
                  <TaskRowSkeleton key={`task-skeleton-${index}`} />
                ))}
              </Box>
            ) : null}

            {!loadingTasks
              ? sortedTasks.map((task, index) => {
                  const dueState = getDueDateState(task);
                  const status = statusIconMap[dueState];
                  const statusChip = getStatusChipConfig(task.status);
                  const priorityChip = getPriorityChipConfig(task.priority);
                  const taskId = resolveTaskId(task);

                  if (!taskId) return null;

                  return (
                    <Box
                      key={taskId}
                      sx={{
                        display: { xs: 'flex', lg: 'grid' },
                        flexDirection: { xs: 'column', lg: 'unset' },
                        gridTemplateColumns: 'minmax(280px, 2.2fr) minmax(220px, 1.6fr) minmax(130px, 1fr)',
                        px: { xs: 1.5, sm: 2.5 },
                        py: { xs: 1.5, sm: 1.75 },
                        gap: { xs: 1.25, md: 1.1, lg: 0 },
                        alignItems: { lg: 'center' },
                        borderRadius: { xs: 2, lg: 0 },
                        backgroundColor: { xs: '#f8fbff', lg: 'transparent' },
                        borderBottom:
                          index === sortedTasks.length - 1 ? 'none' : `1px solid ${borderColor}`,
                        boxShadow: {
                          xs: '0 10px 20px rgba(15, 23, 42, 0.08)',
                          lg: 'none',
                        },
                        border: { xs: `1px solid ${borderColor}`, lg: 'none' },
                        mb: { xs: 1, md: 0.85, lg: 0 },
                      }}
                    >
                      <Box
                        sx={{
                          display: { xs: 'flex', lg: 'block' },
                          justifyContent: { xs: 'space-between', lg: 'flex-start' },
                          alignItems: { xs: 'center', lg: 'flex-start' },
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: mutedText, display: { xs: 'block', lg: 'none' } }}
                        >
                          Task
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: '#1f2937', wordBreak: 'break-word' }}>
                          {task.title}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={0.75}
                          flexWrap="wrap"
                          sx={{ mt: { xs: 0.5, sm: 0.45 }, rowGap: 0.6 }}
                        >
                          <Chip
                            size="small"
                            label={statusChip.label}
                            sx={{
                              height: 22,
                              borderRadius: 999,
                              bgcolor: statusChip.bg,
                              color: statusChip.color,
                              fontWeight: 700,
                              '& .MuiChip-label': { px: 1.1 },
                            }}
                          />
                          <Chip
                            size="small"
                            label={priorityChip.label}
                            sx={{
                              height: 22,
                              borderRadius: 999,
                              bgcolor: priorityChip.bg,
                              color: priorityChip.color,
                              fontWeight: 700,
                              '& .MuiChip-label': { px: 1.1 },
                            }}
                          />
                        </Stack>
                      </Box>

                      <Box
                        sx={{
                          display: { xs: 'flex', lg: 'block' },
                          justifyContent: { xs: 'space-between', lg: 'flex-start' },
                          alignItems: { xs: 'center', lg: 'flex-start' },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: mutedText, display: { xs: 'block', lg: 'none' } }}
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
                            {formatDueDate(task.dueDate)}
                          </Typography>
                        </Stack>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: { xs: 'flex-end', lg: 'center' },
                        }}
                      >
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <CustomIconButton
                            size="small"
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 999,
                              border: `1px solid ${borderColor}`,
                              color: '#64748b',
                              backgroundColor: 'white',
                            }}
                            onClick={() => setSelectedTaskId(taskId)}
                          >
                            <EditOutlined sx={{ fontSize: 16 }} />
                          </CustomIconButton>
                          <CustomTooltip title="Delete Task" placement="top">
                            <CustomIconButton
                              size="small"
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 999,
                                border: '1px solid #fca5a5',
                                backgroundColor: '#fff1f2',
                                '&:hover': {
                                  backgroundColor: '#ffe4e6',
                                  borderColor: '#fca5a5',
                                  color: '#ef4444',
                                },
                                '&:focus, &:focus-visible, &.Mui-focusVisible': {
                                  backgroundColor: '#ffe4e6',
                                  borderColor: '#fca5a5',
                                  color: '#ef4444',
                                  boxShadow: 'none',
                                  outline: 'none',
                                },
                              }}
                              onClick={() => handleOpenDeleteConfirm(taskId)}
                            >
                              <DeleteOutline sx={{ fontSize: 16, color: '#ef4444' }} />
                            </CustomIconButton>
                          </CustomTooltip>
                        </Stack>
                      </Box>
                    </Box>
                  );
                })
              : null}

            {!loadingTasks && loadTasksErrorMessage ? (
              <Box sx={{ px: 2.5, py: 4 }}>
                <Typography sx={{ color: '#ef4444' }}>{loadTasksErrorMessage}</Typography>
              </Box>
            ) : null}

            {!loadingTasks && !loadTasksErrorMessage && sortedTasks.length === 0 ? (
              <Box
                sx={{
                  px: 2.5,
                  py: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 1,
                }}
              >
                <HourglassEmptyOutlined sx={{ fontSize: 40, color: '#94a3b8' }} />
                <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>No tasks found</Typography>
                <Typography sx={{ color: mutedText, maxWidth: 420 }}>
                  {searchQuery.trim() || statusFilter || priorityFilter
                    ? 'Try different filters or search keywords.'
                    : 'Create your first task to get started.'}
                </Typography>
                <CustomButton
                  variant="contained"
                  sx={{ borderRadius: 999, px: 2.25, mt: 1, textTransform: 'none' }}
                  onClick={() => setIsAddTaskOpen(true)}
                >
                  Add Task
                </CustomButton>
              </Box>
            ) : null}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 1.25, sm: 2 },
            borderTop: `1px solid ${borderColor}`,
            backgroundColor: 'white',
            flexWrap: 'nowrap',
            overflowX: 'auto',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
            <Typography sx={{ color: mutedText, fontSize: 13, display: { xs: 'none', sm: 'block' } }}>
              Rows per page
            </Typography>
            <BasicSelect
              options={PAGE_LIMIT_OPTIONS.map((option) => ({ label: String(option), value: option }))}
              mapping={{ label: 'label', value: 'value' }}
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
              fullWidth={false}
              minWidth={84}
              disabled={loadingTasks}
            />
          </Stack>

          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ ml: 'auto', flexShrink: 0 }}>
            {!loadingTasks ? (
              <Typography sx={{ color: mutedText, fontSize: 13 }}>
                {totalTasks === 0 ? '0 results' : `${pageStart}-${pageEnd} of ${totalTasks}`}
              </Typography>
            ) : null}

            {!loadingTasks ? (
              <Pagination
                page={serverPage}
                count={totalPages}
                onChange={(_, value) => {
                  if (value !== page) {
                    setPage(value);
                  }
                }}
                disabled={loadingTasks || totalPages <= 1}
                shape="rounded"
                size="small"
                color="primary"
                siblingCount={0}
                boundaryCount={1}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 999,
                  },
                }}
              />
            ) : null}
          </Stack>
        </Box>
      </Box>

      <AddTaskModal
        open={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSave={handleCreateTask}
        loading={isCreatingTask}
        errorMessage={createTaskErrorMessage}
      />
      <EditTaskModal
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTaskId(null)}
        task={selectedTask}
        onSave={handleUpdateTask}
        onDelete={handleOpenDeleteConfirm}
        loading={isUpdatingTask}
        deleting={isDeletingTask}
        errorMessage={updateTaskErrorMessage}
      />
      <ConfirmationAlertModal
        open={Boolean(taskIdToDelete)}
        variant="delete"
        title="Delete task?"
        message="This action cannot be undone. Do you want to continue?"
        confirmText="Delete"
        cancelText="Cancel"
        isConfirmLoading={isDeletingTask}
        onClose={() => setTaskIdToDelete(null)}
        onConfirm={handleConfirmDeleteTask}
      />
    </Box>
  );
};

export default TasksPage;
