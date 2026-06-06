export function buildDatetime(date, timeString) {
  const [timePart, period] = timeString.split(" ");
  const [hourStr, minuteStr] = timePart.split(":");
  let hours = parseInt(hourStr);
  const minutes = parseInt(minuteStr);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00Z`;
}

export function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function to24Hour(timeString) {
  const [timePart, period] = timeString.split(" ");
  const [hourStr, minuteStr] = timePart.split(":");
  let hours = parseInt(hourStr);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minuteStr}`;
}

export function formatShowingDate(datetime) {
  return new Date(datetime).toLocaleDateString("en-US", {
    timeZone: "UTC",
  });
}

export function formatShowingTime(datetime) {
  return new Date(datetime).toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
  });
}
