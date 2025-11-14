import React from 'react';

interface BusyMonthSelectorProps {
  selectedMonths: number[];
  onChange: (months: number[]) => void;
}

export const BusyMonthSelector: React.FC<BusyMonthSelectorProps> = ({
  selectedMonths,
  onChange,
}) => {
  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ];

  const handleToggle = (monthNumber: number) => {
    const isSelected = selectedMonths.includes(monthNumber);
    if (isSelected) {
      onChange(selectedMonths.filter(m => m !== monthNumber));
    } else {
      onChange([...selectedMonths, monthNumber]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">🚨</span>
        휴가 피해야 할 달
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        바쁜 시즌을 선택하면 해당 월은 추천에서 제외됩니다
      </p>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {months.map((month, index) => {
          const monthNumber = index + 1;
          const isSelected = selectedMonths.includes(monthNumber);

          return (
            <label
              key={monthNumber}
              className={`
                flex items-center justify-center
                p-3 rounded-lg border-2 cursor-pointer
                transition-all duration-200
                ${
                  isSelected
                    ? 'border-red-500 bg-red-50 text-red-700 font-semibold'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(monthNumber)}
                className="mr-2"
              />
              <span>{month}</span>
            </label>
          );
        })}
      </div>

      {selectedMonths.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
          <span className="font-semibold">⚠️ {selectedMonths.length}개월 제외됨.</span>{' '}
          추천 휴가일이 줄어들 수 있습니다.
        </div>
      )}

      {selectedMonths.length === 12 && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
          <span className="font-semibold">❌ 모든 달을 제외할 수 없습니다.</span>
        </div>
      )}
    </div>
  );
};
