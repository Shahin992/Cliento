import { Popover, Stack, Typography } from '@mui/material';
import BasicInput from '../../../common/BasicInput';
import { CustomButton } from '../../../common/CustomButton';

type PipelinesFiltersPopoverProps = {
  useFilterPopover: boolean;
  open: boolean;
  anchorEl: HTMLElement | null;
  borderColor: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
  onClose: () => void;
};

const PipelinesFiltersPopover = ({
  useFilterPopover,
  open,
  anchorEl,
  borderColor,
  searchQuery,
  onSearchChange,
  onClearFilters,
  onClose,
}: PipelinesFiltersPopoverProps) => (
  <Popover
    open={useFilterPopover && open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    PaperProps={{
      sx: {
        mt: 1,
        width: { xs: 'calc(100vw - 24px)', sm: 340 },
        maxWidth: 'calc(100vw - 24px)',
        p: 1.5,
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        boxShadow: '0 16px 36px rgba(15, 23, 42, 0.16)',
      },
    }}
  >
    <Stack spacing={1.25}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Filters</Typography>
      <BasicInput
        fullWidth
        placeholder="Search pipelines"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <CustomButton
          variant="text"
          customColor="#64748b"
          sx={{ textTransform: 'none', px: 0 }}
          onClick={onClearFilters}
        >
          Clear Filters
        </CustomButton>
        <CustomButton
          variant="contained"
          sx={{ textTransform: 'none', borderRadius: 999, px: 2 }}
          onClick={onClose}
        >
          Done
        </CustomButton>
      </Stack>
    </Stack>
  </Popover>
);

export default PipelinesFiltersPopover;
