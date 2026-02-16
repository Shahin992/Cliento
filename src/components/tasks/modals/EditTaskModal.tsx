import { useEffect, useState, type ChangeEvent } from 'react';
import { Box, Modal, Stack, Typography, type SelectChangeEvent } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { CloseOutlined } from '@mui/icons-material';

import { CustomButton } from '../../../common/CustomButton';
import BasicInput from '../../../common/BasicInput';
import BasicSelect from '../../../common/BasicSelect';
import type { TaskListItem } from '../../../hooks/tasks/useTasksQueries';
import type { TaskPayload } from '../../../hooks/tasks/useTasksMutations';
import {
  isoToDateTimeLocal,
  validateTaskPayload,
  type TaskFormValues,
} from './taskValidation';

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: TaskListItem | null;
  onSave: (taskId: string, payload: TaskPayload) => Promise<void>;
  onDelete: (taskId: string) => void;
  loading?: boolean;
  deleting?: boolean;
  errorMessage?: string | null;
}

const labelSx = {
  fontSize: 12,
  fontWeight: 700,
  color: '#0f172a',
  mb: 0.75,
};

const inputSx = {
  width: '100%',
  height: 36,
  px: 1.5,
  borderRadius: 2,
  border: '1px solid #e7edf6',
  backgroundColor: '#f8fbff',
  fontSize: 12,
  color: '#0f172a',
  outline: 'none',
  '&::placeholder': {
    color: '#94a3b8',
    opacity: 1,
  },
};

const resolveTaskId = (task: TaskListItem | null) => task?._id?.trim() || task?.id?.trim() || '';

const statusToFormValue = (status?: string | null) => {
  const normalized = (status ?? '').trim().toLowerCase();
  if (normalized === 'completed' || normalized === 'done') return 'done';
  if (normalized === 'in_progress' || normalized === 'in-progress') return 'in_progress';
  return 'todo';
};

const priorityToFormValue = (priority?: string | null) => {
  const normalized = (priority ?? '').trim().toLowerCase();
  if (normalized === 'high') return 'high';
  if (normalized === 'medium') return 'medium';
  return 'low';
};

const defaultFormValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'low',
  dueDate: '',
};

const EditTaskModal = ({
  open,
  onClose,
  task,
  onSave,
  onDelete,
  loading = false,
  deleting = false,
  errorMessage = null,
}: EditTaskModalProps) => {
  const [form, setForm] = useState<TaskFormValues>(defaultFormValues);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !task) {
      setForm(defaultFormValues);
      setValidationError(null);
      return;
    }

    setForm({
      title: task.title ?? '',
      description: task.description ?? '',
      status: statusToFormValue(task.status),
      priority: priorityToFormValue(task.priority),
      dueDate: isoToDateTimeLocal(task.dueDate),
    });
    setValidationError(null);
  }, [open, task]);

  const handleSave = async () => {
    const taskId = resolveTaskId(task);
    if (!taskId) {
      setValidationError('Task id is missing.');
      return;
    }

    const validation = validateTaskPayload(form);
    if (!validation.success) {
      setValidationError(validation.message);
      return;
    }

    setValidationError(null);
    await onSave(taskId, validation.payload);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-task-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92vw', sm: 420 },
          maxWidth: '92vw',
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22)',
          p: 2.5,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="edit-task-title" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Edit Task
          </Typography>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              width: 28,
              height: 28,
              borderRadius: 999,
              backgroundColor: '#f1f5f9',
              color: '#94a3b8',
              '&:hover': { backgroundColor: '#e2e8f0' },
            }}
          >
            <CloseOutlined sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <Box>
            <Typography sx={labelSx}>Title</Typography>
            <BasicInput
              fullWidth
              value={form.title}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, title: event.target.value }));
                if (validationError) setValidationError(null);
              }}
              placeholder="Enter task title"
              sx={{ ...inputSx, mt: 1 }}
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>Description</Typography>
            <Box
              component="textarea"
              rows={3}
              value={form.description}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                setForm((prev) => ({ ...prev, description: event.target.value }));
                if (validationError) setValidationError(null);
              }}
              placeholder="Enter task description"
              sx={{ ...inputSx, height: 'auto', py: 1 }}
            />
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={labelSx}>Status</Typography>
              <BasicSelect
                options={[
                  { label: 'Todo', value: 'todo' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Done', value: 'done' },
                ]}
                mapping={{ label: 'label', value: 'value' }}
                value={form.status}
                onChange={(event: SelectChangeEvent<unknown>) => {
                  setForm((prev) => ({ ...prev, status: event.target.value as string }));
                  if (validationError) setValidationError(null);
                }}
                defaultText="Select status"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={labelSx}>Priority</Typography>
              <BasicSelect
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
                mapping={{ label: 'label', value: 'value' }}
                value={form.priority}
                onChange={(event: SelectChangeEvent<unknown>) => {
                  setForm((prev) => ({ ...prev, priority: event.target.value as string }));
                  if (validationError) setValidationError(null);
                }}
                defaultText="Select priority"
              />
            </Box>
          </Stack>

          <Box>
            <Typography sx={labelSx}>Due Date</Typography>
            <BasicInput
              fullWidth
              type="datetime-local"
              value={form.dueDate}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, dueDate: event.target.value }));
                if (validationError) setValidationError(null);
              }}
              sx={{ ...inputSx, mt: 1 }}
            />
          </Box>

          {validationError ? (
            <Typography sx={{ color: '#dc2626', fontSize: 12, fontWeight: 600 }}>
              {validationError}
            </Typography>
          ) : null}
          {errorMessage && !validationError ? (
            <Typography sx={{ color: '#dc2626', fontSize: 12, fontWeight: 600 }}>
              {errorMessage}
            </Typography>
          ) : null}
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2.5 }}>
          <CustomButton
            variant="text"
            customColor="#ef4444"
            disabled={deleting}
            onClick={() => {
              const taskId = resolveTaskId(task);
              if (!taskId) {
                setValidationError('Task id is missing.');
                return;
              }
              onDelete(taskId);
            }}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Delete
          </CustomButton>
          <CustomButton
            variant="contained"
            onClick={() => {
              void handleSave();
            }}
            disabled={loading || deleting}
            sx={{
              borderRadius: 999,
              px: 2.5,
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditTaskModal;
