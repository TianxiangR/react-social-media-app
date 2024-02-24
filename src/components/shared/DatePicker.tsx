import { TextField } from '@mui/material';
import React, {useEffect,useState} from 'react';
import { Form } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDaysInMonth, getMonths, getYears } from '@/lib/utils';

import { FormLabel } from '../ui/form';

export type DatePickerProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value?: Date;
  onChange?: (value: Date) => void;
  start?: Date;
  end?: Date;
  className?: string;
};


function DatePicker({ value, onChange, start, end, className, ...props}: DatePickerProps) {
  const date = value ? new Date(value) : new Date();
  const endDate = end ? new Date(end) : new Date();
  const startDate = start ? new Date(start) : new Date(endDate.getTime() - 1);
  const [selectedMonth, setSelectedMonth] = useState<string>(String(date.getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState<string>(String(date.getFullYear()));
  const [selectedDay, setSelectedDay] = useState<string>(String(date.getDate()).padStart(2, '0'));
  const months = getMonths();
  const days = getDaysInMonth(Number(selectedYear), Number(selectedMonth));
  const years = getYears(startDate, endDate);

  useEffect(() => {
    const newDays = getDaysInMonth(Number(selectedYear), Number(selectedMonth));
    if (Number(selectedDay) > newDays.length) {
      console.log('here', newDays[newDays.length - 1]);
      setSelectedDay(newDays[newDays.length - 1]);
    }
  }, [selectedMonth, selectedYear]);

  const formDate = () => new Date(Number(selectedYear), Number(selectedMonth) - 1, Number(selectedDay));

  useEffect(() => {
    onChange?.(formDate());
  }, [selectedDay, selectedMonth, selectedYear]);

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    onChange?.(formDate());
  };

  const handleDayChange = (value: string) => {
    setSelectedDay(value);
    onChange?.(formDate());
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    onChange?.(formDate());
  };

  return (
    <div className={`flex gap-5 max-width-[300px] ${className}`} {...props}>
      <div className="flex-1 flex flex-col gap-1">
        <FormLabel>Month</FormLabel>
        <Select onValueChange={handleMonthChange} value={selectedMonth}>
          <SelectTrigger>
            <SelectValue placeholder={selectedMonth}  />
          </SelectTrigger>
          <SelectContent>
            {
              months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <FormLabel>Day</FormLabel>
        <Select onValueChange={handleDayChange} value={selectedDay}>
          <SelectTrigger className="min-w-0">
            <SelectValue placeholder={selectedDay} />
          </SelectTrigger>
          <SelectContent className="min-w-0">
            {
              days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <FormLabel>Year</FormLabel>
        <Select onValueChange={handleYearChange} value={selectedYear}>
          <SelectTrigger className="min-w-0">
            <SelectValue placeholder={selectedYear} />
          </SelectTrigger>
          <SelectContent className="min-w-0">
            {
              years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default DatePicker;