export const JOIN_NAME_MAX = 80;
export const JOIN_EMAIL_MAX = 254;
export const JOIN_PHONE_MAX = 40;
export const JOIN_PHONE_MIN = 6;
export const JOIN_MESSAGE_MIN = 10;
export const JOIN_MESSAGE_MAX = 2000;

export const JOIN_SUBMIT_FAILED_MESSAGE =
  "That message could not be sent. Please try again.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+0-9()\s.-]{6,40}$/;

export type JoinFieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

export type JoinInput = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
};

export function parseJoinInput(raw: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): { data: JoinInput } | { fieldErrors: JoinFieldErrors } {
  const name = raw.name.trim();
  const email = raw.email.trim();
  const phone = raw.phone.trim();
  const message = raw.message.trim();
  const fieldErrors: JoinFieldErrors = {};

  if (!name) {
    fieldErrors.name = "Enter your name.";
  } else if (name.length > JOIN_NAME_MAX) {
    fieldErrors.name = `Use ${JOIN_NAME_MAX} characters or fewer.`;
  }

  if (!email) {
    fieldErrors.email = "Enter your email address.";
  } else if (email.length > JOIN_EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (phone) {
    if (
      phone.length < JOIN_PHONE_MIN ||
      phone.length > JOIN_PHONE_MAX ||
      !PHONE_PATTERN.test(phone)
    ) {
      fieldErrors.phone =
        "Enter a phone number using digits and common symbols only.";
    }
  }

  if (!message) {
    fieldErrors.message = "Enter a message.";
  } else if (message.length < JOIN_MESSAGE_MIN) {
    fieldErrors.message = `Use at least ${JOIN_MESSAGE_MIN} characters.`;
  } else if (message.length > JOIN_MESSAGE_MAX) {
    fieldErrors.message = `Use ${JOIN_MESSAGE_MAX} characters or fewer.`;
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors };
  }

  return {
    data: {
      name,
      email,
      phone: phone || null,
      message,
    },
  };
}
