export const capitalizeFirstChar = (str: string): string => {
  if (!str) return str; // Return the string if it's empty or falsy
  return str.charAt(0).toUpperCase() + str.slice(1); // Capitalize the first character and append the rest
};
