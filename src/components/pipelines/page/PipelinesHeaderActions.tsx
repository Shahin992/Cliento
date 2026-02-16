import type { MouseEvent } from 'react';
import { FilterListOutlined, SearchOutlined } from '@mui/icons-material';
import { InputAdornment, Stack } from '@mui/material';
import BasicInput from '../../../common/BasicInput';
import { CustomButton } from '../../../common/CustomButton';
import { CustomIconButton } from '../../../common/CustomIconButton';

type PipelinesHeaderActionsProps = {
  useFilterPopover: boolean;
  borderColor: string;
  mutedText: string;
  primary: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenFilter: (event: MouseEvent<HTMLElement>) => void;
  onOpenCreate: () => void;
};

const PipelinesHeaderActions = ({
  useFilterPopover,
  borderColor,
  mutedText,
  primary,
  searchQuery,
  onSearchChange,
  onOpenFilter,
  onOpenCreate,
}: PipelinesHeaderActionsProps) => (
  <Stack
    direction={{ xs: 'row', sm: 'row' }}
    spacing={1}
    alignItems="center"
    justifyContent="flex-end"
    sx={{ width: { xs: '100%', sm: 'auto' } }}
  >
    {useFilterPopover ? (
      <CustomIconButton
        size="small"
        onClick={onOpenFilter}
        sx={{
          width: 40,
          height: 40,
          borderRadius: 999,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          color: '#475569',
        }}
      >
        <FilterListOutlined sx={{ fontSize: 20 }} />
      </CustomIconButton>
    ) : (
      <BasicInput
        fullWidth
        placeholder="Search pipelines"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        minWidth={220}
        sx={{
          height: 40,
          borderRadius: 999,
          borderColor: '#c8d6ea',
          minWidth: { sm: 230, md: 280 },
          width: { xs: '100%', sm: 'auto' },
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchOutlined sx={{ color: mutedText, fontSize: 20 }} />
          </InputAdornment>
        }
      />
    )}
    <CustomButton
      variant="contained"
      sx={{
        borderRadius: 999,
        px: 2.6,
        textTransform: 'none',
        minWidth: { xs: useFilterPopover ? 'auto' : '100%', sm: 144 },
        whiteSpace: 'nowrap',
        backgroundColor: primary,
        '&:hover': { backgroundColor: '#1d4ed8' },
      }}
      onClick={onOpenCreate}
    >
      Add Pipeline
    </CustomButton>
  </Stack>
);

export default PipelinesHeaderActions;
