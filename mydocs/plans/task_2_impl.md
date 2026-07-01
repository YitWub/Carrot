# Task 2 — UI 버그 수정 및 디자인 개선

## 배경
글쓰기 플로팅 버튼의 아이콘 정렬이 맞지 않고, 기존 파란색 구글 로그인 버튼이 당근마켓의 브랜드 컬러(주황색)와 어울리지 않는다는 피드백이 발생함. 

- 작업지시자 요청 사항:
  1. 십자가 모양의 플로팅 버튼을 정중앙에 위치시킬 것.
  2. 구글 로그인 버튼의 배경색을 당근마켓 주황색으로 변경하고, 타이틀 및 아이콘과 겹치지 않게 간격을 조정할 것.

## 초기 판정
- 플로팅 버튼 (`Home.css`): 현재 `.floating-button`에 정렬 속성이 명확하게 지정되어 있지 않아 브라우저 기본 렌더링에 의존 중임.
- 로그인 버튼 (`Profile.tsx`): 구글 기본 로그인 버튼 UI를 사용하고 있으며, 버튼과 상단 텍스트(`<p>`) 사이에 여백이 부족함.

핵심 가설: `.floating-button`에 `flex` 속성을 부여하면 정렬 문제를 해결할 수 있으며, `Profile.tsx` 내 버튼을 감싸는 컨테이너에 `flex-direction: column`과 `gap`을 주면 세로 간격 문제를 해결할 수 있다.

## 구현 계획
1. **플로팅 버튼 정렬 보강**
   - `Home.css`의 `.floating-button`에 `display: flex; align-items: center; justify-content: center;` 추가
2. **구글 로그인 버튼 리디자인**
   - `backgroundColor`를 `#ff7e36`으로 변경
   - 로고 백그라운드를 원형(`borderRadius: "50%"`)으로 분리하여 가독성 증대
   - 버튼 상위 래퍼에 `display: "flex", flexDirection: "column", gap: "24px"` 추가
3. **로컬 컴파일 및 시각적 판정**
   - `npm run dev`를 통해 변경된 UI 시각적 확인

## 검증 대상
- `frontend/src/pages/Home.css`
- `frontend/src/pages/Profile.tsx`
- 로컬 웹브라우저 렌더링 화면
