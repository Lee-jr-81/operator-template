// Default country calling code for local numbers (leading 0, no country code).
// Change this when cloning a non-UK platform.
export const WHATSAPP_DEFAULT_DIAL_CODE = "44";

export function toWhatsAppDigits(
  phone: string | null | undefined,
  defaultDialCode: string = WHATSAPP_DEFAULT_DIAL_CODE,
) {
  if (!phone) {
    return null;
  }

  const trimmed = phone.trim();
  if (!trimmed) {
    return null;
  }

  const hasPlus = trimmed.startsWith("+");
  const hasInternationalPrefix = trimmed.startsWith("00");
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length < 8) {
    return null;
  }

  let normalized: string | null;

  if (hasPlus) {
    normalized = digits;
  } else if (hasInternationalPrefix) {
    normalized = digits.slice(2) || null;
  } else if (digits.startsWith(defaultDialCode)) {
    normalized = digits;
  } else if (digits.startsWith("0")) {
    normalized = `${defaultDialCode}${digits.slice(1)}`;
  } else {
    normalized = `${defaultDialCode}${digits}`;
  }

  if (!normalized || normalized.length < 8) {
    return null;
  }

  return normalized;
}

export function toWhatsAppUrl(phone: string | null | undefined) {
  const digits = toWhatsAppDigits(phone);
  if (!digits) {
    return null;
  }

  return `https://wa.me/${digits}`;
}
