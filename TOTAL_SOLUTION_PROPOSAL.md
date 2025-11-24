# 🛠️ 종합 해결 솔루션 (Total Solution Proposal)

**작성자**: Product Designer & Lead Engineer
**날짜**: 2024-05-23
**목표**: "쓰레기 같다"는 피드백을 완전히 불식시키고, "쓸만한 프로덕트"로 재탄생

---

## 1. 🔍 문제점 심층 분석 (Root Cause Analysis)

사용자의 피드백("템플릿도 안 맞고, 쓸만한 것도 없고, 쓰기가 어렵다")은 단순한 디자인 문제가 아니라 **핵심 로직과 콘텐츠의 부재**에서 비롯됩니다.

| 문제 영역 | 현상 (Symptom) | 원인 (Root Cause) |
| :--- | :--- | :--- |
| **Engine (엔진)** | 캔버스 크기 변경 시 도형이 찌그러지고 텍스트 비율이 깨짐 | `scaleX`, `scaleY`를 무식하게 곱하는 **단순 배율 적용(Naive Scaling)** 방식 사용 |
| **Content (콘텐츠)** | "쓸만한 템플릿이 없다" | 실제 트렌드(먹방, 브이로그, 감성)를 반영하지 못한 **개발자 중심의 플레이스홀더 데이터** |
| **UX (사용성)** | "쓰기가 어렵다" | 텍스트 수정 시 사이드바를 왔다 갔다 해야 함. 직관적인 **Contextual Menu(플로팅 메뉴)** 부재 |

---

## 2. 🚀 해결 방안 (The Solution)

### Phase 1: 스마트 리사이징 엔진 (Smart Resizing Engine)
단순 스케일링을 폐기하고, **"앵커 기반 레이아웃(Anchor-based Layout)"** 시스템을 도입합니다.

- **AS-IS**: 16:9 → 1:1 변경 시 원(Circle)이 타원(Oval)이 됨.
- **TO-BE**:
    - **Aspect Ratio Preservation**: 이미지와 로고는 비율을 유지하며 중앙/상단/하단으로 재배치.
    - **Background Fill**: 배경은 꽉 채우되(Cover), 콘텐츠는 안전 영역(Safe Zone) 내로 이동.
    - **Text Reflow**: 폰트 크기만 조절하고, 장평(ScaleX)은 건드리지 않음.

### Phase 2: "프로" 수준의 템플릿 팩 (Pro Content Pack)
기존 `json` 데이터를 전면 교체합니다. 실제 유튜브/인스타에서 보이는 디자인 패턴을 적용합니다.

- **YouTube**:
    - **"어그로" 팩**: 강렬한 텍스트 + 고대비 배경 (이슈 유튜버 스타일)
    - **"Vlog" 팩**: 감성 필터 이미지 + 얇은 명조체
    - **"Tech" 팩**: 다크 모드 + 네온 엑센트
- **Instagram**:
    - **"Card News"**: 정보 전달형 텍스트 레이아웃
    - **"Mood"**: 이미지 중심 + 중앙 정렬 텍스트

### Phase 3: UX 혁신 (UX Revolution)
사용자가 마우스를 많이 움직이지 않도록 만듭니다.

- **Floating Context Menu**: 객체 선택 시 바로 위에 [복제 | 삭제 | 상위로 | 색상] 버튼 표시.
- **Smart Guides**: 드래그 시 중앙 정렬/간격 맞춤 가이드라인(Snap) 활성화 (Fabric.js 기능 활용).
- **Double Click to Edit**: 텍스트 더블 클릭 시 즉시 편집 모드 진입 및 전체 선택.

---

## 3. 📅 실행 계획 (Execution Plan)

1.  **Engine Refactor**: `App.jsx`의 `handleCanvasSizeChange`를 `smartResize` 로직으로 교체.
2.  **Data Overhaul**: `src/data/templates.js`를 실제 디자인 기반 데이터로 전면 재작성.
3.  **UX Implementation**:
    - `CanvasEditor.jsx`에 Smart Guide 로직 추가.
    - `Toolbar`에 의존하지 않는 `FloatingToolbar` 컴포넌트 신설.

---

**이 제안서는 단순한 "수정"이 아니라, 앱의 "두뇌"와 "얼굴"을 모두 교체하는 작업입니다. 승인 시 즉시 엔진부터 재설계하겠습니다.**
