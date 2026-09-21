import { BUSINESS } from "@/config/business";

export function getPlatformName() {
  return process.env.PLATFORM_NAME?.trim() || BUSINESS.name;
}

export function getOperatorNotificationEmail() {
  return process.env.OPERATOR_NOTIFICATION_EMAIL?.trim() || null;
}

export function getMailFrom() {
  return process.env.MAIL_FROM?.trim() || null;
}

export function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim() || null;
}

export function isMailConfigured() {
  return Boolean(getResendApiKey() && getMailFrom());
}
