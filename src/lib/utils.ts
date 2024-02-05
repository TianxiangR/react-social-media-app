import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysInMonth(year: number, month: number): string[] {
  const date = new Date(year, month, 0);
  const days: string[] = [];
  for (let i = 1; i <= date.getDate(); i++) {
    days.push(i.toString().padStart(2, '0'));
  }
  return days;
}

export function getMonths(): string[] {
  return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
}

export function getYears(start: Date, end: Date): string[] {
  if (start > end) {
    // if the start date is larger than the end date, 
    // return an empty array no matter if they are in the same year or not
    return [];
  }

  const years: string[] = [];
  for (let i = start.getFullYear(); i <= end.getFullYear(); i++) {
    years.push(i.toString());
  }
  return years;
}
