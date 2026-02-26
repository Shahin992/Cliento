export type PlanDetails = {
  planName: string;
  billingCycle: string;
  planPrice: string;
  nextBillingDate: string;
  nextInvoiceTotal: string;
  status: string;
};

export type PaymentCard = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  holder?: string;
  isDefault?: boolean;
};

export type TransactionItem = {
  id: string;
  date: string;
  amount: string;
  status: string;
  description?: string;
  invoiceUrl?: string | null;
};
