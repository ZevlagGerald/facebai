export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._]{2,29}$/;

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export function isAdult(dateOfBirth: string, referenceDate = new Date()) {
  const dob = parseIsoDate(dateOfBirth);
  if (!dob || Number.isNaN(referenceDate.getTime())) return false;

  let age = referenceDate.getUTCFullYear() - dob.getUTCFullYear();
  const month = referenceDate.getUTCMonth() - dob.getUTCMonth();
  if (month < 0 || (month === 0 && referenceDate.getUTCDate() < dob.getUTCDate())) age -= 1;
  return age >= 18;
}
