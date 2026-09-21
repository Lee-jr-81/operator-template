export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export function validateLoginInput(email: string, password: string) {
  const fieldErrors: LoginFieldErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    fieldErrors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!password) {
    fieldErrors.password = "Enter your password.";
  }

  return fieldErrors;
}

export function hasLoginFieldErrors(fieldErrors: LoginFieldErrors) {
  return Boolean(fieldErrors.email || fieldErrors.password);
}

export const SAFE_LOGIN_ERROR_MESSAGE =
  "Invalid email or password. Check your details and try again.";
