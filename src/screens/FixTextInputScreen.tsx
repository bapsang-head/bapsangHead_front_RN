import React, {useState, useLayoutEffect, useRef} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import { NavigationContainer, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

import {styles} from '../styles/styles';

import FixingInputComponent from '@components/FixingInput'
import LoadingComponent from '@components/LoadingComponent'
import SaveCompleteComponent from '@components/SaveCompleteComponent'

//foodData는 이전 컴포넌트에서 아래와 같은 type의 배열 형태로 넘어올 것이다.
type simpleFoodData = {
  name: string;
  unit: string;
  count: number;
}

//simpleFoodData 객체들의 배열 타입 정의
type simpleFoodDataArray = simpleFoodData[];

//StackNavigator의 ParamList 타입을 정한다
//TypeScript에서 발생하는 route.params 객체에 eatingTime, markedDate, serverResponse가 없을 수도 있다고 예상할 수 있음
type RootStackParamList = {
  FixTextInputScreen: {
    eatingTime: string;
    markedDate: string;
    simplifiedData: simpleFoodDataArray
  }
}

//식단 수정 화면
function FixTextInputScreen(){
  const nav = useNavigation(); //네비게이션 사용을 위해 useNavigation() 가져오기
  const abortControllerRef = useRef(null); // AbortController를 useRef로 관리

  //route.paramas를 사용해서 navigation 사이에서 파라미터를 받을 것이다 (route 객체의 타입을 명시적으로 정의한다)
  const route = useRoute<RouteProp<RootStackParamList, 'FixTextInputScreen'>>();
  const { eatingTime, markedDate, simplifiedData } = route.params; //넘겨받은 파라미터를 access 한다

  let [completeBtnAvailable, setCompleteBtnAvailable] = useState(false); //'완료' 버튼을 누를 수 있는 상황인지 확인
  let [subComponentPageNum, setSubComponentPageNum] = useState(0); //화면 하단에 표시되는 Component 페이지 번호 관련 state

  //서버로부터 분석한 결과를 저장하는 state (추후 연동할 것임)
  let [analysisResult, setAnalysisResult] = useState([]);

  //사용자가 1차 분석 후 수정을 완료하고 '완료' 버튼을 눌렀는지 여부를 확인하는 state
  let [isFixingCompleted, setIsFixingCompleted] = useState(false);

  const updateStates = (direction: String) => {
    //'완료' 버튼을 누른 경우
    if(direction === 'forward') {
      setCompleteBtnAvailable(false); //'완료' 버튼은 다시 누를 수 없는 상태가 되어야 한다
      setSubComponentPageNum(prevPageNum => prevPageNum + 1); //subComponentPage 번호를 +1 해준다
    //'뒤로가기' 버튼을 누른 경우
    } else if(direction === 'backward') {
      //각 상황에 맞게 state를 업데이트 해주어야 한다
      if(subComponentPageNum === 1) { //영양성분 분석/저장중일 때..
        setSubComponentPageNum(prevPageNum => prevPageNum - 1); //subComponentPage 번호를 -2 해준다
      }
    }
  }

  const renderSubComponent = () => {
    switch(subComponentPageNum) {
      case 0:
        return <FixingInputComponent
                analysisResult={simplifiedData}
                setAnalysisResult={setAnalysisResult}
                completeBtnAvailable={completeBtnAvailable} //'완료' 버튼 활성/비활성화 상태값 추적을 위해
                setCompleteBtnAvailable={setCompleteBtnAvailable}
                isFixingCompleted={isFixingCompleted}
                />;
      case 1:
        return <LoadingComponent comment="영양성분 분석/저장중입니다..." setSubComponentPageNum={setSubComponentPageNum}/>;
      case 2:
        return <SaveCompleteComponent/>
    } 
  }

  //Input 값에 따라서 완료 버튼 누를 수 있는 상태 handling하는 함수
  const handleInputChange = (text) => {
    //Text가 비어 있지 않으면 completeBtnAvailable을 true로 설정, 비어 있으면 false
    setCompleteBtnAvailable(text.trim().length > 0);
  }

  //완료 버튼을 눌렀을 때의 동작 수행
  const handleDonePress = () => {
    setTimeout(()=>{
      console.log('시간 2초 흘러갑니다');
      updateStates('forward');
    }, 2000);
  }

  //useLayoutEffect()를 통해서 header 설정을 TextInputScreen 내부에서 수행한다
  useLayoutEffect(() => {
      nav.setOptions({
        title: '입력',
        headerTitle: () => <></>,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShadowVisible: false,
        headerBackVisible: false,
        headerLeft: () => (
          //수정이 완료된 마지막 페이지에선 뒤로가기 버튼을 없애본다
          subComponentPageNum === 2 ? (
              null
          ) : (
              <TouchableOpacity onPress={() => {
                  if(subComponentPageNum === 0) //subComponent의 맨 첫페이지인 경우
                  {
                    nav.goBack();
                  } else { //그렇지 않은 경우
                    updateStates('backward');
                  }
                }}>
                  <MaterialCommunityIcons name="chevron-left" size={32} />
                </TouchableOpacity>
          )
        ),
        headerRight: () => (
          <>
          {
            completeBtnAvailable ? (
              //완료 버튼을 누를 수 있는 상태인 경우
              <TouchableOpacity onPress={handleDonePress}>
                <Text style={{fontSize: 20, color: 'green', fontWeight: 'bold'}}>완료</Text>
              </TouchableOpacity>
            ) : (
              //완료 버튼을 누를 수 없는 상태인 경우
              <Text style={{fontSize: 20, color: 'gray', fontWeight: 'light'}}>완료</Text>
            )
          }
          </>
        ),
      });
    }, [nav, handleDonePress]);

  

  return (
      <View style={{marginHorizontal: 28}}>
          {/* 제목 쪽 UI */}
          <View style={styles.header}>
              <Text style={styles.titleTextStyleInInputScreen}>식단을 수정해 주세요</Text>
          </View>
          {
            //subComponent는 아래의 함수에서 조건에 맞게 수행될 것이다
            renderSubComponent()
          }
      </View>
  );
}

export default FixTextInputScreen;