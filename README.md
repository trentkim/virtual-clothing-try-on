# Virtual Clothing Try-On Demo

리테일 업종을 위한 가상 의류 피팅 데모 애플리케이션입니다.

## 🎯 프로젝트 개요

Azure OpenAI의 `gpt-image-1.5` 모델을 활용하여 사용자가 업로드한 사진에 선택한 의류를 가상으로 입혀볼 수 있는 서비스입니다.

### 주요 기능

- 📸 사용자 사진 업로드 (웹캠 캡처 지원)
- 👗 의류 카탈로그 브라우징
- 🎨 AI 기반 가상 피팅 (Virtual Try-On)
- 💾 결과 이미지 다운로드 및 공유
- 🛒 장바구니 연동 (데모)

## 🏗️ 기술 스택

### Frontend
- **Next.js 14** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링

### Backend (Serverless)
- **Azure Functions (Python 3.11)** - 서버리스 백엔드
- **Azure API Management** - API 게이트웨이 및 보안
- **Azure OpenAI** - gpt-image-1.5 이미지 편집 API
- **Azure Blob Storage** - 이미지 저장소

### Infrastructure
- **Azure Static Web Apps** - 프론트엔드 호스팅
- **GitHub Actions** - CI/CD 파이프라인

## 📁 프로젝트 구조

```
virtual-clothing-try-on/
├── frontend/                 # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/             # App Router 페이지
│   │   ├── components/      # React 컴포넌트
│   │   ├── lib/             # API 클라이언트 및 유틸리티
│   │   └── types/           # TypeScript 타입
│   └── public/              # 정적 파일 (의류 이미지 등)
├── backend/                  # Azure Functions 백엔드
│   ├── functions/           # HTTP 트리거 함수 (health, clothing, tryon)
│   ├── shared/              # 공유 로직 및 모델
│   ├── function_app.py      # Functions 엔트리포인트
│   ├── host.json            # Functions 설정
│   └── requirements.txt     # Python 의존성
├── sample-data/             # 샘플 의류 이미지 원본
├── docs/                    # 프로젝트 문서
│   ├── PROJECT_PLAN.md      # 프로젝트 계획서
│   └── AZURE_DEPLOYMENT.md  # Azure 배포 가이드
└── README.md
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- Python 3.11+
- [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
- Azure 계정 및 OpenAI 리소스

### 환경 변수 설정

**Backend (`backend/local.settings.json`)**
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "AZURE_OPENAI_ENDPOINT": "https://your-resource.openai.azure.com/",
    "AZURE_OPENAI_API_KEY": "your-api-key",
    "AZURE_OPENAI_DEPLOYMENT_NAME": "gpt-image-1.5",
    "AZURE_OPENAI_API_VERSION": "2024-02-15-preview"
  }
}
```

**Frontend (`frontend/.env.local`)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:7071
# API Management 사용 시
# NEXT_PUBLIC_APIM_SUBSCRIPTION_KEY=your-apim-key
```

### 로컬 실행

**Backend**
```bash
cd backend
# 가상환경 활성화 (이미 생성된 경우)
source .venv/bin/activate
# 실행
func start
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

### 접속

- Frontend: http://localhost:3000
- Backend API: http://localhost:7071/api/v1/health

## 🔧 Azure 배포

상세한 배포 방법은 [docs/AZURE_DEPLOYMENT.md](docs/AZURE_DEPLOYMENT.md)를 참조하세요.

1. Azure OpenAI 리소스 및 모델 배포
2. Azure Functions App 생성 및 배포
3. Azure API Management 설정 (선택 사항)
4. Azure Static Web Apps에 프론트엔드 배포

## 🎨 Virtual Try-On 프롬프트

Azure OpenAI gpt-image-1.5 모델에 사용되는 최적화된 프롬프트:

```
Edit the image to dress the person using the provided clothing images. 
Do not change their face, facial features, skin tone, body shape, pose, 
or identity in any way. Preserve their exact likeness, expression, hairstyle, 
and proportions. Replace only the clothing, fitting the garments naturally 
to their existing pose and body geometry with realistic fabric behavior. 
Match lighting, shadows, and color temperature to the original photo so 
the outfit integrates photorealistically, without looking pasted on. 
Do not change the background, camera angle, framing, or image quality, 
and do not add accessories, text, logos, or watermarks.
```

## 📄 라이선스

MIT License
