import {
  AutoAwesomeOutlined,
  BoltOutlined,
  InsightsOutlined,
  PeopleAltOutlined,
  ShieldOutlined,
  ViewKanbanOutlined,
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomButton } from '../common/CustomButton';
import { CustomIconButton as IconButton } from '../common/CustomIconButton';
import { startStripeCheckout } from '../lib/stripeCheckout';

const ink = '#0b1220';
const accent = '#1f6feb';
const accentWarm = '#ff8a3d';
const surface = '#f7f9fc';

const features = [
  {
    title: 'Pipeline momentum',
    description: 'Move deals through stages with clarity and speed.',
    icon: <ViewKanbanOutlined />,
  },
  {
    title: 'Customer intelligence',
    description: 'Every contact, note, and activity in one place.',
    icon: <PeopleAltOutlined />,
  },
  {
    title: 'Instant insights',
    description: 'Dashboards that highlight what needs attention.',
    icon: <InsightsOutlined />,
  },
  {
    title: 'Workflow automation',
    description: 'Automate follow-ups and keep the team aligned.',
    icon: <BoltOutlined />,
  },
  {
    title: 'Security-first',
    description: 'Built-in permissions and audit-ready activity logs.',
    icon: <ShieldOutlined />,
  },
  {
    title: 'Delightful UX',
    description: 'Beautiful, fast UI for teams that live in their CRM.',
    icon: <AutoAwesomeOutlined />,
  },
];

const testimonials = [
  {
    quote:
      'We replaced three tools with Cliento. The pipeline view alone doubled our follow-up speed.',
    name: 'Amira Grant',
    title: 'RevOps Lead, Northwind',
  },
  {
    quote: 'The dashboard is clean and actionable. My team knows what to do every morning.',
    name: 'Ravi Patel',
    title: 'Sales Manager, Helix',
  },
  {
    quote: 'Our close rate improved in two quarters because we finally tracked every stage.',
    name: 'Lena Torres',
    title: 'Sales Director, Arcadia',
  },
  {
    quote: 'Clean UI, fast workflows, and the best customer context we have ever used.',
    name: 'Noah Kim',
    title: 'Head of Sales, Stride',
  },
  {
    quote: 'Cliento keeps my team aligned without training overhead. It just makes sense.',
    name: 'Priya Desai',
    title: 'GTM Ops, Linea',
  },
  {
    quote: 'The pipeline snapshot alone saves us hours every week.',
    name: 'Marcus Lee',
    title: 'Revenue Lead, Nova',
  },
];

const faqs = [
  {
    q: 'How fast can we get started?',
    a: 'Most teams are fully set up in under a day with pipelines, contacts, and tasks ready to go.',
  },
  {
    q: 'Can we customize our pipeline stages?',
    a: 'Yes. Create, rename, and color-code stages to match your exact sales process.',
  },
  {
    q: 'Does Cliento work well on mobile?',
    a: 'Absolutely. The UI is responsive so you can update deals and tasks from anywhere.',
  },
  {
    q: 'Is my data secure?',
    a: 'Cliento is built with role-based access and activity logging to keep your data protected.',
  },
];

const pricing = [
  { name: 'Starter', price: '$12', detail: 'per user / month', cta: 'Get started' },
  { name: 'Growth', price: '$29', detail: 'per user / month', cta: 'Upgrade now' },
  { name: 'Scale', price: '$59', detail: 'per user / month', cta: 'Talk to sales' },
];

const LandingPage = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const isStripeMock = import.meta.env.VITE_STRIPE_MOCK === 'true';
  const visibleTestimonials = useMemo(() => {
    const itemsPerView = 3;
    return Array.from({ length: itemsPerView }, (_, i) =>
      testimonials[(testimonialIndex + i) % testimonials.length],
    );
  }, [testimonialIndex]);

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePricingCheckout = async (planName: string) => {
    setCheckoutError(null);
    setCheckoutPlanId(planName);
    try {
      await startStripeCheckout({
        planId: planName.toLowerCase(),
        quantity: 1,
        successPath: '/payment/success',
        cancelPath: '/?status=cancel',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to start checkout';
      setCheckoutError(message);
    } finally {
      setCheckoutPlanId(null);
    }
  };

  return (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: surface,
      color: ink,
      fontFamily: '"Space Grotesk", "Sora", "Segoe UI", sans-serif',
      '@keyframes floaty': {
        '0%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-8px)' },
        '100%': { transform: 'translateY(0px)' },
      },
      '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(16px)' },
        '100%': { opacity: 1, transform: 'translateY(0px)' },
      },
    }}
  >
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(50% 50% at 15% 10%, rgba(31,111,235,0.18), transparent 55%), radial-gradient(40% 40% at 80% 20%, rgba(255,138,61,0.18), transparent 55%), #f7f9fc',
        borderBottom: '1px solid #e6ecf5',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'linear-gradient(140deg, rgba(31,111,235,0.22), transparent)',
          filter: 'blur(4px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -140,
          right: -140,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'linear-gradient(140deg, rgba(255,138,61,0.25), transparent)',
          filter: 'blur(4px)',
        }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack
          direction="row"
          spacing={0}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              component="img"
              src="/Cliento-logo.png"
              alt="Cliento"
              sx={{ height: 40, width: 'auto' }}
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              component="a"
              href="#features"
              sx={{
                textDecoration: 'none',
                color: ink,
                fontWeight: 600,
                display: { xs: 'none', md: 'inline-flex' },
              }}
            >
              Features
            </Box>
            <Box
              component="a"
              href="#proof"
              sx={{
                textDecoration: 'none',
                color: ink,
                fontWeight: 600,
                display: { xs: 'none', md: 'inline-flex' },
              }}
            >
              Proof
            </Box>
            <Box
              component="a"
              href="#pricing"
              sx={{
                textDecoration: 'none',
                color: ink,
                fontWeight: 600,
                display: { xs: 'none', md: 'inline-flex' },
              }}
            >
              Pricing
            </Box>
            <CustomButton
              variant="outlined"
              customColor={accent}
              component={Link}
              to="/signin"
              sx={{ height: 36, borderRadius: 999, px: 2.5, textTransform: 'none' }}
            >
              Sign in
            </CustomButton>
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={{ xs: 4, md: 6 }}
          sx={{ py: { xs: 5, md: 8 } }}
          alignItems="center"
        >
          <Box
            sx={{
              flex: 1,
              animation: 'fadeIn 0.9s ease',
              textAlign: { xs: 'center', lg: 'left' },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 40, md: 54 },
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
            >
              The modern CRM
              <Box component="span" sx={{ color: accent, display: 'block' }}>
                built for momentum
              </Box>
            </Typography>
            <Typography
              sx={{
                mt: 2,
                fontSize: 18,
                color: '#52607a',
                maxWidth: 520,
                mx: { xs: 'auto', lg: 0 },
              }}
            >
              Cliento combines pipeline clarity, customer context, and task focus so
              every follow-up is intentional and fast.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 3, justifyContent: { xs: 'center', lg: 'flex-start' } }}
            >
              <CustomButton
                variant="contained"
                customColor={accent}
                component={Link}
                to="/signup"
                sx={{ borderRadius: 999, px: 3, textTransform: 'none', height: 44 }}
              >
                Get started
              </CustomButton>
              <CustomButton
                variant="outlined"
                customColor={accent}
                component={Link}
                to="/dashboard"
                sx={{ borderRadius: 999, px: 3, textTransform: 'none', height: 44 }}
              >
                View live demo
              </CustomButton>
            </Stack>
            <Stack
              direction="row"
              spacing={3}
              sx={{
                mt: 4,
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', lg: 'flex-start' },
              }}
            >
              {[
                { label: 'Teams onboarded', value: '1,240+' },
                { label: 'Deal velocity', value: '+34%' },
                { label: 'Active pipelines', value: '8.6k' },
              ].map((item) => (
                <Box key={item.label}>
                  <Typography sx={{ fontWeight: 800, fontSize: 18 }}>{item.value}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: 1, width: '100%', maxWidth: 560 }}>
            <Box
              sx={{
                borderRadius: 4,
                border: '1px solid #dbe3f0',
                p: 2.5,
                backgroundColor: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 30px 70px rgba(12, 23, 50, 0.16)',
                animation: 'floaty 5s ease-in-out infinite',
              }}
            >
              <Stack spacing={2}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: 'white',
                    border: '1px solid #e6ecf5',
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>Today’s priorities</Typography>
                  <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                    {[
                      { label: 'Send proposal', meta: 'Monolith · Stage 3' },
                      { label: 'Follow up renewal', meta: 'Nexus · 2:00 PM' },
                      { label: 'Prep demo', meta: 'Arcadia · Tomorrow' },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: '1px solid #eef2f7',
                          backgroundColor: '#f9fafc',
                        }}
                      >
                        <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {item.meta}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(120deg, #0f172a, #1f2937)',
                    color: 'white',
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Pipeline won
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 24 }}>$128k</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Close rate
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 24 }}>42%</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>

    <Container maxWidth="lg" id="proof" sx={{ py: { xs: 5, md: 7 } }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
      >
        <Typography sx={{ fontWeight: 700, color: '#64748b' }}>
          Trusted by modern revenue teams
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          justifyContent="center"
          sx={{ rowGap: 2 }}
        >
          {['Nova', 'Atlas', 'Stride', 'Helix', 'Arcadia', 'Linea'].map((brand) => (
            <Box
              key={brand}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 999,
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                fontWeight: 700,
                color: '#475569',
              }}
            >
              {brand}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Container>

    <Box id="features" sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        <Typography sx={{ fontWeight: 800, fontSize: 28, mb: 1 }}>
          Everything your CRM should do.
        </Typography>
        <Typography sx={{ color: '#64748b', mb: 4 }}>
          Built to help teams stay aligned from first contact to closed deal.
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {features.map((item) => (
            <Box
              key={item.title}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 18px 35px rgba(15, 23, 42, 0.08)',
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  color: accent,
                  mb: 1.5,
                }}
              >
                {item.icon}
              </Box>
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{item.title}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {item.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>

    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 26, mb: 1 }}>
            A workspace that feels built for your team.
          </Typography>
          <Typography sx={{ color: '#64748b', mb: 3 }}>
            Create stages, set priorities, and align the day without switching tools.
          </Typography>
          <Stack spacing={2}>
            {[
              'Drag deals through stages with instant context.',
              'Keep contacts, tasks, and notes together.',
              'Stay on top of revenue with clean summaries.',
            ].map((text) => (
              <Stack key={text} direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: accentWarm,
                  }}
                />
                <Typography sx={{ fontWeight: 600 }}>{text}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 2.5,
            borderRadius: 4,
            border: '1px solid #dbeafe',
            backgroundColor: '#eff6ff',
            boxShadow: '0 20px 50px rgba(37, 99, 235, 0.2)',
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Pipeline snapshot</Typography>
          <Stack spacing={1.5}>
            {[
              { stage: 'Lead', value: 14, color: '#60a5fa' },
              { stage: 'Qualified', value: 9, color: '#34d399' },
              { stage: 'Proposal', value: 6, color: '#fbbf24' },
              { stage: 'Won', value: 4, color: '#22c55e' },
            ].map((item) => (
              <Box
                key={item.stage}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.25,
                  borderRadius: 2,
                  backgroundColor: 'white',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: item.color,
                    }}
                  />
                  <Typography sx={{ fontWeight: 600 }}>{item.stage}</Typography>
                </Stack>
                <Typography sx={{ fontWeight: 700 }}>{item.value}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Container>

    <Box
      id="pricing"
      sx={{
        py: { xs: 6, md: 8 },
        background:
          'radial-gradient(40% 60% at 10% 10%, rgba(31,111,235,0.08), transparent 55%), #ffffff',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ md: 'flex-end' }}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 28, mb: 1 }}>
              Pricing that scales with you.
            </Typography>
            <Typography sx={{ color: '#64748b' }}>
              Start simple and upgrade only when you need more power.
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2.5,
              py: 1,
              borderRadius: 999,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              fontWeight: 700,
              color: '#475569',
            }}
          >
            Monthly billing
          </Box>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {pricing.map((plan, index) => {
            const isFeatured = plan.name === 'Growth';
            const isLoading = checkoutPlanId === plan.name;
            return (
              <Box
                key={plan.name}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: isFeatured ? '1px solid #1f6feb' : '1px solid #e2e8f0',
                  backgroundColor: isFeatured ? '#0f172a' : '#ffffff',
                  color: isFeatured ? 'white' : ink,
                  boxShadow: isFeatured
                    ? '0 24px 60px rgba(15, 23, 42, 0.28)'
                    : '0 16px 40px rgba(15, 23, 42, 0.08)',
                  position: 'relative',
                  transform: { md: isFeatured ? 'translateY(-10px)' : 'none' },
                }}
              >
                {isFeatured ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 999,
                      backgroundColor: accentWarm,
                      color: '#111827',
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    Most popular
                  </Box>
                ) : null}
                <Typography sx={{ fontWeight: 700 }}>{plan.name}</Typography>
                <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 36 }}>
                    {plan.price}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: isFeatured ? 'rgba(255,255,255,0.7)' : '#64748b' }}
                  >
                    {plan.detail}
                  </Typography>
                </Stack>
                <Stack spacing={1.25} sx={{ mt: 2 }}>
                  {[
                    index === 0 ? 'Contacts + tasks' : 'Pipeline automation',
                    index === 2 ? 'Revenue forecasting' : 'Custom stages',
                    index === 1 ? 'Team dashboards' : 'Email activity',
                  ].map((point) => (
                    <Stack key={point} direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: isFeatured ? accentWarm : accent,
                        }}
                      />
                      <Typography sx={{ fontWeight: 600 }}>{point}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <CustomButton
                  variant={isFeatured ? 'contained' : 'outlined'}
                  customColor={isFeatured ? '#ffffff' : accent}
                  customTextColor={isFeatured ? '#0f172a' : undefined}
                  onClick={() => handlePricingCheckout(plan.name)}
                  disabled={isLoading}
                  sx={{
                    borderRadius: 999,
                    mt: 3,
                    textTransform: 'none',
                  }}
                >
                  {isLoading ? 'Opening Stripe...' : 'Pay with Stripe (test)'}
                </CustomButton>
              </Box>
            );
          })}
        </Box>
        {checkoutError ? (
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ color: '#b91c1c', fontWeight: 600 }}>
              {checkoutError}
            </Typography>
          </Box>
        ) : null}
        {isStripeMock ? (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: '#64748b', fontWeight: 600 }}>
              Stripe mock mode enabled (frontend only).
            </Typography>
          </Box>
        ) : null}
      </Container>
    </Box>

    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background:
          'radial-gradient(50% 50% at 90% 10%, rgba(31,111,235,0.12), transparent 60%), #f8fafc',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ md: 'flex-end' }}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 26 }}>
              Teams love the clarity.
            </Typography>
            <Typography sx={{ color: '#64748b' }}>
              Real results from teams who live in their pipeline.
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
          >
            {['4.9/5 G2', '98% retention'].map((chip) => (
              <Box
                key={chip}
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: 999,
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  fontWeight: 700,
                  color: '#334155',
                }}
              >
                {chip}
              </Box>
            ))}
          </Stack>
        </Stack>

        <Box sx={{ position: 'relative' }}>
          <IconButton
            size="small"
            customColor={accent}
            sx={{
              position: 'absolute',
              left: { xs: 0, md: -20 },
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: 999,
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              zIndex: 2,
              display: { xs: 'none', md: 'inline-flex' },
            }}
            onClick={handlePrevTestimonial}
            aria-label="Previous testimonials"
          >
            <ArrowBackIosNewOutlined sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            customColor={accent}
            sx={{
              position: 'absolute',
              right: { xs: 0, md: -20 },
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: 999,
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              zIndex: 2,
              display: { xs: 'none', md: 'inline-flex' },
            }}
            onClick={handleNextTestimonial}
            aria-label="Next testimonials"
          >
            <ArrowForwardIosOutlined sx={{ fontSize: 16 }} />
          </IconButton>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2.5,
              alignItems: 'stretch',
            }}
          >
            {visibleTestimonials.map((item, index) => (
              <Box
                key={`${item.name}-${index}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  boxShadow: '0 18px 35px rgba(15, 23, 42, 0.08)',
                  transform: { md: index === 1 ? 'translateY(-12px)' : 'none' },
                }}
              >
                <Typography sx={{ fontWeight: 600, mb: 2 }}>{item.quote}</Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 'auto' }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0f172a, #1f6feb)',
                      color: 'white',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {item.title}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>

    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ md: 'flex-end' }}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 26 }}>FAQ</Typography>
            <Typography sx={{ color: '#64748b' }}>
              Quick answers to common questions from CRM teams.
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2.5,
              py: 1,
              borderRadius: 999,
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              fontWeight: 700,
              color: '#475569',
            }}
          >
            Support 24/7
          </Box>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 2,
          }}
        >
          {faqs.map((item, index) => (
            <Box
              key={item.q}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: openFaqIndex === index ? 'white' : '#f8fafc',
                boxShadow: '0 14px 30px rgba(15, 23, 42, 0.06)',
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() =>
                  setOpenFaqIndex((prev) => (prev === index ? null : index))
                }
                sx={{
                  width: '100%',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  textAlign: 'left',
                  color: ink,
                  p: 0,
                  outline: 'none',
                  '&:focus, &:focus-visible, &:active': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                <span>{item.q}</span>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: accent,
                  }}
                >
                  {openFaqIndex === index ? '–' : '+'}
                </Box>
              </Box>
              {openFaqIndex === index ? (
                <Typography sx={{ color: '#64748b', mt: 1.5 }}>{item.a}</Typography>
              ) : null}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>

    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background:
          'radial-gradient(40% 60% at 10% 10%, rgba(31,111,235,0.08), transparent 55%), #f8fafc',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
        >
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 26, mb: 1 }}>
              Talk to our team
            </Typography>
            <Typography sx={{ color: '#64748b', mb: 3 }}>
              Get a tailored walkthrough, pricing guidance, or help migrating your data.
            </Typography>
            <Stack spacing={1.5}>
              {[
                'Live demo for your team',
                'Migration help from a CRM specialist',
                'Security & compliance overview',
              ].map((item) => (
                <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: accentWarm,
                    }}
                  />
                  <Typography sx={{ fontWeight: 600 }}>{item}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              boxShadow: '0 18px 35px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Stack spacing={2}>
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 0.75 }}>Work email</Typography>
                <Box
                  component="input"
                  placeholder="you@company.com"
                  sx={{
                    width: '100%',
                    height: 42,
                    px: 1.5,
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 0.75 }}>What do you need?</Typography>
                <Box
                  component="textarea"
                  placeholder="Tell us about your team, goals, and timeline."
                  rows={4}
                  sx={{
                    width: '100%',
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </Box>
              <CustomButton
                variant="contained"
                customColor={accent}
                component={Link}
                to="/signup"
                sx={{ borderRadius: 999, textTransform: 'none' }}
              >
                Contact sales
              </CustomButton>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Or email us at support@cliento.io
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>

    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background: `linear-gradient(120deg, ${accent} 0%, #0f3d91 100%)`,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography sx={{ fontWeight: 800, fontSize: 28 }}>
              Ready to organize every deal?
            </Typography>
            <Typography sx={{ opacity: 0.9, mt: 1 }}>
              Start quickly and give your pipeline a workspace it deserves.
            </Typography>
          </Box>
          <CustomButton
            variant="contained"
            customColor="#ffffff"
            customTextColor={accent}
            component={Link}
            to="/signup"
            sx={{
              borderRadius: 999,
              px: 3,
              textTransform: 'none',
              alignSelf: { xs: 'center', md: 'auto' },
            }}
          >
            Create your workspace
          </CustomButton>
        </Stack>
      </Container>
    </Box>

    <Box sx={{ py: 4, backgroundColor: '#0f172a', color: 'white' }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
          textAlign={{ xs: 'center', md: 'left' }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={{ xs: 'center', md: 'flex-start' }}
            sx={{ width: { xs: '100%', md: 'auto' } }}
          >
            <Box
              component="img"
              src="/Cliento-small.png"
              alt="Cliento logo"
              sx={{ height: 28, width: 'auto' }}
            />
            <Typography sx={{ fontWeight: 700 }}>Cliento</Typography>
          </Stack>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            © 2026 Cliento. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  </Box>
  );
};

export default LandingPage;
