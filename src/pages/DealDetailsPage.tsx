import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import ActivityLog from '../components/deals/details/ActivityLog';
import DealContactBar from '../components/deals/details/DealContactBar';
import DealInfoSection from '../components/deals/details/DealInfoSection';
import DealSummaryCard from '../components/deals/details/DealSummaryCard';
import RecordActivityCard from '../components/deals/details/RecordActivityCard';
import { deals } from '../data/deals';

const DealDetailsPage = () => {
  const { dealId } = useParams();
  const deal = deals.find((item) => String(item.id) === dealId) ?? deals[0];

  if (!deal) {
    return (
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 4 }}>
        <Typography sx={{ color: '#64748b' }}>Deal not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 1.5, sm: 2, md: 3 },
        pb: 4,
        minHeight: { xs: 'calc(100vh - 96px)', sm: 'calc(100vh - 110px)' },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          borderRadius: 3,
          border: '1px solid #e7edf6',
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        <DealContactBar customer={deal.customer} email={deal.email} phone={deal.phone} />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2.2fr) minmax(280px, 1fr)' },
            gap: { xs: 2, lg: 2.5 },
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 2, sm: 2.5 },
            backgroundColor: '#f8fbff',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <DealSummaryCard address={deal.address} />
            <DealInfoSection
              progress={deal.progress}
              appointment={deal.appointment}
              roomArea={deal.roomArea}
              people={deal.people}
              price={deal.price}
              roomAccess={deal.roomAccess}
              instructions={deal.instructions}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <RecordActivityCard />
            <ActivityLog items={deal.activity} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DealDetailsPage;
