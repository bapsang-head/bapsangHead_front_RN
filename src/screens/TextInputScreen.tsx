import React, {useState, useLayoutEffect, useRef} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

import {styles} from '../styles/styles';

import FixingInputComponent from '@components/FixingInput'
import LoadingComponent from '@components/LoadingComponent'
import SaveCompleteComponent from '@components/SaveCompleteComponent'


function TextInputScreen({route, navigation, appState}){

    let [inputText, setInputText] = useState('');
    let [inputTextAvailable, setInputTextAvailable] = useState(true) //상단의 문장 입력하는 칸에다가 텍스트를 입력할 수 있는 상태 handling
    let [completeBtnAvailable, setCompleteBtnAvailable] = useState(false); //'완료' 버튼을 누를 수 있는 상황인지 확인
    let [subComponentPageNum, setSubComponentPageNum] = useState(0); //화면 하단에 표시되는 Component 페이지 번호 관련 state

    const updateStates = (direction: String) => {
      //'완료' 버튼을 누른 경우
      if(direction === 'forward') {
        if(subComponentPageNum === 0) //subComponentPage가 0일 때 '완료' 버튼을 눌렀다면
        {
          setInputTextAvailable(false); //상단의 문장 입력하는 칸에다가 텍스트를 입력할 수 있는 상태 handling
        }
        setCompleteBtnAvailable(false); //'완료' 버튼은 다시 누를 수 없는 상태가 되어야 한다
        setSubComponentPageNum(prevPageNum => prevPageNum + 1); //subComponentPage 번호를 +1 해준다
      //'뒤로가기' 버튼을 누른 경우
      } else if(direction === 'backward') {
        //각 상황에 맞게 state를 업데이트 해주어야 한다
        if(subComponentPageNum === 2) {
          setInputTextAvailable(true);
          setSubComponentPageNum(prevPageNum => prevPageNum - 2); //subComponentPage 번호를 -2 해준다
        } else if(subComponentPageNum === 4) {
          setSubComponentPageNum(prevPageNum => prevPageNum - 2);
        } else if(subComponentPageNum === 1) {
          setInputTextAvailable(true);
          setSubComponentPageNum(prevPageNum => prevPageNum - 1); //subComponentPage 번호를 -2 해준다
        } else if(subComponentPageNum === 3) {
          setSubComponentPageNum(prevPageNum => prevPageNum - 1); //subComponentPage 번호를 -2 해준다
        }
      }
    }

    const renderSubComponent = () => {
      switch(subComponentPageNum) {
        case 0:
          return null;
        case 1:
          return <LoadingComponent comment="입력내용 분석중입니다" setSubComponentPageNum={setSubComponentPageNum}/>;
        case 2:
          return <FixingInputComponent/>;
        case 3:
          return <LoadingComponent comment="영양성분 분석/저장중입니다" setSubComponentPageNum={setSubComponentPageNum}/>;
        case 4:
          return <SaveCompleteComponent/>
      } 
    }

    //Input 값에 따라서 완료 버튼 누를 수 있는 상태 handling하는 함수
    const handleInputChange = (text) => {
      setInputText(text);
      //Text가 비어 있지 않으면 completeBtnAvailable을 true로 설정, 비어 있으면 false
      setCompleteBtnAvailable(text.trim().length > 0);
    }

    //서버로부터 분석한 결과를 저장하는 state (추후 연동할 것임)
    let [analysisResult, setAnalysisResult] = useState([]);

    const nav = useNavigation(); //네비게이션 사용을 위해 useNavigation() 가져오기

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
                <Text style={styles.titleTextStyleInInputScreen}>드신 음식을 입력해주세요</Text>
            </View>
            <View>
                <TextInput
                    style={[styles.textInputStyle, {marginTop: 24}]}
                    onChangeText={handleInputChange}
                    value={inputText}
                    placeholder="예시) 삼겹살 2근, 콜라 1캔 먹었어."
                    placeholderTextColor={'#a8a8a8'}
                    editable={inputTextAvailable}/>
            </View>
            {
              //subComponent는 아래의 함수에서 조건에 맞게 수행될 것이다
              renderSubComponent()
            }
        </View>

    );
}

export default TextInputScreen;