import React, {useState, useLayoutEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

import {styles} from '../styles/styles';

import FixingInput from '@components/FixingInput'


function TextInputScreen({route, navigation, appState}){

    let [inputText, setInputText] = useState('');
    let [isInputComplete, setIsInputComplete] = useState(false); //'완료' 버튼이 눌렸는지 판단
    let [subComponentPage, setSubComponentPage] = useState(0); //화면 하단에 표시되는 Component의 페이지

    //서버로부터 분석한 결과를 저장하는 state (추후 연동할 것임)
    let [analysisResult, setAnalysisResult] = useState([]);

    const nav = useNavigation(); //네비게이션 사용을 위해 useNavigation() 가져오기

    //완료 버튼을 눌렀을 때의 동작 수행
    const handleDonePress = () => {
        setSubComponentPage(subComponentPage+1);
        alert('Done pressed!');
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
            <TouchableOpacity onPress={() => nav.goBack()}>
              <MaterialCommunityIcons name="chevron-left" size={32} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleDonePress}>
              <Text>완료</Text>
            </TouchableOpacity>
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
                    onChangeText={setInputText}
                    value={inputText}
                    placeholder="예시) 난 오늘 삼겹살 2근, 콜라 1캔 먹었어."
                    placeholderTextColor={'#a8a8a8'}/>
            </View>
            <FixingInput analysisResult={analysisResult}/>
        </View>

    );
}

export default TextInputScreen;