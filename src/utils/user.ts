import type { User } from '../types/user';

type UserWithOwnerDetails = User & {
  ownerDetails?: unknown;
};

export const hasActiveAccess = (accessExpiresAt?: string | null) => {
  if (!accessExpiresAt) return false;

  const expiresAtMs = Date.parse(accessExpiresAt);
  if (Number.isNaN(expiresAtMs)) return false;

  return expiresAtMs > Date.now();
};

export const normalizeUserDetails = (user: UserWithOwnerDetails): UserWithOwnerDetails => {
  const normalizedOwnerDetails = user.ownerDetails ?? user.ownerInfo ?? null;

  return {
    ...user,
    ownerInfo: normalizedOwnerDetails,
    ownerDetails: normalizedOwnerDetails,
  };
};
