export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._]{2,29}$/;

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function isAdult(dateOfBirth: string) {
  const dob = new Date(`${dateOfBirth}T00:00:00Z`);
  if (Number.isNaN(dob.getTime())) return false;

  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const month = now.getUTCMonth() - dob.getUTCMonth();
  if (month < 0 || (month === 0 && now.getUTCDate() < dob.getUTCDate())) age -= 1;
  return age >= 18;
}
