export const pageBg = 'linear-gradient(180deg, #f1f5f9 0%, #eef2f6 100%)';
export const borderColor = 'rgba(15, 23, 42, 0.08)';
export const mutedText = '#667085';
export const textColor = '#0f172a';
export const cardBg = 'rgba(248, 250, 252, 0.92)';
export const elevatedBg = 'rgba(255, 255, 255, 0.72)';

export const formatCurrency = (value?: number | null) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDate = (value?: string | null) => {
  if (!value) return 'No date';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'No date';
  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getInitials = (value?: string | null) =>
  (value ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'C';

export const normalizeRate = (value?: number | null) => {
  const numericValue = Number(value) || 0;
  return Math.max(0, Math.min(100, numericValue));
};

export const getStatusTone = (status?: string | null) => {
  switch ((status ?? '').trim().toLowerCase()) {
    case 'won':
      return { label: 'Won', color: '#027a48', bg: '#ecfdf3' };
    case 'lost':
      return { label: 'Lost', color: '#b42318', bg: '#fef3f2' };
    default:
      return { label: 'Open', color: '#175cd3', bg: '#eff8ff' };
  }
};

export const getTaskTone = (status?: string | null) => {
  switch ((status ?? '').trim().toLowerCase()) {
    case 'done':
      return { label: 'Done', color: '#027a48', bg: '#ecfdf3' };
    case 'in_progress':
      return { label: 'In Progress', color: '#b54708', bg: '#fffaeb' };
    default:
      return { label: 'To Do', color: '#175cd3', bg: '#eff8ff' };
  }
};
