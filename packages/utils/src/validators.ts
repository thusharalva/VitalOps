// Validation utilities

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Indian phone number
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 && /^[6-9]/.test(cleaned);
}

/**
 * Validate PAN number
 */
export function isValidPAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
}

/**
 * Validate Aadhaar number
 */
export function isValidAadhaar(aadhaar: string): boolean {
  const cleaned = aadhaar.replace(/\D/g, '');
  return cleaned.length === 12;
}

/**
 * Validate pincode
 */
export function isValidPincode(pincode: string): boolean {
  const cleaned = pincode.replace(/\D/g, '');
  return cleaned.length === 6;
}



