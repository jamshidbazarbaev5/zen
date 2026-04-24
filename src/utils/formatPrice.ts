export const formatPrice = (n: number) => {
  const val = Number.isFinite(n) ? n : 0;
  const [intPart, decPart] = val.toFixed(2).split(".");
  const intFormatted = Number(intPart).toLocaleString("uz-UZ").replace(/,/g, " ");
  const trimmedDec = decPart.replace(/0+$/, "");
  return trimmedDec ? `${intFormatted},${trimmedDec}` : intFormatted;
};
