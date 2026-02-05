export interface TaskItem {
  id: string;
  dueDate: string;
  title: string;
  status: 'warning' | 'overdue' | 'complete' | 'default';
}

export const tasks: TaskItem[] = [
  {
    id: 'task-1',
    dueDate: '14 Nov 2021',
    title: 'Description goes here',
    status: 'warning',
  },
  {
    id: 'task-2',
    dueDate: '24 Dec 2021',
    title: 'Web conference agenda (overdue)',
    status: 'overdue',
  },
  {
    id: 'task-3',
    dueDate: '24 Nov 2022',
    title: 'Meeting with partners',
    status: 'complete',
  },
  {
    id: 'task-4',
    dueDate: '24 Nov 2022',
    title: 'Add new services',
    status: 'default',
  },
  {
    id: 'task-5',
    dueDate: '24 Nov 2022',
    title: 'Upload new legals (terms & conditions)',
    status: 'complete',
  },
  {
    id: 'task-6',
    dueDate: '24 Nov 2022',
    title: 'Sales report due',
    status: 'default',
  },
  {
    id: 'task-7',
    dueDate: '24 Nov 2022',
    title: 'Description goes here',
    status: 'default',
  },
];

