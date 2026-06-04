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
