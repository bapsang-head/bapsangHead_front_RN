//Libarary or styles import
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import { Calendar, CalendarList, LocaleConfig, ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import { styles } from '../styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

import NoExerciseIcon from '../assets/svg/airline_seat_individual_suite.svg';
import LittleExerciseIcon from '../assets/svg/accessibility_new.svg';
import ExerciseIcon from '../assets/svg/directions_run.svg';
import MuchExerciseIcon from '../assets/svg/exercise.svg';

import AsyncStorage from '@react-native-async-storage/async-storage'

//redux-toolkit을 사용하기 위한 import
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from '../store'
import { setHeight, setWeight, setAge, setGender, setActivityLevel } from "../slices/accountInfoSlice";

//세 번째 설정 화면
function ActivityLevelFixScreen({route, navigation, appState}) {

    //실험용 코드 (redux-toolkit으로 accountInfo를 전역적으로 관리하고 있음)
    let accountInfo = useSelector((state: RootState) => state.accountInfo);

    //초기 상태는 redux에 저장되어 있는(초기에 서버에서 불러온 유저 정보) activityLevel 정보로 초기화
    let [selectedActivityLevel, setSelectedActivityLevel] = useState(accountInfo.activityLevel);


    //accountInfo를 업데이트하기 위한 코드
    const dispatch: AppDispatch = useDispatch();

    const nav = useNavigation(); //네비게이션 사용을 위해 useNavigation() 가져오기

    //활동량을 수정하고 서버에 patch 요청 날리는 updateUserActivityLevel 함수
    async function updateUserActivityLevel() {
        const accessToken = await AsyncStorage.getItem('accessToken') //내부 저장소의 accessToken을 우선 가져온다


        //변경하고자 하는 데이터를 객체 형태로 정의한다
        const updatedData = {
            activityLevel: selectedActivityLevel //activityLevel을 선택된 활동량(LIGHT, MEDIUM 등)으로 변경
        };
        
        console.log('accessToken: ', accessToken);
        console.log(updatedData);

        try {
            //PATCH 요청을 보낸다
            const response = await axios.patch(
                'http://ec2-15-164-110-7.ap-northeast-2.compute.amazonaws.com:8080/api/v1/users/profile',
                updatedData, //변경할 데이터를 요청에 포함한다
                {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${accessToken}`, //Authorization 헤더 추가
                    }
                }
            );

            //성공적으로 요청이 완료되었을 경우의 처리
            console.log('성공적으로 활동량 수정 완료되었습니다: ', response.data);
            dispatch(setActivityLevel(selectedActivityLevel)); //redux에 저장되어 있는 activityLevel 정보 수정
            nav.goBack();
        } catch (error) {
            //요청 실패 시의 에러 처리
            console.error('활동량 수정 실패했습니다: ', error);
            nav.goBack();
        }
    }

    //'완료' 버튼을 눌렀을 때의 동작 수행
    const handleDonePress = () => {
        updateUserActivityLevel();
        alert('유저 활동량 수정이 완료되었습니다.');
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
            <Text style={{fontSize: 28, fontWeight: 'bold', paddingLeft: 32, paddingTop: 24}}>평소 활동량이 변했나요?</Text>
            {/* 활동량 표시 버튼을 나열할 것입니다 */}
            <View style={{alignItems: 'center', marginTop: 42}}>
            
            {/* selectedActivityLevel state 값에 맞게 Rendering을 진행할 것임 (조건문 삽입) */}
            
            {/* '평소 활동이 적습니다' 버튼 */}
            {
                selectedActivityLevel === 'LOW' ? (
                    <TouchableOpacity onPress={()=>{setSelectedActivityLevel('')}}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#f2fcde'}]}>
                            <NoExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>평소 활동이 적습니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 0~1회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={()=>{setSelectedActivityLevel('LOW')}}>
                        <View style={styles.activityLevelButton}>
                            <NoExerciseIcon width={40} height={40} fillOpacity={0.3}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 0.3}}>
                                <Text style={{fontSize: 16}}>평소 활동이 적습니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 0~1회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }

            {/* '평소 가볍게 운동합니다' 버튼 */}
            {
                selectedActivityLevel === 'LIGHT' ? (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('')}}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#FFF8D5'}]}>
                            <LittleExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>평소 가볍게 운동합니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 2~3회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('LIGHT')}}>
                        <View style={styles.activityLevelButton}>
                            <LittleExerciseIcon width={40} height={40} fillOpacity={0.3}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 0.3}}>
                                <Text style={{fontSize: 16}}>평소 가볍게 운동합니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 2~3회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }

            {/* '활동적인 편입니다' 버튼 */}
            {
                selectedActivityLevel === 'MEDIUM' ? (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('')}}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#FFC3A1'}]}>
                            <ExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>활동적인 편입니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 4~5회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('MEDIUM')}}>
                        <View style={styles.activityLevelButton}>
                            <ExerciseIcon width={40} height={40} fillOpacity={0.3}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 0.3}}>
                                <Text style={{fontSize: 16}}>활동적인 편입니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 4~5회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }

            {/* '운동 없으면 못삽니다.' 버튼 */}
            {
                selectedActivityLevel === 'HIGH' ? (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('')}}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#FFCED7'}]}>
                            <MuchExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>운동 없으면 못삽니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 6~7회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('HIGH')}}>
                        <View style={styles.activityLevelButton}>
                            <MuchExerciseIcon width={40} height={40} fillOpacity={0.3}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 0.3}}>
                                <Text style={{fontSize: 16}}>운동 없으면 못삽니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 6~7회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }
            </View>
        </View>
    )
}

export default ActivityLevelFixScreen;