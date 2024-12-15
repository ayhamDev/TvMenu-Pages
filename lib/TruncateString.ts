/**
 * Truncates a string to a specified length and adds an ellipsis if it exceeds the limit.
 * @param text - The string to truncate.
 * @param maxLength - The maximum length of the string before truncating.
 * @returns The truncated string with ellipsis if necessary.
 */
export function TruncateString(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}
