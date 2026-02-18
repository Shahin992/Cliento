import { useMemo, useState } from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Box, Chip, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import { useToast } from '../common/ToastProvider';
import BasicInput from '../common/BasicInput';
import BasicRadioOptions from '../common/BasicRadioOptions';
import {
  type BillingCycle,
  type CreatePackagePayload,
  type PackageResponse,
  useCreatePackageMutation,
} from '../hooks/packages/usePackagesMutations';

const borderColor = '#e7edf6';
const mutedText = '#8b95a7';
const primary = '#0f766e';
const bgSoft = '#f4fbfa';

type FeatureItem = {
  id: string;
  value: string;
};

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

const toSafeNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const CreatePlanPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [hasTrial, setHasTrial] = useState(true);
  const [trialPeriodDays, setTrialPeriodDays] = useState('14');
  const [priceAmount, setPriceAmount] = useState('0');
  const [priceCurrency, setPriceCurrency] = useState('usd');
  const [usersLimit, setUsersLimit] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(true);
  const [features, setFeatures] = useState<FeatureItem[]>([{ id: 'feat-1', value: '' }]);
  const [createdPackage, setCreatedPackage] = useState<PackageResponse | null>(null);
  const { showToast } = useToast();
  const { createPackage, loading: isCreatingPackage, errorMessage: createPackageError } =
    useCreatePackageMutation();

  const cleanedFeatures = useMemo(
    () => features.map((item) => item.value.trim()).filter(Boolean),
    [features],
  );

  const generatedCode = useMemo(() => {
    const normalizedName = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    return `${billingCycle}_${normalizedName || 'package'}`;
  }, [billingCycle, name]);

  const payload = useMemo<CreatePackagePayload>(
    () => ({
      code: generatedCode,
      name: name.trim(),
      description: description.trim(),
      billingCycle,
      hasTrial,
      trialPeriodDays: hasTrial ? Math.max(0, toSafeNumber(trialPeriodDays)) : 0,
      price: {
        amount: Math.max(0, toSafeNumber(priceAmount)),
        currency: priceCurrency.trim().toLowerCase(),
      },
      limits: {
        users: Math.max(0, toSafeNumber(usersLimit)),
      },
      features: cleanedFeatures,
      isActive,
      isDefault,
    }),
    [
      billingCycle,
      cleanedFeatures,
      description,
      generatedCode,
      hasTrial,
      isActive,
      isDefault,
      name,
      priceAmount,
      priceCurrency,
      trialPeriodDays,
      usersLimit,
    ],
  );

  const canSave = useMemo(
    () =>
      Boolean(payload.name) &&
      payload.price.amount >= 0 &&
      payload.limits.users >= 0 &&
      (!payload.hasTrial || payload.trialPeriodDays > 0),
    [payload],
  );

  const previewPackage = useMemo(
    () =>
      createdPackage ?? {
        _id: 'pending',
        code: payload.code,
        name: payload.name,
        description: payload.description,
        billingCycle: payload.billingCycle,
        hasTrial: payload.hasTrial,
        trialPeriodDays: payload.trialPeriodDays,
        price: {
          amount: payload.price.amount,
          currency: payload.price.currency,
          stripePriceId: 'will_be_generated_by_backend',
        },
        limits: payload.limits,
        features: payload.features,
        isActive: payload.isActive,
        isDefault: payload.isDefault,
        buyLinkUrl: 'will_be_generated_by_backend',
      },
    [createdPackage, payload],
  );

  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, { id: `feat-${Date.now()}`, value: '' }]);
  };

  const handleRemoveFeature = (id: string) => {
    setFeatures((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePublishPackage = async () => {
    if (!canSave || isCreatingPackage) return;
    try {
      const response = await createPackage(payload);
      setCreatedPackage(response);
      showToast({ message: 'Package created successfully.', severity: 'success' });
      navigate('/settings/subscription');
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Failed to create package.',
        severity: 'error',
      });
    }
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
        title="Create Package"
        subtitle="Define your package payload and preview how it will appear"
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
            <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Package Details</Typography>
            <Typography sx={{ color: mutedText, mt: 0.5 }}>
              Fields below map directly to your create-package payload.
            </Typography>
          </Box>
          <Box>
            <Typography sx={labelSx}>Name</Typography>
            <BasicInput
              fullWidth
              placeholder="Pro Plan"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Typography sx={{ mt: 0.75, fontSize: 12, color: mutedText }}>
              Code is auto-generated: <b>{generatedCode}</b>
            </Typography>
          </Box>
          <Box>
            <Typography sx={labelSx}>Description</Typography>
            <BasicInput
              fullWidth
              multiline
              minRows={3}
              height="auto"
              placeholder="Short summary of this package."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              sx={{ alignItems: 'flex-start', py: 1 }}
            />
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
              name="package-billing-cycle"
              value={billingCycle}
              options={[
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
              mapping={{ label: 'label', value: 'value' }}
              onChange={(event) =>
                setBillingCycle(event.target.value as BillingCycle)
              }
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
              <Typography sx={labelSx}>Price Amount</Typography>
              <BasicInput
                fullWidth
                type="number"
                placeholder="0"
                value={priceAmount}
                onChange={(event) => setPriceAmount(event.target.value)}
              />
            </Box>
            <Box>
              <Typography sx={labelSx}>Currency</Typography>
              <BasicInput
                fullWidth
                placeholder="usd"
                value={priceCurrency}
                onChange={(event) => setPriceCurrency(event.target.value)}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / span 2' } }}>
              <Typography sx={labelSx}>Users Limit</Typography>
              <BasicInput
                fullWidth
                type="number"
                placeholder="0"
                value={usersLimit}
                onChange={(event) => setUsersLimit(event.target.value)}
              />
            </Box>
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
                Free Trial
              </Typography>
              <Typography sx={{ fontSize: 12, color: mutedText }}>
                Enable and set `trialPeriodDays`.
              </Typography>
            </Box>
            <FormControlLabel
              label={hasTrial ? 'Enabled' : 'Disabled'}
              control={
                <Switch
                  checked={hasTrial}
                  onChange={(event) => setHasTrial(event.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: primary },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: primary,
                    },
                  }}
                />
              }
            />
          </Box>
          <Box>
            <Typography sx={labelSx}>Trial Period Days</Typography>
            <BasicInput
              fullWidth
              type="number"
              placeholder="14"
              value={trialPeriodDays}
              onChange={(event) => setTrialPeriodDays(event.target.value)}
              disabled={!hasTrial}
            />
          </Box>
          <Box
            sx={{
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              backgroundColor: bgSoft,
              px: 1.5,
              py: 1.25,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1,
            }}
          >
            <Box>
              <FormControlLabel
                label={isActive ? 'Shown to customers' : 'Hidden from customers'}
                control={
                  <Switch
                    checked={isActive}
                    onChange={(event) => setIsActive(event.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: primary },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: primary,
                      },
                    }}
                  />
                }
              />
              <Typography sx={{ fontSize: 12, color: mutedText, mt: -0.5 }}>
                Turn this on to make the package available for selection.
              </Typography>
            </Box>
            <Box>
              <FormControlLabel
                label={isDefault ? 'Set as default package' : 'Not default'}
                control={
                  <Switch
                    checked={isDefault}
                    onChange={(event) => setIsDefault(event.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: primary },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: primary,
                      },
                    }}
                  />
                }
              />
              <Typography sx={{ fontSize: 12, color: mutedText, mt: -0.5 }}>
                The default package is prioritized and pre-selected by default.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ ...cardSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Package Features</Typography>
            <Typography sx={{ color: mutedText, mt: 0.5 }}>
              Add feature strings for the `features` array.
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
              borderRadius: 3,
              border: `1px solid ${borderColor}`,
              background:
                'linear-gradient(180deg, #ffffff 0%, #f8fbff 45%, #f4f8ff 100%)',
              color: '#0f172a',
              px: 2.25,
              py: 2.5,
            }}
          >
            <Typography sx={{ fontSize: 42, fontWeight: 700, lineHeight: 1 }}>
              {previewPackage.name || 'Package'}
            </Typography>
            <Typography sx={{ mt: 0.5, color: mutedText, fontSize: 22, lineHeight: 1.3 }}>
              {previewPackage.description || 'Add a description for this package.'}
            </Typography>
            <Typography sx={{ mt: 3, fontSize: 62, fontWeight: 700, lineHeight: 1 }}>
              ${previewPackage.price.amount}
              <Typography component="span" sx={{ ml: 0.8, fontSize: 28, color: mutedText }}>
                / {previewPackage.billingCycle}
              </Typography>
            </Typography>
            <CustomButton
              variant="outlined"
              customColor="#4f46e5"
              customTextColor="#4f46e5"
              sx={{
                width: '100%',
                borderRadius: 999,
                mt: 3,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: 18,
              }}
              disabled
            >
              Buy Now
            </CustomButton>
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
                <Chip
                  label={previewPackage.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  sx={{
                    bgcolor: previewPackage.isActive ? '#dcfce7' : '#fee2e2',
                    color: previewPackage.isActive ? '#166534' : '#991b1b',
                    fontWeight: 700,
                  }}
                />
                <Chip
                  label={previewPackage.isDefault ? 'Default' : 'Custom'}
                  size="small"
                  sx={{
                    bgcolor: '#eef2ff',
                    color: '#3730a3',
                    fontWeight: 700,
                  }}
                />
                <Chip
                  label={
                    previewPackage.hasTrial
                      ? `${previewPackage.trialPeriodDays} day trial`
                      : 'No trial'
                  }
                  size="small"
                  sx={{
                    bgcolor: '#ecfeff',
                    color: '#155e75',
                    fontWeight: 700,
                  }}
                />
              </Stack>
            <Typography sx={{ mt: 2, color: '#0f172a', fontWeight: 700, fontSize: 16 }}>
              Everything in Free and:
            </Typography>
            <Box sx={{ mt: 1.5, borderTop: `1px solid ${borderColor}` }} />
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {(previewPackage.features.length ? previewPackage.features : ['No features added yet']).map(
                (feature) => (
                  <Box key={feature} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: 17, color: '#4f46e5', mt: 0.1 }} />
                    <Typography sx={{ color: '#0f172a', fontSize: 15 }}>{feature}</Typography>
                  </Box>
                ),
              )}
            </Stack>
            <Typography sx={{ mt: 2.5, fontSize: 12, color: mutedText }}>
              Users included: {previewPackage.limits.users} • Currency:{' '}
              {previewPackage.price.currency.toUpperCase()}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
            <CustomButton
              component={Link}
              to="/settings/subscription"
              variant="outlined"
              customColor="#94a3b8"
              sx={{ borderRadius: 999, px: 2.5, textTransform: 'none', flex: 1 }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              customColor={primary}
              sx={{ borderRadius: 999, px: 2.5, textTransform: 'none', flex: 1 }}
              disabled={!canSave || isCreatingPackage}
              onClick={handlePublishPackage}
            >
              {isCreatingPackage ? 'Saving...' : 'Save'}
            </CustomButton>
          </Stack>
        </Box>
      </Box>
      {createPackageError ? (
        <Typography sx={{ color: '#dc2626', fontSize: 13, px: 0.5 }}>
          {createPackageError}
        </Typography>
      ) : null}
    </Box>
  );
};

export default CreatePlanPage;
