# 🚀 추가 개선 사항 제안

## 🔴 Critical (치명적 문제)

### 1. **기본 템플릿 자동 로드**
**현재 문제**: 앱 실행 시 캔버스가 비어있음
**해결 방안**: 첫 템플릿을 자동으로 로드하여 즉시 결과물을 보여줌
```jsx
// CanvasEditor.jsx - useEffect에서 첫 템플릿 자동 로드
useEffect(() => {
  if (canvas && !hasLoadedInitialTemplate) {
    loadFirstTemplate()
  }
}, [canvas])
```

### 2. **템플릿 미리보기 이미지**
**현재 문제**: 이모지만으로는 템플릿 디자인을 알기 어려움
**해결 방안**: 각 템플릿의 실제 썸네일 이미지 생성
- canvas.toDataURL()로 각 템플릿의 미리보기 생성
- Base64 이미지를 templates.js에 포함

### 3. **레이어 순서 컨트롤**
**현재 문제**: 객체가 겹칠 때 앞/뒤 조정 불가
**해결 방안**: PropertyPanel에 레이어 순서 버튼 추가
- "맨 앞으로" (bringToFront)
- "맨 뒤로" (sendToBack)
- "한 칸 앞으로" (bringForward)
- "한 칸 뒤로" (sendBackwards)

## 🟡 High Priority (높은 우선순위)

### 4. **실행 취소/재실행 (Undo/Redo)**
**개선 효과**: 디자인 실험을 두려워하지 않게 됨
**구현 방안**:
```jsx
const [history, setHistory] = useState([])
const [historyStep, setHistoryStep] = useState(0)

// Ctrl+Z, Ctrl+Y 키보드 단축키
```

### 5. **키보드 단축키 시스템**
**필수 단축키**:
- `Delete`: 선택 객체 삭제
- `Ctrl+C`: 복사
- `Ctrl+V`: 붙여넣기
- `Ctrl+D`: 복제
- `Ctrl+Z`: 실행 취소
- `Ctrl+S`: 저장
- `Esc`: 선택 해제

### 6. **텍스트 편집 개선**
**현재 문제**: 텍스트 더블클릭해도 편집 모드 진입 안 됨
**해결 방안**: Fabric.js의 `enterEditing()` 기능 활성화

### 7. **템플릿 JSON 불러오기**
**개선 효과**: 이전에 저장한 작업 재개 가능
**구현**: Header에 "불러오기" 버튼 추가
```jsx
<input type="file" accept=".json" onChange={handleLoadJSON} />
```

## 🟢 Medium Priority (중간 우선순위)

### 8. **색상 팔레트 프리셋**
**개선**: 색상 피커 대신 자주 쓰는 색상 팔레트 제공
```jsx
const colorPresets = [
  '#DC2626', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#F59E0B', '#000000', '#FFFFFF'
]
```

### 9. **그리드/가이드라인**
**개선**: 정렬을 쉽게 하기 위한 그리드 표시
```jsx
canvas.setBackgroundColor({
  source: 'path/to/grid.png',
  repeat: 'repeat'
})
```

### 10. **다중 객체 선택**
**개선**: Shift 클릭으로 여러 객체 동시 선택/편집
- 이미 Fabric.js가 지원하지만 UI가 없음
- PropertyPanel에 "그룹화" 버튼 추가

### 11. **텍스트 그림자 컨트롤**
**현재**: 프리셋으로만 그림자 적용 가능
**개선**: PropertyPanel에 그림자 세부 조정 슬라이더
- 그림자 색상
- Blur 강도
- X/Y 오프셋

### 12. **이미지 자르기 (Crop)**
**개선**: 업로드한 이미지를 원하는 부분만 자르기
- Fabric.js clipPath 기능 활용

## 🔵 Low Priority (낮은 우선순위)

### 13. **애니메이션 효과**
**개선**: 템플릿 로드 시 부드러운 전환
```jsx
<Transition show={isVisible}>
  <TemplateGallery />
</Transition>
```

### 14. **검색/필터 기능**
**개선**: 템플릿이 많아지면 카테고리별 필터
```jsx
<select onChange={filterByCategory}>
  <option value="all">전체</option>
  <option value="youtube">유튜브</option>
  <option value="vlog">브이로그</option>
</select>
```

### 15. **다크모드 토글**
**개선**: 밝은 배경 선호 사용자를 위한 라이트 모드

### 16. **반응형 캔버스 크기 프리셋**
**개선**: 
- YouTube (1280×720)
- Instagram Post (1080×1080)
- Instagram Story (1080×1920)
- Facebook Cover (1200×630)

### 17. **스티커/아이콘 라이브러리**
**개선**: Lucide 아이콘을 SVG로 캔버스에 추가

### 18. **AI 배경 제거**
**개선**: Remove.bg API 연동 (유료)

## 🎯 우선 구현 추천 (Top 5)

1. ⭐ **기본 템플릿 자동 로드** - 즉시 결과물 표시
2. ⭐ **레이어 순서 컨트롤** - 필수 편집 기능
3. ⭐ **키보드 단축키 (Delete, Ctrl+C/V/D)** - 생산성 향상
4. ⭐ **실행 취소/재실행 (Undo/Redo)** - 안전한 실험
5. ⭐ **템플릿 JSON 불러오기** - 저장한 작업 재개

## 🐛 잠재적 버그

1. **폰트 로딩 지연**: Google Fonts가 로드되기 전 템플릿 렌더링
   - 해결: Font loading event 대기
   
2. **이미지 교체 시 선택 손실**: 
   - handleImageFileChange에서 setSelectedObject 필요

3. **텍스트 프리셋 후 shadow 수정 불가**:
   - PropertyPanel에 shadow 편집 UI 추가 필요

