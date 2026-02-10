import { Box, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { useState } from 'react';

import BasicInput from '../../common/BasicInput';
import { CustomButton } from '../../common/CustomButton';
import { cardSx, labelSx, mutedText } from './profileStyles';
import type { PasswordState } from './types';

interface ChangePasswordSectionProps {
  passwords: PasswordState;
  onChange: (field: keyof PasswordState, value: string) => void;
  isSaving?: boolean;
  isDisabled?: boolean;
  errors?: Partial<Record<keyof PasswordState, string>>;
  onSave: () => void;
}

const ChangePasswordSection = ({
  passwords,
  onChange,
  isSaving = false,
  isDisabled = false,
  errors,
  onSave,
}: ChangePasswordSectionProps) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Box id="security" sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Security</Typography>
          <Typography sx={{ color: mutedText, mt: 0.5 }}>
            Update your password to keep your account secure.
          </Typography>
        </Box>
        <CustomButton
          variant="contained"
          sx={{
            borderRadius: 999,
            px: 2.5,
            textTransform: 'none',
            width: { xs: '100%', sm: 'auto' },
          }}
          disabled={isSaving || isDisabled}
          onClick={onSave}
        >
          {isSaving ? 'Updating...' : 'Update Password'}
        </CustomButton>
      </Stack>

      <Stack spacing={1.5}>
        <Box>
          <Typography sx={labelSx}>Current Password</Typography>
          <BasicInput
            fullWidth
            type={showCurrent ? 'text' : 'password'}
            value={passwords.current}
            onChange={(event) => onChange('current', event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setShowCurrent((prev) => !prev)}
                  edge="end"
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors?.current ? (
            <Typography sx={{ color: '#dc2626', fontSize: 12, mt: 0.5 }}>
              {errors.current}
            </Typography>
          ) : null}
        </Box>
        <Box>
          <Typography sx={labelSx}>New Password</Typography>
          <BasicInput
            fullWidth
            type={showNext ? 'text' : 'password'}
            value={passwords.next}
            onChange={(event) => onChange('next', event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setShowNext((prev) => !prev)}
                  edge="end"
                  aria-label={showNext ? 'Hide password' : 'Show password'}
                >
                  {showNext ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors?.next ? (
            <Typography sx={{ color: '#dc2626', fontSize: 12, mt: 0.5 }}>
              {errors.next}
            </Typography>
          ) : null}
        </Box>
        <Box>
          <Typography sx={labelSx}>Confirm Password</Typography>
          <BasicInput
            fullWidth
            type={showConfirm ? 'text' : 'password'}
            value={passwords.confirm}
            onChange={(event) => onChange('confirm', event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  edge="end"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors?.confirm ? (
            <Typography sx={{ color: '#dc2626', fontSize: 12, mt: 0.5 }}>
              {errors.confirm}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Box>
  );
};

export default ChangePasswordSection;
