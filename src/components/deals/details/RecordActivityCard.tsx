import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { EventOutlined } from '@mui/icons-material';

import { CustomButton } from '../../../common/CustomButton';

const labelSx = { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' };

const RecordActivityCard = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const imageUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ''),
    [imageFile],
  );

  useEffect(() => {
    if (!imageFile) {
      return undefined;
    }

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageFile, imageUrl]);

  return (
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
        <Box sx={{ position: 'relative' }}>
          <Box
            component="input"
            type="datetime-local"
            defaultValue="2021-11-14T10:00"
            sx={{
              width: '100%',
              height: 36,
              px: 1.5,
              borderRadius: 8,
              border: '1px solid #e7edf6',
              backgroundColor: '#f8fbff',
              color: '#64748b',
              fontSize: 13,
              outline: 'none',
              '&::-webkit-calendar-picker-indicator': {
                opacity: 0,
                cursor: 'pointer',
              },
            }}
          />
          <EventOutlined
            sx={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 18,
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          />
        </Box>
      </Box>
        <Box>
          <Typography sx={labelSx}>Images</Typography>
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e7edf6',
              borderRadius: 8,
              px: 1.5,
              py: 1,
              backgroundColor: '#f8fbff',
              color: '#94a3b8',
              fontSize: 12,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt="Activity upload"
                sx={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6 }}
              />
            ) : (
              'ADD'
            )}
          </Box>
          <Box
            component="input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setImageFile(file);
            }}
            sx={{ display: 'none' }}
          />
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
};

export default RecordActivityCard;
