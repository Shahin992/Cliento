import { useState } from 'react';
import { Box, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';

import PageHeader from '../components/PageHeader';
import BasicInput from '../common/BasicInput';
import BasicRadioOptions from '../common/BasicRadioOptions';
import BasicSelect from '../common/BasicSelect';
import { CustomButton } from '../common/CustomButton';
import CustomModal from '../common/CustomModal';
import CustomScrollbar from '../common/CustomScrollbar';
import GlobalEmptyPage from '../common/GlobalEmptyPage';

const basicOptions = [
  { id: 'new', title: 'New' },
  { id: 'active', title: 'Active' },
  { id: 'archived', title: 'Archived' },
];

const radioOptions = [
  { value: 'monthly', title: 'Monthly' },
  { value: 'yearly', title: 'Yearly' },
];

const DashboardPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [radioValue, setRadioValue] = useState('monthly');

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle="Quick overview of your CRM pipeline" />

      <Grid container spacing={2}>
        {[
          { label: 'Active Deals', value: '128' },
          { label: 'Open Deals', value: '24' },
          { label: 'Monthly Revenue', value: '$82k' },
        ].map((card) => (
          <Grid item xs={12} md={4} key={card.label}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e4ef' }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h5">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Common Components Preview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e4ef' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Buttons
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <CustomButton variant="contained" customColor="#6d28ff">
                  Contained
                </CustomButton>
                <CustomButton variant="outlined" customColor="#6d28ff">
                  Outlined
                </CustomButton>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e4ef' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Basic Input
              </Typography>
              <BasicInput fullWidth placeholder="Type here..."  minWidth="240px"  />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e4ef' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Basic Select
              </Typography>
              <BasicSelect
                options={basicOptions}
                mapping={{ label: 'title', value: 'id' }}
                value={selectValue}
                onChange={(event) => setSelectValue(event.target.value as string)}
                defaultText="Select status"
                minWidth="240px" 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e4ef' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Radio Options
              </Typography>
              <BasicRadioOptions
                options={radioOptions}
                mapping={{ label: 'title', value: 'value' }}
                value={radioValue}
                onChange={(event) => setRadioValue(event.target.value)}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e4ef' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Custom Scrollbar
              </Typography>
              <CustomScrollbar sx={{ maxHeight: 160, p: 2 }}>
                <Stack spacing={1}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        height: 36,
                        borderRadius: 2,
                        bgcolor: '#f1f5f9',
                        px: 2,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Scroll item {index + 1}
                    </Box>
                  ))}
                </Stack>
              </CustomScrollbar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e4ef' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Empty State
              </Typography>
              <Box sx={{ height: 220 }}>
                <GlobalEmptyPage message="No items yet." />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <CustomButton variant="contained" customColor="#6d28ff" onClick={() => setModalOpen(true)}>
          Open Modal
        </CustomButton>
      </Box>

      <CustomModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleSubmit={() => setModalOpen(false)}
        title="Demo Modal"
        description="This is a reusable modal example."
        submitButtonText="Confirm"
      >
        <Typography variant="body2">Modal content goes here.</Typography>
      </CustomModal>
    </Box>
  );
};

export default DashboardPage;
