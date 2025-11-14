import React from 'react';
import { useStore } from '../../store/useStore';
import { PlanCard } from './PlanCard';

export const ResultSection: React.FC = () => {
  const { plans, excludedMonths, selectPlan } = useStore();

  if (plans.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
        추천 휴가 플랜
      </h2>
      <p className="text-center text-gray-600 mb-8">
        당신에게 최적화된 3가지 휴가 조합을 확인해보세요
      </p>

      {plans.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            😢 추천 가능한 휴가 조합을 찾을 수 없습니다
          </h3>
          <p className="text-gray-600 mb-4">
            {excludedMonths.length > 0
              ? `제외된 달(${excludedMonths.length}개)이 너무 많거나, 연차가 부족합니다.`
              : '연차 개수를 확인해주세요.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={() => selectPlan(plan)} />
          ))}
        </div>
      )}
    </div>
  );
};
