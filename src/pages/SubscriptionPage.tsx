import { useMemo, useState } from 'react';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { Box, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import { usePackagesQuery } from '../hooks/packages/usePackagesQueries';
import { useAppSelector } from '../app/hooks';

const borderColor = '#dbe4f0';
const mutedText = '#64748b';
const primary = '#1d4ed8';
const bgSoft = 'linear-gradient(180deg, #f8fbff 0%, #f3f7ff 50%, #edf3ff 100%)';
const contentMaxWidth = 1320;

const cardSx = {
  borderRadius: 3,
  border: `1px solid ${borderColor}`,
  backgroundColor: 'white',
  px: { xs: 2, sm: 2.25 },
  py: { xs: 2.25, sm: 2.5 },
};

const PackageCardSkeleton = () => (
  <Box
    sx={{
      ...cardSx,
      minHeight: 540,
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
    }}
  >
    <Stack spacing={1}>
      <Skeleton variant="text" width="44%" height={34} />
      <Skeleton variant="text" width="88%" height={24} />
      <Skeleton variant="text" width="75%" height={24} />
    </Stack>

    <Skeleton variant="text" width="64%" height={78} sx={{ mt: 0.5 }} />
    <Skeleton variant="rounded" height={44} sx={{ borderRadius: 999, mt: 0.5 }} />

    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
      <Skeleton variant="rounded" width={100} height={26} sx={{ borderRadius: 999 }} />
      <Skeleton variant="rounded" width={90} height={26} sx={{ borderRadius: 999 }} />
    </Stack>

    <Skeleton variant="text" width="62%" height={28} sx={{ mt: 0.75 }} />

    <Stack spacing={1}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={42} sx={{ borderRadius: 2 }} />
      ))}
    </Stack>
  </Box>
);

const SubscriptionPage = () => {
  const authUser = useAppSelector((state) => state.auth.user);
  const [billingFilter, setBillingFilter] = useState<'monthly' | 'yearly'>('monthly');
  const { packages, loading, errorMessage } = usePackagesQuery({
    planType: null,
    billingCycle: billingFilter,
  });
  const isSuperAdmin = authUser?.role?.toUpperCase() === 'SUPER_ADMIN';

  const sortedPackages = useMemo(
    () =>
      [...packages].sort((a, b) => {
        if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
        return (a.price?.amount ?? 0) - (b.price?.amount ?? 0);
      }),
    [packages],
  );

  const visiblePackages = sortedPackages;

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
        alignItems: 'center',
        gap: 2,
        background: bgSoft,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: contentMaxWidth }}>
        <PageHeader
          title="Subscription"
          subtitle="Choose a plan that fits your team"
          action={
            isSuperAdmin ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <CustomButton
                  component={Link}
                  to="/settings/subscription/create"
                  variant="contained"
                  customColor={primary}
                  sx={{ borderRadius: 999, px: 2.5, textTransform: 'none' }}
                >
                  Create Package
                </CustomButton>
              </Stack>
            ) : undefined
          }
        />
      </Box>

      <Box sx={{ ...cardSx, py: 1.25, px: 1.25, maxWidth: 260, alignSelf: 'center' }}>
        <Stack direction="row" spacing={1} sx={{ borderRadius: 999, p: 0.5, bgcolor: '#f1f5f9' }}>
          <Box
            component="button"
            type="button"
            onClick={() => setBillingFilter('monthly')}
            sx={{
              flex: 1,
              textAlign: 'center',
              py: 0.5,
              borderRadius: 999,
              bgcolor: billingFilter === 'monthly' ? 'white' : 'transparent',
              fontWeight: 700,
              color: billingFilter === 'monthly' ? '#0f172a' : '#64748b',
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Monthly
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => setBillingFilter('yearly')}
            sx={{
              flex: 1,
              textAlign: 'center',
              py: 0.5,
              borderRadius: 999,
              bgcolor: billingFilter === 'yearly' ? 'white' : 'transparent',
              color: billingFilter === 'yearly' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Yearly
          </Box>
        </Stack>
      </Box>

      {!loading && errorMessage ? (
        <Box
          sx={{
            ...cardSx,
            width: '100%',
            maxWidth: contentMaxWidth,
            borderColor: '#fecaca',
            bgcolor: '#fff1f2',
          }}
        >
          <Typography sx={{ color: '#be123c', fontWeight: 600 }}>
            Failed to load billing packages.
          </Typography>
          <Typography sx={{ color: '#be123c', mt: 0.5 }}>{errorMessage}</Typography>
        </Box>
      ) : null}

      {!loading && !errorMessage && visiblePackages.length === 0 ? (
        <Box sx={{ ...cardSx, width: '100%', maxWidth: contentMaxWidth }}>
          <Typography sx={{ color: mutedText }}>
            No {billingFilter === 'monthly' ? 'monthly' : 'yearly'} packages available yet.
          </Typography>
        </Box>
      ) : null}

      <Box
        sx={{
          width: '100%',
          maxWidth: contentMaxWidth,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <PackageCardSkeleton key={index} />)
          : null}
        {!loading && !errorMessage
          ? visiblePackages.map((pkg) => {
              const isInactive = pkg.isActive === false;
              const ctaText = pkg.hasTrial ? 'Start Trial' : `Get ${pkg.name}`;
              const headerLabel = pkg.isDefault ? 'Recommended' : undefined;

          return (
            <Box
              key={pkg._id}
              sx={{
                ...cardSx,
                borderColor: isInactive ? '#e2e8f0' : borderColor,
                position: 'relative',
                overflow: 'hidden',
                minHeight: 540,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {headerLabel ? (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: '#dbeafe',
                    color: '#1e3a8a',
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
              <Stack spacing={1.5} sx={{ height: '100%' }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: 18 }}>
                    {pkg.name}
                  </Typography>
                  <Typography sx={{ color: mutedText, mt: 0.5 }}>
                    {pkg.description}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 52, color: '#0f172a', lineHeight: 1 }}>
                    ${pkg.price.amount}
                    <Typography component="span" sx={{ fontSize: 24, color: mutedText, ml: 0.5 }}>
                      / {pkg.billingCycle}
                    </Typography>
                  </Typography>
                </Box>

                <CustomButton
                  variant="outlined"
                  customColor="#0f172a"
                  customTextColor="#0f172a"
                  sx={{ borderRadius: 999, textTransform: 'none', mt: 0.5, fontSize: 17 }}
                  disabled={isInactive || !pkg.buyLinkUrl}
                  onClick={() => {
                    if (pkg.buyLinkUrl) {
                      window.location.assign(pkg.buyLinkUrl);
                    }
                  }}
                >
                  {ctaText} ↗
                </CustomButton>

                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                  {pkg.hasTrial ? (
                    <Chip
                      label={`${pkg.trialPeriodDays} day trial`}
                      icon={<AutoAwesomeRoundedIcon sx={{ color: '#1d4ed8 !important' }} />}
                      size="small"
                      sx={{ bgcolor: '#eff6ff', color: '#1e3a8a', fontWeight: 700 }}
                    />
                  ) : null}
                  <Chip
                    label={`${pkg.limits.users} users`}
                    size="small"
                    sx={{ bgcolor: '#f8fafc', color: '#334155', fontWeight: 700 }}
                  />
                  {isInactive ? (
                    <Chip
                      label="Inactive"
                      size="small"
                      sx={{ bgcolor: '#fef2f2', color: '#991b1b', fontWeight: 700 }}
                    />
                  ) : null}
                </Stack>

                <Typography sx={{ color: '#0f172a', fontWeight: 700, mt: 0.75 }}>
                  {pkg.isDefault ? 'Most popular plan includes:' : 'Included features:'}
                </Typography>
                <Stack spacing={1} sx={{ pt: 0.25 }}>
                  {pkg.features.map((feature) => (
                    <Box
                      key={feature}
                      sx={{
                        display: 'flex',
                        gap: 1.1,
                        alignItems: 'center',
                        px: 1.2,
                        py: 0.9,
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        bgcolor: '#f8fafc',
                      }}
                    >
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: '#e2e8f0',
                          flexShrink: 0,
                        }}
                      >
                        <CheckRoundedIcon sx={{ color: '#0f172a', fontSize: 14 }} />
                      </Box>
                      <Typography sx={{ color: '#0f172a', fontSize: 15.5, lineHeight: 1.35 }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                <Box sx={{ flexGrow: 1 }} />
              </Stack>
            </Box>
          );
            })
          : null}
      </Box>
    </Box>
  );
};

export default SubscriptionPage;
