export const formatDuration = (totalSeconds = 0) => {
  if (!totalSeconds) {
    return "0s";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ");
};

export const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  return new Date(dateValue).toLocaleString();
};
