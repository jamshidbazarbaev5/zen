export const formatPrice = (n: number) => {
  const rounded = Math.round(Number.isFinite(n) ? n : 0);
  return rounded.toLocaleString("uz-UZ").replace(/,/g, " ");
};
