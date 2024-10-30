//Libarary or styles import
import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, ScrollView, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import { styles } from '../styles/styles';

//svg Icon들 import!
import MorningIcon from '../assets/svg/morning.svg'
import LunchIcon from '../assets/svg/lunch.svg'
import DinnerIcon from '../assets/svg/dinner.svg'
import PenIcon from '../assets/svg/pen.svg'
import SlimArrowDownIcon from '../assets/svg/slimArrow_Down.svg'
import SlimArrowUpIcon from '../assets/svg/slimArrow_Up.svg'
import WatchDetailsIcon from '../assets/svg/watch_detail.svg'
import FixDietIcon from '../assets/svg/fix_diet.svg'

import { parseISO, format } from 'date-fns';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'

function returnIcon(eatingTime: String) {
    if(eatingTime === '아침 식사')
    {
        return (<MorningIcon height={32} width={32} opacity={1}/>);
    } 
    else if(eatingTime === '점심 식사')
    {
        return (<LunchIcon height={32} width={32} opacity={1}/>);
    }
    else if(eatingTime === '저녁 식사')
    {
        return (<DinnerIcon height={32} width={32} opacity={1}/>);
    } else {
        return null; //해당하지 않는 경우 null 반환
    }
}

//유저의 특정 날짜에 대한 식단 정보를 받아오기 위한 fetchMealInfo
async function fetchMealInfo(eatingTime: string, formattedDate: string) {

  let mealType: string = null;
  
  //들어온 값에 맞는 mealType을 지정해준다
  if(eatingTime === '아침 식사') {
    mealType = 'BREAKFAST';
  } else if(eatingTime === '점심 식사') {
    mealType = 'LUNCH'
  } else if(eatingTime === '저녁 식사') {
    mealType = 'DINNER'
  }

  try {
      const accessToken = await AsyncStorage.getItem('accessToken'); //accessToken을 우선 가져온다
      const url = `http://ec2-15-164-110-7.ap-northeast-2.compute.amazonaws.com:8080/api/v1/foods/records/date/${formattedDate}/type/${mealType}`; //get 요청에 사용할 url 설정
      if(accessToken) {
          //AsyncStorage에 저장되어 있는 accessToken(매개변수로 넘어올 것임)을 이용해서 response를 받아올 것이다
          const response = await axios.get(url, {
              headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization': `Bearer ${accessToken}`, //Authorization 헤더 추가
              },
          })

          console.log('accessToken: ', accessToken);

          //응답이 배열인지 확인하고, 배열이 비어있는지 체크
          if(Array.isArray(response.data) && response.data.length === 0) {
            console.log('응답 배열이 비어있습니다.');
            return null; //빈 배열일 경우 null return
          } else {
            return response.data; //비어 있지 않은 경우 Data를 반환
          }
      }
  } catch (error) {
      console.error('get 요청 중 에러 발생: ', error)
      return null;
  }
}

//간단한 식단 정보(name, unit, count)만을 포함하는 data로 가공하는 function
function makeSimpleFoodData(response: any)
{
  return response.map(data => ({
    name: data.name,
    unit: data.unit,
    count: data.count
  }));
}

//칼로리 계산하기
function calculateTotalCalories(mealInfo: any) {

  const transformedResult = mealInfo.map(item => ({
      //칼로리 필요한 경우 소수점 둘째 자리까지 반올림하여 계산 (계산식 적용)
      calorie: Math.round((item.calorie) * ((item.gram) / 100) * item.count)
  }));
  
  //총 칼로리 값을 계산한다(reduce 함수 활용)
  const totalCalories = transformedResult.reduce((result, item) => {
      result.calorie += item.calorie;
      return result;
  }, {calorie: 0});

  return totalCalories.calorie;
}

//상황에 맞게 Section을 만들어낼 것이다
function MainScreenSection({eatingTime, navigation, toggleBottomSheet, markedDate, setMealInfoDetail}) {

    let [isSectionFolded, setIsSectionFolded] = useState(true); //section을 접었다 폈다 하는 state
    let [simplifiedData, setSimplifiedData] = useState(null); //서버에서 받아온 정보를 가공해서 name, unit, count만을 저장한 state
    let [totalCalories, setTotalCalories] = useState(0); //각 section마다 표시해 줄 total Calorie를 state로 나타낸다
    let [checkNull, setCheckNull] = useState(true); //section이 펼쳐질 때 확인해야 하는 값(불러온 게 null이면 true, 아니면 false) 

    //markedDate가 변할 때마다 sectionFolded는 true로 설정되어야 한다. (=선택한 날짜가 바뀔 때마다 카드 섹션은 접혀야 한다.)
    useEffect(() => {
      setIsSectionFolded(true);
    },[markedDate]);


    // simplifiedData가 변경될 때마다 로그를 출력하는 useEffect 추가
    useEffect(() => {
      if (simplifiedData) {
        console.log('간단해진 식단 정보: ', simplifiedData);
      }
    }, [simplifiedData]);

    //section을 toggle할 때 사용하는 함수
    async function toggleSection(eatingTime: string, markedDate: string) {
      const parsedDate = parseISO(markedDate);
      const formattedDate = format(parsedDate, 'yyyy-MM-dd');  // 원하는 형식으로 변환
      if(isSectionFolded) { 
        let response = await fetchMealInfo(eatingTime, formattedDate) //section을 펼칠 땐 식단 정보를 가져와야 한다 (await 키워드를 활용해 비동기 함수가 끝난 후 데이터가 출력하도록 코드를 수정해야 함)

        console.log('formattedDate: ', formattedDate);
        console.log('서버에서 가져온 게 뭔데?: ', response);
        
        //response가 null이 아닐 때에만 simplifiedData를 response를 이용해서 만들어 낸다. 
        if(response !== null)
        {
          setSimplifiedData(makeSimpleFoodData(response)); //간단하게 가공한 정보를 simplifiedData 값으로 설정
          setTotalCalories(calculateTotalCalories(response)) //로컬(section 컴포넌트)에 칼로리를 계산하여 저장한다
          setCheckNull(false); //이 값이 false가 됨으로써, section을 펼칠 것이다
        }
        setMealInfoDetail(response) //서버에서 불러온 전체 정보도 저장한다 (세부 영양성분 보여줄 때 필요하거든 / props로 받은 setMealInfo() state 변경함수 활용)
      }
      setIsSectionFolded(!isSectionFolded); //section을 접었다 폈다 하는 state 변화 주기
    } 

    //간단한 식단 정보(simplifiedData)를 출력하는 메소드
    function returnMealInfo() {
      if(!checkNull) { //식단 정보가 불려와 졌으면
        return (
          <>
          {/* 식단 정보 출력 */}
          <Text style={{marginTop: 12, marginLeft: 12, fontSize: 24, fontWeight: 'bold'}}>{totalCalories}kcal</Text>
          {simplifiedData.map((item, index) => (
            <View key={index}>
              <Text style={{marginVertical: 4, marginLeft: 12}}>{item.name} {item.count}{item.unit}</Text>
            </View>
          ))}

          {/* 수정하기와 세부 영양성분 버튼 */}
          <View style={styles.section_container_horizontal}>
            <TouchableOpacity onPress={moveToFixTextInputScreen} style={{flex: 3}}>
              <View style={styles.section_Button_short}>
                <FixDietIcon height={20} width={20} opacity={1}/>
                <Text style={{textAlign: 'center', marginLeft: 8, fontSize: 14}}>수정하기</Text>
              </View>
            </TouchableOpacity>
            <View style={{flex: 1}}></View>
            <TouchableOpacity onPress={()=>toggleBottomSheet(eatingTime)} style={{flex: 3}}>
              <View style={styles.section_Button_short}>
                <WatchDetailsIcon height={20} width={20} opacity={1}/>
                <Text style={{textAlign: 'center', marginLeft: 8, fontSize: 14}}>세부 영양성분</Text>
              </View>
            </TouchableOpacity>
          </View>
          </>
          
        )
      } else { //식단 정보가 불려져 오지 않았다면
        return (
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
    }

    //navigation 이동 관련 함수 moveToTextInputScreen, moveToFixTextInputScreen
    function moveToTextInputScreen() {
      navigation.navigate('TextInputScreen', {
        eatingTime: eatingTime, //eatingTime 관련한 정보를 넘겨준다
        markedDate: markedDate,
      });
    }

    function moveToFixTextInputScreen() {
        navigation.navigate('FixTextInputScreen', {
          eatingTime: eatingTime, //eatingTime 관련한 정보를 넘겨준다
          markedDate: markedDate,
          simplifiedData: simplifiedData //서버에서 불러온 정보를 토대로 가공한 정보도 넘겨준다
        });
    }

    return (
        <View style={SectionStyles.section}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                {/* 각 상황에 맞게 렌더링 */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* returnIcon 함수 호출 */}
                    {returnIcon(eatingTime)}
                    <Text style={styles.sectionTitle}>{eatingTime}</Text>
                </View>
                {/* 우측에 붙어있는 화살표 */}
                <TouchableOpacity onPress={()=>toggleSection(eatingTime, markedDate)}>
                {
                  isSectionFolded ? (
                    <SlimArrowDownIcon height={32} width={32} opacity={1}/>
                  ) : (
                    <SlimArrowUpIcon height={32} width={32} opacity={1}/>
                  )
                }
                </TouchableOpacity>
            </View>
            {/* section이 접혀있는지 아닌지에 따라서 다른 결과를 렌더링한다 */}
            {
                isSectionFolded ? (
                  null
                ) : (
                  returnMealInfo()
                )
              }
        </View>
    );
}

//Section에 관해 사용할 StyleSheet
const SectionStyles = StyleSheet.create({
    //section 박스 스타일
    section: {
        backgroundColor: '#f0ffd4',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
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
        backgroundColor: '#bbf3be',
    },
    //Main 화면의 section 안에 들어가는 버튼 style (긴 버전)
    section_Button_long: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 76,
        height: 48,
        borderRadius: 18,
        backgroundColor: '#bbf3be',
    },
});

export default MainScreenSection;