export type ProfileState = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  language: string;
  dateFormat: string;
  currency: string;
  defaultPipeline: string;
  signature: string;
  emailDigest: boolean;
  dealUpdates: boolean;
  taskReminders: boolean;
  marketing: boolean;
  twoFactor: boolean;
};

export type PasswordState = {
  current: string;
  next: string;
  confirm: string;
};
