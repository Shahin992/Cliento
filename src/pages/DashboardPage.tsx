import { Box } from '@mui/material';

import {
  ActivityCard,
  CustomersCard,
  NextAppointmentCard,
  RecentDealsCard,
  StatCard,
  TasksCard,
} from '../components/dashboard';

const DashboardPage = () => (
  <Box
    sx={{
      width: '100%',
      maxWidth: '100%',
      px: { xs: 1.5, sm: 2, md: 3 },
      pb: 4,
      minHeight: { xs: 'calc(100vh - 96px)', sm: 'calc(100vh - 110px)' },
      display: 'flex',
    }}
  >
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'minmax(240px, 1fr) minmax(360px, 2fr) minmax(280px, 1fr)',
        },
        gap: { xs: 2, md: 2.5 },
        width: '100%',
        height: '100%',
        minHeight: '100%',
        alignItems: 'stretch',
        alignContent: 'stretch',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: 0,
          height: '100%',
          alignSelf: 'stretch',
          justifyContent: { xs: 'flex-start' },
        }}
      >
        <NextAppointmentCard />
        <StatCard label="Customers" value="78" color="#34d399" />
        <StatCard label="Deals" value="136" color="#f97316" />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: 0,
          height: '100%',
          alignSelf: 'stretch',
          justifyContent: { xs: 'flex-start' },
        }}
      >
        <RecentDealsCard />
        <ActivityCard />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: 0,
          height: '100%',
          alignSelf: 'stretch',
          justifyContent: { xs: 'flex-start', md: 'space-between' },
        }}
      >
        <CustomersCard />
        <TasksCard />
      </Box>
    </Box>
  </Box>
);

export default DashboardPage;
