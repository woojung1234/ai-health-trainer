# AI 헬스 트레이너 (AI Health Trainer)

## 소개
AI 헬스 트레이너는 OpenAI API를 활용하여 개인 맞춤형 운동 계획 및 식단을 추천해주는 모바일 애플리케이션입니다. 사용자의 목표, 경험 수준, 운동 빈도에 따라 최적화된 트레이닝 플랜을 제공합니다.

## 특징
- 목표별 맞춤형 운동 루틴 추천 (다이어트, 근육 증가, 체력 증진)
- 경험 수준에 맞는 운동 강도 조절 (초보, 중급, 고급)
- 개인화된 식단 제안
- 운동 기록 저장 및 관리
- 사용자 프로필 관리

## 설치 및 실행

### 필수 조건
- Node.js (v14 이상)
- React Native CLI
- Android Studio 또는 Xcode

### 설치 단계

1. 저장소 클론
```bash
git clone https://github.com/woojung1234/ai-health-trainer.git
cd ai-health-trainer
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정 (.env 파일 생성)
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. 앱 실행
```bash
# Android
npm run android

# iOS
npm run ios
```

## 기술 스택
- React Native
- React Navigation
- React Native Paper (UI)
- Axios (API 통신)
- OpenAI API
- AsyncStorage (데이터 저장)

## 라이선스
MIT