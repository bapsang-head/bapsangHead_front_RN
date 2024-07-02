//Libarary or styles import
import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, CalendarList, LocaleConfig } from 'react-native-calendars';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import moment from 'moment';
import { styles } from './styles/styles';

//svg import
import MainIcon from './assets/MainIcon';

//components import
import BottomSheetModal from '@components/BottomSheetModal';

// Define the type for the navigation stack
type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};
 
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
LocaleConfig.defaultLocale = 'ko';

// Create the stack navigator
let Stack = createNativeStackNavigator<RootStackParamList>();
let Tab = createBottomTabNavigator();

function MainScreen() {
  const [isCalendarVisible, setIsCalendarVisible] = useState(true); // State to control the visibility of the calendar
  const bottomSheetRef = useRef<BottomSheet>(null); // Reference for the bottom sheet
  const currentDate = moment().format('YYYY-MM-DD'); // Get the current date

  // Function to toggle the calendar visibility
  let toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  // Get the week dates for the current date
  const getWeekDates = (date: moment.MomentInput) => {
    const startOfWeek = moment(date).startOf('week');
    return Array.from({ length: 7 }, (_, i) =>
      startOfWeek.clone().add(i, 'day').format('YYYY-MM-DD')
    );
  };

  const weekDates = getWeekDates(currentDate);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.monthText}>{moment().format('YYYY년 M월')}</Text>
          <Button title={isCalendarVisible ? "달력 접기" : "달력 펼치기"} onPress={toggleCalendar} />
        </View>

        {/* Calendar component */}
        {isCalendarVisible ? (
          <CalendarList
            current={currentDate}
            markedDates={{
              [currentDate]: { selected: true, marked: true, selectedColor: 'green' },
            }}
            hideExtraDays
            theme={{
              calendarBackground: 'white',
              textSectionTitleColor: 'black',
              selectedDayBackgroundColor: 'green',
              selectedDayTextColor: 'white',
              todayTextColor: 'green',
              dayTextColor: 'black',
              textDisabledColor: 'gray',
              dotColor: 'green',
              selectedDotColor: 'green',
              arrowColor: 'black',
              monthTextColor: 'black',
              indicatorColor: 'green',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
            horizontal
            pagingEnabled
            hideDayNames
            showScrollIndicator={false}
            style={{ height: 350 }}  // 원하는 높이로 설정합니다.
          />
        ) : (
          <View style={styles.weekContainer}>
            {weekDates.map((date) => (
              <View key={date} style={styles.dayContainer}>
                <Text style={date === currentDate ? styles.selectedDay : styles.day}>
                  {moment(date).format('D')}
                </Text>
                <Text style={date === currentDate ? styles.selectedDayText : styles.dayText}>
                  {moment(date).format('dd')}
                </Text>
              </View>
            ))}
          </View>
)}


        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>아침 식사</Text>
          </TouchableOpacity>
          <Text>아직 추가된 식단이 없어요!</Text>
          <Button title="텍스트로 기록하기" onPress={() => {}} />
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>점심 식사</Text>
          </TouchableOpacity>
          <Text>3,982kcal</Text>
          <Text>삼겹살 1근</Text>
          <Text>BBQ 황금올리브 1마리</Text>
          <Text>코카콜라 제로 1캔</Text>
          <Text>멸치쇼핑 땅콩 1줌</Text>
          <Button title="수정하기" onPress={() => {}} />
          <Button title="세부 영양성분" onPress={() => {}} />
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>저녁 식사</Text>
          </TouchableOpacity>
          <Text>1234</Text>
        </View>
      </ScrollView>
      <BottomSheet ref={bottomSheetRef} snapPoints={['9%', '24%']}>
        <View style={styles.bottomSheetContent}>
          <Text>나의 일일 칼로리 섭취 현황 확인하기</Text>
          {/* <Button title="닫기" onPress={() => bottomSheetRef.current?.close()} /> */}
          <BottomSheetModal onClose={false} MyActivity={3250} TodayEatenCalories={990}/>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

// Details screen component
function DetailsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Details Screen</Text>
    </SafeAreaView>
  );
}

//MyPage screen component
function MyPageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>MyPage Screen</Text>
    </SafeAreaView>
  );
}


// Bottom Tab Navigator component
function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Main" 
        component={MainScreen} 
        options={{ 
          tabBarLabel: '메인',
          tabBarIcon: ({ color, size }) => (
            <MainIcon darkMode={false} size={32} color={'red'}/>
          ),
          }} />
      <Tab.Screen name="Details" component={DetailsScreen} options={{ tabBarLabel: '상세' }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ 
        tabBarLabel: '마이페이지',
        // tabBarIcon: ({ color, size }) => (
        //   <MyPageIcon darkMode={false} size={24} color={"green"} />
        // ),
        }} />
    </Tab.Navigator>
  );
}

// Main App component
function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;