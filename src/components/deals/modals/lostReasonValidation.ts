type LostReasonValidationSuccess = {
  success: true;
  value: string;
};

type LostReasonValidationError = {
  success: false;
  message: string;
};

export type LostReasonValidationResult =
  | LostReasonValidationSuccess
  | LostReasonValidationError;

export const validateLostReason = (value: string): LostReasonValidationResult => {
  const normalized = value.trim();
  if (!normalized.length) {
    return { success: false, message: 'Lost reason is required.' };
  }
  if (normalized.length > 500) {
    return { success: false, message: 'Lost reason must be 500 characters or less.' };
  }

  return { success: true, value: normalized };
};

export const validateDealId = (value: string): LostReasonValidationResult => {
  const normalized = value.trim();
  if (!normalized.length) {
    return { success: false, message: 'Deal id is required.' };
  }
  return { success: true, value: normalized };
};
