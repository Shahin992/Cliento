import { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { CustomIconButton as IconButton } from '../common/CustomIconButton';
import {
  Avatar,
  Box,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import {
  EditOutlined,
  FilterAltOutlined,
  LocalOfferOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import AddCustomerModal from '../components/contacts/modals/AddCustomerModal';
import { contacts } from '../data/contacts';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const primary = '#6d28ff';
const bgSoft = '#f8fbff';

const ContactsPage = () => {
  const [sortBy, setSortBy] = useState('date-created');
  const totalCustomers = 78;
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 1.5, sm: 2, md: 3 },
        pb: 4,
        minHeight: { xs: 'calc(100vh - 96px)', sm: 'calc(100vh - 110px)' },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <PageHeader
        title="Contacts"
        subtitle="Manage your contact list"
        action={
          <CustomButton
            variant="contained"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
            onClick={() => setIsAddCustomerOpen(true)}
          >
            Add Customer
          </CustomButton>
        }
      />

      <Box
        sx={{
          width: '100%',
          borderRadius: 3,
          border: `1px solid ${borderColor}`,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{
            px: { xs: 1.5, sm: 2.5 },
            py: 2,
            gap: 1.5,
            borderBottom: `1px solid ${borderColor}`,
            backgroundColor: bgSoft,
          }}
        >
          <Typography sx={{ fontWeight: 600, color: '#111827' }}>
            Total: {totalCustomers} customers
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Select
              size="small"
              value={sortBy}
              onChange={(event: SelectChangeEvent) =>
                setSortBy(event.target.value as string)
              }
              sx={{
                minWidth: { xs: '100%', sm: 170 },
                height: 36,
                bgcolor: 'white',
                borderRadius: 999,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  pl: 2,
                  py: 0.75,
                },
                '& fieldset': {
                  borderColor,
                },
              }}
            >
              <MenuItem value="date-created">Sort by: Date Created</MenuItem>
              <MenuItem value="name">Sort by: Name</MenuItem>
              <MenuItem value="recent">Sort by: Recently Added</MenuItem>
            </Select>
            <CustomButton
              variant="outlined"
              customColor="#64748b"
              startIcon={<FilterAltOutlined fontSize="small" />}
              sx={{
                height: 36,
                borderRadius: 999,
                px: 2,
                minWidth: 96,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Filter
            </CustomButton>
          </Stack>
        </Stack>

        <Box sx={{ overflowX: { xs: 'visible', md: 'hidden' } }}>
          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns:
                'minmax(230px, 2.2fr) minmax(190px, 1.8fr) minmax(140px, 1.2fr) minmax(250px, 2.4fr) 56px',
              px: 2.5,
              py: 1.5,
              color: mutedText,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderBottom: `1px solid ${borderColor}`,
              alignItems: 'center',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalOfferOutlined sx={{ fontSize: 16, color: mutedText }} />
              <Box>Name</Box>
            </Stack>
            <Box>Email</Box>
            <Box>Phone</Box>
            <Box>Address</Box>
            <Box textAlign="center">Edit</Box>
          </Box>

          <Box>
            {contacts.map((contact, index) => (
              <Box
                key={`${contact.id}-${index}`}
                sx={{
                  display: { xs: 'flex', md: 'grid' },
                  flexDirection: { xs: 'column', md: 'unset' },
                  gridTemplateColumns:
                    'minmax(230px, 2.2fr) minmax(190px, 1.8fr) minmax(140px, 1.2fr) minmax(250px, 2.4fr) 56px',
                  px: { xs: 1.5, sm: 2.5 },
                  py: { xs: 1.5, sm: 1.75 },
                  gap: { xs: 1.5, sm: 0 },
                  alignItems: { md: 'center' },
                  borderRadius: { xs: 2, md: 0 },
                  backgroundColor: { xs: '#f8fbff', md: 'transparent' },
                  borderBottom:
                    index === contacts.length - 1 ? 'none' : `1px solid ${borderColor}`,
                  boxShadow: {
                    xs: '0 10px 20px rgba(15, 23, 42, 0.08)',
                    md: 'none',
                  },
                  border: { xs: `1px solid ${borderColor}`, md: 'none' },
                  mb: { xs: 1.25, md: 0 },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#eef2ff',
                      color: primary,
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {contact.avatar}
                  </Avatar>
                  <Typography
                    component={Link}
                    to={`/contacts/${contact.id}`}
                    sx={{
                      fontWeight: 600,
                      color: '#1f2937',
                      textDecoration: 'none',
                      '&:hover': { color: primary },
                    }}
                  >
                    {contact.name}
                  </Typography>
                  </Stack>
                  <IconButton
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      border: `1px solid ${borderColor}`,
                      color: '#64748b',
                      backgroundColor: 'white',
                      display: { xs: 'flex', md: 'none' },
                    }}
                  >
                    <EditOutlined sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>

                <Box
                  sx={{
                    display: { xs: 'flex', md: 'block' },
                    justifyContent: { xs: 'space-between', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', md: 'none' } }}
                  >
                    Email
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {contact.email}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'flex', md: 'block' },
                    justifyContent: { xs: 'space-between', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', md: 'none' } }}
                  >
                    Phone
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {contact.phone}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'flex', md: 'block' },
                    justifyContent: { xs: 'space-between', md: 'flex-start' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: mutedText, display: { xs: 'block', md: 'none' } }}
                  >
                    Address
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {contact.address}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-end', md: 'center' },
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      border: `1px solid ${borderColor}`,
                      color: '#64748b',
                      backgroundColor: 'white',
                      display: { xs: 'none', md: 'inline-flex' },
                    }}
                  >
                    <EditOutlined sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
          <CustomButton
            variant="outlined"
            customColor="#94a3b8"
            sx={{ borderRadius: 999, px: 3, textTransform: 'none' }}
          >
            Load More
          </CustomButton>
        </Box>
      </Box>

      <AddCustomerModal
        open={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSave={() => setIsAddCustomerOpen(false)}
      />
    </Box>
  );
};

export default ContactsPage;
