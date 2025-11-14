import React from 'react';

interface AnnualLeaveInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const AnnualLeaveInput: React.FC<AnnualLeaveInputProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value) || 0;
    if (num >= 0 && num <= 50) {
      onChange(num);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <label htmlFor="annual-leave" className="block text-lg font-semibold mb-3 text-gray-800">
        올해 연차 개수
      </label>
      <div className="flex items-center gap-4">
        <input
          id="annual-leave"
          type="number"
          min="1"
          max="50"
          value={value}
          onChange={handleChange}
          className="flex-1 px-4 py-3 text-2xl font-bold border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
        <span className="text-xl font-medium text-gray-600">개</span>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        보유한 연차 개수를 입력하세요 (1-50)
      </p>
    </div>
  );
};
