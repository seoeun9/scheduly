import type { Routine } from '@/stores/RoutineStore';
import type { TodoColor } from '@/types/todo';
import type { SFSymbol } from 'expo-symbols';

export type RoutineTodoInput = {
  routineId: string;
  date: string;
  title: string;
  color: TodoColor;
  icon: SFSymbol;
  done: boolean;
};

export function toDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);

  result.setDate(result.getDate() + amount);

  return result;
}

function getDayDifference(start: Date, target: Date) {
  const startValue = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();

  const targetValue = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();

  return Math.round((targetValue - startValue) / (1000 * 60 * 60 * 24));
}

function isRoutineDate(routine: Routine, date: Date) {
  const startDate = fromDateKey(routine.startDate);

  const dateKey = toDateKey(date);

  if (dateKey < routine.startDate) {
    return false;
  }

  if (routine.endDate && dateKey > routine.endDate) {
    return false;
  }

  const interval = Math.max(routine.interval, 1);

  if (routine.repeatType === 'daily') {
    const difference = getDayDifference(startDate, date);

    return difference % interval === 0;
  }

  if (routine.repeatType === 'weekly') {
    const difference = getDayDifference(startDate, date);

    return difference % (interval * 7) === 0;
  }

  const monthDifference =
    (date.getFullYear() - startDate.getFullYear()) * 12 + date.getMonth() - startDate.getMonth();

  if (monthDifference < 0 || monthDifference % interval !== 0) {
    return false;
  }

  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const scheduledDay = Math.min(startDate.getDate(), lastDayOfMonth);

  return date.getDate() === scheduledDay;
}

export function generateRoutineTodos(
  routine: Routine,
  rangeStart: Date,
  rangeEnd: Date
): RoutineTodoInput[] {
  const result: RoutineTodoInput[] = [];

  let cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());

  while (cursor <= rangeEnd) {
    if (isRoutineDate(routine, cursor)) {
      const dateKey = toDateKey(cursor);

      result.push({
        routineId: routine.id,
        date: dateKey,

        title: routine.title,
        icon: routine.icon,
        color: routine.color,
        done: routine.completedDates.includes(dateKey),
      });
    }

    cursor = addDays(cursor, 1);
  }

  return result;
}
