import type { TaskPayload } from '../../../hooks/tasks/useTasksMutations';

const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;

export type TaskFormValues = {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
};

type ValidationSuccess = {
  success: true;
  payload: TaskPayload;
};

type ValidationError = {
  success: false;
  message: string;
};

export type TaskValidationResult = ValidationSuccess | ValidationError;

const parseDateTimeLocalToIso = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
};

export const isoToDateTimeLocal = (isoDate?: string | null): string => {
  if (!isoDate) return '';

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return '';

  const offsetMinutes = parsed.getTimezoneOffset();
  const localDate = new Date(parsed.getTime() - offsetMinutes * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

export const validateTaskPayload = (form: TaskFormValues): TaskValidationResult => {
  const title = form.title.trim();
  if (!title.length) {
    return { success: false, message: 'Title is required.' };
  }
  if (title.length > 120) {
    return { success: false, message: 'Title must be 120 characters or less.' };
  }

  const description = form.description.trim();
  if (!description.length) {
    return { success: false, message: 'Description is required.' };
  }
  if (description.length > 2000) {
    return { success: false, message: 'Description must be 2000 characters or less.' };
  }

  const status = form.status.trim();
  if (!TASK_STATUSES.includes(status as (typeof TASK_STATUSES)[number])) {
    return { success: false, message: 'Status is invalid.' };
  }

  const priority = form.priority.trim();
  if (!TASK_PRIORITIES.includes(priority as (typeof TASK_PRIORITIES)[number])) {
    return { success: false, message: 'Priority is invalid.' };
  }

  const dueDate = parseDateTimeLocalToIso(form.dueDate);
  if (!dueDate) {
    return { success: false, message: 'Due date is invalid.' };
  }

  return {
    success: true,
    payload: {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: null,
    },
  };
};
