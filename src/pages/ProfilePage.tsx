import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';

import PageHeader from '../components/PageHeader';
import { CustomButton } from '../common/CustomButton';
import ProfileOverviewCard from '../components/profile/ProfileOverviewCard';
import AccountDetailsSection from '../components/profile/AccountDetailsSection';
import PreferencesSection from '../components/profile/PreferencesSection';
import NotificationsSection from '../components/profile/NotificationsSection';
import SignatureSection from '../components/profile/SignatureSection';
import SecuritySection from '../components/profile/SecuritySection';
import type { PasswordState, ProfileState } from '../components/profile/types';

const ProfilePage = () => {
  const initialProfile: ProfileState = {
    firstName: 'Emma',
    lastName: 'Cole',
    title: 'Account Executive',
    email: 'emma@cliento.com',
    phone: '(415) 555-0123',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    defaultPipeline: 'Enterprise',
    signature: 'Thanks,\nEmma',
    emailDigest: true,
    dealUpdates: true,
    taskReminders: true,
    marketing: false,
    twoFactor: true,
  };

  const initialPasswords: PasswordState = {
    current: '',
    next: '',
    confirm: '',
  };

  const [profile, setProfile] = useState<ProfileState>(initialProfile);
  const [passwords, setPasswords] = useState<PasswordState>(initialPasswords);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleProfileChange = (field: keyof ProfileState, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileToggle = (field: keyof ProfileState, value: boolean) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: keyof PasswordState, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setProfile(initialProfile);
    setPasswords(initialPasswords);
    setAvatarFile(null);
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
        title="My Profile"
        subtitle="Manage your account, preferences, and security"
        action={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <CustomButton
              variant="outlined"
              customColor="#94a3b8"
              sx={{
                borderRadius: 999,
                px: 2.5,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
              }}
              onClick={handleReset}
            >
              Reset
            </CustomButton>
            <CustomButton
              variant="contained"
              sx={{
                borderRadius: 999,
                px: 2.5,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Save Changes
            </CustomButton>
          </Stack>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1.4fr' },
          gap: 2,
        }}
      >
        <ProfileOverviewCard
          profile={profile}
          avatarPreview={avatarPreview}
          onAvatarChange={setAvatarFile}
        />
        <AccountDetailsSection profile={profile} onFieldChange={handleProfileChange} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
          gap: 2,
        }}
      >
        <PreferencesSection profile={profile} onFieldChange={handleProfileChange} />
        <NotificationsSection profile={profile} onToggle={handleProfileToggle} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
          gap: 2,
        }}
      >
        <SignatureSection
          signature={profile.signature}
          onChange={(value) => handleProfileChange('signature', value)}
        />
        <SecuritySection
          passwords={passwords}
          twoFactor={profile.twoFactor}
          onPasswordChange={handlePasswordChange}
          onToggle={(value) => handleProfileToggle('twoFactor', value)}
        />
      </Box>
    </Box>
  );
};

export default ProfilePage;
