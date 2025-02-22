export const formatDateTime = (utcString: string, is24Hour: boolean = false) => {
    const date = new Date(utcString);
    
    // Format options
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short", // e.g., February
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24Hour, // Switch between 12-hour and 24-hour formats
      timeZone: "UTC", // Ensures the input is treated as UTC
    };
  
    return date.toLocaleString("en-US", options);
  };