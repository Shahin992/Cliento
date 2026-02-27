import { useAppQuery } from '../useAppQuery';

export type TeamUser = {
  _id: string;
  fullName: string;
  companyName?: string | null;
  email: string;
  role: string;
  teamId: number;
  ownerInfo?: unknown;
  profilePhoto?: string | null;
  phoneNumber?: string | null;
  location?: string | null;
  timeZone?: string | null;
  accessExpiresAt?: string | null;
  planType?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type TeamUsersData = {
  totalAllowedUsers: number;
  usedUsers: number;
  remainingUsers: number;
  canCreateMoreUsers: boolean;
  users: TeamUser[];
};

export const userQueryKeys = {
  teamUsers: ['users', 'team-users'] as const,
};

export const useTeamUsersQuery = () => {
  const query = useAppQuery<TeamUsersData>({
    queryKey: userQueryKeys.teamUsers,
    request: {
      method: 'GET',
      url: '/api/users/team-users',
    },
    retry: false,
  });

  return {
    ...query,
    teamUsersData: query.data ?? null,
    users: query.data?.users ?? [],
    loading: query.isLoading || query.isFetching,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};
