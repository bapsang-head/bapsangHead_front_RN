import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    marginHorizontal: 20,
  },

  weekCalendarList: { //주 단위 캘린더 스타일
    height: 100, //원하는 높이로 설정
  },
  calendarList: { //월 단위 캘린더 스타일
    height: 350, //원하는 높이로 설정
  },

  header: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  monthText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  //Main 화면의 한 section(아침식사 등..) 스타일
  section: {
    backgroundColor: '#e0ffcc',
    borderRadius: 10,
    padding: 10,
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
    marginHorizontal: 12,
    marginVertical: 8,
    flexDirection: 'row', //수평 정렬
    alignItems: 'center', //수직 가운데 정렬
    justifyContent: 'space-between', //수평적으로는 사이 간격을 최대로 벌림
  },

  //한 Section 안에 들어가는 sectionTitle 글꼴 스타일(아침 식사 등..)
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 4, //margin 추가
  },

  //Main 화면의 section 안에 들어가는 구성요소들 style
  section_contents: {
    fontSize: 16,
    fontWeight: 'light',
    margin: 8, //margin 추가
  },

  //Main 화면의 section 안에 들어가는 버튼 style (짧은 버전)
  section_Button_short: {
    width: 144,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#BFE99E',
  },

  //Main 화면의 section 안에 들어가는 버튼 style (긴 버전)
  section_Button_long: {
    marginHorizontal: 12,
    marginVertical: 8,
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
  }
});