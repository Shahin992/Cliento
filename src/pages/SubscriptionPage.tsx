import { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';

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

const plans = [
  {
    id: 'individual',
    name: 'Individual',
    description: 'Single user account',
    monthly: 59,
    oldPrice: 79,
    features: ['CRM', 'Sales & Service Pipelines'],
  },
  {
    id: 'small-team',
    name: 'Small Team',
    description: '1-3 users',
    monthly: 99,
    oldPrice: 129,
    features: ['CRM', 'Sales & Service Pipelines'],
    highlight: true,
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Up to 10 team members',
    monthly: 149,
    oldPrice: 199,
    features: ['CRM', 'Sales & Service Pipelines'],
  },
];

const SubscriptionPage = () => {
  const [selectedPlanId, setSelectedPlanId] = useState('small-team');

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[1],
    [selectedPlanId],
  );

  const currentPrice = selectedPlan.monthly;

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
        title="Subscription"
        subtitle="Choose a plan that fits your team"
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <CustomButton
              variant="outlined"
              customColor="#94a3b8"
              sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
            >
              Manage Billing
            </CustomButton>
            <CustomButton
              component={Link}
              to="/settings/subscription/create"
              variant="contained"
              sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
            >
              Create Plan
            </CustomButton>
          </Stack>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const price = plan.monthly;
          return (
            <Box
              key={plan.id}
              sx={{
                ...cardSx,
                borderColor: isSelected ? primary : borderColor,
                boxShadow: isSelected ? '0 18px 30px rgba(109, 40, 255, 0.18)' : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {plan.highlight ? (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: '#ede9fe',
                    color: primary,
                    fontSize: 11,
                    fontWeight: 700,
                    px: 1.2,
                    py: 0.4,
                    borderRadius: 999,
                  }}
                >
                  Popular
                </Box>
              ) : null}
              <Stack spacing={1.5}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: 18 }}>
                    {plan.name}
                  </Typography>
                  <Typography sx={{ color: mutedText, mt: 0.5 }}>{plan.description}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    {plan.oldPrice ? (
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: mutedText,
                          textDecoration: 'line-through',
                        }}
                      >
                        ${plan.oldPrice}
                      </Typography>
                    ) : null}
                    <Typography sx={{ fontWeight: 800, fontSize: 32, color: primary }}>
                      ${price}
                      <Typography component="span" sx={{ fontSize: 13, color: mutedText, ml: 0.5 }}>
                        /month
                      </Typography>
                    </Typography>
                  </Stack>
                </Box>
                <Stack spacing={0.75}>
                  {plan.features.map((feature) => (
                    <Typography key={feature} sx={{ color: '#0f172a', fontSize: 13 }}>
                      • {feature}
                    </Typography>
                  ))}
                </Stack>
                <CustomButton
                  variant={isSelected ? 'contained' : 'outlined'}
                  customColor={isSelected ? primary : '#94a3b8'}
                  sx={{ borderRadius: 999, textTransform: 'none', mt: 1 }}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </CustomButton>
              </Stack>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          ...cardSx,
          backgroundColor: bgSoft,
          borderColor,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>
            Selected Plan: {selectedPlan.name}
          </Typography>
          <Typography sx={{ color: mutedText, mt: 0.5 }}>
            ${currentPrice} per month
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <CustomButton
            variant="outlined"
            customColor="#94a3b8"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
          >
            Compare Plans
          </CustomButton>
          <CustomButton
            variant="contained"
            sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
          >
            Continue with {selectedPlan.name}
          </CustomButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default SubscriptionPage;
