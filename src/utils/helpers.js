function capitalizeFirst(input) {
  if (typeof input !== "string" || input.length === 0) return "";
  const [first, ...rest] = [...input]; // iterate by Unicode code points
  // Use the environment's default locale for Unicode-aware uppercasing
  return first.toLocaleUpperCase() + rest.join("");
}

const truncateName = (name, maxLength = 10) =>
  name?.length > maxLength ? name.slice(0, maxLength) + "..." : name;
export { capitalizeFirst, truncateName };
