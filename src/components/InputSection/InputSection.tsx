import React from 'react';
import { AnnualLeaveInput } from './AnnualLeaveInput';
import { BusyMonthSelector } from './BusyMonthSelector';
import { useStore } from '../../store/useStore';

export const InputSection: React.FC = () => {
  const {
    annualLeave,
    excludedMonths,
    setAnnualLeave,
    setExcludedMonths,
    calculatePlans,
  } = useStore();

  const [errors, setErrors] = React.useState<string[]>([]);

  const handleSubmit = () => {
    const validationErrors: string[] = [];

    if (annualLeave < 1) {
      validationErrors.push('연차는 최소 1개 이상이어야 합니다.');
    }
    if (annualLeave > 50) {
      validationErrors.push('연차가 너무 많습니다. 확인해주세요.');
    }
    if (excludedMonths.length === 12) {
      validationErrors.push('모든 달을 제외할 수 없습니다.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    calculatePlans();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnnualLeaveInput value={annualLeave} onChange={setAnnualLeave} />

      <BusyMonthSelector
        selectedMonths={excludedMonths}
        onChange={setExcludedMonths}
      />

      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="font-semibold text-red-800 mb-2">입력 오류:</div>
          <ul className="list-disc list-inside text-red-700">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 text-lg"
      >
        최적 조합 보기
      </button>
    </div>
  );
};
