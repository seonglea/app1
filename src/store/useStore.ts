import { create } from 'zustand';
import { AppState, VacationPlan } from '../types';
import { calculateOptimalPlans } from '../utils/algorithm';
import { holidays2026 } from '../utils/holidayData';

// 로컬 스토리지 키
const STORAGE_KEY = 'vacationPlanner2026';

// 로컬 스토리지에서 불러오기
function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
}

// 로컬 스토리지에 저장
function saveToLocalStorage(state: Partial<AppState>) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        annualLeave: state.annualLeave,
        companyHolidays: state.companyHolidays,
        excludedMonths: state.excludedMonths,
      })
    );
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// 초기 상태
const savedState = loadFromLocalStorage();

export const useStore = create<AppState>((set, get) => ({
  // 입력 데이터
  annualLeave: savedState?.annualLeave ?? 15,
  companyHolidays: savedState?.companyHolidays ?? [],
  excludedMonths: savedState?.excludedMonths ?? [],

  // 계산 결과
  plans: [],
  selectedPlan: null,

  // 액션
  setAnnualLeave: (count: number) => {
    set({ annualLeave: count });
    saveToLocalStorage(get());
  },

  setCompanyHolidays: (dates: string[]) => {
    set({ companyHolidays: dates });
    saveToLocalStorage(get());
  },

  setExcludedMonths: (months: number[]) => {
    set({ excludedMonths: months });
    saveToLocalStorage(get());
  },

  calculatePlans: () => {
    const { annualLeave, companyHolidays, excludedMonths } = get();

    // 유효성 검사
    if (annualLeave < 1) {
      set({ plans: [] });
      return;
    }

    if (excludedMonths.length === 12) {
      set({ plans: [] });
      return;
    }

    // 알고리즘 실행
    const calculatedPlans = calculateOptimalPlans(
      holidays2026,
      annualLeave,
      companyHolidays,
      excludedMonths
    );

    set({ plans: calculatedPlans, selectedPlan: null });
  },

  selectPlan: (plan: VacationPlan | null) => {
    set({ selectedPlan: plan });
  },

  reset: () => {
    set({
      annualLeave: 15,
      companyHolidays: [],
      excludedMonths: [],
      plans: [],
      selectedPlan: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  },
}));
