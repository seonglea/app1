import React, { useRef } from 'react';
import { VacationPlan } from '../types';
import { parseISO, format, eachDayOfInterval, isWeekend, endOfMonth } from 'date-fns';
import html2canvas from 'html2canvas';
import { holidays2026 } from '../utils/holidayData';
import { isHoliday } from '../utils/dateUtils';

interface DetailModalProps {
  plan: VacationPlan;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ plan, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSaveImage = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current);
      const link = document.createElement('a');
      link.download = `2026-휴가-계획-${plan.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  const handleCopyURL = () => {
    const params = new URLSearchParams({
      plan: plan.id,
    });
    const url = `${window.location.origin}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    alert('링크가 복사되었습니다!');
  };

  // 각 브릿지의 연차 사용일을 Set으로 변환
  const leaveDatesSet = new Set(
    plan.bridges.flatMap(b => b.leaveDates)
  );

  // 연간 달력 렌더링
  const renderYearCalendar = () => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(2026, month, 1);
      const monthEnd = endOfMonth(monthStart);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

      months.push(
        <div key={month} className="bg-white p-3 rounded-lg border">
          <h4 className="font-bold text-center mb-2 text-gray-800">
            {month + 1}월
          </h4>
          <div className="grid grid-cols-7 gap-1">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} className="text-xs text-center text-gray-500 font-semibold">
                {day}
              </div>
            ))}
            {/* 빈 칸 추가 (월의 시작 요일 맞추기) */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isLeave = leaveDatesSet.has(dateStr);
              const isHol = isHoliday(day, holidays2026);
              const isWknd = isWeekend(day);

              let bgColor = 'bg-white';
              let textColor = 'text-gray-800';

              if (isLeave) {
                bgColor = 'bg-leave';
                textColor = 'text-white';
              } else if (isHol) {
                bgColor = 'bg-holiday';
                textColor = 'text-white';
              } else if (isWknd) {
                bgColor = 'bg-weekend';
                textColor = 'text-white';
              }

              return (
                <div
                  key={dateStr}
                  className={`text-xs text-center p-1 rounded ${bgColor} ${textColor}`}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return months;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-50 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div ref={contentRef} className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{plan.name}</h2>
              <p className="text-gray-600 mt-1">{plan.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {plan.totalLeaveDaysUsed}
              </div>
              <div className="text-sm text-gray-500 mt-1">연차 사용</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {plan.totalVacationDays}
              </div>
              <div className="text-sm text-gray-500 mt-1">총 휴가일</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {plan.averageEfficiency.toFixed(1)}
              </div>
              <div className="text-sm text-gray-500 mt-1">평균 효율</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 text-gray-800">색상 범례</h3>
            <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-holiday rounded"></div>
                <span className="text-sm">공휴일</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-leave rounded"></div>
                <span className="text-sm">연차 사용일</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-weekend rounded"></div>
                <span className="text-sm">주말</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                <span className="text-sm">평일</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 text-gray-800">2026년 연간 달력</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {renderYearCalendar()}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              상세 일정 ({plan.bridges.length}개)
            </h3>
            <div className="space-y-3">
              {plan.bridges.map((bridge, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="font-bold text-lg text-gray-900">
                    #{idx + 1} {format(parseISO(bridge.startDate), 'M월 d일')} ~{' '}
                    {format(parseISO(bridge.endDate), 'M월 d일')}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">총 휴가:</span>{' '}
                      <span className="font-semibold">{bridge.totalVacationDays}일</span>
                    </div>
                    <div>
                      <span className="text-gray-600">연차 사용:</span>{' '}
                      <span className="font-semibold">{bridge.requiredLeaveDays}개</span>
                    </div>
                    <div>
                      <span className="text-gray-600">효율:</span>{' '}
                      <span className="font-semibold">{bridge.efficiency.toFixed(1)}</span>
                    </div>
                    {bridge.includedHolidays.length > 0 && (
                      <div>
                        <span className="text-gray-600">공휴일:</span>{' '}
                        <span className="font-semibold">
                          {bridge.includedHolidays.map(h => h.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">연차 사용일:</span>{' '}
                    <span className="font-semibold">
                      {bridge.leaveDates.map(d => format(parseISO(d), 'M/d')).join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-6 bg-white border-t">
          <button
            onClick={handleSaveImage}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            이미지로 저장
          </button>
          <button
            onClick={handleCopyURL}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            URL 복사
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
