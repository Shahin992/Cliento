import type { TeamUser } from '../../hooks/user/useUserQueries';

export const borderColor = '#e7edf6';
export const mutedText = '#8b95a7';

export const toTitleCase = (value?: string | null) => {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (!normalized) return 'Unknown';
  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
};

export const getUserInitials = (user: TeamUser) => {
  const fromName = user.fullName
    ?.split(' ')
    .map((part) => part.trim()?.[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (fromName) return fromName;
  return user.email?.trim()?.[0]?.toUpperCase() ?? 'U';
};

const isAccessExpired = (accessExpiresAt?: string | null) => {
  if (!accessExpiresAt) return false;
  const expiresAt = new Date(accessExpiresAt);
  if (Number.isNaN(expiresAt.getTime())) return false;
  return expiresAt.getTime() < Date.now();
};

export type UserState = 'active' | 'inactive' | 'system';

export const getUserState = (user: TeamUser): UserState => {
  const normalizedRole = user.role?.trim().toLowerCase() ?? '';

  if (normalizedRole === 'owner' || normalizedRole === 'system') {
    return 'system';
  }

  return isAccessExpired(user.accessExpiresAt) ? 'inactive' : 'active';
};

export const getStatusChipSx = (status: UserState) => {
  if (status === 'system') {
    return {
      bgcolor: '#ede9fe',
      color: '#5b21b6',
    };
  }

  if (status === 'active') {
    return {
      bgcolor: '#ecfdf3',
      color: '#166534',
    };
  }

  return {
    bgcolor: '#fff1f2',
    color: '#be123c',
  };
};

export const getAvatarAccent = (status: UserState) => {
  if (status === 'system') {
    return { border: '#c4b5fd', dot: '#7c3aed' };
  }
  if (status === 'active') {
    return { border: '#86efac', dot: '#16a34a' };
  }
  return { border: '#fda4af', dot: '#e11d48' };
};

export const normalizePhoneToE164 = (value: string) => {
  let cleaned = value.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('00')) {
    cleaned = `+${cleaned.slice(2)}`;
  }

  if (cleaned.startsWith('+')) {
    cleaned = `+${cleaned.slice(1).replace(/\D/g, '')}`;
    return cleaned;
  }

  const digits = cleaned.replace(/\D/g, '');
  if (digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }

  return digits;
};
