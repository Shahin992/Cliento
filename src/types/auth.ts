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
