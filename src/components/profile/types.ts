export type ProfileState = {
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  profilePhoto: string | null;
  location: string | null;
  timeZone: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PasswordState = {
  current: string;
  next: string;
  confirm: string;
};
