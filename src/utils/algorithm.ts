import { addDays, subDays, differenceInDays, parseISO, isWeekend, format } from 'date-fns';
import { Bridge, Holiday, VacationPlan } from '../types';
import {
  isNonWorkingDay,
  rangeOverlapsExcludedMonths,
  isInExcludedMonth,
  getDateRange,
  findHoliday,
} from './dateUtils';

/**
 * 공휴일 주변의 징검다리 연휴 찾기
 */
export function findBridgeHolidays(
  holidays: Holiday[],
  excludedMonths: number[] = []
): Bridge[] {
  const bridges: Bridge[] = [];

  // 각 공휴일을 중심으로 브릿지 탐색
  for (const holiday of holidays) {
    const holidayDate = parseISO(holiday.date);

    // 제외된 달이면 스킵
    if (isInExcludedMonth(holidayDate, excludedMonths)) {
      continue;
    }

    // 공휴일 전후로 최대 5일까지 탐색
    for (let daysBefore = 0; daysBefore <= 5; daysBefore++) {
      for (let daysAfter = 0; daysAfter <= 5; daysAfter++) {
        const startDate = subDays(holidayDate, daysBefore);
        const endDate = addDays(holidayDate, daysAfter);

        // 제외된 달에 걸치면 스킵
        if (rangeOverlapsExcludedMonths(startDate, endDate, excludedMonths)) {
          continue;
        }

        const bridge = analyzeBridge(startDate, endDate, holidays);

        // 효율이 1.5 미만이면 제외
        if (bridge && bridge.efficiency >= 1.5 && bridge.requiredLeaveDays > 0 && bridge.requiredLeaveDays <= 5) {
          // 중복 체크
          const isDuplicate = bridges.some(
            b => b.startDate === bridge.startDate && b.endDate === bridge.endDate
          );
          if (!isDuplicate) {
            bridges.push(bridge);
          }
        }
      }
    }
  }

  // 연속된 공휴일 블록도 찾기 (설날, 추석 등)
  const holidayBlocks = findConsecutiveHolidayBlocks(holidays, excludedMonths);
  for (const block of holidayBlocks) {
    // 블록 앞뒤로 주말이나 평일을 연결할 수 있는지 확인
    const blockStart = parseISO(block[0].date);
    const blockEnd = parseISO(block[block.length - 1].date);

    // 앞뒤로 최대 5일씩 확장
    for (let daysBefore = 0; daysBefore <= 5; daysBefore++) {
      for (let daysAfter = 0; daysAfter <= 5; daysAfter++) {
        if (daysBefore === 0 && daysAfter === 0) continue;

        const startDate = subDays(blockStart, daysBefore);
        const endDate = addDays(blockEnd, daysAfter);

        if (rangeOverlapsExcludedMonths(startDate, endDate, excludedMonths)) {
          continue;
        }

        const bridge = analyzeBridge(startDate, endDate, holidays);

        if (bridge && bridge.efficiency >= 1.5 && bridge.requiredLeaveDays > 0 && bridge.requiredLeaveDays <= 5) {
          const isDuplicate = bridges.some(
            b => b.startDate === bridge.startDate && b.endDate === bridge.endDate
          );
          if (!isDuplicate) {
            bridges.push(bridge);
          }
        }
      }
    }
  }

  // 효율 순으로 정렬
  return bridges.sort((a, b) => b.efficiency - a.efficiency);
}

/**
 * 연속된 공휴일 블록 찾기
 */
function findConsecutiveHolidayBlocks(
  holidays: Holiday[],
  excludedMonths: number[]
): Holiday[][] {
  const blocks: Holiday[][] = [];
  const sortedHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));

  let currentBlock: Holiday[] = [];

  for (const holiday of sortedHolidays) {
    const holidayDate = parseISO(holiday.date);

    if (isInExcludedMonth(holidayDate, excludedMonths)) {
      if (currentBlock.length > 1) {
        blocks.push([...currentBlock]);
      }
      currentBlock = [];
      continue;
    }

    if (currentBlock.length === 0) {
      currentBlock.push(holiday);
    } else {
      const lastDate = parseISO(currentBlock[currentBlock.length - 1].date);
      const daysDiff = differenceInDays(holidayDate, lastDate);

      // 3일 이내면 같은 블록으로 간주 (주말 포함)
      if (daysDiff <= 3) {
        currentBlock.push(holiday);
      } else {
        if (currentBlock.length > 1) {
          blocks.push([...currentBlock]);
        }
        currentBlock = [holiday];
      }
    }
  }

  if (currentBlock.length > 1) {
    blocks.push(currentBlock);
  }

  return blocks;
}

/**
 * 특정 날짜 범위를 브릿지로 분석
 */
function analyzeBridge(
  startDate: Date,
  endDate: Date,
  holidays: Holiday[]
): Bridge | null {
  // 주말로 시작하거나 끝나도록 조정
  let adjustedStart = new Date(startDate);
  let adjustedEnd = new Date(endDate);

  // 시작일이 주말이 아니면 이전 주말을 찾음
  while (!isWeekend(adjustedStart) && !isNonWorkingDay(adjustedStart, holidays)) {
    adjustedStart = subDays(adjustedStart, 1);
    if (differenceInDays(startDate, adjustedStart) > 5) {
      adjustedStart = new Date(startDate);
      break;
    }
  }

  // 종료일이 주말이 아니면 다음 주말을 찾음
  while (!isWeekend(adjustedEnd) && !isNonWorkingDay(adjustedEnd, holidays)) {
    adjustedEnd = addDays(adjustedEnd, 1);
    if (differenceInDays(adjustedEnd, endDate) > 5) {
      adjustedEnd = new Date(endDate);
      break;
    }
  }

  const totalDays = differenceInDays(adjustedEnd, adjustedStart) + 1;

  if (totalDays < 2) return null;

  const dateRange = getDateRange(adjustedStart, adjustedEnd);

  // 연차가 필요한 날 찾기
  const leaveDates: Date[] = [];
  const includedHolidays: Holiday[] = [];

  for (const date of dateRange) {
    if (isWeekend(date)) {
      continue;
    }

    const holiday = findHoliday(date, holidays);
    if (holiday) {
      includedHolidays.push(holiday);
    } else {
      leaveDates.push(date);
    }
  }

  const requiredLeaveDays = leaveDates.length;
  const totalVacationDays = totalDays;
  const efficiency = requiredLeaveDays > 0 ? totalVacationDays / requiredLeaveDays : 0;

  if (requiredLeaveDays === 0) return null;

  return {
    startDate: format(adjustedStart, 'yyyy-MM-dd'),
    endDate: format(adjustedEnd, 'yyyy-MM-dd'),
    requiredLeaveDays,
    totalVacationDays,
    efficiency,
    leaveDates: leaveDates.map(d => format(d, 'yyyy-MM-dd')),
    includedHolidays,
  };
}

/**
 * 3가지 플랜 생성
 */
export function generateThreePlans(
  bridges: Bridge[],
  annualLeave: number
): VacationPlan[] {
  const plans: VacationPlan[] = [];

  // 플랜 A: 장기 집중형 (한 번에 긴 휴가)
  const planA = createLongVacationPlan(bridges, annualLeave);
  if (planA) plans.push(planA);

  // 플랜 B: 균형형 (중간 길이 여러 번)
  const planB = createBalancedPlan(bridges, annualLeave);
  if (planB) plans.push(planB);

  // 플랜 C: 분산형 (짧게 자주)
  const planC = createFrequentPlan(bridges, annualLeave);
  if (planC) plans.push(planC);

  return plans;
}

/**
 * 플랜 A: 장기 집중형
 */
function createLongVacationPlan(bridges: Bridge[], annualLeave: number): VacationPlan | null {
  const selectedBridges: Bridge[] = [];
  let usedLeave = 0;

  // 가장 긴 휴가 우선 (총 휴가일수가 긴 것)
  const sorted = [...bridges].sort((a, b) => b.totalVacationDays - a.totalVacationDays);

  for (const bridge of sorted) {
    if (usedLeave + bridge.requiredLeaveDays <= annualLeave) {
      // 날짜 겹침 체크
      if (!hasOverlap(selectedBridges, bridge)) {
        selectedBridges.push(bridge);
        usedLeave += bridge.requiredLeaveDays;
      }
    }

    // 1-2개만 선택
    if (selectedBridges.length >= 2) break;
  }

  if (selectedBridges.length === 0) return null;

  return {
    id: 'plan-a',
    name: '플랜 A: 장기 집중형',
    description: '한 번에 길게 쉬는 플랜. 해외여행이나 장기 휴식에 최적',
    bridges: selectedBridges,
    totalLeaveDaysUsed: usedLeave,
    totalVacationDays: selectedBridges.reduce((sum, b) => sum + b.totalVacationDays, 0),
    averageEfficiency: selectedBridges.reduce((sum, b) => sum + b.efficiency, 0) / selectedBridges.length,
  };
}

/**
 * 플랜 B: 균형형
 */
function createBalancedPlan(bridges: Bridge[], annualLeave: number): VacationPlan | null {
  const selectedBridges: Bridge[] = [];
  let usedLeave = 0;

  // 효율이 좋은 것 우선, 중간 길이 (4-6일)
  const sorted = [...bridges]
    .filter(b => b.totalVacationDays >= 4 && b.totalVacationDays <= 7)
    .sort((a, b) => b.efficiency - a.efficiency);

  for (const bridge of sorted) {
    if (usedLeave + bridge.requiredLeaveDays <= annualLeave) {
      if (!hasOverlap(selectedBridges, bridge)) {
        selectedBridges.push(bridge);
        usedLeave += bridge.requiredLeaveDays;
      }
    }

    // 3-4개 정도 선택
    if (selectedBridges.length >= 4) break;
  }

  // 충분히 선택되지 않았으면 다른 브릿지도 추가
  if (selectedBridges.length < 2) {
    const remaining = bridges.filter(b => !selectedBridges.includes(b));
    for (const bridge of remaining) {
      if (usedLeave + bridge.requiredLeaveDays <= annualLeave) {
        if (!hasOverlap(selectedBridges, bridge)) {
          selectedBridges.push(bridge);
          usedLeave += bridge.requiredLeaveDays;
        }
      }
      if (selectedBridges.length >= 3) break;
    }
  }

  if (selectedBridges.length === 0) return null;

  return {
    id: 'plan-b',
    name: '플랜 B: 균형형',
    description: '적당한 길이로 여러 번. 국내 여행과 휴식의 균형',
    bridges: selectedBridges,
    totalLeaveDaysUsed: usedLeave,
    totalVacationDays: selectedBridges.reduce((sum, b) => sum + b.totalVacationDays, 0),
    averageEfficiency: selectedBridges.reduce((sum, b) => sum + b.efficiency, 0) / selectedBridges.length,
  };
}

/**
 * 플랜 C: 분산형
 */
function createFrequentPlan(bridges: Bridge[], annualLeave: number): VacationPlan | null {
  const selectedBridges: Bridge[] = [];
  let usedLeave = 0;

  // 효율이 가장 좋은 것들을 많이 선택 (짧은 것도 포함)
  const sorted = [...bridges].sort((a, b) => b.efficiency - a.efficiency);

  for (const bridge of sorted) {
    if (usedLeave + bridge.requiredLeaveDays <= annualLeave) {
      if (!hasOverlap(selectedBridges, bridge)) {
        selectedBridges.push(bridge);
        usedLeave += bridge.requiredLeaveDays;
      }
    }

    // 많이 선택
    if (selectedBridges.length >= 6 || usedLeave >= annualLeave * 0.8) break;
  }

  if (selectedBridges.length === 0) return null;

  return {
    id: 'plan-c',
    name: '플랜 C: 분산형',
    description: '짧게 자주 쉬는 플랜. 워라밸 중시, 리프레시에 최적',
    bridges: selectedBridges,
    totalLeaveDaysUsed: usedLeave,
    totalVacationDays: selectedBridges.reduce((sum, b) => sum + b.totalVacationDays, 0),
    averageEfficiency: selectedBridges.reduce((sum, b) => sum + b.efficiency, 0) / selectedBridges.length,
  };
}

/**
 * 브릿지 간 날짜 겹침 체크
 */
function hasOverlap(existingBridges: Bridge[], newBridge: Bridge): boolean {
  const newStart = parseISO(newBridge.startDate);
  const newEnd = parseISO(newBridge.endDate);

  for (const bridge of existingBridges) {
    const existingStart = parseISO(bridge.startDate);
    const existingEnd = parseISO(bridge.endDate);

    // 겹침 확인
    if (
      (newStart >= existingStart && newStart <= existingEnd) ||
      (newEnd >= existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * 메인 계산 함수
 */
export function calculateOptimalPlans(
  holidays: Holiday[],
  annualLeave: number,
  companyHolidays: string[],
  excludedMonths: number[]
): VacationPlan[] {
  // 회사 휴무일 추가
  const allHolidays: Holiday[] = [
    ...holidays,
    ...companyHolidays.map(date => ({
      date,
      name: '회사 휴무',
      type: 'company' as const,
    })),
  ];

  // 브릿지 찾기
  const bridges = findBridgeHolidays(allHolidays, excludedMonths);

  if (bridges.length === 0) {
    return [];
  }

  // 3가지 플랜 생성
  const plans = generateThreePlans(bridges, annualLeave);

  return plans;
}
