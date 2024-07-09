//Libarary or styles import
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Calendar, CalendarList, LocaleConfig, ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import BottomSheet from '@gorhom/bottom-sheet';
import moment from 'moment';
import { styles } from '../styles/styles';

//svg import
import MainIcon from '../assets/MainIcon';

//components import
import BottomSheetModal from '@components/BottomSheetModal';

//Calendar 구성 요소들을 설정
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: [
    '1.', '2.', '3.', '4.', '5.', '6.',
    '7.', '8.', '9.', '10.', '11.', '12.'
  ],
  dayNames: [
    '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'
  ],
  dayNamesShort: [
    '일', '월', '화', '수', '목', '금', '토'
  ]
};

LocaleConfig.defaultLocale = 'ko'; //기본 locale을 한국으로 설정

//메인화면 Component
function MainScreen({route, navigation}) {

  const bottomSheetRef = useRef<BottomSheet>(null); // Reference for the bottom sheet
  const currentDate = moment().format('YYYY-MM-DD'); //현재 날짜(currentDate)를 YYYY-MM-DD 형식으로 가져온다


  let [isCalendarFolded, setIsCalendarFolded] = useState(false); //Calendar의 visibility를 관리한다
  let [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split('T')[0]); // 초기값 현재 날짜
  let [selectedDate, setSelectedDate] = useState(currentDate); //선택된 날짜를 관리한다
  let [markedDates, setMarkedDates] = useState(null); //날짜 마킹을 위한 state


  let [calendarHeight, setCalendarHeight] = useState(350); //캘린더의 높이를 동적으로 관리한다


  //날짜를 선택했을 때 호출되는 함수 onDayPress를 정의한다
  function onDayPress(day: { dateString: string; }) {
    setSelectedDate(day.dateString);
  }


  //캘린더를 보여주거나 숨기는 함수 toggleCalendar를 정의한다
  let toggleCalendar = () => {
    setIsCalendarFolded(!isCalendarFolded);
  };

  let onVisibleMonthsChange = (months) => {
    //첫 번째 보이는 달의 정보를 가져온다
    const month = months[0].dateString;
    setCurrentMonth(month);
  }

  //현재 월과 연도를 추출한다
  let year = new Date(currentMonth).getFullYear();
  let month = new Date(currentMonth).getMonth() + 1;

  // Get the week dates for the current date
  // const getWeekDates = (date: moment.MomentInput) => {
  //   const startOfWeek = moment(date).startOf('week');
  //   return Array.from({ length: 7 }, (_, i) =>
  //     startOfWeek.clone().add(i, 'day').format('YYYY-MM-DD')
  //   );
  // };

  //onLayout 이벤트를 사용하여 CalendarList 컴포넌트의 높이를 동적으로 설정한다
  let onLayout = (event) => {
    let {height} = event.nativeEvent.layout;
    setCalendarHeight(height);
  };

  function moveToTextInputScreen(){
    navigation.navigate('TextInputScreen');
  }
  

  return (
    <>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false} //ScrollView의 스크롤바를 숨긴다
        >
        <View style={styles.header}>
          <Text style={styles.monthText}>{year}년 {month}월</Text>
          <Button title={isCalendarFolded ? "달력 접기" : "달력 펼치기"} onPress={toggleCalendar} />
        </View>
        {/* 캘린더 Component를 접거나 필 구역임 */}
        {isCalendarFolded ? (
          <CalendarList
            style={{
              width: Dimensions.get('window').width,
              alignSelf: 'center',
              overflow: 'hidden',
              height: calendarHeight
            }}
            theme={{
              calendarBackground: "#ffffff",
              dayTextColor: '#000000',
              todayTextColor: '#000000',
              selectedDayTextColor: '#000000',
            }}
            onLayout={onLayout} //CalendarList의 높이를 동적으로 설정하기 위해 props를 넘긴다
            current={currentDate}
            onDayPress={onDayPress} //날짜 선택 함수
            horizontal={true}
            pagingEnabled={true}
            onVisibleMonthsChange={onVisibleMonthsChange}
            renderHeader={() => <></>} //Header를 빈 Component로 대체하여 숨긴다
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#BFE99E'},
              '2024-07-18': {marked: true, dotColor: '#FFB800', activeOpacity: 0},
            }}
          />
        ) : null}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>아침 식사</Text>
          <Text style={styles.section_contents}>아직 추가된 식단이 없어요!</Text>
          <TouchableOpacity onPress={moveToTextInputScreen}>
              <View style={styles.section_Button_long}>
                <Text style={{
                  margin: 16,
                  textAlign: 'center'
                }}>텍스트로 기록하기</Text>
              </View>
            </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>점심 식사</Text>
          {/* 식사 내용(추후 DB에서 불러올 때에는, map 함수를 이용하여 불러오면 될 듯, 지금은 Dummy Data) */}
          <Text style={styles.section_Calories}>3,982kcal</Text>                                      
          <Text style={styles.section_contents}>삼겹살 1근</Text>
          <Text style={styles.section_contents}>BBQ 황금올리브 1마리</Text>
          <Text style={styles.section_contents}>코카콜라 제로 1캔</Text>
          <Text style={styles.section_contents}>멸치쇼핑 땅콩 1줌</Text>

          {/* 수정하기와 세부 영양성분 버튼 */}
          <View style={styles.section_container_horizontal}>
            <TouchableOpacity onPress={()=>{moveToTextInputScreen}}>
              <View style={styles.section_Button_short}>
                <Text style={{
                  margin: 16,
                  textAlign: 'center'
                }}>수정하기</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{}}>
              <View style={styles.section_Button_short}>
                <Text style={{
                  margin: 16,
                  textAlign: 'center'
                }}>세부 영양성분</Text>
              </View>
            </TouchableOpacity>
          </View>
          
        </View>
        <View style={styles.section_Bottom}>
          <Text style={styles.sectionTitle}>저녁 식사</Text>
          <Text style={styles.section_Calories}>740kcal</Text>
          <Text style={styles.section_contents}>삼겹살 1근</Text>
          <Text style={styles.section_contents}>BBQ 황금올리브 1마리</Text>
          <Text style={styles.section_contents}>코카콜라 제로 1캔</Text>
          <Text style={styles.section_contents}>멸치쇼핑 땅콩 1줌</Text>
          
          {/* 수정하기와 세부 영양성분 버튼 */}
          <View style={styles.section_container_horizontal}>
            <TouchableOpacity onPress={()=>{}}>
              <View style={styles.section_Button_short}>
                <Text style={{
                  margin: 16,
                  textAlign: 'center'
                }}>수정하기</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{}}>
              <View style={styles.section_Button_short}>
                <Text style={{
                  margin: 16,
                  textAlign: 'center'
                }}>세부 영양성분</Text>
              </View>
            </TouchableOpacity>
          </View>
          
        </View>
      </ScrollView>
      <BottomSheet ref={bottomSheetRef} snapPoints={['8%', '24%']}>
        <View style={styles.bottomSheetContent}>
          <Text>나의 일일 칼로리 섭취 현황 확인하기</Text>
          {/* <Button title="닫기" onPress={() => bottomSheetRef.current?.close()} /> */}
          <BottomSheetModal onClose={false} MyActivity={3250} TodayEatenCalories={1000}/>
        </View>
      </BottomSheet>
    </>
  );
}

  export default MainScreen;