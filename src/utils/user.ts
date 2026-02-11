import type { User } from '../types/user';

type UserWithOwnerDetails = User & {
  ownerDetails?: unknown;
};

export const normalizeUserDetails = (user: UserWithOwnerDetails): UserWithOwnerDetails => {
  const normalizedOwnerDetails = user.ownerDetails ?? user.ownerInfo ?? null;

  return {
    ...user,
    ownerInfo: normalizedOwnerDetails,
    ownerDetails: normalizedOwnerDetails,
  };
};
