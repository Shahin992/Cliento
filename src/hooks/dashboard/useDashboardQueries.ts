import { useAppQuery } from '../useAppQuery';

type DashboardSummaryDeals = {
  total: number;
  open: number;
  won: number;
  lost: number;
};

type DashboardWonThisMonth = {
  count: number;
  amount: number;
};

type DashboardWonLostComparison = {
  wonCount: number;
  lostCount: number;
  wonAmount: number;
  lostAmount: number;
  winRate: number;
};

type DashboardContactsSummary = {
  total: number;
};

type DashboardSummary = {
  deals: DashboardSummaryDeals;
  wonThisMonth: DashboardWonThisMonth;
  wonLostComparison: DashboardWonLostComparison;
  contacts: DashboardContactsSummary;
};

type DashboardPipelineRef = {
  _id: string;
  name: string;
};

type DashboardStageRef = {
  _id: string;
  name: string;
  color?: string | null;
  order?: number;
};

type DashboardDealContactRef = {
  _id: string;
  name: string;
  companyName?: string;
};

export type DashboardRecentDeal = {
  _id: string;
  title: string;
  amount: number | null;
  status: string;
  expectedCloseDate: string | null;
  createdAt: string;
  wonAt?: string | null;
  lostAt?: string | null;
  pipeline?: DashboardPipelineRef | null;
  stage?: DashboardStageRef | null;
  contact?: DashboardDealContactRef | null;
};

export type DashboardRecentContact = {
  _id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  photoUrl?: string | null;
  companyName?: string | null;
  status?: string | null;
  leadSource?: string | null;
  createdAt: string;
};

export type DashboardRecentTask = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  createdAt?: string;
};

export type DashboardOverview = {
  summary: DashboardSummary;
  recentDeals: DashboardRecentDeal[];
  recentContacts: DashboardRecentContact[];
  recentTasks: DashboardRecentTask[];
};

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  overview: () => ['dashboard', 'overview'] as const,
};

export const useDashboardOverviewQuery = () => {
  const query = useAppQuery<DashboardOverview>({
    queryKey: dashboardQueryKeys.overview(),
    request: {
      method: 'GET',
      url: '/api/dashboard/overview',
    },
  });

  return {
    ...query,
    overview: query.data,
    summary: query.data?.summary,
    recentDeals: query.data?.recentDeals ?? [],
    recentContacts: query.data?.recentContacts ?? [],
    recentTasks: query.data?.recentTasks ?? [],
    loading: query.isLoading,
    hasError: query.isError,
    errorMessage: query.error?.message ?? null,
  };
};
