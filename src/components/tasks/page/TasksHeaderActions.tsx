import type { MouseEvent } from 'react';
import { AddOutlined, FilterListOutlined, SearchOutlined } from '@mui/icons-material';
import { InputAdornment, Stack } from '@mui/material';
import { CustomIconButton } from '../../../common/CustomIconButton';
import BasicInput from '../../../common/BasicInput';
import BasicSelect from '../../../common/BasicSelect';
import { CustomButton } from '../../../common/CustomButton';

type TasksHeaderActionsProps = {
  useFilterPopover: boolean;
  borderColor: string;
  mutedText: string;
  primary: string;
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onOpenFilter: (event: MouseEvent<HTMLElement>) => void;
  onOpenAddTask: () => void;
};

const TasksHeaderActions = ({
  useFilterPopover,
  borderColor,
  mutedText,
  primary,
  searchQuery,
  statusFilter,
  priorityFilter,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onOpenFilter,
  onOpenAddTask,
}: TasksHeaderActionsProps) => (
  <>
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="flex-end"
      sx={{ display: useFilterPopover ? 'flex' : 'none', minWidth: 90 }}
    >
      <CustomIconButton
        size="small"
        onClick={onOpenFilter}
        customColor={mutedText}
        sx={{
          width: 40,
          height: 40,
          borderRadius: 999,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
        }}
      >
        <FilterListOutlined sx={{ fontSize: 20 }} />
      </CustomIconButton>
      <CustomIconButton
        size="small"
        onClick={onOpenAddTask}
        customColor="white"
        sx={{
          width: 40,
          height: 40,
          borderRadius: 999,
          backgroundColor: `${primary} !important`,
          '&:hover': {
            backgroundColor: '#346fef !important',
          },
          '&:focus, &:focus-visible': {
            backgroundColor: `${primary} !important`,
          },
          '&.Mui-focusVisible': {
            backgroundColor: `${primary} !important`,
          },
        }}
      >
        <AddOutlined sx={{ fontSize: 20 }} />
      </CustomIconButton>
    </Stack>

    <Stack
      direction="row"
      spacing={0.75}
      alignItems="center"
      sx={{
        display: useFilterPopover ? 'none' : 'flex',
        width: { sm: 'auto' },
        flexWrap: 'nowrap',
      }}
    >
      <BasicInput
        fullWidth
        placeholder="Search tasks"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        minWidth={210}
        sx={{
          height: 40,
          borderRadius: 999,
          borderColor: '#d6dee9',
          minWidth: { sm: 210, md: 240 },
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchOutlined sx={{ color: mutedText, fontSize: 20 }} />
          </InputAdornment>
        }
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
        fullWidth={false}
        minWidth={132}
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
        fullWidth={false}
        minWidth={132}
      />
      <CustomButton
        variant="contained"
        sx={{
          borderRadius: 999,
          px: 2.5,
          textTransform: 'none',
          minWidth: { sm: 132, md: 148 },
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
        onClick={onOpenAddTask}
      >
        Add Task
      </CustomButton>
    </Stack>
  </>
);

export default TasksHeaderActions;
