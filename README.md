# 2026 신년 휴가 플래너 🎯

연차를 똑똑하게 사용하여 최대한 긴 휴가를 계획할 수 있도록 도와주는 웹 애플리케이션입니다.

## 주요 기능

- **연차 입력**: 보유한 연차 개수를 입력하세요
- **바쁜 달 제외**: 특정 달을 휴가 추천에서 제외할 수 있습니다
- **3가지 플랜 추천**:
  - 플랜 A: 장기 집중형 (한 번에 길게)
  - 플랜 B: 균형형 (적당한 길이로 여러 번)
  - 플랜 C: 분산형 (짧게 자주)
- **상세 보기**: 연간 달력으로 휴가 일정 확인
- **이미지 저장**: 계획을 이미지로 저장
- **URL 공유**: 링크로 공유

## 기술 스택

- **React 18** with TypeScript
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Zustand** - 상태 관리
- **date-fns** - 날짜 처리
- **html2canvas** - 이미지 생성

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── components/
│   ├── InputSection/
│   │   ├── AnnualLeaveInput.tsx
│   │   ├── BusyMonthSelector.tsx
│   │   └── InputSection.tsx
│   ├── ResultSection/
│   │   ├── PlanCard.tsx
│   │   └── ResultSection.tsx
│   ├── DetailModal.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── store/
│   └── useStore.ts
├── types/
│   └── index.ts
├── utils/
│   ├── algorithm.ts
│   ├── dateUtils.ts
│   └── holidayData.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 알고리즘

### 핵심 로직

1. **징검다리 연휴 찾기**: 공휴일을 기준으로 주말과 연결할 수 있는 구간 탐색
2. **효율 계산**: 총 휴가일수 / 필요 연차 개수
3. **제외 월 필터링**: 사용자가 선택한 달은 완전히 제외
4. **3가지 플랜 생성**:
   - 장기 집중형: 총 휴가일수가 긴 것 우선
   - 균형형: 중간 길이 (4-6일) 여러 번
   - 분산형: 효율 좋은 것 많이 선택

## 2026년 공휴일

- 1/1 신정
- 1/24-26 설날 연휴
- 3/1 삼일절
- 5/5 어린이날
- 5/24 부처님오신날
- 6/6 현충일
- 8/15 광복절
- 9/26-28 추석 연휴
- 10/3 개천절
- 10/9 한글날
- 12/25 크리스마스

## 배포

Vercel, Netlify 등의 플랫폼에 배포할 수 있습니다.

```bash
npm run build
```

`dist` 폴더의 내용을 배포하세요.

## 라이선스

MIT

## 만든이

Made with ❤️ for Korean Workers
