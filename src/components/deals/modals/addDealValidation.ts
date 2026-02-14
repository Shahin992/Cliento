import type { CreateDealPayload } from '../../../hooks/deals/useDealsMutations';

export type AddDealFormValues = {
  ownerId: string;
  pipelineId: string;
  stageId: string;
  title: string;
  amount: string;
  contactId: string;
  expectedCloseDate: string;
};

type ValidationSuccess = {
  success: true;
  payload: CreateDealPayload;
};

type ValidationError = {
  success: false;
  message: string;
};

export type AddDealValidationResult = ValidationSuccess | ValidationError;

export const validateCreateDealPayload = (
  form: AddDealFormValues,
): AddDealValidationResult => {
  const ownerId = form.ownerId.trim();
  if (!ownerId.length) {
    return { success: false, message: 'Owner is required.' };
  }

  const pipelineId = form.pipelineId.trim();
  if (!pipelineId.length) {
    return { success: false, message: 'Pipeline is required.' };
  }

  const stageId = form.stageId.trim();
  if (!stageId.length) {
    return { success: false, message: 'Stage is required.' };
  }

  const title = form.title.trim();
  if (!title.length) {
    return { success: false, message: 'Deal title is required.' };
  }
  if (title.length > 120) {
    return { success: false, message: 'Deal title must be 120 characters or less.' };
  }

  const contactId = form.contactId.trim();
  if (!contactId.length) {
    return { success: false, message: 'Contact is required.' };
  }

  let amount: number | null = null;
  const normalizedAmount = form.amount.trim();
  if (normalizedAmount.length) {
    const parsedAmount = Number(normalizedAmount);
    if (!Number.isFinite(parsedAmount)) {
      return { success: false, message: 'Amount must be numeric.' };
    }
    if (parsedAmount < 0) {
      return { success: false, message: 'Amount must be 0 or greater.' };
    }
    amount = parsedAmount;
  }

  let expectedCloseDate: string | null = null;
  const normalizedDate = form.expectedCloseDate.trim();
  if (normalizedDate.length) {
    const date = new Date(`${normalizedDate}T23:59:59.000Z`);
    if (Number.isNaN(date.getTime())) {
      return { success: false, message: 'Expected close date is invalid.' };
    }
    expectedCloseDate = date.toISOString();
  }

  return {
    success: true,
    payload: {
      ownerId,
      pipelineId,
      stageId,
      title,
      amount,
      contactId,
      expectedCloseDate,
    },
  };
};
