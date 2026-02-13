import type { CreateContactPayload } from '../../../services/contacts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type OptionalTextRule = {
  label: string;
  value: string;
  maxLength: number;
};

export type AddContactFormValues = {
  firstName: string;
  lastName: string;
  companyName: string;
  photoUrl?: string;
  emails: string[];
  phones: string[];
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    zipCode: string;
    country: string;
  };
};

type ValidationSuccess = {
  success: true;
  payload: CreateContactPayload;
};

type ValidationError = {
  success: false;
  message: string;
};

export type AddContactValidationResult = ValidationSuccess | ValidationError;

const validateOptionalText = ({
  label,
  value,
  maxLength,
}: OptionalTextRule): { value?: string; error?: string } => {
  if (!value.length) {
    return { value: undefined };
  }

  const trimmed = value.trim();
  if (!trimmed.length) {
    return { error: `${label} cannot be only spaces.` };
  }

  if (trimmed.length > maxLength) {
    return { error: `${label} must be ${maxLength} characters or less.` };
  }

  return { value: trimmed };
};

const dedupeCaseInsensitive = (values: string[]) => {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const value of values) {
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(value);
    }
  }

  return deduped;
};

const dedupeExact = (values: string[]) => {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      deduped.push(value);
    }
  }

  return deduped;
};

export const validateAddContactPayload = (
  form: AddContactFormValues,
): AddContactValidationResult => {
  const firstName = form.firstName.trim();
  if (!firstName) {
    return { success: false, message: 'First name is required.' };
  }
  if (firstName.length > 30) {
    return { success: false, message: 'First name must be 30 characters or less.' };
  }

  const lastNameValidation = validateOptionalText({
    label: 'Last name',
    value: form.lastName,
    maxLength: 30,
  });
  if (lastNameValidation.error) {
    return { success: false, message: lastNameValidation.error };
  }

  const companyNameValidation = validateOptionalText({
    label: 'Company name',
    value: form.companyName,
    maxLength: 60,
  });
  if (companyNameValidation.error) {
    return { success: false, message: companyNameValidation.error };
  }

  const photoUrl = form.photoUrl?.trim();
  if (photoUrl) {
    if (photoUrl.length > 208) {
      return { success: false, message: 'Photo URL must be 208 characters or less.' };
    }

    try {
      new URL(photoUrl);
    } catch {
      return { success: false, message: 'Photo URL is invalid.' };
    }
  }

  if (form.emails.length > 10) {
    return { success: false, message: 'You can submit up to 10 emails.' };
  }

  const normalizedEmails = form.emails.map((item) => item.trim()).filter(Boolean);
  for (const email of normalizedEmails) {
    if (email.length > 60) {
      return { success: false, message: 'Each email must be 60 characters or less.' };
    }
    if (!EMAIL_REGEX.test(email)) {
      return { success: false, message: `Invalid email: ${email}` };
    }
  }
  const emails = dedupeCaseInsensitive(normalizedEmails);

  if (form.phones.length > 10) {
    return { success: false, message: 'You can submit up to 10 phone numbers.' };
  }

  const normalizedPhones = form.phones
    .map((item) => item.trim().replace(/\s+/g, ''))
    .filter(Boolean);
  for (const phone of normalizedPhones) {
    if (phone.length < 7 || phone.length > 20) {
      return {
        success: false,
        message: 'Each phone number must be between 7 and 20 characters.',
      };
    }
  }
  const phones = dedupeExact(normalizedPhones);

  if (!emails.length && !phones.length) {
    return {
      success: false,
      message: 'At least one email or phone number is required.',
    };
  }

  const streetValidation = validateOptionalText({
    label: 'Street',
    value: form.address.street,
    maxLength: 100,
  });
  if (streetValidation.error) {
    return { success: false, message: streetValidation.error };
  }

  const cityValidation = validateOptionalText({
    label: 'City',
    value: form.address.city,
    maxLength: 50,
  });
  if (cityValidation.error) {
    return { success: false, message: cityValidation.error };
  }

  const stateValidation = validateOptionalText({
    label: 'State',
    value: form.address.state,
    maxLength: 50,
  });
  if (stateValidation.error) {
    return { success: false, message: stateValidation.error };
  }

  const postalValidation = validateOptionalText({
    label: 'Postal code',
    value: form.address.postalCode,
    maxLength: 10,
  });
  if (postalValidation.error) {
    return { success: false, message: postalValidation.error };
  }

  const zipValidation = validateOptionalText({
    label: 'Zip code',
    value: form.address.zipCode,
    maxLength: 10,
  });
  if (zipValidation.error) {
    return { success: false, message: zipValidation.error };
  }

  const countryValidation = validateOptionalText({
    label: 'Country',
    value: form.address.country,
    maxLength: 25,
  });
  if (countryValidation.error) {
    return { success: false, message: countryValidation.error };
  }

  const effectivePostalCode = postalValidation.value ?? zipValidation.value;
  const address = {
    ...(streetValidation.value ? { street: streetValidation.value } : {}),
    ...(cityValidation.value ? { city: cityValidation.value } : {}),
    ...(stateValidation.value ? { state: stateValidation.value } : {}),
    ...(effectivePostalCode ? { postalCode: effectivePostalCode } : {}),
    ...(countryValidation.value ? { country: countryValidation.value } : {}),
  };

  const payload: CreateContactPayload = {
    firstName,
    ...(lastNameValidation.value ? { lastName: lastNameValidation.value } : {}),
    ...(companyNameValidation.value ? { companyName: companyNameValidation.value } : {}),
    ...(photoUrl ? { photoUrl } : {}),
    ...(emails.length ? { emails } : {}),
    ...(phones.length ? { phones } : {}),
    ...(Object.keys(address).length ? { address } : {}),
  };

  return { success: true, payload };
};
