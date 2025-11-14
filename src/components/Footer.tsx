import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 mt-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-4">
          <p className="text-sm text-gray-300">
            2026 신년 휴가 플래너 - 연차 최적화의 시작
          </p>
        </div>
        <div className="text-xs text-gray-400">
          <p>이 서비스는 2026년 대한민국 공휴일을 기준으로 합니다.</p>
          <p className="mt-1">
            실제 휴가 사용 시 회사 규정을 확인해주세요.
          </p>
        </div>
        <div className="mt-6 text-xs text-gray-500">
          Made with ❤️ for Korean Workers | v1.0.0
        </div>
      </div>
    </footer>
  );
};
