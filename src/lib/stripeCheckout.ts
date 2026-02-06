import { getStripe } from './stripe';

export type CheckoutPayload = {
  planId: string;
  priceId?: string;
  paymentLinkUrl?: string;
  quantity?: number;
  customerEmail?: string;
  successPath?: string;
  cancelPath?: string;
};

type CheckoutResponse = {
  sessionId?: string;
  url?: string;
};

export const startStripeCheckout = async (payload: CheckoutPayload) => {
  const isMock = import.meta.env.VITE_STRIPE_MOCK === 'true';
  const envPaymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK as
    | string
    | undefined;
  const paymentLink = payload.paymentLinkUrl || envPaymentLink;

  if (isMock) {
    const target = payload.successPath || window.location.pathname;
    window.location.href = target;
    return;
  }

  if (paymentLink) {
    window.location.href = paymentLink;
    return;
  }

  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Unable to start checkout');
  }

  const data = (await response.json()) as CheckoutResponse;

  if (data.url) {
    window.location.href = data.url;
    return;
  }

  if (!data.sessionId) {
    throw new Error('Checkout session not returned by server');
  }

  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
  if (error) {
    throw error;
  }
};
