export const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
