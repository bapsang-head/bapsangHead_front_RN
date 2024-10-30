//Libarary or styles import
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolate, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { styles } from '../styles/styles';

//svg Icon들 import!
import ArrowUpIcon from '../assets/svg/arrow_drop_up.svg'
import ArrowDownIcon from '../assets/svg/arrow_drop_down.svg'


import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../store";
import { setMarkedDate } from '../slices/markedDateSlice'

import {
  getDate,
  getYear,
  getMonth,
} from "date-fns"

//components import
import BottomSheetModal from '@components/BottomSheetModal';
import Calendar from '@components/Calendar';
import CalendarFolded from '@components/CalendarFolded';
import DetailBottomSheetModal from '@components/DetailBottomSheetModal'
import MainScreenSection from '@components/MainScreenSection';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

//메인화면 Component
function MainScreen({navigation}) {

  const bottomSheetRef = useRef<BottomSheet>(null); // Reference for the bottom sheet

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  let [pointDate, setPointDate] = useState(new Date()); 
  let [isCalendarOpened, setIsCalendarOpened] = useState(false); //Calendar의 visibility를 관리한다

  let [mealInfoDetail_Morning, setMealInfoDetail_Morning] = useState(null); //세부 영양정보 표시를 위해 사용하는 state (추후, 세부영양성분 표시 bottomsheet에 사용 예정)
  let [mealInfoDetail_Lunch, setMealInfoDetail_Lunch] = useState(null); //세부 영양정보 표시를 위해 사용하는 state (추후, 세부영양성분 표시 bottomsheet에 사용 예정)
  let [mealInfoDetail_Dinner, setMealInfoDetail_Dinner] = useState(null); //세부 영양정보 표시를 위해 사용하는 state (추후, 세부영양성분 표시 bottomsheet에 사용 예정)
  let [detailInfo_Time, setDetailInfo_Time] = useState(null); //어느 section에서 세부 영양정보 표시 버튼을 눌렀는지 확인해야 함 (아침, 점심, 저녁 식사 중 하나일 것임)

  //redux에 저장되어 있는 markedDate 정보를 가져온다
  let markedDate = useSelector((state: RootState) => state.markedDate.date);

  //캘린더를 보여주거나 숨기는 함수 toggleCalendar를 정의한다 (의존성 배열로 isCalendarOpened, markedDate를 집어 넣는다)
  let toggleCalendar = useCallback(() => {

    // 렌더링은 markedDate 있는 날짜 기준으로 렌더링 (markedDate와 다를 경우에만 업데이트)
    if (pointDate.toISOString() !== new Date(markedDate).toISOString()) {
      setPointDate(new Date(markedDate));
    }
    
    //Calendar가 펴져 있는지, 접혀 있는지에 대한 상태값을 바꾼다
    setIsCalendarOpened(!isCalendarOpened);
  }, [isCalendarOpened, markedDate, pointDate]);

  //분기해서 세부 영양성분을 잘 출력하는 renderBottomSheet()
  function renderBottomSheet()
  {
    //각 section에 따라 설정을 다르게 해야 한다
    if(detailInfo_Time === '아침 식사'){
      return <DetailBottomSheetModal mealInfoDetail={mealInfoDetail_Morning} />
    } else if(detailInfo_Time === '점심 식사') {
      return <DetailBottomSheetModal mealInfoDetail={mealInfoDetail_Lunch} />
    } else if(detailInfo_Time === '저녁 식사') {
      return <DetailBottomSheetModal mealInfoDetail={mealInfoDetail_Dinner} />
    }
  }

  //'세부 영양성분' BottomSheet 관련 코드
  const translateY = useSharedValue(SCREEN_HEIGHT); //최초의 BottomSheet 위치 (off-screen)
  const startY = useSharedValue(0);  // Shared value to store the starting Y position
  const maxDragUpPosition = 0;  // Maximum position to prevent dragging above this point (change as per your requirement)
  const [detailBS_IsVisible, setDetailBS_IsVisible] = useState(false);

  //Detail BottomSheet에 대한 Animated Style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  //BackDrop에 대한 Animated Style
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, SCREEN_HEIGHT], [0.7, 0]),
  }));

  const openBottomSheet = () => {
    'worklet'; //해당 함수가 worklet으로 취급되도록 한다
    translateY.value = withTiming(50, {duration: 500});
  }

  const closeBottomSheet = () => {
    'worklet'; //해당 함수가 worklet으로 취급되도록 한다
    translateY.value = withTiming(SCREEN_HEIGHT, {duration: 500});
    
    //State 업데이트는 "JS Thread"에서 업데이트 되도록 보장해 주어야 한다
    runOnJS(setDetailBS_IsVisible)(false); //Inline 함수들을 사용하지 말도록 하자
  }

  //DetailBottomSheet를 띄우는 버튼을 클릭했을 때의 동작
  const toggleBottomSheet = (eatingTime: string) => {
    if(detailBS_IsVisible) {
      closeBottomSheet(); 
    } else {
      runOnJS(setDetailBS_IsVisible)(true); //Inline 함수들을 사용하지 말도록 하자
      setDetailInfo_Time(eatingTime);
      openBottomSheet();
    }
  };

  //BottomSheet를 Dragging 하는 것에 대한 Gesture Handler
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      //Gesture를 시작할 때 현재 translateY 값을 저장한다
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      // Update translateY but clamp it so it cannot go higher than 'maxDragUpPosition'
      translateY.value = Math.max(startY.value + event.translationY, maxDragUpPosition);  // Prevent upward dragging beyond 'maxDragUpPosition'
    })
    .onEnd((event) => {
      // Determine whether to close or open the BottomSheet based on the drag distance
      if (event.translationY > 100) {
        closeBottomSheet();
      } else {
        openBottomSheet();
      }
    });
  

  //year, month (기준이 되는 pointDate 기준으로 렌더링)
  let year = getYear(pointDate);
  let month = getMonth(pointDate) + 1;


  return (
    <>
    {
      isCalendarOpened ? (
        //캘린더가 펼쳐져 있는 경우
        <View style={{flex: 1, marginHorizontal: 20}}>
          <View style={styles.header}>
            <Text style={styles.monthText}>{year}년 {month}월</Text>
            <TouchableOpacity onPress={toggleCalendar}>
              <ArrowUpIcon width={36} height={36}/>
            </TouchableOpacity>
          </View>
          <Calendar
            pointDate={pointDate}
            setPointDate={setPointDate}
          />
        </View>
      ) : (
      //캘린더가 접혀져 있는 경우
      <>
        <View style={{flex: 1, marginHorizontal: 20}}>

          <View style={styles.header}>
            <Text style={styles.monthText}>{year}년 {month}월</Text>
            <TouchableOpacity onPress={toggleCalendar}>
              <ArrowDownIcon width={36} height={36}/>
            </TouchableOpacity>
          </View>

          {/* 접힌 한 주치 Calendar가 나올 구역임 */}
          <CalendarFolded
            pointDate={pointDate}
            setPointDate={setPointDate}
          />

          {/* 스크롤 뷰 안에는 아침,점심,저녁 식단 입력을 확인할 수 있는 창들이 나올 것임 */}
          <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 64}}>
            <MainScreenSection 
              eatingTime={'아침 식사'} 
              navigation={navigation} 
              toggleBottomSheet={toggleBottomSheet} 
              markedDate={markedDate} 
              setMealInfoDetail={setMealInfoDetail_Morning}/>
            <MainScreenSection 
              eatingTime={'점심 식사'} 
              navigation={navigation} 
              toggleBottomSheet={toggleBottomSheet} 
              markedDate={markedDate} 
              setMealInfoDetail={setMealInfoDetail_Lunch}/>
            <MainScreenSection 
              eatingTime={'저녁 식사'} 
              navigation={navigation} 
              toggleBottomSheet={toggleBottomSheet} 
              markedDate={markedDate} 
              setMealInfoDetail={setMealInfoDetail_Dinner}/>
          </ScrollView>
        </View>

        {/* 나의 일일 칼로리 섭취 현황 확인하기 */}
        <BottomSheet 
          ref={bottomSheetRef} 
          index={0} //초기 index를 명확히 설정
          snapPoints={['8%', '20%']}
          enablePanDownToClose={false}
          style={{ display: isDetailModalOpen ? 'none' : 'flex'}}> 
          <View style={styles.bottomSheetContent}>
            <Text>나의 일일 칼로리 섭취 현황 확인하기</Text>
            <BottomSheetModal onClose={false} MyActivity={3250} TodayEatenCalories={1000}/>
          </View>
        </BottomSheet>

        {/*세부영양성분 BottomSheet 나올 때의 BackDrop UI*/}
        {
          detailBS_IsVisible && (
            <TouchableWithoutFeedback onPress={closeBottomSheet}>
              <Animated.View style={[MainStyles.backdrop, backdropStyle]} />
            </TouchableWithoutFeedback>
          )
        }

        {/* 세부 영양정보 관련 BottomSheet (세부 영양성분 분석을 위해 mealInfo state를 props로 넘겨준다)*/}
        <Animated.View style={[MainStyles.bottomSheet, animatedStyle]}>
          {/* 드래그가 가능한 부분(상단 부분)을 설정한다 */}
          <GestureDetector gesture={panGesture}>
            <View style={MainStyles.draggableArea}>
              <Text style={MainStyles.dragText}>Drag Area</Text>
            </View>
          </GestureDetector>
          {/* mealInfo가 null이 아니면 DetailBottomSheetModal을 렌더링 */}
          {renderBottomSheet()}
        </Animated.View>

      </>
      )
    }
    </>
    
  );
}

//메인화면 Style 관련 시트
const MainStyles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
  box: {
    height: 120,
    width: 120,
    color: '#f8f9ff',
    backgroundColor: '#b58df1',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  sheetContent: {
    marginTop: 20,
    textAlign: 'center',
  },
  toggleButton: {
    padding: 10,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    margin: 20,
  },
  draggableArea: {
    height: 40,  // Only the top 40px is draggable
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragText: {
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    flex: 1, // 화면 전체를 차지하도록 설정
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
    padding: 20, // 여백 추가
    backgroundColor: '#f0f0f0', // 배경색을 연한 회색으로 설정
  },
});

export default MainScreen;