export type UserRole = 'SUPER_ADMIN' | 'OWNER' | 'ADMIN' | 'MEMBER' | 'USER';

export type User = {
  _id: string;
  fullName: string;
  companyName: string;
  email: string;
  role: UserRole;
  ownerInfo: unknown;
  profilePhoto: string | null;
  phoneNumber: string;
  location: string | null;
  timeZone: string | null;
  signature: string | null;
  accessExpiresAt: string | null;
  planType: string;
  createdAt: string;
  updatedAt: string;
};
