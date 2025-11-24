# 🎨 디자인 고도화 및 UX 개선 기획안 (Design Improvement Proposal)

**작성자**: Design Lead (30년차 경력)
**수신**: PM 및 개발팀
**날짜**: 2024-05-23
**문서 상태**: 검토 대기

---

## 1. 🚨 현재 상태 진단 (AS-IS Analysis)

현재 프로덕트의 UI는 사용자로부터 **"쓰레기 같다"**는 극단적인 피드백을 받은 상태입니다. 전문가적 관점에서 분석한 결과, 이는 단순한 악평이 아니라 **기본적인 디자인 원칙(Hierarchy, Consistency, Spacing)의 부재**에서 오는 타당한 불만입니다.

### 주요 문제점 (Pain Points)

#### 1.1. 색상 체계의 부조화 (Color System Clash)
- **문제점**: `bg-dark-950` (Zinc 계열, 웜톤)과 `border-dark-700` (Gray 계열, 쿨톤)이 혼재되어 화면이 "지저분해(Muddy)" 보입니다.
- **영향**: 전문적인 도구가 아닌, 급하게 만든 "개발자용 어드민" 느낌을 줍니다.
- **진단**: 일관된 Hue(색조)를 가진 그레이스케일이 적용되지 않았습니다.

#### 1.2. 시각적 계층 구조 부재 (Lack of Visual Hierarchy)
- **문제점**: 툴바와 속성 패널의 모든 요소가 비슷한 비중으로 보입니다. 탭 버튼, 액션 버튼, 입력 필드 간의 구분이 명확하지 않습니다.
- **영향**: 사용자는 어디를 먼저 봐야 할지 모르며, 작업 흐름이 끊깁니다.
- **진단**: Font Size, Weight, Opacity를 활용한 정보의 위계질서 정리가 시급합니다.

#### 1.3. 투박한 컴포넌트 스타일링 (Unrefined Components)
- **문제점**:
    - `input[type="range"]`가 브라우저 기본 스타일로 노출됨 (가장 큰 감점 요인).
    - 버튼과 입력창의 테두리가 너무 강하여(`border-dark-700`) 시선을 분산시킴.
    - 패딩(Padding)과 마진(Margin)이 불규칙하여 숨 쉴 공간(Breathing Room)이 부족함.

---

## 2. ✨ 디자인 개선 컨셉 (TO-BE Concept)

### **"Professional Creative Studio"**

전문적이면서도 창작 욕구를 자극하는 **Modern Dark Mode** 인터페이스로 전면 개편합니다.

### 2.1. 디자인 키워드
- **Immersive (몰입감)**: 불필요한 테두리를 제거하고 배경 톤의 미묘한 차이(Layering)로 영역을 구분합니다.
- **Unified (일관성)**: 단일 Hue(예: Zinc 또는 Neutral) 기반의 컬러 팔레트로 통일합니다.
- **Precision (정교함)**: 1px 단위의 섬세한 정렬과 커스텀 컨트롤 UI를 적용합니다.

---

## 3. 🛠 구체적 실행 방안 (Action Plan)

### 3.1. 색상 시스템 재정의 (Color System Refactor)
`tailwind.config.js`를 수정하여 **Zinc (Modern Neutral)** 계열로 전체 팔레트를 통일합니다.

- **Backgrounds**:
    - Canvas Area: `#09090b` (Zinc-950) - 가장 어두운 배경으로 캔버스 집중도 향상.
    - Panels: `#18181b` (Zinc-900) - 도구 모음 영역.
    - Inputs/Surface: `#27272a` (Zinc-800) - 입력창 및 카드 배경.
- **Borders**: 테두리 사용을 최소화하고, 필요 시 `#3f3f46` (Zinc-700) 대신 `#27272a` (Zinc-800) 수준의 은은한 경계 사용.
- **Primary Accent**: `Indigo-400`을 유지하되, 더 선명한 `Violet` 또는 `Blue` 계열로 조정 검토 (예: `#6366f1` Indigo-500).

### 3.2. Typography & Hierarchy
- **Font**: `Noto Sans KR` 유지, 영문은 `Inter` 또는 `JetBrains Mono`(수치 데이터) 혼용 검토.
- **Scale**:
    - **Panel Headers**: `text-xs font-bold uppercase tracking-wider text-zinc-500` (작지만 명확하게).
    - **Labels**: `text-xs text-zinc-400` (본문보다 흐리게).
    - **Values**: `text-sm font-medium text-zinc-200` (선명하게).

### 3.3. UI 컴포넌트 고도화 (Component Polish)

#### A. 커스텀 Range Slider
브라우저 기본 슬라이더를 제거하고 CSS 커스텀 스타일링 적용.
- **Track**: 얇은 회색 라인.
- **Thumb**: Primary Color의 원형 핸들, Hover 시 확대로 인터랙션 강화.
- **Fill**: 슬라이더 값만큼 Primary Color로 채움.

#### B. Property Panel (우측 패널) 개선
- 단순 나열식 배치를 **그룹화(Grouping)**된 카드 형태로 변경.
- 예: "텍스트 속성" 그룹, "위치/크기" 그룹 등으로 나누고 각 그룹 간 간격(Spacer) 추가.
- 아이콘 활용: 텍스트 정렬 버튼 등을 텍스트 대신 직관적인 아이콘 그룹으로 변경 (`Segmented Control` 스타일).

#### C. Toolbar (좌측 툴바) 개선
- 현재의 텍스트+아이콘 나열 방식을 **"아이콘 중심의 네비게이션"**으로 변경.
- 메인 카테고리(템플릿, 텍스트, 요소)를 좌측 좁은 띠(Sidebar)로 분리하고, 세부 내용을 서랍(Drawer) 형식으로 보여주는 2단 구조 검토.

### 3.4. UX 디테일 (Micro-Interactions)
- **Hover Effects**: 버튼 호버 시 단순 배경색 변경이 아닌, `transform: translateY(-1px)` 또는 `text-white`로 명확한 피드백 제공.
- **Focus States**: 입력창 포커스 시 `ring-2 ring-indigo-500/30` 등 부드러운 Glow 효과 적용.

---

## 4. 📅 진행 계획 (Timeline & Next Steps)

1.  **Phase 1: Foundation (즉시 실행)**
    - Tailwind Config 수정 (Color Palette 통일).
    - Global CSS에 Custom Scrollbar 및 Range Slider 스타일 추가.
2.  **Phase 2: Component Refactor**
    - `Toolbar.jsx`, `PropertyPanel.jsx`의 레이아웃 구조 변경 (Spacing, Grouping).
    - 버튼 및 입력창 컴포넌트 분리 및 스타일링 적용.
3.  **Phase 3: Final Polish**
    - 아이콘 교체 및 마이크로 인터랙션 추가.

## 5. 기대 효과 (Expected Outcome)

- **사용자 신뢰도 상승**: "쓰레기 같다"는 평가에서 "쓸만한 프로 툴"이라는 평가로 전환.
- **작업 효율 증가**: 명확한 시각적 위계로 사용자가 기능을 더 빠르게 찾음.
- **브랜드 가치 제고**: 깔끔하고 정돈된 UI로 서비스 품질 인식 개선.

---
**위 기획안에 대해 승인해주시면, Phase 1 (Foundation)부터 즉시 코드 작업을 시작하겠습니다.**
