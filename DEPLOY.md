# Netlify 배포 가이드

## 방법 1: Netlify 웹사이트를 통한 배포 (가장 쉬움)

1. [Netlify](https://www.netlify.com/) 웹사이트 방문
2. "Sign up" 또는 "Log in" (GitHub 계정으로 로그인 권장)
3. "Add new site" → "Import an existing project" 클릭
4. GitHub 연동 후 `thumbnail` 저장소 선택
5. Branch to deploy: `claude/create-thumbnail-generator-011CULRBsc8TDaEaABEzasHv` 선택
6. Build settings:
   - Build command: (비워두기)
   - Publish directory: `.` (루트 디렉토리)
7. "Deploy site" 클릭

배포가 완료되면 자동으로 URL이 생성됩니다 (예: `https://your-site-name.netlify.app`)

## 방법 2: Netlify CLI를 통한 배포

### 설치 (처음 한 번만)
```bash
npm install -g netlify-cli
```

### 로그인
```bash
netlify login
```

### 배포
```bash
# 저장소 루트에서 실행
cd /home/user/thumbnail

# 초기 배포 (대화형)
netlify deploy

# 프로덕션 배포
netlify deploy --prod
```

배포 시 선택사항:
- Publish directory: `.` 입력 (현재 디렉토리)

## 방법 3: Drag & Drop 배포 (가장 빠름)

1. [Netlify Drop](https://app.netlify.com/drop) 방문
2. 프로젝트 폴더를 드래그 앤 드롭
3. 즉시 배포 완료!

## 자동 배포 설정

GitHub 연동 후에는:
- `claude/create-thumbnail-generator-011CULRBsc8TDaEaABEzasHv` 브랜치에 푸시할 때마다 자동 배포
- 커밋 히스토리에서 롤백 가능
- 브랜치 미리보기 지원

## 커스텀 도메인 설정

1. Netlify 대시보드에서 사이트 선택
2. "Domain settings" 클릭
3. "Add custom domain" 클릭
4. 도메인 입력 및 DNS 설정

## 문제 해결

배포 실패 시:
- `netlify.toml` 파일이 있는지 확인
- 브라우저 콘솔에서 에러 확인
- Netlify 대시보드의 "Deploy log" 확인
