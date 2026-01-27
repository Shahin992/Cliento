import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import type { DealActivity } from '../../../data/deals';
import EditActivityModal from '../modals/EditActivityModal';

interface ActivityLogProps {
  items: DealActivity[];
}

const ActivityLog = ({ items }: ActivityLogProps) => {
  const [selectedActivity, setSelectedActivity] = useState<DealActivity | null>(null);

  return (
    <>
      <Box
        sx={{
          borderRadius: 3,
          border: '1px solid #e7edf6',
          backgroundColor: 'white',
          px: { xs: 1.5, sm: 2 },
          py: 2,
        }}
      >
        <Typography sx={{ fontWeight: 700, color: '#1f2937', mb: 1.5 }}>
          Activity Log
        </Typography>
        <Stack spacing={2}>
          {items.map((item, index) => (
            <Box
              key={item.id}
              sx={{ display: 'flex', gap: 1.5, cursor: 'pointer' }}
              onClick={() => setSelectedActivity(item)}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: 18,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#6d28ff',
                    mt: 0.5,
                  }}
                />
                {index < items.length - 1 ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      bottom: -16,
                      width: 2,
                      bgcolor: '#e7edf6',
                    }}
                  />
                ) : null}
              </Box>
              <Box>
                <Typography sx={{ fontSize: 11, color: '#94a3b8', mb: 0.5 }}>
                  {item.date}
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>
                  {item.title}
                </Typography>
                {item.description ? (
                  <Typography sx={{ fontSize: 12, color: '#64748b', mt: 0.5 }}>
                    {item.description}
                  </Typography>
                ) : null}
                {item.hasImage ? (
                  <Box
                    sx={{
                      mt: 1,
                      width: '100%',
                      height: 72,
                      borderRadius: 2,
                      backgroundColor: '#e2e8f0',
                    }}
                  />
                ) : null}
              </Box>
            </Box>
          ))}
        </Stack>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            color: '#6d28ff',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Load More
        </Box>
      </Box>

      <EditActivityModal
        open={Boolean(selectedActivity)}
        onClose={() => setSelectedActivity(null)}
        activity={selectedActivity}
      />
    </>
  );
};

export default ActivityLog;
