export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export function validatePassword(password) {
  const errors = [];
  if (!password || password.length < 12) {
    errors.push('At least 12 characters');
  }
  if (!/[A-Z]/.test(password || '')) {
    errors.push('At least one uppercase letter (A–Z)');
  }
  if (!SPECIAL_CHAR_REGEX.test(password || '')) {
    errors.push('At least one special character (!@#$...)');
  }
  return errors;
}

export function validateEmail(email) {
  if (!email?.trim()) return ['Email is required'];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return ['Please enter a valid email address'];
  }
  return [];
}

export function getPasswordStrengthHints(password) {
  return [
    { label: '12+ characters', ok: (password?.length ?? 0) >= 12 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password || '') },
    { label: 'Special character', ok: SPECIAL_CHAR_REGEX.test(password || '') },
  ];
}
