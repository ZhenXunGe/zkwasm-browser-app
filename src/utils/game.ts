export function formatAge(ageInMonths: number) {
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;

  if (months === 0) {
    return `${years} yr`;
  } else {
    return `${years} yr, ${months} mth`;
  }
}
