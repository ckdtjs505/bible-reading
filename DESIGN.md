---
name: 함온성
description: 함께하는 온라인 성경일독. 공동체가 같은 날 같은 분량을 함께 읽는 달력.
colors:
  ink: "#171717"
  paper: "#ffffff"
  action-blue: "#3b82f6"
  action-blue-tint: "#eff6ff"
  action-blue-ink: "#2563eb"
  hover-slate: "#4b5563"
  selected-day: "#006edc"
  selected-day-hover: "#1087ff"
  weekday-teal: "#71c9ce"
  today-yellow: "#ffff76"
  today-yellow-hover: "#ffffa9"
  read-mint: "#cbf1f5"
  verse-mark: "#ffff00"
  sunday-red: "#d10000"
  muted-text: "#6b7280"
  quiet-surface: "#f3f4f6"
  hairline: "#d1d5db"
typography:
  display:
    fontFamily: "Hahmlet, serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Hahmlet, serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Hahmlet, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Hahmlet, serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
  calendar-note:
    fontFamily: "Hahmlet, serif"
    fontSize: "0.5rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  md: "6px"
  tile: "12.8px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-primary-hover:
    backgroundColor: "{colors.hover-slate}"
  button-icon:
    backgroundColor: "{colors.action-blue-tint}"
    textColor: "{colors.action-blue-ink}"
    rounded: "{rounded.full}"
    padding: "12px"
  button-scroll-top:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
    size: "48px"
  calendar-tile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "10px 6.67px"
  calendar-tile-today:
    backgroundColor: "{colors.today-yellow}"
  calendar-tile-read:
    backgroundColor: "{colors.read-mint}"
  calendar-tile-selected:
    backgroundColor: "{colors.selected-day}"
    textColor: "{colors.paper}"
---

# Design System: 함온성

이 문서는 멤버 화면(홈, 읽기 현황) 기준이다. 관리자 화면(`/admin`)은 Tailwind 회색 계열로 만든 별도 업무 화면이고, 이 시스템을 따르지 않아도 된다.

## Overview

**Creative North Star: "함께 펴는 성경 달력"**

화면의 중심은 달력이다. 멤버는 매일 같은 달력을 펴고, 오늘 칸(노랑)과 내가 읽은 칸(민트)을 확인한 뒤, 바로 아래에서 그날 본문을 읽거나 듣는다. 모든 요소는 "오늘 분량을 읽고 기록한다"는 하루의 흐름을 위에서 아래로 한 줄로 따라간다.

흰 바탕에 Hahmlet 세리프 한 가지로 쓰고, 색은 달력의 상태를 알리는 데 주로 쓴다. 장식은 거의 없고, 크고 단순한 조작을 우선한다. 어르신도 설명 없이 쓸 수 있어야 하므로 화려함보다 알아보기 쉬움을 고른다.

**Key Characteristics:**
- 한 열로 쌓이는 모바일 화면. 달력 → 영상 → 요약 이미지 → 본문 → 기도일기 순서.
- 색은 상태 신호(오늘, 읽음, 선택, 주일)다.
- 본문 글자 크기는 사용자가 9단계로 바꾼다.
- 그림자와 층은 거의 없는 평평한 화면.

## Colors

흰 바탕과 거의 검은 글자 위에, 달력 상태를 알리는 밝은 신호색 몇 가지가 얹힌 팔레트다.

### Primary
- **함온성 파랑**: 주요 버튼(로그인, 저장, 맨 위로)의 바탕. 한 화면에서 "지금 누를 것"을 가리킨다.
- **연파랑 바탕 / 진파랑 글자**: 둥근 아이콘 버튼과 듣기(TTS) 버튼. 파랑을 약하게 쓴 보조 행동.

### Secondary
- **선택한 날 파랑**: 달력에서 지금 보고 있는 날. 흰 글자와 함께 쓴다.
- **요일 띠 청록**: 달력 요일 머리줄 바탕. 이 화면의 가장 큰 색 면이자 함온성의 인상색이다.

### Tertiary
- **오늘 노랑**: 달력의 오늘 칸.
- **읽음 민트**: 내가 읽기를 마친 날, 선택된 번역본 칩. 오늘을 읽었으면 노랑보다 민트가 먼저 보인다.
- **말씀 표시 노랑**: 눌러서 담아 둔 구절의 형광펜 바탕.
- **주일 빨강**: 달력의 일요일 날짜. 토요일은 파랑 글자.

### Neutral
- **먹색**: 본문과 제목 글자.
- **종이 흰색**: 페이지 바탕.
- **흐린 회색 글자**: 보조 설명, 비활성 안내.
- **조용한 회색 바탕**: 비활성 칸, hover 바탕.
- **가는 선 회색**: 글자 크기 버튼 테두리, 입력칸 테두리.

### Named Rules
**The Calendar Speaks Rule.** 노랑·민트·선택 파랑은 달력 상태 전용이다. 다른 요소의 장식이나 강조에 빌려 쓰지 않는다.

**The Read Wins Rule.** 한 칸에 오늘과 읽음이 겹치면 읽음(민트)이 보인다. 기록을 마쳤다는 신호가 "오늘"이라는 사실보다 중요하다.

## Typography

**Display Font:** Hahmlet (with serif)
**Body Font:** Hahmlet (with serif)

**Character:** 한 가족의 가변 세리프 하나로 제목부터 본문까지 쓴다. 성경 본문다운 차분함이 있고, 굵기만으로 위계를 나눈다.

### Hierarchy
- **Display**: 상단 "함 온 성" 제목. 글자 사이는 자간이 아니라 실제 띄어쓰기로 벌린다.
- **Title**: 본문의 책 이름, 빈 날 안내 같은 구역 머리.
- **Body**: 성경 본문과 기도일기. 기본값은 글자 크기 4단계(text-lg)이고, 사용자가 text-xs부터 text-5xl까지 9단계로 바꾼다.
- **Label**: 버튼과 작은 안내.
- **Calendar Note**: 달력 칸 안의 "레위기 1-5장" 같은 분량 표기. 칸이 좁아서 아주 작다.

### Named Rules
**The Reader Sets The Size Rule.** 본문 크기는 `stores/font.ts`의 단계로만 바꾼다. 본문에 고정 글자 크기를 박지 않는다. 쓰는 단계들은 Tailwind `safelist`에 들어 있어야 한다.

## Layout

휴대폰 폭 한 열이 기본이다. 구역은 위에서 아래로 쌓이고, 구역 안쪽 여백은 16px(p-4)이다. 요소 사이 간격은 8px(gap-2), 다이얼로그 같은 상자 안쪽은 24px(p-6)이다. 달력은 화면 폭을 꽉 채우고, 다이얼로그는 가운데 정렬로 최대 28rem(max-w-md)이다. 반응형 분기는 거의 없다. 넓은 화면에서도 같은 한 열 구성을 그대로 늘린다.

## Elevation & Depth

평평한 화면이다. 깊이는 색 면(요일 띠, 상태 칸)과 가는 선으로 나눈다. 그림자는 화면 위에 떠 있는 것에만 쓴다. 맨 위로 버튼과 다이얼로그가 그렇다.

### Shadow Vocabulary
- **떠 있는 버튼** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): 맨 위로 버튼 같은 고정 버튼.
- **버튼 안쪽 빛** (`box-shadow: inset 0 2px 4px 0 rgb(255 255 255 / 0.1)`): Headless UI 기본 버튼의 아주 약한 안쪽 하이라이트.

### Named Rules
**The Flat Page Rule.** 페이지에 붙어 있는 요소에는 그림자를 주지 않는다. 그림자는 위에 떠 있다는 뜻으로만 쓴다.

## Shapes

부드럽게 둥근 모서리가 기본이다. 일반 버튼은 살짝 둥글게, 달력 칸은 그보다 둥글게 둔다. 아이콘 버튼, 번역본 칩, 맨 위로 버튼은 완전한 원이나 알약 모양이다. 날카로운 직각 모서리는 쓰지 않는다.

## Components

### Buttons
크고 단순하게 누르는 버튼을 목표로 한다.
- **Shape:** 살짝 둥근 모서리.
- **Primary:** 함온성 파랑 바탕, 흰 글자, 굵은 label.
- **Hover / Focus:** 지금 코드는 hover 시 회색(hover-slate)으로 바뀐다. Headless UI의 `data-[hover]`, `data-[focus]`로 상태를 준다.
- **Icon:** 연파랑 원형 버튼. 보조 동작(말씀 모아보기 등)에 쓴다.
- **Outline:** 회색 가는 선 사각 버튼. 글자 크기 −/+에 쓴다.

### Chips
- **Style:** 번역본 선택(개역개정, 우리말, 새한글)용 알약 모양 버튼. 테두리 없이 작은 글자로 쓴다.
- **State:** 선택되면 민트 바탕. TTS 재생 중에는 다른 번역본을 반투명(opacity 50%)으로 막는다.

### Inputs / Fields
- **Style:** 회색 가는 선, 살짝 둥근 모서리, 높이 40px(h-10).
- **Focus:** 따로 정한 스타일 없이 브라우저 기본값.

### Calendar (Signature Component)
함온성의 얼굴이다. react-calendar를 `components/Calendar.css`로 덮어써서 쓴다.
- 청록 요일 띠 아래에 7열 날짜 칸이 있다. 칸마다 큰 날짜 숫자와 아주 작은 분량 표기(책 이름, 장 범위)를 둔다.
- 상태: 오늘 노랑, 읽음 민트, 선택 파랑(흰 글자), hover 회색, 비활성 회색.
- 일요일은 빨강, 토요일은 파랑 글자. 이전·다음 달 칸은 흐린 회색이다.
- 년 단위 이동 버튼(« »)은 숨기고, 달 이동(‹ ›)만 남긴다.

### Verse Line
- 한 구절씩 "장:절 본문"으로 한 줄에 쓰고, 구절 사이를 한 줄 띄운다.
- 구절을 누르면 노랑 형광펜으로 담기고, 한 번 더 누르면 빠진다.
- TTS로 읽는 중인 구절은 파란 밑줄과 연파랑 바탕으로 따라간다.

## Do's and Don'ts

### Do:
- **Do** 새 화면도 흰 바탕, Hahmlet 한 가지, 한 열 구성으로 만든다.
- **Do** 달력 상태는 노랑(오늘), 민트(읽음), 선택 파랑으로만 표시한다.
- **Do** 본문 크기는 글자 크기 단계를 따르게 만든다.
- **Do** 누르는 영역을 크게 잡는다. 새로 만드는 버튼과 칩은 높이 44px 이상을 목표로 한다. 지금 기본 버튼(약 36px)과 번역본 칩은 이보다 작다.
- **Do** 주요 행동 하나에만 함온성 파랑 바탕을 쓴다.

### Don't:
- **Don't** 노랑·민트·선택 파랑을 달력과 말씀 표시 밖의 장식에 쓰지 않는다.
- **Don't** 두 번째 글꼴을 들이지 않는다.
- **Don't** 페이지에 붙은 카드나 구역에 그림자를 주지 않는다.
- **Don't** 본문에 고정 글자 크기를 주지 않는다.
