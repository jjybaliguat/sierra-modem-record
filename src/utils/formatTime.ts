export const formatTime = (utcString: string, is24Hour: boolean = false) => {
  return new Date(utcString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24Hour, // false = 24-hour format
    timeZone: "UTC", // Keep it in UTC
  });
  };