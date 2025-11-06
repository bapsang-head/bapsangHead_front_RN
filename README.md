# 🍽️ 밥상머리 - "식단관리? 내가 해줄게!"
<table align="center">
  <tr>
    <!-- 왼쪽: 서비스 로고 / 스플래시 이미지 -->
    <td align="center" valign="middle" width="512">
      <img src="https://github.com/user-attachments/assets/f1f2a8a1-bbea-4b98-9ad9-25a162b984c6" width="256" height="256" alt="서비스 로고" />
    </td>
    <!-- 오른쪽: 두 개의 유튜브 링크 -->
    <td align="left" valign="middle" style="padding-left: 60px;">
      <table style="border:none;">
        <tr>
          <td align="left" style="padding-bottom: 20px;">
            🎬 <a href="https://www.youtube.com/watch?v=ZRVgpbOicNU" target="_blank">
              <b>서비스 설명 영상 (Android 기준)</b>
            </a>
          </td>
        </tr>
        <tr>
          <td align="left">
            📱 <a href="https://www.youtube.com/watch?v=7-Ad9a-VrAE" target="_blank">
              <b>서비스 실사용 영상 (iOS)</b>
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

**NLP를 이용한 식단 관리 어플리케이션 서비스**

---

## 📖 프로젝트 개요

### 기획 배경

기존 식단 관리 앱들은 음식을 일일이 검색하고 선택해야 하는 번거로움이 있었습니다. 식단 관리를 편하게 만들기 위해, 사용자가 "점심에 김치찌개 1인분, 밥 한공기 먹었어"와 같이 말하듯 자연스럽게 입력해도, AI가 자동으로 음식을 인식하고 영양 성분을 분석해주는 서비스의 필요성을 체감했습니다.

### 서비스 목표

- 자연어 입력: 일상 대화처럼 식단을 입력하면 KoBERT + GPT-4o 기반 NER(Named Entity Recognition)이 음식명과 수량을 자동 추출
- 정확한 영양 분석: 사용자의 신체 정보(나이, 성별, 키, 몸무게, 활동량)를 기반으로 기초대사량(BMR)과 활동대사량을 계산하여 맞춤형 영양 분석 제공
- 새로운 정보에 유연한 대응: 입력 받은 문장에서 얻어낸 음식 명, 수량을 바탕으로 DB를 탐색, 없을 경우 웹에서의 정보를 활용하여 식단 분석을 진행

### Front-End 시스템 FlowChart
<p align="center">
  <img src="https://github.com/user-attachments/assets/b6707a9e-413d-4cbc-b40c-8dc42a26567d"
       style="max-width: 100%; height: auto;" />
</p>
<br/>

## 📱 주요 화면 및 기능

밥상머리 서비스의 주요 기능은 크게 아래 3개의 섹션으로 요약할 수 있습니다. OAuth를 활용한 카카오 소셜 로그인을 통해 회원가입을 진행한 사용자는 해당 기능들을 이용할 수 있습니다.

### 홈 화면
<p align="center">
  <img src="https://github.com/user-attachments/assets/bd666e9d-1a1f-4e22-829b-593ecd4566d4" height="440">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/41fb5169-26cf-40bf-ac66-5620f849343a" height="440">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/ab3eed59-33ec-4f41-af09-81198f381d4d" height="440">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/706f65d2-1d91-44eb-af98-1cd9d12892e8" height="440">
</p>

- 날짜별 식단 기록 조회 (주차별, 월간별 캘린더 활용)
- 총 섭취 칼로리와 활동대사량 대비 비율을 Progress Bar를 통해 바로 확인 가능
- '활동대사량' 정보는 사용자가 입력한 활동량, 신체 정보를 바탕으로 계산되어 관리

### 식단 입력 & 분석
<p align="center">
  <img src="https://github.com/user-attachments/assets/3392b123-f1b1-4965-9992-a284c0d0cb8c" height="380" />
  <img src="https://github.com/user-attachments/assets/1a2963aa-4167-4bec-90fc-59837c780ce6" height="380" />
  <img src="https://github.com/user-attachments/assets/70361da2-5e5b-4e4d-9806-737faaee73dc" height="380" />
  <img src="https://github.com/user-attachments/assets/a4b78a2e-2746-40be-82fa-326a51ffd938" height="380" />
  <img src="https://github.com/user-attachments/assets/485e4048-8b57-443e-88f4-74825de1b2e4" height="380" />
</p>

- 식단을 자유로운 형식의 문장으로 입력 *(ex. "난 오늘 BBQ 황금올리브 1마리 야무지게 먹었어")*
- KoBERT + GPT-4o 기반 NER을 통해 음식명, 수량, 단위를 추출 -> 식단 1차 분석
- 1차 분석 후, 분석 결과를 사용자에게 노출. 해당 결과에 대해서 사용자가 정보 수정, 추가, 삭제 가능
- 사용자가 수정한 정보를 바탕으로 2차 분석 진행 <br/>
  - 시스템 DB에 존재하는 식품이라면, 캐싱된 데이터 활용 <br/>
  - 시스템 DB에 존재하는 식품이 아니라면, FatSecret DB(외부 API 활용)에 있는 식품 DB 정보 활용 <br/>
  - FatSecret DB에도 없는 정보라면, 웹 검색 API를 활용해서 정보 수집 <br/>
  - RAG를 활용해 외부 정보를 불러온 경우라면, 시스템 DB에 식품 정보 캐싱 (추후 식단 분석 속도 개선을 위함) <br/>
- 2차 분석 후, 분석된 식단 정보를 사용자 식단 정보에 저장, 추후 홈 화면에서 조회 및 수정 가능

### 식단 히스토리 통계 확인 & 마이페이지
<p align="center">
  <img src="https://github.com/user-attachments/assets/c3dc95df-5fda-4625-acf7-a7fd54acbcbe" height="500" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/30319884-8d5b-4993-bfdc-04b0ad6d5288" height="500" />
</p>

- 해당 월 식단 입력 현황 확인 가능
- 일주일/월별 영양소 섭취 추이를 차트로 시각화
- 마이페이지에서는 사용자 신체 정보·활동량 정보 확인, 로그인 관리 등 가능

<br/>

## 🧰 기술 스택

| 영역            | 사용 기술                                | 선택 이유                                                                                     |
| --------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Frontend**    | React Native 0.74.5 (Expo Bare Workflow) | iOS/Android 동시 개발, 네이티브 모듈 완전한 제어 가능                                         |
| **언어**        | TypeScript 5.3.3                         | 타입 안정성 확보, 개발 생산성 향상                                                            |
| **상태 관리**   | Redux Toolkit 2.2.6                      | 글로벌 상태 관리(계정 정보, 식단 입력, 캘린더 날짜)                                           |
| **로컬 저장소** | AsyncStorage, EncryptedStorage           | AccessToken은 빠른 접근을 위해 AsyncStorage, RefreshToken은 보안을 위해 EncryptedStorage 사용 |
| **네비게이션**  | React Navigation 6 (Stack + Bottom Tabs) | 직관적인 화면 전환 구조                                                                       |
| **네트워크**    | Axios (Custom Instance)                  | Interceptor로 자동 로그아웃, 토큰 갱신, 에러 핸들링 통합 관리                                 |
| **UI/UX**       | Figma                                    | 빠르고 정확한 프로토타이핑, 디자인을 위해 사용                                                |
| **차트**        | react-native-chart-kit                   | 영양소 섭취 추이 시각화                                                                       |
| **캘린더**      | 직접 구현                                | 날짜별 식단 기록, 주별·월별 캘린더 등의 기능 필요로 인해 캘린더 직접 구현                     |

### 기술적 선택의 근거

#### Expo Bare Workflow 선택 이유

초기에는 Expo Managed Workflow로 프로젝트를 제작해 나갔으나, Kakao 소셜 로그인 SDK와의 호환성 문제가 발생했습니다. 해당 라이브러리 뿐만 아니라 네이티브 모듈을 직접 제어해야 했기에 Bare Workflow로 전환했고, 이를 통해 Android/iOS 네이티브 설정을 완전히 커스터마이징할 수 있었습니다.

#### Redux Toolkit 사용 이유

Context API만으로는 복잡한 상태 업데이트 로직(BMR 계산, 활동대사량 계산)을 관리하기 어려웠습니다. Redux Toolkit의 `createSlice`를 활용하여 `accountInfoSlice`, `markedDateSlice`, `mealInputSlice`를 분리 관리함으로써 상태 로직의 가독성과 유지보수성을 향상 시켰습니다.

<br/>

## 📊 성과 및 기대효과

### 정량적 성과

- **식단 입력 시간 단축:** 기존 2분 15초 → 50초로 62% 단축 **(170% 향상)**
- **NER 모델 성능:** F1 Score 0.99 달성 (한국어 음식명 인식 정확도)
- **식단 분석 응답 속도 향상:** DB 캐싱 적용으로 API 응답 속도 390% 향상
- **사용자 만족도:** 베타 테스터 15명 중 93%가 "사용하기 쉽다" 평가
- 기술적 완성도와 편한 사용성을 인정 받아 '건국대학교 컴퓨터공학부 온·오프라인 전시회'에서 **인기상&우수상** 수상

### 대표적 사용자 피드백

> "음식을 일일이 검색할 필요 없이 말하듯이 입력하면 돼서 너무 편합니다." <br/>
> "제 활동량에 맞춰서 하루 권장량을 보여줘서 식단 조절 하는데 훨씬 덜 귀찮네요."

<br/>

## 💭 아쉬운 점 및 회고

### 기술적 회고

#### Expo SDK 버전 충돌 경험

프로젝트 초기, Kakao Login SDK와 Expo SDK 51 간의 버전 충돌로 빌드가 실패했습니다. Expo 공식 문서와 구글링을 통해 며칠 간 탐색한 결과, `expo-build-properties`를 활용한 Gradle 설정 커스터마이징으로 해결할 수 있었습니다. 이 과정에서 네이티브 빌드 시스템에 대한 깊은 이해를 얻었습니다.

#### 커스텀 컴포넌트 구현의 시행착오

처음에는 `react-native-calendars` 라이브러리를 이용해서 Figma 시안에 있는 캘린더 디자인 및 기능을 구현하려 했습니다. 직접 라이브러리 내부 코드를 수정하려 했으나, 유지보수성과 라이브러리 의존성 등에서 비용이 많이 든다는 것을 깨닫고 아예 시스템에 맞는 CalendarFolded 컴포넌트를 새롭게 작성했습니다. 이를 통해 라이브러리 의존성을 줄이는 설계의 중요성을 배웠습니다.

#### 과도한 생성형 AI 의존

프로젝트 진행 당시 React 조차 제대로 다루어 보지 않은 상태에서, **React Native를 처음 다루는 상황**에 직면했습니다.  
기능 구현만을 바라보고 **생성형 AI의 코드 답변에 과도하게 의존**한 적이 있습니다.  
검증되지 않은 코드를 그대로 적용하면서 로직이 불안정해졌고,
사용자 체감 성능은 개선되었지만 **프로젝트 코드의 품질과 유지보수성이 크게 저하되는 문제**로 이어졌습니다.

이 경험을 통해 **AI는 생산성을 높이는 도구일 뿐, 학습과 검증의 책임은 개발자에게 있다**는 사실을 명확히 깨달았습니다.  
이후부터는 공식 문서와 신뢰할 수 있는 기술 자료를 중심으로 학습을 진행하며,  
AI는 설계 초안 작성이나 아이디어 참고 등 **보조적 도구**로만 활용했습니다.

> 이 경험은 단순한 기술 실수 이상의 교훈이었습니다. <br/>
> 개발에서 가장 중요한 것은 '빠르게 만드는 것'이 아니라 '이해하고 만드는 것'임을 몸소 배웠습니다.

### 앞으로 개선하고 싶은 부분 (TO-BE)

- **오프라인 지원:** 네트워크가 불안정한 환경에서도 입력한 식단을 로컬에 저장 후 동기화하는 기능 추가
- **커뮤니티 기능:** 사용자 간 식단 공유 및 피드백 기능 추가
- **성능 최적화:** 프론트엔드를 기술적으로 처음 접했던 시기에 어찌보면 무작정 제작했던 프로젝트입니다. 성능을 고려한다고 나름 노력했으나, 부족한 경험에 최적화를 고려하지 않은 부분이 많이 있을 것이라 생각됩니다. 여유가 된다면, 해당 프로젝트에 대해서 성능 최적화를 진행해 보고 싶은 마음이 큽니다.

<br/>

## 🚀 프로젝트 폴더 구조

```text
📦 bapsangHead_front_RN
┣ 📁 android/                      # Android 네이티브 설정
┣ 📁 ios/                          # iOS 네이티브 설정
┣ 📁 src/
┃ ┣ 📁 apis/
┃ ┃ ┗ 📄 customAxios.tsx          # Axios 인스턴스, 인터셉터, 자동 로그아웃 처리
┃ ┣ 📁 assets/                    # 이미지, SVG 아이콘, 로고
┃ ┃ ┗ 📁 svg/                     # 커스텀 SVG 아이콘 (활동량, 성별, 식사 타입 등)
┃ ┣ 📁 components/
┃ ┃ ┣ 📄 BottomSheetModal.tsx     # 식단 입력 후 확인/수정 모달
┃ ┃ ┣ 📄 Calendar.tsx             # 월별 캘린더 (식단 기록 마킹)
┃ ┃ ┣ 📄 CalendarFolded.tsx       # 접힌 상태의 미니 캘린더
┃ ┃ ┣ 📄 DetailBottomSheetModal.tsx # 영양소 상세 정보 모달
┃ ┃ ┣ 📄 LoadingComponent.tsx     # NLP 처리 중 로딩 UI
┃ ┃ ┗ 📄 MainScreenSection.tsx    # 메인 화면의 식사별(아침/점심/저녁) 섹션
┃ ┣ 📁 screens/
┃ ┃ ┣ 📄 SplashScreen.tsx         # 앱 시작 화면 (토큰 검증)
┃ ┃ ┣ 📄 LoginScreen.tsx          # Kakao 소셜 로그인
┃ ┃ ┣ 📄 MainScreen.tsx           # 홈 화면 (식단 기록 조회)
┃ ┃ ┣ 📄 TextInputScreen.tsx      # 자연어 식단 입력 화면
┃ ┃ ┣ 📄 DetailScreen.tsx         # 통계 화면 (차트)
┃ ┃ ┣ 📄 MyPageScreen.tsx         # 마이페이지 (계정 정보 관리)
┃ ┃ ┣ 📄 SettingScreen.tsx        # 초기 설정 (신체 정보 입력)
┃ ┃ ┣ 📄 ActivityLevelFixScreen.tsx # 활동량 수정
┃ ┃ ┣ 📄 FixBasicDataScreen.tsx   # 기본 정보 수정
┃ ┃ ┗ 📄 FixTextInputScreen.tsx   # 식단 기록 수정
┃ ┣ 📁 slices/
┃ ┃ ┣ 📄 accountInfoSlice.ts      # 사용자 정보, BMR/활동대사량 계산 로직
┃ ┃ ┣ 📄 markedDateSlice.ts       # 캘린더 선택 날짜 관리
┃ ┃ ┗ 📄 mealInputSlice.ts        # 식단 입력 임시 저장
┃ ┣ 📁 styles/
┃ ┃ ┗ 📄 styles.ts                # 전역 스타일 정의
┃ ┣ 📄 App.tsx                    # 최상위 컴포넌트 (Navigation, Redux Provider)
┃ ┗ 📄 store.ts                   # Redux Store 설정
┣ 📄 app.config.js                # Expo 설정 (Kakao SDK 연동)
┣ 📄 package.json                 # 의존성 관리
┣ 📄 tsconfig.json                # TypeScript 설정
┗ 📄 README.md                    # 본 문서
```

<br/>

## 🎓 프로젝트를 통해 배운 것

- **Cross-Platform 개발의 현실적 이해:** "한 번 작성하면 모든 플랫폼에서 작동한다"는 이상과 달리, iOS/Android 각각의 네이티브 설정과 권한 관리를 깊이 이해해야 했습니다.
- **상태 관리 아키텍처 설계 능력:** Redux Toolkit의 Slice 패턴을 활용하여, 계정 정보와 식단 입력을 분리 관리함으로써 컴포넌트 간 결합도를 낮췄습니다.
- **AI 서비스와의 협업 경험:** NLP 모델의 응답 형식(JSON)을 Frontend에서 어떻게 파싱하고 에러 핸들링할지 백엔드 팀과 API 스펙을 지속적으로 조율했습니다.
- **사용자 중심 설계의 중요성:** 베타 테스트에서 "입력 후 수정 기능이 필요하다"는 피드백을 받아 FixTextInputScreen을 추가했고, 사용자 만족도가 크게 향상되었습니다.
- **공식 문서의 중요성:** 생성형 AI의 답변을 무작정 신뢰하기 보다, React Native, Expo, TypeScript 공식 문서의 내용을 기반으로 신뢰도 높은 코드 및 로직을 작성해야 한다는 것을 깨달았습니다.
