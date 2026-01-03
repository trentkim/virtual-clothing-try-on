# Sample Clothing Data

이 폴더에는 데모용 의류 이미지가 포함됩니다.

## 폴더 구조

```
sample-data/
├── clothing/              # 의류 이미지 (배경 제거된 PNG)
│   ├── top-001.png       # 화이트 티셔츠
│   ├── top-002.png       # 네이비 폴로셔츠
│   ├── top-003.png       # 스트라이프 셔츠
│   ├── top-004.png       # 블랙 탱크탑
│   ├── bottom-001.png    # 블루 진
│   ├── bottom-002.png    # 블랙 치노
│   ├── dress-001.png     # 플로럴 원피스
│   ├── dress-002.png     # 블랙 드레스
│   ├── outerwear-001.png # 데님 재킷
│   └── outerwear-002.png # 트렌치코트
├── thumbnails/           # 썸네일 이미지 (200x200)
└── sample-users/         # 테스트용 사용자 이미지
```

## 이미지 요구사항

### 의류 이미지
- **형식**: PNG (투명 배경 권장)
- **크기**: 1024x1024px 이하
- **배경**: 투명 또는 단색 (AI가 의류만 추출하기 쉽도록)
- **앵글**: 정면 뷰
- **품질**: 고해상도, 선명한 디테일

### 사용자 이미지
- **형식**: JPEG, PNG, WebP
- **크기**: 최대 10MB
- **포즈**: 전신 또는 상반신 (의류 종류에 따라)
- **조명**: 균일한 조명, 그림자 최소화
- **배경**: 단순한 배경 권장

## 샘플 이미지 소스

데모용 이미지는 다음 소스에서 구할 수 있습니다:

1. **Unsplash** (https://unsplash.com) - 무료 고품질 사진
2. **Pexels** (https://pexels.com) - 무료 스톡 사진
3. **AI 생성** - DALL-E, Midjourney 등으로 가상 의류 생성
4. **실제 제품 사진** - 배경 제거 후 사용

## 배경 제거 도구

- remove.bg
- Adobe Express
- Canva Background Remover
- Python Pillow + rembg 라이브러리
