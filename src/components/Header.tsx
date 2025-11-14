import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3">
          <span className="text-5xl">🎯</span>
          신년 휴가 플래너 2026
        </h1>
        <p className="text-xl md:text-2xl font-medium opacity-90">
          연차를 똑똑하게, 휴가를 길게!
        </p>
        <p className="mt-4 text-sm md:text-base opacity-80">
          2026년 공휴일을 활용한 최적의 휴가 조합을 찾아드립니다
        </p>
      </div>
    </header>
  );
};
