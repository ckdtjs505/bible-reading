# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

함온성(함께읽는 온라인 성경일독)은 교회 공동체가 같은 일정으로 성경을 함께 읽는 사이트다. Next.js 15(App Router, React 19)로 만들었고 Vercel에 배포한다. 제품 맥락, 사용자, 원칙은 `PRODUCT.md`에 있다.

## 명령어

- `npm run dev`: 개발 서버(Turbopack)
- `npm run build`: 프로덕션 빌드. 타입 검사도 이걸로 한다.
- `npm run lint`: `next lint`

테스트는 없다. `package-lock.json`과 `pnpm-lock.yaml`이 둘 다 커밋돼 있다.

`.env.local`에 `MONGODB_URI`가 있어야 한다.

## 구조

데이터 저장소가 두 곳이고, 기능마다 둘 중 하나를 쓴다.

1. **MongoDB(mongoose)**: 읽기 일정과 관리자 계정
   - `lib/db.ts`가 연결을 `global.mongoose`에 캐시한다. 모든 API 라우트는 먼저 `dbConnect()`를 부른다.
   - 모델은 `models/`(`Schedule`, `Admin`)에 있다. Schedule 필드는 `daycount`, `index`, `year`까지 전부 문자열이다.
   - `date`는 0을 채우지 않은 형식(`2026-1-5`)이다. `lib/server-utils.ts`의 `getCurrentDaycount`가 "오늘"을 한국 시간(UTC+9) 기준으로 구한다.
   - `scripts/migrate-to-db.ts`가 연도별 일정 JSON(`data/<year>.json`)을 MongoDB에 넣는다. 이 JSON은 `convert_plan.js`가 `constants/plan.ts`로 만든다.
2. **Google Sheets**: 사람별 읽기 진행, 말씀("내 말씀"), 기도
   - 쓰기: `lib/google-api.ts`의 `setReadBible`이 클라이언트(`components/PrayerJournal.tsx`)에서 Google Apps Script 웹앱으로 바로 POST한다. `no-cors`라서 응답을 읽을 수 없다.
   - 읽기: `lib/server-utils.ts`의 `getHamonDB`가 `opensheet.elk.sh`에서 시트 전체를 JSON으로 가져온다. `/api/mywords`는 그중 이름으로 거른다.
   - 행은 저장한 순서대로 쌓인다. `daycnt`는 일정마다 1부터 다시 시작하므로 정렬은 `daycnt`가 아니라 행 순서로 한다.
   - 사용자 인증은 없다. 멤버는 입력한 이름으로만 구분하고, 이름은 `stores/userInfo.ts`에 저장된다.

### 그 밖의 코드

- **성경 본문**은 `constants/`에 큰 정적 배열로 들어 있다(번역본 3개: `bible.ts`(우리말), `newHangulBible.ts`, `newBible.ts`). 서버 액션 `app/actions/bible.ts`(`getDailyVerse`)가 책 번호와 장 범위로 골라낸다. 이 상수를 클라이언트 컴포넌트에서 import하지 않는다.
- **클라이언트 상태**:
  - 서버 데이터는 TanStack Query(`components/QueryProvider.tsx`, `hooks/useSchedules.ts` → `/api/schedule?year=`)로 가져온다.
  - UI와 사용자 상태는 `stores/`의 Zustand 스토어에 둔다.
  - persist 스토어는 SSR 불일치를 피하려고 `stores/useStore.ts` 헬퍼나 `_hasHydrated` 플래그를 쓴다.
- **홈 화면**(`app/page.tsx`)은 클라이언트 페이지 하나로, 달력·영상·요약 이미지·본문·기도 일지·다이얼로그를 이어 붙인다.
- **관리자**(`/admin`, 일정 편집):
  - `middleware.ts`는 `admin_session` 쿠키가 있는지만 본다.
  - `/api/admin/login`이 `Admin` 컬렉션과 bcrypt로 비교한 뒤 그 쿠키를 심는다.
  - `/api/admin/*` 라우트는 미들웨어 matcher(`/admin/:path*`)에 걸리지 않고, `/api/admin/schedule`은 쿠키를 직접 확인하지도 않는다.

UI 문구와 코드 주석은 한국어로 쓴다.
