import React from 'react';
import { VacationPlan } from '../../types';
import { parseISO, format } from 'date-fns';

interface PlanCardProps {
  plan: VacationPlan;
  onSelect: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-200">
      <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
      <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{plan.totalLeaveDaysUsed}</div>
          <div className="text-xs text-gray-500 mt-1">연차 사용</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{plan.totalVacationDays}</div>
          <div className="text-xs text-gray-500 mt-1">총 휴가일</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">
            {plan.averageEfficiency.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">평균 효율</div>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">
          휴가 일정 ({plan.bridges.length}개)
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {plan.bridges.map((bridge, idx) => (
            <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
              <div className="font-semibold text-gray-800">
                {format(parseISO(bridge.startDate), 'M/d')} ~{' '}
                {format(parseISO(bridge.endDate), 'M/d')}
                <span className="ml-2 text-blue-600">
                  ({bridge.totalVacationDays}일)
                </span>
              </div>
              <div className="text-gray-600">
                연차 {bridge.requiredLeaveDays}개 사용 · 효율 {bridge.efficiency.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSelect}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        자세히 보기
      </button>
    </div>
  );
};
