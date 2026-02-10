import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';

import PageHeader from '../components/PageHeader';
import ProfileOverviewCard from '../components/profile/ProfileOverviewCard';
import AccountDetailsSection from '../components/profile/AccountDetailsSection';
import type { ProfileState } from '../components/profile/types';
import { http } from '../services/api';
import { updateProfileDetails } from '../services/profile';
import { uploadPhoto } from '../services/upload';
import { decodeBase64, encodeBase64, getCookie, setCookie } from '../utils/auth';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setAuth } from '../features/auth/authSlice';
import { useToast } from '../common/ToastProvider';

type AccountDraft = Pick<
  ProfileState,
  'fullName' | 'companyName' | 'email' | 'phoneNumber' | 'location' | 'timeZone'
>;

const getAccountDraft = (profile: ProfileState): AccountDraft => ({
  fullName: profile.fullName,
  companyName: profile.companyName,
  email: profile.email,
  phoneNumber: profile.phoneNumber,
  location: profile.location,
  timeZone: profile.timeZone,
});

const buildProfileState = (user: ProfileState | null): ProfileState => ({
  fullName: user?.fullName ?? '',
  companyName: user?.companyName ?? '',
  email: user?.email ?? '',
  phoneNumber: user?.phoneNumber ?? '',
  role: user?.role ?? '',
  teamId: user?.teamId ?? 0,
  ownerInfo: user?.ownerInfo ?? null,
  profilePhoto: user?.profilePhoto ?? null,
  location: user?.location ?? null,
  timeZone: user?.timeZone ?? null,
  accessExpiresAt: user?.accessExpiresAt ?? null,
  planType: user?.planType ?? '',
  createdAt: user?.createdAt ?? '',
  updatedAt: user?.updatedAt ?? '',
});

const ProfilePage = () => {

  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const authToken = useAppSelector((state) => state.auth.token);
  const { showToast } = useToast();

  const [profile, setProfile] = useState<ProfileState>(() =>
    buildProfileState(authUser as ProfileState | null)
  );

  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

  const [isAccountEditing, setIsAccountEditing] = useState(false);
  const [accountDraft, setAccountDraft] = useState<AccountDraft>(() =>
    getAccountDraft(buildProfileState(authUser as ProfileState | null))
  );

  useEffect(() => {
    const nextProfile = buildProfileState(authUser as ProfileState | null);
    setProfile(nextProfile);
    if (!isAccountEditing) {
      setAccountDraft(getAccountDraft(nextProfile));
    }
  }, [authUser, isAccountEditing]);

  const handleAvatarChange = async (file: File | null) => {
    if (!file) {
      setProfile((prev) => ({ ...prev, profilePhoto: null }));
      return;
    }

    const previousPhoto = profile.profilePhoto;
    const previewUrl = URL.createObjectURL(file);

    setProfile((prev) => ({ ...prev, profilePhoto: previewUrl }));
    setIsAvatarUploading(true);

    try {
      const response = await uploadPhoto({ file, folder: 'profile' });
      if (response.success && response.data?.url) {
        const photoUrl = response.data.url;
        const patchResponse = await http.patch<unknown, { profilePhoto: string }>(
          '/api/users/profile-photo',
          { profilePhoto: photoUrl }
        );

        if (patchResponse.success) {
          setProfile((prev) => ({ ...prev, profilePhoto: photoUrl }));
          const userCookie = getCookie('cliento_user');
          if (userCookie) {
            try {
              const user = JSON.parse(decodeBase64(userCookie));
              const updatedUser = { ...user, profilePhoto: photoUrl };
              setCookie('cliento_user', encodeBase64(JSON.stringify(updatedUser)));
              if (authUser) {
                dispatch(
                  setAuth({
                    user: { ...authUser, profilePhoto: photoUrl },
                    token: authToken,
                  })
                );
              }
            } catch {
              // ignore malformed cookie
            }
          }
          URL.revokeObjectURL(previewUrl);
        } else {
          showToast({
            message: patchResponse.message || 'Failed to update profile photo.',
            severity: 'error',
          });
          setProfile((prev) => ({ ...prev, profilePhoto: previousPhoto }));
          URL.revokeObjectURL(previewUrl);
        }
      } else {
        showToast({
          message: response.message || 'Upload failed. Please try again.',
          severity: 'error',
        });
        setProfile((prev) => ({ ...prev, profilePhoto: previousPhoto }));
        URL.revokeObjectURL(previewUrl);
      }
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Upload failed.',
        severity: 'error',
      });
      setProfile((prev) => ({ ...prev, profilePhoto: previousPhoto }));
      URL.revokeObjectURL(previewUrl);
    } finally {
      setIsAvatarUploading(false);
    }
  };

  useEffect(() => {
    if (!isAccountEditing) {
      setAccountDraft(getAccountDraft(profile));
    }
  }, [isAccountEditing, profile]);

  const isAccountDirty = useMemo(
    () =>
      Object.keys(accountDraft).some((field) => {
        const key = field as keyof AccountDraft;
        return accountDraft[key] !== profile[key];
      }),
    [accountDraft, profile]
  );

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
        subtitle="Manage your account profile and access"
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1.4fr' },
          gap: { xs: 1.5, sm: 2.5 },
        }}
      >
        <ProfileOverviewCard
          profile={profile}
          isUploading={isAvatarUploading}
          onAvatarChange={handleAvatarChange}
        />
        <AccountDetailsSection
          profile={accountDraft}
          isSaving={isProfileUpdating}
          onFieldChange={(field, value) =>
            setAccountDraft((prev) => {
              if (field === 'location' || field === 'timeZone') {
                return { ...prev, [field]: value.trim() ? value : null };
              }
              return { ...prev, [field]: value };
            })
          }
          isEditing={isAccountEditing}
          isDirty={isAccountDirty}
          onEdit={() => {
            setAccountDraft(getAccountDraft(profile));
            setIsAccountEditing(true);
          }}
          onCancel={() => {
            setAccountDraft(getAccountDraft(profile));
            setIsAccountEditing(false);
          }}
          onSave={() => {
            const nextProfile = {
              ...profile,
              ...accountDraft,
              location: accountDraft.location?.trim() ? accountDraft.location : null,
              timeZone: accountDraft.timeZone?.trim() ? accountDraft.timeZone : null,
            };

            const hasChanges =
              nextProfile.fullName !== profile.fullName ||
              nextProfile.companyName !== profile.companyName ||
              nextProfile.phoneNumber !== profile.phoneNumber ||
              nextProfile.location !== profile.location ||
              nextProfile.timeZone !== profile.timeZone;

            if (!hasChanges) {
              setIsAccountEditing(false);
              return;
            }

        const applyUpdates = async () => {
              setIsProfileUpdating(true);
              try {
                const response = await updateProfileDetails({
                  fullName: nextProfile.fullName,
                  companyName: nextProfile.companyName,
                  phoneNumber: nextProfile.phoneNumber,
                  location: nextProfile.location ?? '',
                  timeZone: nextProfile.timeZone ?? '',
                });

                if (response.success) {
                  setProfile(nextProfile);
                  const userCookie = getCookie('cliento_user');
                  if (userCookie) {
                    try {
                      const user = JSON.parse(decodeBase64(userCookie));
                      const updatedUser = {
                        ...user,
                        fullName: nextProfile.fullName,
                        companyName: nextProfile.companyName,
                        phoneNumber: nextProfile.phoneNumber,
                        location: nextProfile.location,
                        timeZone: nextProfile.timeZone,
                      };
                      setCookie('cliento_user', encodeBase64(JSON.stringify(updatedUser)));
                      if (authUser) {
                        dispatch(
                          setAuth({
                            user: { ...authUser, ...updatedUser },
                            token: authToken,
                          })
                        );
                      }
                    } catch {
                      // ignore malformed cookie
                    }
                  }
                  setIsAccountEditing(false);
                  showToast({ message: 'Profile updated successfully.', severity: 'success' });
                } else {
                  showToast({
                    message: response.message || 'Failed to update profile.',
                    severity: 'error',
                  });
                }
              } catch (error) {
                showToast({
                  message:
                    error instanceof Error ? error.message : 'Failed to update profile.',
                  severity: 'error',
                });
              } finally {
                setIsProfileUpdating(false);
              }
            };

            void applyUpdates();
          }}
        />
      </Box>

    </Box>
  );
};

export default ProfilePage;
