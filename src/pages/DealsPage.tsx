import { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import {
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { EditOutlined, FilterAltOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import AddDealModal from '../components/deals/modals/AddDealModal';
import { deals } from '../data/deals';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const primary = '#6d28ff';
const bgSoft = '#f8fbff';

const statusStyles: Record<string, { color: string; background: string }> = {
  'In Progress': { color: primary, background: '#efe9ff' },
  Closed: { color: '#7c3aed', background: '#f3e8ff' },
};

const DealsPage = () => {
  const [sortBy, setSortBy] = useState('date-created');
  const totalDeals = 136;
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);

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
        title="Deals"
        subtitle="Track active opportunities"
        action={
          <CustomButton
            variant="contained"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
            onClick={() => setIsAddDealOpen(true)}
          >
            Add Deal
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
            Total: {totalDeals} deals
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
              <MenuItem value="appointment">Sort by: Appointment Date</MenuItem>
              <MenuItem value="price">Sort by: Price</MenuItem>
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
              'minmax(240px, 2.4fr) minmax(90px, 0.7fr) minmax(170px, 1.2fr) minmax(110px, 0.8fr) minmax(120px, 0.7fr) 48px',
            px: 2.5,
            py: 1.5,
            color: mutedText,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <Box>Name</Box>
          <Box>Area</Box>
          <Box>Appointment Date</Box>
          <Box>Price</Box>
          <Box>Status</Box>
          <Box textAlign="center">Edit</Box>
        </Box>

        <Box>
          {deals.map((deal, index) => (
            <Box
              key={`${deal.id}-${index}`}
              sx={{
                display: { xs: 'flex', md: 'grid' },
                flexDirection: { xs: 'column', md: 'unset' },
                gridTemplateColumns:
                  'minmax(240px, 2.4fr) minmax(90px, 0.7fr) minmax(170px, 1.2fr) minmax(110px, 0.8fr) minmax(120px, 0.7fr) 48px',
                px: { xs: 1.5, sm: 2.5 },
                py: { xs: 1.5, sm: 1.75 },
                gap: { xs: 1.25, sm: 0 },
                alignItems: { md: 'center' },
                borderBottom:
                  index === deals.length - 1 ? 'none' : `1px solid ${borderColor}`,
              }}
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
                  {deal.avatar}
                </Avatar>
                <Box>
                  <Typography
                    component={Link}
                    to={`/deals/${deal.id}`}
                    sx={{
                      fontWeight: 600,
                      color: '#1f2937',
                      textDecoration: 'none',
                      marginRight:'8px',
                      '&:hover': { color: primary },
                    }}
                  >
                    {deal.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: mutedText }}>
                    {deal.location}
                  </Typography>
                </Box>
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
                  Area
                </Typography>
                <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {deal.area}
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
                  Appointment Date
                </Typography>
                <Typography sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {deal.appointment}
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
                  Price
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#1f2937' }}>
                  {deal.price}
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
                  Status
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.6,
                    py: 0.4,
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: statusStyles[deal.status].color,
                    backgroundColor: statusStyles[deal.status].background,
                  }}
                >
                  {deal.status}
                </Box>
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

      <AddDealModal
        open={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        onSave={() => setIsAddDealOpen(false)}
      />
    </Box>
  );
};

export default DealsPage;
