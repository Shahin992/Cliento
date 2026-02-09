export type SignUpPayload = {
  fullName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};
