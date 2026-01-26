import { Box, Stack, Typography } from '@mui/material';
import { EventOutlined } from '@mui/icons-material';

import { CustomButton } from '../../../common/CustomButton';

const labelSx = { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' };

const RecordActivityCard = () => (
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
      Record Activity
    </Typography>
    <Stack spacing={1.5}>
      <Box>
        <Typography sx={labelSx}>Description</Typography>
        <Box
          component="textarea"
          placeholder="Write your notes"
          rows={3}
          style={{
            width: '100%',
            borderRadius: 8,
            border: '1px solid #e7edf6',
            padding: '10px 12px',
            fontSize: 13,
            color: '#475569',
            background: '#f8fbff',
            resize: 'none',
            fontFamily: 'inherit',
          }}
        />
      </Box>
      <Box>
        <Typography sx={labelSx}>Date</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #e7edf6',
            borderRadius: 8,
            px: 1.5,
            py: 1,
            backgroundColor: '#f8fbff',
            color: '#64748b',
            fontSize: 13,
          }}
        >
          <span>Nov 14 2021, 10:00</span>
          <EventOutlined sx={{ fontSize: 18, color: '#94a3b8' }} />
        </Box>
      </Box>
      <Box>
        <Typography sx={labelSx}>Images</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #e7edf6',
            borderRadius: 8,
            px: 1.5,
            py: 1,
            backgroundColor: '#f8fbff',
            color: '#94a3b8',
            fontSize: 12,
            letterSpacing: '0.08em',
          }}
        >
          <span />
          <span>ADD</span>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CustomButton
          variant="contained"
          customColor="#6d28ff"
          sx={{ borderRadius: 999, px: 3, textTransform: 'none', height: 34 }}
        >
          Save
        </CustomButton>
      </Box>
    </Stack>
  </Box>
);

export default RecordActivityCard;
