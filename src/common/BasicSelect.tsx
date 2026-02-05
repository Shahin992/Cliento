import type { CSSProperties } from 'react';
import type { SelectChangeEvent, SelectProps } from '@mui/material';
import { FormHelperText, InputBase, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';

//                                Useages

// <BasicSelect
// fullWidth
//   options={DUMMY_OPTIONS}
//     value={name}
//     onChange={(e)=> setName(e.target.value)}
//   defaultText="Select Privacy"
//   mapping={{ label: 'label', value: 'value' }}
// />

const BasicInputSelect = styled(InputBase)(({ theme }) => ({
  backgroundColor: 'white',
  fontSize: '15px',
  padding: '3px 9px',
  height: '40px !important',
  borderRadius: '4px',
  border: '1px solid #ced4da',
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  '&:focus': {
    borderRadius: 4,
    boxShadow: 'unset',
    backgroundColor: '#fff',
  },
  '& input::placeholder': {
    color: '#082852',
  },
}));


const menuItemSx = {
  '&:hover': {
    backgroundColor: '#cbd4ff',
    color: '#133159',
  },
  '&.Mui-selected': {
    backgroundColor: '#cbd4ff',
    color: '#133159',
  },
};

const lineThroughItemSx = {
  textDecoration: 'line-through',
  color: '#ee1b54',
};

const deletedNoteSx = {
  fontSize: '9px',
  ml: 1,
};

const preloaderSx: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: '#e3e9e9',
  width: '100%',
  height:'40px',
  padding: '10px',
  fontSize: '16px',
  fontWeight:600,
  borderRadius: '4px',
  border: '1px solid #ced4da',
  color: '#c89999',
  userSelect: 'none',
  cursor: 'progress',
};

type BasicSelectOption = Record<string, string | number>;

interface BasicSelectProps {
  options: BasicSelectOption[];
  mapping?: { label: string; value: string };
  defaultText?: string;
  name?: string;
  onChange: (event: SelectChangeEvent<unknown>) => void;
  value?: SelectProps['value'];
  disabled?: boolean;
  selectedOption?: (option: BasicSelectOption) => void;
  deletedMapping?: { field: string; value: string | number };
  className?: string | null;
  emptyable?: boolean;
  fullWidth?: boolean;
  multiple?: boolean;
  isLoading?: boolean;
  error?: string;
  dropDownHeight?: string | number;
  minWidth?: string | number;
}

const BasicSelect = ({
  options,
  mapping = { label: 'title', value: 'id' },
  defaultText = 'Select',
  name = 'default',
  onChange,
  value = '',
  disabled = false,
  selectedOption,
  deletedMapping,
  className = null,
  emptyable = false,
  fullWidth = true,
  multiple = false,
  isLoading = false,
  error = '',
  dropDownHeight = '350px',
  minWidth = 120,
}: BasicSelectProps) => {
  const placeholderColor = 'rgb(8 40 82 / 44%)';
  const activeColor = '#36454F';

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    let newValue = event.target.value as SelectProps['value'];

    if (multiple) {
      if (!Array.isArray(newValue) || newValue.length === 0) {
        newValue = [''];
      } else if (newValue[newValue.length - 1] === '' && emptyable) {
        newValue = [''];
      } else {
        newValue = newValue.filter((val) => val !== '');
      }
    }

    const patchedEvent = {
      ...event,
      target: { ...event.target, value: newValue, name },
    } as SelectChangeEvent<unknown>;

    onChange(patchedEvent);

    if (selectedOption && !multiple) {
      const selected = options.find(
        (option) => option[mapping.value] === newValue
      );
      if (selected) {
        selectedOption(selected);
      }
    }
  };

  const renderOptions = () => {
    const filtered = options.filter((option) => {
      const isDeleted =
        deletedMapping && option[deletedMapping.field] === deletedMapping.value;
      const isCurrent = multiple
        ? Array.isArray(value) && value.includes(option[mapping.value])
        : value === option[mapping.value];

      return !isDeleted || isCurrent;
    });

    return filtered.map((option, index) => {
      const isDeleted =
        deletedMapping && option[deletedMapping.field] === deletedMapping.value;

      return (
        <MenuItem
          key={index}
          value={option[mapping.value]}
          sx={{
            ...menuItemSx,
            ...(isDeleted ? lineThroughItemSx : {}),
          }}
        >
          {option[mapping.label]}
          {isDeleted && <span style={deletedNoteSx}>(deleted)</span>}
        </MenuItem>
      );
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: fullWidth ? '100%' : 'auto',
        minWidth,
      }}
    >
      <Select
        fullWidth={fullWidth}
        defaultValue={value}
        value={value}
        onChange={handleSelectChange}
        name={name}
        displayEmpty
        disabled={disabled}
        multiple={multiple}
        input={
          <BasicInputSelect
            style={{
              color: multiple
                ? !(Array.isArray(value) && value[0])
                  ? placeholderColor
                  : activeColor
                : !value
                  ? placeholderColor
                  : activeColor,
            }}
          />
        }
        inputProps={{ 'aria-label': 'Without label' }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          PaperProps: {
            style: {
              maxHeight: dropDownHeight,
            },
            sx: {
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: '10px',
                backgroundColor: '#346fef',
              },
              '&::-webkit-scrollbar-track': {
                borderRadius: '10px',
                backgroundColor: '#2c3e50',
              },
            },
          },
        }}
        className={className ?? ''}
        error={!!error}
      >
        <MenuItem
          value=""
          disabled={!emptyable}
          sx={{
            ...menuItemSx, color: '#c0c0c0', fontSize: '15px',

            '&.Mui-disabled': {
              opacity: 1,
              color: '#999',
              fontStyle: 'italic',
              fontSize: '15px'
            },
          }}
        >
          {defaultText}
        </MenuItem>
        {renderOptions()}
      </Select>

      {isLoading && <div style={preloaderSx}>Loading...</div>}

      {!!error && (
        <FormHelperText style={{ position: 'absolute' }} error>
          {error}
        </FormHelperText>
      )}
    </div>
  );
};

export default BasicSelect;
