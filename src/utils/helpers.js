function capitalizeFirst(input) {
  if (typeof input !== "string" || input.length === 0) return "";
  const [first, ...rest] = [...input]; // iterate by Unicode code points
  // Use the environment's default locale for Unicode-aware uppercasing
  return first.toLocaleUpperCase() + rest.join("");
}

const truncateName = (name, maxLength = 10) =>
  name?.length > maxLength ? name.slice(0, maxLength) + "..." : name;

// Extend Date with getWeekNumber
function getWeekNumber(date = new Date()) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstDay.getDay() + 1) / 7);
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // format: YYYY-MM-DD
}

export { capitalizeFirst, truncateName, getWeekNumber, getCurrentDate };
