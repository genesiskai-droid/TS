export const formatDate = (
  date: Date | string,
  formatStr: string = 'dd/MM/yyyy HH:mm',
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Invalid date';

  const pad = (n: number) => n.toString().padStart(2, '0');
  const replacements: Record<string, string> = {
    dd: pad(dateObj.getDate()),
    MM: pad(dateObj.getMonth() + 1),
    yyyy: dateObj.getFullYear().toString(),
    HH: pad(dateObj.getHours()),
    mm: pad(dateObj.getMinutes()),
    ss: pad(dateObj.getSeconds()),
  };

  let result = formatStr;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(key, value);
  }
  return result;
};

export const formatDateRelative = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Invalid date';

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'hace un momento';
  if (diffMins < 60) return `hace ${diffMins} minutos`;
  if (diffHours < 24) return `hace ${diffHours} horas`;
  if (diffDays < 30) return `hace ${diffDays} días`;
  return formatDate(dateObj);
};

export const isDateExpired = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return true;
  return dateObj < new Date();
};

export const getStartOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getEndOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};
