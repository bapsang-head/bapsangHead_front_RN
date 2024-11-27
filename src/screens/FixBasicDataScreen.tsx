//Libarary or styles import
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { styles } from '../styles/styles';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

//redux-toolkit을 사용하기 위한 import
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from '../store'
import { setHeight, setWeight, setAge, setGender, calculateBMR } from "../slices/accountInfoSlice";

import AsyncStorage from '@react-native-async-storage/async-storage'
import customAxios from '../apis/customAxios'

//SVG 파일들 Import
import HeightIcon from '../assets/svg/height.svg';
import WeightIcon from '../assets/svg/scale.svg';
import AgeIcon from '../assets/svg/timer_play.svg';
import GenderIcon from '../assets/svg/wc.svg';
import ManIcon from '../assets/svg/man_4.svg';
import WomanIcon from '../assets/svg/woman_2.svg';

function FixBasicDataScreen() {

    //실험용 코드 (redux-toolkit으로 accountInfo를 전역적으로 관리하고 있음)
    let accountInfo = useSelector((state: RootState) => state.accountInfo);

    console.log(accountInfo);

    //accountInfo에 저장되어 있는 값을 기준으로 해당 값들을 배정한다
    let [manPressed, setManPressed] = useState(accountInfo.gender === 'MALE' ? true : false); //남자 버튼이 눌렸을 때
    let [womanPressed, setWomanPressed] = useState(accountInfo.gender === 'FEMALE' ? true : false); //여자 버튼이 눌렸을 때

    //아래 3개의 값만 필요할 듯 (gender는 버튼 선택으로 정해지니까..)
    let height = accountInfo.height;
    let weight = accountInfo.weight;
    let age = accountInfo.age;

    //accountInfo를 업데이트하기 위한 코드
    const dispatch: AppDispatch = useDispatch();
    
    //height 입력값을 handling
    const handleHeightChange = (text: string) => {
        const heightValue = text ? parseInt(text, 10) : null;
        dispatch(setHeight(heightValue))
    };

    //weight 입력값을 handling
    const handleWeightChange = (text: string) => {
        const weightValue = text ? parseInt(text, 10) : null;
        dispatch(setWeight(weightValue));
    };

    //age 입력값을 handling
    const handleAgeChange = (text: string) => {
        const ageValue = text ? parseInt(text, 10) : null;
        dispatch(setAge(ageValue));
    };

    const nav = useNavigation(); //네비게이션 사용을 위해 useNavigation() 가져오기

    //'완료' 버튼을 눌렀을 때의 동작 수행
    const handleDonePress = () => {
        updateUserBasicInfo();
        Alert.alert(
            '수정 완료', // Alert의 제목
            '유저 기본 정보 수정이 완료되었습니다.', // Alert의 내용
            [
                {
                    text: '확인', // 버튼 텍스트
                    onPress: () => console.log('확인 버튼 클릭됨'), // 버튼 클릭 시 동작
                },
            ]
        );
    }

    async function updateUserBasicInfo() {
        const accessToken = await AsyncStorage.getItem('accessToken') //내부 저장소의 accessToken을 우선 가져온다


        //변경하고자 하는 데이터를 객체 형태로 정의한다
        const updatedData = {
            height: accountInfo.height,
            weight: accountInfo.weight,
            age: accountInfo.age,
            gender: accountInfo.gender,
        };
        
        console.log('accessToken: ', accessToken);
        console.log(updatedData);

        try {
            //PATCH 요청을 보낸다
            const response = await customAxios.patch(
                '/api/v1/users/profile',
                updatedData, //변경할 데이터를 요청에 포함한다
                {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${accessToken}`, //Authorization 헤더 추가
                    }
                }
            );

            dispatch(calculateBMR()); //BMR 값 변경 (이와 관련된 height, weight, age가 변경되었기 때문)
            //성공적으로 요청이 완료되었을 경우의 처리
            console.log('성공적으로 기본 정보 수정 완료되었습니다. 이에 따라 기초 대사량 값도 변경되었습니다: ', response.data);
            
            nav.goBack();
        } catch (error) {
            //요청 실패 시의 에러 처리
            console.error('기본 정보 수정에 실패했습니다: ', error);
            nav.goBack();
        }
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
        <View style={styles.container}>
            <Text style={{fontSize: 28, fontWeight: 'bold', paddingLeft: 32, paddingTop: 24}}>신체 기본 정보 수정하기</Text>

            {/* 정보 입력 Layout들을 모아 놓은 상단 View */}
            <View style={{paddingLeft: 32, paddingTop: 32, paddingRight: 84}}>
                {/* 키 입력란 */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <HeightIcon width={32} height={32}/>
                    <Text style={{fontSize: 20, marginLeft: 8, fontWeight: 'bold'}}>키</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
                    <TextInput
                        style={[styles.settingInputButton, {flex: 1}]}
                        onChangeText={handleHeightChange}
                        value={height !== null ? height.toString() : ''}
                        placeholder="178"
                        placeholderTextColor={'#a8a8a8'}/>
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 8}}>cm</Text>
                </View>

                {/* 몸무게 입력란 */}
                <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
                    <WeightIcon width={32} height={32}/>
                    <Text style={{fontSize: 20, marginLeft: 8, fontWeight: 'bold'}}>몸무게</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
                    <TextInput
                        style={[styles.settingInputButton, {flex: 1}]}
                        onChangeText={handleWeightChange}
                        value={weight !== null ? weight.toString() : ''}
                        placeholder="72"
                        placeholderTextColor={'#a8a8a8'}/>
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 8}}>kg</Text>
                </View>

                {/* 나이 입력란 */}
                <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
                    <AgeIcon width={32} height={32}/>
                    <Text style={{fontSize: 20, marginLeft: 8, fontWeight: 'bold'}}>나이</Text>
                </View>
                {/* getWidth 함수를 onLayout 옵션으로 넘겨서 width 정보를 받아올 것이다 */}
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
                    <TextInput
                        style={[styles.settingInputButton, {flex: 1}]}
                        onChangeText={handleAgeChange}
                        value={age !== null ? age.toString() : ''}
                        placeholder="25"
                        placeholderTextColor={'#a8a8a8'}/>
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 8}}>세</Text>
                </View>

                {/* 성별 선택란 */}
                <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
                    <GenderIcon width={32} height={32}/>
                    <Text style={{fontSize: 20, marginLeft: 8, fontWeight: 'bold'}}>성별</Text>
                </View>
                <View style={{flexDirection: 'row', 
                    alignItems: 'center',
                    marginTop: 16, 
                    justifyContent: 'space-between'}}>

                    {/* '남성' 버튼을 누를 경우엔 여성 버튼은 선택 해제시켜야 한다. 그 반대도 마찬가지. */}
                    <TouchableOpacity 
                        onPress={()=>{
                            //이미 버튼이 눌려있는 경우, 눌려있지 않은 경우에 대해서 이벤트를 달리 처리한다.
                            if(manPressed)
                            {
                                setManPressed(false);
                                dispatch((setGender(null))); //gender 선택 null
                            } else {
                                setWomanPressed(false);
                                setManPressed(true);
                                dispatch((setGender('MALE'))); //gender 선택 null
                            }
                        }}  
                        style={{flex: 3}}>
                        {
                            //눌렸을 때와 안눌렸을 때의 스타일 차이가 있다.
                            manPressed ? (
                                <View style={[styles.genderSelectButton, {backgroundColor: '#FFE7D1', borderColor: '#FFE7D1'}]}>
                                    <ManIcon width={24} height={24} opacity={1} fill='#FFA858'/>
                                    <Text style={{fontSize: 16, opacity: 1}}>남성</Text>
                                </View>
                            ) : (
                                <View style={[styles.genderSelectButton]}>
                                    <ManIcon width={24} height={24} opacity={0.3} fill='black'/>
                                    <Text style={{fontSize: 16, opacity: 0.3}}>남성</Text>
                                </View>
                            )
                        }
                        
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>{/* 비율 Layout을 위한 빈 View */}
                    <TouchableOpacity 
                        onPress={()=>{
                            //이미 버튼이 눌려있는 경우, 눌려있지 않은 경우에 대해서 이벤트를 달리 처리한다.
                            if(womanPressed)
                            {
                                setWomanPressed(false);
                                dispatch((setGender(null))); //gender 선택 null
                            } else {
                                setManPressed(false);
                                setWomanPressed(true);
                                dispatch((setGender('FEMALE'))); //gender 선택 null
                            }
                        }} 
                        style={{flex: 3}}>
                        {
                            //눌렸을 때와 안 눌렸을 때의 스타일 차이가 있다.
                            womanPressed ? (
                                <View style={[styles.genderSelectButton, {backgroundColor: '#FFE5E5', borderColor: '#FFE5E5'}]}>
                                    <WomanIcon width={24} height={24} opacity={1} fill='#FFB6B6'/>
                                    <Text style={{fontSize: 16, opacity: 1}}>여성</Text>
                                </View>
                            ) : (
                                <View style={styles.genderSelectButton}>
                                    <WomanIcon width={24} height={24} opacity={0.3} fill='black'/>
                                    <Text style={{fontSize: 16, opacity: 0.3}}>여성</Text>
                                </View>
                            )
                        }
                        
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default FixBasicDataScreen;