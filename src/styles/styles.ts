import { StyleSheet, Platform, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //SafeAreaView는 Android 기기들에서 작동하지 않음. 따라서 Platform에 따라 다르게 적용
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  
  scrollView: {
    marginHorizontal: 20,
  },

  titleTextStyle: { //타이틀 텍스트 스타일
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  titleTextStyleInInputScreen: { //텍스트로 입력하는 란에서의 타이틀 텍스트 스타일
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  textInputStyle: { //텍스트 인풋 스타일
    fontSize: 14,
    fontWeight: 'bold',
    height: 44,
    paddingLeft: 16,
    borderRadius: 18,
    backgroundColor: '#ECECEC',
    textAlign: 'left',
  },

  header: { //상단 title 관련 스타일
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  monthText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  //Main 화면의 한 section(아침식사 등..) 스타일
  section: {
    backgroundColor: '#E5FFC4',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
  },

  section_inDetailPage: { //분석 페이지에서 상단에 있는 section 스타일
    backgroundColor: '#E5FFC4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  //Main 화면의 맨 밑의 section style
  section_Bottom: {
    backgroundColor: '#e0ffcc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginBottom: 60, //밑의 BottomSheetModal이 가리지 않도록 마진 추가
  },

  sectionHeader: {
    fontSize: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  //수평 정렬을 위한 style
  section_container_horizontal: {
    marginTop: 16,
    flexDirection: 'row', //수평 정렬
    alignItems: 'center', //수직 가운데 정렬
    justifyContent: 'space-between', //수평적으로는 사이 간격을 최대로 벌림
  },

  //한 Section 안에 들어가는 sectionTitle 글꼴 스타일(아침 식사 등..)
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8
  },

  //Main 화면의 section 안에 들어가는 구성요소들 style
  section_contents: {
    paddingVertical: 20, //margin 추가
    justifyContent: 'center',
    alignItems: 'center'
  },

  //Main 화면의 section 안에 들어가는 버튼 style (짧은 버전)
  section_Button_short: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#BFE99E',
  },

  //Main 화면의 section 안에 들어가는 버튼 style (긴 버전)
  section_Button_long: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 76,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#BFE99E',
  },

  //Main 화면의 section 안에 들어가는 칼로리 표시를 위한 style
  section_Calories: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 8, //margin 추가
  },

  //'기본 정보가 궁금해요!' 화면에서 성별 설정 버튼 layout
  genderSelectButton: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: "#ECECEC",
		borderColor: "#ECECEC",
		borderRadius: 18,
		borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30
  },

  //'평소의 활동량이 궁금해요!' 화면에서 활동 버튼 layout
  activityLevelButton: {
    flexDirection: 'row',
    width: 280,
    height: 80,
    borderRadius: 18,
    paddingHorizontal: 24,
    backgroundColor: "#ECECEC",
		borderColor: "#ECECEC",
    alignItems: 'center',
  },

  //'기본 정보가 궁금해요!' 화면에서 Input layout
  settingInputButton: {
    height: 40,
    paddingLeft: 16,
    borderRadius: 18,
    backgroundColor: "#ECECEC",
		borderColor: "#ECECEC",
    alignItems: 'flex-start'
  },

  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  dayContainer: {
    alignItems: 'center',
  },
  day: {
    fontSize: 16,
    color: 'black',
  },
  dayText: {
    fontSize: 12,
    color: 'grey',
  },
  selectedDay: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  selectedDayText: {
    fontSize: 12,
    color: 'green',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  modalBottom: {
    alignItems: 'flex-start',
    fontSize: 12,
    fontWeight: 'light',
    marginTop: 4,
  },
  statusBarWrapper: {
    marginHorizontal: 10,
  },
  rowInDetailPage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  startStyleInInputStatus: {
    flexDirection: 'row',
    marginRight: 5,
  },
  circleStyleInInputStatus: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  profileImageCircle: { //프로필 이미지 관련 스타일
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  ImageStyle: { //이미지 스타일
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center'
  },

  calendarContainerFolded: { //calendarContainerFolded(접혀진 한 주치 달력) 높이는 고정값으로 한다
    height: 72,
    backgroundColor: 'white'
  },

  calendarContainer: {  //이거는 flex 값으로 지정한다
    flex: 1,
    backgroundColor: 'white',
  },

  calendarMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#BFE99E',
    alignItems: 'center',
    justifyContent: 'center'
  },

  //마이페이지에서의 활동량 버튼
  activityLevelButton_inMyPage: {
    flexDirection: 'row',
    paddingVertical: 24,
    borderRadius: 18,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  //마이페이지에서의 로그아웃 버튼
  logout_Button: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#BFE99E'
  },

  //'입력내용 분석 결과입니다' 화면에서의 '-'(제거) 버튼 style
  delete_button: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BFE99E',
  },

  //'입력내용 분석 결과입니다' 화면에서의 '입력내용 추가하기' 버튼 style
  add_button: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 88,
    height: 44,
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#BFE99E'
  }
});