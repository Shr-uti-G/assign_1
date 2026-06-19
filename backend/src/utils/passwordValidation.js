const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

function validatePassword(password) {
  const errors = [];
  if (!password || password.length < 12) {
    errors.push('Password must be at least 12 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!SPECIAL_CHAR_REGEX.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  return errors;
}

function validateEmail(email) {
  if (!email?.trim()) return ['Email is required'];
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return ok ? [] : ['Please enter a valid email address'];
}

module.exports = { validatePassword, validateEmail, SPECIAL_CHAR_REGEX };
