//Libarary or styles import
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
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

//date와 관련하여 직접 control하기 위한 date-fns 라이브러리 import!
import { 
  getYear,
  getMonth
  } from 'date-fns'; 

//components import
import BottomSheetModal from '@components/BottomSheetModal';
import Calendar from '@components/Calendar';
import CalendarFolded from '@components/CalendarFolded';

//메인화면 Component
function MainScreen({route, navigation}) {

  const bottomSheetRef = useRef<BottomSheet>(null); // Reference for the bottom sheet
  const detailBottomSheetRef = useRef(null); //세부 영양성분에 관한 Bottom Sheet Reference

  

  let [currentDate, setCurrentDate] = useState(new Date()); //현재 Date(날짜) 가져오기
  let [isCalendarFolded, setIsCalendarFolded] = useState(false); //Calendar의 visibility를 관리한다
  let [isSectionFolded, setIsSectionFolded] = useState([true, true, true]); //아침,점심,저녁 식사를 표시한 section을 접었다 폈다 하는 state

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


  //캘린더를 보여주거나 숨기는 함수 toggleCalendar를 정의한다
  let toggleCalendar = useCallback(() => {
    setIsCalendarFolded(!isCalendarFolded);
  }, [isCalendarFolded]);

  //'세부 영양성분' 내용을 담은 Bottom Sheet를 보여주는 함수 showDetailBottomSheet
  // const showDetailBottomSheet = useCallback(() => {
  //   navigation.setOptions({tabBarStyle: {display: 'none'}});
  //   detailBottomSheetRef.current?.present();
  // }, [navigation]);

  //Sheet의 변화를 감지하는 handleSheetChanges(gorhom/bottom-sheet 라이브러리는 인덱스로 -1 값이 들어올 경우, bottomsheet가 닫혔다는 뜻이다)
  // const handleSheetChanges = useCallback((index: number) => {
  //   if (index === -1)
  //   {
  //     navigation.setOptions({ tabBarStyle: {display: 'flex'}});
  //   }
  // }, [navigation]);

  //현재 월과 연도를 추출한다
  //date-fns 라이브러리의 getMonth는 1월달이 0부터 시작한다(즉, +1 해주어야 한다)
  let year = getYear(currentDate);
  let month = (getMonth(currentDate))+1;

  function moveToTextInputScreen(){
    navigation.navigate('TextInputScreen');
  }
  

  return (
    <>
      {
        isCalendarFolded ? (
          //캘린더가 펼쳐져 있는 경우
          <View style={{flex: 1, marginHorizontal: 20}}>
            <View style={styles.header}>
              <Text style={styles.monthText}>{year}년 {month}월</Text>
              <TouchableOpacity onPress={toggleCalendar}>
                <ArrowUpIcon width={36} height={36}/>
              </TouchableOpacity>
            </View>
            <Calendar 
              currentDate={currentDate} 
              setCurrentDate={setCurrentDate}/>
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
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}/>

            {/* 스크롤 뷰 안에는 아침,점심,저녁 식단 입력을 확인할 수 있는 창들이 나올 것임 */}
            <ScrollView showsVerticalScrollIndicator={false}>

              {/* 한 section(아침 식단)의 형태는 아래와 같다. */}
              <View style={styles.section}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  {/* 아침 식사 구역 */}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MorningIcon height={32} width={32} opacity={1}/>
                    <Text style={styles.sectionTitle}>아침 식사</Text>
                  </View>
                  {/* 우측에 붙어있는 화살표 */}
                  <TouchableOpacity onPress={()=>{handleSectionFoldedState(0)}}>
                  {
                    isSectionFolded[0] ? (
                      <SlimArrowDownIcon height={32} width={32} opacity={1}/>
                    ) : (
                      <SlimArrowUpIcon height={32} width={32} opacity={1}/>
                    )
                  }
                  </TouchableOpacity>
                </View>
                {/* Section이 접혀 있는지 아닌지를 확인한다. */}
                {
                  isSectionFolded[0] ? (
                    null
                  ) : (
                    <>
                    <View style={styles.section_contents}>
                      <Text style={{fontSize: 16, fontWeight: 'light'}}>아직 추가된 식단이 없어요!</Text>
                    </View>
                    <TouchableOpacity onPress={moveToTextInputScreen}>
                      <View style={styles.section_Button_long}>
                        <PenIcon height={24} width={24} opacity={1}/>
                        <Text>텍스트로 기록하기</Text>
                      </View>
                    </TouchableOpacity>
                    </>
                  )
                }
                
                
              </View>


              {/* 한 section(점심 식단)의 형태는 아래와 같다. */}
              <View style={styles.section}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  {/* 점심 식사 구역 */}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <LunchIcon height={32} width={32} opacity={1}/>
                    <Text style={styles.sectionTitle}>점심 식사</Text>
                  </View>
                  {/* 우측에 붙어있는 화살표 */}
                  <TouchableOpacity onPress={()=>{handleSectionFoldedState(1)}}>
                  {
                    isSectionFolded[1] ? (
                      <SlimArrowDownIcon height={32} width={32} opacity={1}/>
                    ) : (
                      <SlimArrowUpIcon height={32} width={32} opacity={1}/>
                    )
                  }
                  </TouchableOpacity>
                </View>
                {
                  isSectionFolded[1] ? (
                    null
                  ) : (
                    <>
                    {/* 식사 내용(추후 DB에서 불러올 때에는, map 함수를 이용하여 불러오면 될 듯, 지금은 Dummy Data) */}
                    <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 8, marginLeft: 12}}>3,982kcal</Text>                                      
                    <Text style={{marginVertical: 4, marginLeft: 12}}>삼겹살 1근</Text>
                    <Text style={{marginVertical: 4, marginLeft: 12}}>BBQ 황금올리브 1마리</Text>
                    <Text style={{marginVertical: 4, marginLeft: 12}}>코카콜라 제로 1캔</Text>
                    <Text style={{marginVertical: 4, marginLeft: 12}}>멸치쇼핑 땅콩 1줌</Text>

                    {/* 수정하기와 세부 영양성분 버튼 */}
                    <View style={styles.section_container_horizontal}>
                      <TouchableOpacity onPress={()=>{moveToTextInputScreen}} style={{flex: 3}}>
                        <View style={styles.section_Button_short}>
                          <FixDietIcon height={20} width={20} opacity={1}/>
                          <Text style={{textAlign: 'center', marginLeft: 8, fontSize: 14}}>수정하기</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={{flex: 1}}></View>
                      <TouchableOpacity onPress={()=>{}} style={{flex: 3}}>
                        <View style={styles.section_Button_short}>
                          <WatchDetailsIcon height={20} width={20} opacity={1}/>
                          <Text style={{textAlign: 'center', marginLeft: 8, fontSize: 14}}>세부 영양성분</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    </>
                  )
                }
              </View>
                
              {/* 한 section의 형태는 아래와 같다. */}
              <View style={[styles.section, {marginBottom: 64}]}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  {/* 저녁 식사 구역 */}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <DinnerIcon height={32} width={32} opacity={1}/>
                    <Text style={styles.sectionTitle}>저녁 식사</Text>
                  </View>
                  {/* 우측에 붙어있는 화살표 */}
                  <TouchableOpacity onPress={()=>{handleSectionFoldedState(2)}}>
                  {
                    isSectionFolded[2] ? (
                      <SlimArrowDownIcon height={32} width={32} opacity={1}/>
                    ) : (
                      <SlimArrowUpIcon height={32} width={32} opacity={1}/>
                    )
                  }
                  </TouchableOpacity>
                </View>
                {
                  isSectionFolded[2] ? (
                    null
                  ) : (
                    <>  
                    <View style={styles.section_contents}>
                      <Text style={{fontSize: 16, fontWeight: 'light'}}>아직 추가된 식단이 없어요!</Text>
                    </View>
                    <TouchableOpacity onPress={moveToTextInputScreen}>
                        <View style={styles.section_Button_long}>
                          <PenIcon height={24} width={24} opacity={1}/>
                          <Text>텍스트로 기록하기</Text>
                        </View>
                      </TouchableOpacity>
                    </>
                  )
                }
              </View>
            </ScrollView>
          </View>
          <BottomSheet 
            ref={bottomSheetRef} 
            snapPoints={['8%', '24%']}
            enablePanDownToClose={false}>
            <View style={styles.bottomSheetContent}>
              <Text>나의 일일 칼로리 섭취 현황 확인하기</Text>
              <BottomSheetModal onClose={false} MyActivity={3250} TodayEatenCalories={1000}/>
            </View>
          </BottomSheet>
          {/* <BottomSheet
            ref={detailBottomSheetRef}
            snapPoints={['20%']}
            onChange={handleSheetChanges}>
            <View>
              <Text>안뇽하세요?</Text>
            </View>
          </BottomSheet> */}
        </>
        )
      }
    </>
  );
}

  export default MainScreen;