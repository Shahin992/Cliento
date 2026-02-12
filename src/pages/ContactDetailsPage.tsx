import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import {
  AlternateEmailOutlined,
  ArrowBack,
  CameraAltOutlined,
  Circle,
  LocationOnOutlined,
  MoreHoriz,
  SellOutlined,
} from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { deals } from '../data/deals';
import { getContactById, type ContactDetails } from '../services/contacts';

const borderColor = '#e6eaf1';
const mutedText = '#7e8796';
const primary = '#6d28ff';

const tabs = ['Deals', 
  // 'Email', 'Notes'
];

const normalize = (value?: string | null) => (value || '').trim().toLowerCase();

const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
};

const formatAddress = (contact: ContactDetails) => {
  const parts = [
    contact.address?.street,
    contact.address?.city,
    contact.address?.state,
    contact.address?.postalCode,
    contact.address?.country,
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : '-';
};

const ContactDetailsSkeleton = () => (
  <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: 3, backgroundColor: 'white', overflow: 'hidden' }}>
    <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
      <Skeleton variant="text" width={90} height={24} />
      <Stack direction="row" spacing={1.5} alignItems="center" mt={1.2}>
        <Skeleton variant="circular" width={56} height={56} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={180} height={32} />
          <Skeleton variant="text" width="100%" height={22} />
        </Box>
      </Stack>
    </Box>
    <Divider />
    <Box sx={{ p: 2.5 }}>
      <Skeleton variant="rounded" height={460} sx={{ borderRadius: 2.5 }} />
    </Box>
  </Box>
);

const ContactDetailsPage = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();
  const [activeTab, setActiveTab] = useState('Deals');
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const loadContact = async () => {
      if (!contactId) {
        setContact(null);
        setErrorMessage('Missing contact id.');
        setIsLoading(false);
        return;
      }

      const requestId = ++requestIdRef.current;
      setIsLoading(true);
      setErrorMessage(null);

      const response = await getContactById(contactId);
      if (requestId !== requestIdRef.current) return;

      if (!response.success || !response.data) {
        setContact(null);
        setErrorMessage(response.message || 'Contact not found.');
        setIsLoading(false);
        return;
      }

      setContact(response.data);
      setIsLoading(false);
    };

    void loadContact();
  }, [contactId]);

  const fullName = useMemo(() => {
    if (!contact) return '';
    return [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'Unnamed Contact';
  }, [contact]);

  const initials = useMemo(() => {
    if (!contact) return 'C';
    const first = contact.firstName?.trim()?.[0] ?? '';
    const last = contact.lastName?.trim()?.[0] ?? '';
    return `${first}${last}`.toUpperCase() || 'C';
  }, [contact]);

  const associatedDeals = useMemo(() => {
    if (!contact) return [];

    const fullNameKey = normalize([contact.firstName, contact.lastName].filter(Boolean).join(' '));
    const emailKey = normalize(contact.emails?.[0]);
    const phoneKey = normalize(contact.phones?.[0]);

    return deals.filter((deal) => {
      const dealCustomer = normalize(deal.customer);
      const dealEmail = normalize(deal.email);
      const dealPhone = normalize(deal.phone);
      return (
        (emailKey && dealEmail === emailKey) ||
        (phoneKey && dealPhone === phoneKey) ||
        (fullNameKey && dealCustomer === fullNameKey)
      );
    });
  }, [contact]);

  const emailCount = contact?.emails?.length ?? 0;
  const phoneCount = contact?.phones?.length ?? 0;
  const primaryEmail = contact?.emails?.[0] || '-';

  const contactTags = useMemo(
    () => (contact?.tags ?? []).map((tag) => tag?.trim()).filter((tag): tag is string => Boolean(tag)),
    [contact]
  );

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 1.5, sm: 2, md: 3 },
        pb: 4,
        minHeight: { xs: 'calc(100vh - 96px)', sm: 'calc(100vh - 110px)' },
      }}
    >
      {isLoading ? <ContactDetailsSkeleton /> : null}

      {!isLoading && !contact ? (
        <Box
          sx={{
            borderRadius: 3,
            border: `1px solid ${borderColor}`,
            backgroundColor: 'white',
            px: { xs: 2, sm: 3 },
            py: { xs: 4, sm: 5 },
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>Contact unavailable</Typography>
          <Typography sx={{ color: mutedText }}>{errorMessage || 'No contact data found.'}</Typography>
          <Typography
            component={Link}
            to="/contacts"
            sx={{ mt: 2, display: 'inline-block', color: primary, textDecoration: 'none', fontWeight: 700 }}
          >
            Back to Contacts
          </Typography>
        </Box>
      ) : null}

      {!isLoading && contact ? (
        <Box
          sx={{
            border: `1px solid ${borderColor}`,
            borderRadius: 3,
            backgroundColor: 'white',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: { xs: 1.5, sm: 2.5 }, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
              onClick={() => navigate(-1)}
              sx={{ textTransform: 'none', color: '#4b5563', minWidth: 0, px: 0.5 }}
            >
              Back
            </Button>
            <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: 1.5, border: `1px solid ${borderColor}` }}>
              <MoreHoriz sx={{ color: '#4b5563', fontSize: 18 }} />
            </Button>
          </Box>

          <Box sx={{ px: { xs: 1.5, sm: 2.5 }, pb: 1.5 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.3} alignItems="center">
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <Avatar
                    src={contact.photoUrl || undefined}
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: '#eef2ff',
                      color: primary,
                      fontWeight: 800,
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      right: -2,
                      bottom: -2,
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      border: '2px solid white',
                      backgroundColor: primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <CameraAltOutlined sx={{ fontSize: 12, color: 'white' }} />
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#111827', fontSize: 24 }}>{fullName}</Typography>
                  <Typography sx={{ color: mutedText, fontSize: 13 }}>
                    {primaryEmail} • {contact.companyName || 'No company'}
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" mt={0.75}>
                    <Chip size="small" label={contact.status || 'Lead'} sx={{ bgcolor: '#ecfdf3', color: '#047857', fontWeight: 700 }} />
                    <Chip size="small" label={contact.leadSource || 'manual'} sx={{ bgcolor: '#f3f4f6', color: '#374151', textTransform: 'capitalize' }} />
                    {contactTags.length > 0 ? (
                      contactTags.map((tag) => (
                        <Chip key={`header-tag-${tag}`} size="small" label={tag} sx={{ bgcolor: '#f3f4f6', color: '#374151' }} />
                      ))
                    ) : (
                      <Chip size="small" label="No tags" sx={{ bgcolor: '#f3f4f6', color: '#6b7280' }} />
                    )}
                  </Stack>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button variant="outlined" startIcon={<AlternateEmailOutlined sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', borderColor, color: '#111827', minWidth: { xs: 90, sm: 96 } }}>
                  Email
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ px: { xs: 1.5, sm: 2.5 }, borderBottom: `1px solid ${borderColor}` }}>
            <Stack direction="row" spacing={2.25} sx={{ overflowX: 'auto', py: 1.2 }}>
              {tabs.map((tab) => (
                <Typography
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  sx={{
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: 13,
                    fontWeight: activeTab === tab ? 700 : 500,
                    color: activeTab === tab ? '#111827' : mutedText,
                    borderBottom: activeTab === tab ? `2px solid ${primary}` : '2px solid transparent',
                    pb: 0.8,
                  }}
                >
                  {tab}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.35fr) minmax(260px, 1fr)', lg: 'minmax(0, 1.65fr) minmax(300px, 0.9fr)' },
              minHeight: 520,
            }}
          >
            <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRight: { xs: 'none', lg: `1px solid ${borderColor}` } }}>
              {activeTab === 'Deals' ? (
                <Stack spacing={1.5}>
                  <Typography sx={{ fontSize: 12, color: mutedText, fontWeight: 700 }}>TODAY</Typography>

                  {associatedDeals.length === 0 ? (
                    <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: 2, p: 2 }}>
                      <Typography sx={{ color: '#111827', fontWeight: 700, mb: 0.5 }}>No activity yet</Typography>
                      <Typography sx={{ color: mutedText, fontSize: 13 }}>
                        This contact has no associated deal activity at the moment.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Stack direction="row" spacing={1.2} alignItems="flex-start">
                        <Avatar src={contact.photoUrl || undefined} sx={{ width: 28, height: 28, fontSize: 12 }}>
                          {initials}
                        </Avatar>
                        <Box>
                          <Typography sx={{ color: '#111827', fontWeight: 700, fontSize: 14 }}>
                            {fullName} <Typography component="span" sx={{ color: mutedText, fontSize: 12 }}>{formatDateTime(contact.updatedAt)}</Typography>
                          </Typography>
                          <Typography sx={{ color: mutedText, fontSize: 13 }}>Viewed {associatedDeals.length} associated deals</Typography>
                        </Box>
                      </Stack>

                      {associatedDeals.slice(0, 5).map((deal) => (
                        <Box key={deal.id} sx={{ border: `1px solid ${borderColor}`, borderRadius: 2, p: 1.25 }}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                            <Box
                              sx={{
                                width: 58,
                                height: 48,
                                borderRadius: 1.5,
                                background: 'linear-gradient(135deg, #dbeafe, #f5f3ff)',
                                border: `1px solid ${borderColor}`,
                              }}
                            />
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography component={Link} to={`/deals/${deal.id}`} sx={{ color: '#111827', textDecoration: 'none', fontWeight: 700 }}>
                                {deal.price}
                              </Typography>
                              <Typography sx={{ color: '#111827', fontSize: 13 }}>
                                {deal.area} • {deal.appointment}
                              </Typography>
                              <Typography sx={{ color: mutedText, fontSize: 12 }} noWrap>
                                {deal.location}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      ))}
                    </>
                  )}
                </Stack>
              ) : (
                <Box sx={{ border: `1px dashed ${borderColor}`, borderRadius: 2, p: 2.5 }}>
                  <Typography sx={{ fontWeight: 700, color: '#111827' }}>{activeTab}</Typography>
                  <Typography sx={{ color: mutedText, mt: 0.75 }}>
                    Content for {activeTab.toLowerCase()} can be added here.
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack spacing={2}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: 14, mb: 1 }}>Details</Typography>
                  <Stack spacing={1.15}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.6}>
                      <Typography sx={{ color: mutedText, fontSize: 13 }}>Type</Typography>
                      <Chip size="small" label={contact.status || 'Lead'} sx={{ height: 22, fontWeight: 700, bgcolor: '#f3f4f6' }} />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.6}>
                      <Typography sx={{ color: mutedText, fontSize: 13 }}>Tags</Typography>
                      <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
                        {contactTags.length > 0 ? (
                          contactTags.map((tag) => (
                            <Chip
                              key={`details-tag-${tag}`}
                              size="small"
                              label={tag}
                              sx={{ height: 22, bgcolor: '#f3e8ff', color: '#6b21a8', fontWeight: 600 }}
                            />
                          ))
                        ) : (
                          <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>-</Typography>
                        )}
                      </Box>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.6}>
                      <Typography sx={{ color: mutedText, fontSize: 13 }}>Emails</Typography>
                      <Stack spacing={0.35} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                        {emailCount > 0 ? (
                          contact.emails.map((email, index) => (
                            <Typography
                              key={`details-email-${index}`}
                              sx={{ color: '#111827', fontSize: 13, fontWeight: 600, wordBreak: 'break-all' }}
                            >
                              {email}
                            </Typography>
                          ))
                        ) : (
                          <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>-</Typography>
                        )}
                      </Stack>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.6}>
                      <Typography sx={{ color: mutedText, fontSize: 13 }}>Phone numbers</Typography>
                      <Stack spacing={0.2} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                        {phoneCount > 0 ? (
                          contact.phones.map((phone, index) => (
                            <Typography
                              key={`details-phone-${index}`}
                              sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}
                            >
                              {phone}
                            </Typography>
                          ))
                        ) : (
                          <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>-</Typography>
                        )}
                      </Stack>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.6}>
                      <Typography sx={{ color: mutedText, fontSize: 13 }}>Location</Typography>
                      <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ maxWidth: { xs: '100%', sm: 180 } }}>
                        <LocationOnOutlined sx={{ fontSize: 14, color: mutedText, mt: 0.1 }} />
                        <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600, wordBreak: 'break-word' }}>
                          {formatAddress(contact)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: 14, mb: 1 }}>Enriched data</Typography>
                  <Stack spacing={1.15}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.6}>
                      <Typography sx={{ color: mutedText, fontSize: 13 }}>Ownership</Typography>
                      <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>
                        {contact.ownerDetails?.fullName || 'Home owner'}
                      </Typography>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.6}>
                      <Typography sx={{ color: mutedText, fontSize: 13 }}>Associated deals</Typography>
                      <Stack direction="row" spacing={0.55} alignItems="center">
                        <SellOutlined sx={{ fontSize: 14, color: '#111827' }} />
                        <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>
                          {associatedDeals.length} active {associatedDeals.length === 1 ? 'deal' : 'deals'}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.6}>
                      <Typography sx={{ color: mutedText, fontSize: 13 }}>Created</Typography>
                      <Typography sx={{ color: '#111827', fontSize: 13, fontWeight: 600 }}>
                        {formatDateTime(contact.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default ContactDetailsPage;
