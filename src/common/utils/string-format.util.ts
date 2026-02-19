export const toTitleCase = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .split(' ')
    .filter((word) => word.length > 0) // Evita espacios dobles
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const normalizeCode = (code: string): string => {
  return code.trim().toUpperCase();
};
