# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

한 교회 소그룹의 멤버들(약 20명, 명단은 `constants/member.ts`)이 쓴다. 공개 서비스가 아니라 이 공동체 전용이다. 나이대가 섞여 있어 어르신부터 청년까지 함께 쓴다. 멤버들은 매일 휴대폰으로 그날 분량을 읽거나 듣고, 읽음을 기록하고, 묵상과 기도를 남긴다.

관리자(별도 로그인)는 연간 읽기 일정을 관리하고 멤버들의 진행 현황을 본다.

## Product Purpose

함온성(함께하는 온라인 성경일독)은 공동체가 1년 동안 성경을 함께 일독하도록 돕는다. 성공의 기준은 서로의 진도를 보며 격려하고, 공동체가 함께 끝까지 일독을 마치는 것이다. 개인의 습관이나 기록 기능도 이 목표에 기여해야 한다.

## Positioning

일반 성경 앱이 아니라 우리 소그룹 한 곳의 일정과 명단, 진행 현황에 맞춰진 도구다. 모두가 같은 날 같은 분량을 읽고 서로의 읽기 현황이 보인다는 점이 핵심이다.

## Operating Context

- 주로 휴대폰 브라우저에서 매일 접속한다. 배포 주소: https://bible-reading-nu.vercel.app/
- 로그인은 비밀번호 없이 이름만 입력한다. 이름은 브라우저에 저장된다.
- 읽기 기록, 묵상, 기도는 Google Sheet(함온성DB)에 쌓이고 읽기 현황 화면(`/readingStatus`)이 그것을 읽는다.
- 일정은 MongoDB에 있고 관리자 화면(`/admin`)에서 관리한다.

## Capabilities and Constraints

- 달력에 날짜별 읽기 일정과 본인 진행 상황을 표시한다.
- 오늘 분량의 본문을 보여주고 TTS로 들려준다. 유튜브 영상과 요약 이미지도 함께 보여준다.
- 글자 크기를 단계별로 조절할 수 있다(`stores/font.ts`).
- 말씀을 눌러 담아두고 모아볼 수 있다(내 말씀).
- 기도일기(묵상·기도)를 작성할 수 있다.
- 멤버별 읽음 현황(O/X)을 보여준다.
- 관리자 기능: 로그인, 일정 관리, 현황 대시보드.
- 스택: Next.js 15 App Router, React 19, Tailwind 3, Headless UI, Zustand, TanStack Query, Mongoose. Vercel에 배포한다.

## Brand Commitments

- 이름: 함온성(함 온 성). 부제는 "함께하는 온라인 성경일독"이다.
- 로고: `public/mainlogo.png` (OG 이미지로도 쓴다).

## Evidence on Hand

- 실제 화면 스크린샷: `doc/screenshot-hamon.png`
- 실제 멤버 명단과 읽기 계획: `constants/member.ts`, `constants/readingPlanByWeek.ts`
- 사용자 후기, 통계, 외부 홍보 자료는 없다. 이런 내용을 지어내지 않는다.

## Product Principles

1. 함께 읽기가 먼저다. 혼자만 보는 기능보다 서로의 진도와 격려가 드러나는 쪽을 고른다.
2. 매일 오는 이유는 오늘의 분량이다. 첫 화면에서 오늘 읽을 것과 읽음 기록까지 가는 길이 가장 짧아야 한다.
3. 가장 약한 사용자에게 맞춘다. 어르신도 설명 없이 읽고, 듣고, 기록할 수 있어야 한다.
4. 가볍게 들어온다. 이름만 입력하면 되는 지금의 진입 장벽을 높이지 않는다.

## Accessibility & Inclusion

나이대가 섞여 있으므로 가장 약한 사용자 기준으로 만든다. 글자 크기 조절과 듣기(TTS)는 핵심 기능이므로 유지한다. 누르는 영역은 크게, 대비는 충분하게, 조작은 단순하게 한다.
