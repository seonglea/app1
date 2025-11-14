export interface Holiday {
  date: string; // YYYY-MM-DD format
  name: string;
  type: 'public' | 'company';
}

export interface Bridge {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  requiredLeaveDays: number; // 필요한 연차 개수
  totalVacationDays: number; // 총 휴가 일수
  efficiency: number; // totalVacationDays / requiredLeaveDays
  leaveDates: string[]; // 연차 써야 하는 날짜들
  includedHolidays: Holiday[]; // 포함된 공휴일
}

export interface VacationPlan {
  id: string;
  name: string;
  description: string;
  bridges: Bridge[];
  totalLeaveDaysUsed: number;
  totalVacationDays: number;
  averageEfficiency: number;
}

export interface AppState {
  // 입력 데이터
  annualLeave: number;
  companyHolidays: string[];
  excludedMonths: number[]; // 1-12

  // 계산 결과
  plans: VacationPlan[];
  selectedPlan: VacationPlan | null;

  // 액션
  setAnnualLeave: (count: number) => void;
  setCompanyHolidays: (dates: string[]) => void;
  setExcludedMonths: (months: number[]) => void;
  calculatePlans: () => void;
  selectPlan: (plan: VacationPlan | null) => void;
  reset: () => void;
}
