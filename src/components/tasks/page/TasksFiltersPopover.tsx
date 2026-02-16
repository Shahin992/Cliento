import { Popover, Stack, Typography } from '@mui/material';
import BasicInput from '../../../common/BasicInput';
import BasicSelect from '../../../common/BasicSelect';
import { CustomButton } from '../../../common/CustomButton';

type TasksFiltersPopoverProps = {
  useFilterPopover: boolean;
  open: boolean;
  anchorEl: HTMLElement | null;
  borderColor: string;
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onClearFilters: () => void;
  onClose: () => void;
};

const TasksFiltersPopover = ({
  useFilterPopover,
  open,
  anchorEl,
  borderColor,
  searchQuery,
  statusFilter,
  priorityFilter,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onClearFilters,
  onClose,
}: TasksFiltersPopoverProps) => (
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
        placeholder="Search tasks"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <BasicSelect
        options={[
          { label: 'All status', value: '' },
          { label: 'Todo', value: 'todo' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Done', value: 'done' },
        ]}
        mapping={{ label: 'label', value: 'value' }}
        value={statusFilter}
        onChange={(event) => onStatusChange((event.target.value as string) || '')}
      />
      <BasicSelect
        options={[
          { label: 'All priority', value: '' },
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ]}
        mapping={{ label: 'label', value: 'value' }}
        value={priorityFilter}
        onChange={(event) => onPriorityChange((event.target.value as string) || '')}
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

export default TasksFiltersPopover;
