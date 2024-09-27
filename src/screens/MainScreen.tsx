//Libarary or styles import
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, ScrollView, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import moment from 'moment';
import { styles } from '../styles/styles';

//svg Icon들 import!
import ArrowUpIcon from '../assets/svg/arrow_drop_up.svg'
import ArrowDownIcon from '../assets/svg/arrow_drop_down.svg'
import MorningIcon from '../assets/svg/morning.svg'
import LunchIcon from '../assets/svg/lunch.svg'
import DinnerIcon from '../assets/svg/dinner.svg'
import PenIcon from '../assets/svg/pen.svg'
import SlimArrowDownIcon from '../assets/svg/slimArrow_Down.svg'
import SlimArrowUpIcon from '../assets/svg/slimArrow_Up.svg'
import WatchDetailsIcon from '../assets/svg/watch_detail.svg'
import FixDietIcon from '../assets/svg/fix_diet.svg'

import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

import AsyncStorage from '@react-native-async-storage/async-storage'

//메인화면 Component
function MainScreen({route, navigation}) {

  const bottomSheetRef = useRef<BottomSheet>(null); // Reference for the bottom sheet
  const detailBottomSheetRef = useRef(null); //세부 영양성분에 관한 Bottom Sheet Reference

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  let [pointDate, setPointDate] = useState(new Date()); 
  let [isCalendarOpened, setIsCalendarOpened] = useState(false); //Calendar의 visibility를 관리한다


  let [isSectionFolded, setIsSectionFolded] = useState([true, true, true]); //아침,점심,저녁 식사를 표시한 section을 접었다 폈다 하는 state
  
  let [loadedDietData, setLoadedDietData] = useState(null);

  //redux에 저장되어 있는 markedDate 정보를 가져온다
  let markedDate = useSelector((state: RootState) => state.markedDate.date);

  //markedDate를 업데이트 하기 위한 코드
  const dispatch: AppDispatch = useDispatch();
  const updateMarkedDate = (date: string) => {
    dispatch(setMarkedDate(date));
  }

  //식단 정보는 markedDate가 변할 때만 불러오면 된다
  useEffect(()=>{
    let imsi = loadDietData(markedDate);
    setLoadedDietData(imsi);
  },[markedDate]);
  

  //AsyncStorage에 저장된 식단 정보를 불러오는 함수
  const loadDietData = async (date) => {
    try {
      const jsonValue = await AsyncStorage.getItem(`diet_${date}`);
      return jsonValue != null ? JSON.parse(jsonValue) : null; //불러온 정보가 null이 아니면, parsing하여 돌려주고, 아니면 null을 돌려준다.
    } catch (e) {
      console.error('AsyncStorage로부터 식단 Data를 불러오는 데 실패했습니다.');
    }
  };


  //section을 접고, 피고, 할 수 있도록 하는 함수
  //배열로 된 state는 상태를 변경할 때, 아래와 같은 형태를 따라야 한다
  function handleSectionFoldedState(index: Number) {
    const sectionFolded = isSectionFolded.map((a, i) => {
      if (i === index) {
        //해당하는 곳은 boolean 값을 반전시킨다
        return !a;
      } else {
        //변경할 필요가 없는 나머지는 반환한다.
        return a;
      }
    });
    setIsSectionFolded(sectionFolded);
  }


  //캘린더를 보여주거나 숨기는 함수 toggleCalendar를 정의한다 (의존성 배열로 isCalendarOpened, markedDate를 집어 넣는다)
  let toggleCalendar = useCallback(() => {

    //렌더링은 markedDate 있는 날짜 기준으로 렌더링 되어야 한다
    setPointDate(new Date(markedDate));
    
    //Calendar가 펴져 있는지, 접혀 있는지에 대한 상태값을 바꾼다
    setIsCalendarOpened(!isCalendarOpened);
  }, [isCalendarOpened, markedDate]);

  //'세부 영양성분' 내용을 담은 Bottom Sheet를 보여주는 함수 showDetailBottomSheet
  const showDetailBottomSheet = useCallback(() => {
    setIsDetailModalOpen(true);
    navigation.setOptions({tabBarStyle: {display: 'none'}});
    bottomSheetRef.current.close();
    detailBottomSheetRef.current.snapToIndex(0);
  }, [navigation]);

  //Sheet의 변화를 감지하는 handleSheetChanges(gorhom/bottom-sheet 라이브러리는 인덱스로 -1 값이 들어올 경우, bottomsheet가 닫혔다는 뜻이다)
  const handleSheetChanges = useCallback((index: number) => {
    if(index === -1) //bottom sheet가 닫혔을 때
    {
      setIsDetailModalOpen(false);
      navigation.setOptions({ tabBarStyle: {display: 'flex'}});
      bottomSheetRef.current.snapToIndex(0); //기존의 bottom sheet 다시 표시
    } 
    
  }, [navigation]);

  //커스텀 backdrop component
  const renderBackDrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5} //투명도 설정
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'gray'}}
      />
    ),
    []
  );

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
          <ScrollView showsVerticalScrollIndicator={false}>
            <MainScreenSection eatingTime={'아침 식사'} navigation={navigation}/>
            <MainScreenSection eatingTime={'점심 식사'} navigation={navigation}/>
            <MainScreenSection eatingTime={'저녁 식사'} navigation={navigation}/>
          </ScrollView>
        </View>

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

        <BottomSheet
          ref={detailBottomSheetRef}
          index={-1} //초기 index를 명확히 설정
          snapPoints={['60%']}
          enablePanDownToClose={true} //스크롤로 닫을 수 있도록 설정
          onChange={handleSheetChanges} //인덱스 변화 감지
          backdropComponent={renderBackDrop} //Custom Backdrop 적용
          >
          <View>
            <DetailBottomSheetModal onClose={false}/>
          </View>
        </BottomSheet>
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
  parent: {
    width: 200,
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
});

export default MainScreen;