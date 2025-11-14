import { addDays, isWeekend, getMonth, format, parseISO } from 'date-fns';
import { Holiday } from '../types';

/**
 * 공휴일인지 체크
 */
export function isHoliday(date: Date, holidays: Holiday[]): boolean {
  const dateStr = format(date, 'yyyy-MM-dd');
  return holidays.some(h => h.date === dateStr);
}

/**
 * 주말 또는 공휴일인지 체크
 */
export function isNonWorkingDay(date: Date, holidays: Holiday[]): boolean {
  return isWeekend(date) || isHoliday(date, holidays);
}

/**
 * 날짜가 제외된 달에 포함되는지 체크
 */
export function isInExcludedMonth(date: Date, excludedMonths: number[]): boolean {
  const month = getMonth(date) + 1; // 0-based → 1-based
  return excludedMonths.includes(month);
}

/**
 * 날짜 범위가 제외된 달에 걸치는지 체크
 */
export function rangeOverlapsExcludedMonths(
  startDate: Date,
  endDate: Date,
  excludedMonths: number[]
): boolean {
  let current = new Date(startDate);
  while (current <= endDate) {
    if (isInExcludedMonth(current, excludedMonths)) {
      return true;
    }
    current = addDays(current, 1);
  }
  return false;
}

/**
 * 날짜 배열을 문자열 배열로 변환
 */
export function datesToStrings(dates: Date[]): string[] {
  return dates.map(d => format(d, 'yyyy-MM-dd'));
}

/**
 * 문자열 날짜를 Date 객체로 변환
 */
export function stringToDate(dateStr: string): Date {
  return parseISO(dateStr);
}

/**
 * 두 날짜 사이의 모든 날짜 배열 반환
 */
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current = addDays(current, 1);
  }

  return dates;
}

/**
 * 날짜 범위 내에서 평일(근무일) 개수 계산
 */
export function countWorkingDays(
  startDate: Date,
  endDate: Date,
  holidays: Holiday[]
): number {
  const dates = getDateRange(startDate, endDate);
  return dates.filter(date => !isNonWorkingDay(date, holidays)).length;
}

/**
 * 날짜를 한국어 형식으로 포맷
 */
export function formatKorean(date: Date): string {
  return format(date, 'M월 d일 (E)', { locale: undefined });
}

/**
 * 해당 공휴일 객체 찾기
 */
export function findHoliday(date: Date, holidays: Holiday[]): Holiday | undefined {
  const dateStr = format(date, 'yyyy-MM-dd');
  return holidays.find(h => h.date === dateStr);
}
