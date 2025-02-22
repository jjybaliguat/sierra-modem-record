import { format } from "date-fns";

export function formatDate(date: Date): string {
  if(!date) return ""
  return format(new Date(date), "MM-dd-yyyy"); // Format as desired
}
