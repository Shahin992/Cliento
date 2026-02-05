import { useMemo, useState } from 'react';
import { Avatar, Box, Modal, Stack, Typography } from '@mui/material';
import { CustomIconButton as IconButton } from '../../../common/CustomIconButton';
import { CloseOutlined, ChevronRightOutlined } from '@mui/icons-material';

import { contacts } from '../../../data/contacts';
import { inputSx, mutedText, primary } from './dealModalStyles';

interface SelectCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (customerId: string) => void;
  onAddNew?: () => void;
}

const SelectCustomerModal = ({
  open,
  onClose,
  onSelect,
  onAddNew,
}: SelectCustomerModalProps) => {
  const [query, setQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return contacts;
    }

    return contacts.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalized) ||
        customer.email.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="select-customer-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92vw', sm: 360 },
          maxWidth: '92vw',
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.22)',
          p: 2.5,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="select-customer-title" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Select Customer
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              sx={{ fontSize: 12, fontWeight: 700, color: primary, cursor: 'pointer' }}
              onClick={onAddNew}
            >
              Add New
            </Typography>
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                width: 28,
                height: 28,
                borderRadius: 999,
                backgroundColor: '#f1f5f9',
                color: '#94a3b8',
                '&:hover': { backgroundColor: '#e2e8f0' },
              }}
            >
              <CloseOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box
            component="input"
            sx={inputSx}
            placeholder="Search customer"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Box>

        <Stack spacing={1.25} sx={{ mt: 2 }}>
          {filteredCustomers.slice(0, 6).map((customer) => (
            <Stack
              key={customer.id}
              direction="row"
              spacing={1.25}
              alignItems="center"
              sx={{
                p: 1,
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f8fbff' },
              }}
              onClick={() => onSelect?.(customer.id)}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#e8f0ff',
                  color: primary,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {customer.avatar}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {customer.name}
                </Typography>
                <Typography variant="caption" sx={{ color: mutedText }}>
                  {customer.email}
                </Typography>
              </Box>
              <ChevronRightOutlined sx={{ color: primary, fontSize: 18 }} />
            </Stack>
          ))}
          {filteredCustomers.length === 0 ? (
            <Typography variant="caption" sx={{ color: mutedText, textAlign: 'center' }}>
              No customers found.
            </Typography>
          ) : null}
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
          <Typography variant="caption" sx={{ color: primary, fontWeight: 800 }}>
            Load More
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default SelectCustomerModal;
