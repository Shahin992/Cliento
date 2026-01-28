import { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import BasicInput from '../common/BasicInput';
import BasicRadioOptions from '../common/BasicRadioOptions';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const primary = '#6d28ff';
const bgSoft = '#f8fbff';

const cardSx = {
  borderRadius: 3,
  border: `1px solid ${borderColor}`,
  backgroundColor: 'white',
  px: { xs: 1.5, sm: 2.5 },
  py: { xs: 2, sm: 2.5 },
};

const labelSx = {
  fontSize: 12,
  fontWeight: 700,
  color: '#0f172a',
  mb: 0.75,
};

const CreatePlanPage = () => {
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [userLabel, setUserLabel] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [highlight, setHighlight] = useState('No');
  const [features, setFeatures] = useState([{ id: 'feat-1', value: '' }]);

  const canSave = useMemo(
    () => planName.trim() && monthlyPrice.trim(),
    [planName, monthlyPrice],
  );

  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, { id: `feat-${Date.now()}`, value: '' }]);
  };

  const handleRemoveFeature = (id: string) => {
    setFeatures((prev) => prev.filter((item) => item.id !== id));
  };

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
        title="Create Plan"
        subtitle="Build a new subscription plan for your CRM"
        action={
          <CustomButton
            component={Link}
            to="/settings/subscription"
            variant="outlined"
            customColor="#94a3b8"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
          >
            Back to Subscription
          </CustomButton>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
          gap: 2,
        }}
      >
        <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Plan Details</Typography>
            <Typography sx={{ color: mutedText, mt: 0.5 }}>
              Define how the plan looks and what it includes.
            </Typography>
          </Box>
          <Box>
            <Typography sx={labelSx}>Plan Name</Typography>
            <BasicInput
              fullWidth
              placeholder="Example: Growth Plus"
              value={planName}
              onChange={(event) => setPlanName(event.target.value)}
            />
          </Box>
          <Box>
            <Typography sx={labelSx}>Description</Typography>
            <BasicInput
              fullWidth
              multiline
              minRows={3}
              height="auto"
              placeholder="Short summary of who this plan is for."
              value={planDescription}
              onChange={(event) => setPlanDescription(event.target.value)}
              sx={{ alignItems: 'flex-start', py: 1 }}
            />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={labelSx}>Monthly Price</Typography>
              <BasicInput
                fullWidth
                type="number"
                placeholder="$ 0"
                value={monthlyPrice}
                onChange={(event) => setMonthlyPrice(event.target.value)}
              />
            </Box>
            <Box>
              <Typography sx={labelSx}>Old Price (optional)</Typography>
              <BasicInput
                fullWidth
                type="number"
                placeholder="$ 0"
                value={oldPrice}
                onChange={(event) => setOldPrice(event.target.value)}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / span 2' } }}>
              <Typography sx={labelSx}>User Label</Typography>
              <BasicInput
                fullWidth
                placeholder="Example: 1-3 users"
                value={userLabel}
                onChange={(event) => setUserLabel(event.target.value)}
              />
            </Box>
          </Box>
          <Box
            sx={{
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              backgroundColor: bgSoft,
              px: 1.5,
              py: 1.25,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Billing Cycle</Typography>
            <BasicRadioOptions
              name="plan-billing-cycle"
              value={billingCycle}
              options={[
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
              mapping={{ label: 'label', value: 'value' }}
              onChange={(event) =>
                setBillingCycle(event.target.value as 'monthly' | 'yearly')
              }
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1,
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              backgroundColor: bgSoft,
              px: 1.5,
              py: 1.25,
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#0f172a' }}>
                Highlight this plan
              </Typography>
              <Typography sx={{ fontSize: 12, color: mutedText }}>
                Show a “Popular” badge on this plan.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              {['Yes', 'No'].map((option) => (
                <CustomButton
                  key={option}
                  variant={highlight === option ? 'contained' : 'outlined'}
                  customColor={highlight === option ? primary : '#94a3b8'}
                  sx={{ borderRadius: 999, px: 2, textTransform: 'none' }}
                  onClick={() => setHighlight(option)}
                >
                  {option}
                </CustomButton>
              ))}
            </Stack>
          </Box>
        </Box>

        <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Plan Features</Typography>
            <Typography sx={{ color: mutedText, mt: 0.5 }}>
              Add key benefits that will display on the subscription page.
            </Typography>
          </Box>
          <Stack spacing={1.25}>
            {features.map((feature) => (
              <Box
                key={feature.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <BasicInput
                  fullWidth
                  placeholder="Feature description"
                  value={feature.value}
                  onChange={(event) =>
                    setFeatures((prev) =>
                      prev.map((item) =>
                        item.id === feature.id ? { ...item, value: event.target.value } : item,
                      ),
                    )
                  }
                />
                <CustomButton
                  variant="outlined"
                  customColor="#ef4444"
                  sx={{ borderRadius: 999, px: 2, textTransform: 'none' }}
                  onClick={() => handleRemoveFeature(feature.id)}
                  disabled={features.length <= 1}
                >
                  Remove
                </CustomButton>
              </Box>
            ))}
          </Stack>
          <CustomButton
            variant="outlined"
            customColor="#94a3b8"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none', alignSelf: 'flex-start' }}
            onClick={handleAddFeature}
          >
            Add Feature
          </CustomButton>
          <Box
            sx={{
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              backgroundColor: bgSoft,
              px: 1.5,
              py: 1.25,
            }}
          >
            <Typography sx={{ fontSize: 12, color: mutedText }}>Preview</Typography>
            <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
              {planName || 'Plan name'}
            </Typography>
            <Typography sx={{ fontSize: 12, color: mutedText, mt: 0.5 }}>
              {userLabel || 'User count'} · ${monthlyPrice || '0'}/{billingCycle}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          ...cardSx,
          backgroundColor: bgSoft,
          borderColor,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Ready to publish?</Typography>
          <Typography sx={{ color: mutedText, mt: 0.5 }}>
            Save your plan and it will appear in the subscription list.
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <CustomButton
            variant="outlined"
            customColor="#94a3b8"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
          >
            Save Draft
          </CustomButton>
          <CustomButton
            variant="contained"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
            disabled={!canSave}
          >
            Publish Plan
          </CustomButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default CreatePlanPage;
