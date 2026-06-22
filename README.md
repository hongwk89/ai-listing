# AI 상품 등록 도우미

**[→ 데모 바로가기](https://ai-listing-two.vercel.app/)**

이커머스 판매자를 위한 AI 카피 자동 생성 웹앱입니다.
상품 사진과 기본 정보를 입력하면 AI가 상품명, 핵심 셀링포인트, 상세 설명, 추천 태그를 자동으로 작성해줍니다.

## 주요 기능

- 상품 사진 업로드 (드래그 앤 드롭 지원)
- 등급, 원산지, 보관 방법, 배송 방식, 강조할 점 입력 (모두 선택)
- AI 카피 자동 생성 (상품명 / 셀링포인트 3개 / 상세 설명 / 추천 태그)
- 생성된 결과 인라인 편집
- 항목별 클립보드 복사

## 설계 원칙

AI는 입력된 사실과 사진에서 실제로 보이는 것만 사용합니다.
입력되지 않은 항목은 추측하지 않고 `[입력 필요]` 형태로 남깁니다.
과장·허위 광고를 방지하는 것이 이 프로젝트의 핵심 설계 기준입니다.

## 기술 스택

- **프론트엔드**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **AI**: Claude claude-sonnet-4-6 (Anthropic Vision API)
- **서버**: Vercel Serverless Function (`/api/generate`)
- **배포**: Vercel

## 로컬 실행

```bash
# 패키지 설치
npm install

# 환경변수 설정
# .env 파일 생성 후 아래 값 입력
ANTHROPIC_API_KEY=sk-ant-...

# 개발 서버 실행 (서버리스 함수 포함)
vercel dev
```

## 환경변수

| 변수명 | 설명 |
|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic API 키 (서버리스 함수에서만 사용) |

## 데이터 흐름

```
브라우저 (사진·정보 입력)
  → Vercel 서버리스 함수 (API 키 보관, Claude 호출)
  → Claude claude-sonnet-4-6 (사진 분석 + 카피 생성)
  → 브라우저 (결과 표시·편집·복사)
```
