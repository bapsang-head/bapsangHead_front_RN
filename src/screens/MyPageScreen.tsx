//Libarary or styles import
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import { styles } from '../styles/styles';

import * as KakaoLogins from "@react-native-seoul/kakao-login";

import EncryptedStorage from 'react-native-encrypted-storage'

import FixBasicInfoIcon from '../assets/svg/build.svg';

import NoExerciseIcon from '../assets/svg/airline_seat_individual_suite.svg';
import LittleExerciseIcon from '../assets/svg/accessibility_new.svg';
import ExerciseIcon from '../assets/svg/directions_run.svg';
import MuchExerciseIcon from '../assets/svg/exercise.svg';
import LogoutIcon from '../assets/svg/logout.svg';

//redux-toolkit을 사용하기 위한 import
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from '../store'
import { setHeight, setWeight, setAge, setGender, setActivityLevel, setEmail, setName } from "../slices/accountInfoSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';


function MyPageScreen({route, navigation}) {

    //accountInfo를 초기화하기 위한 코드
    const dispatch: AppDispatch = useDispatch();

    //실험용 코드 (redux-toolkit으로 accountInfo를 전역적으로 관리하고 있음)
    let accountInfo = useSelector((state: RootState) => state.accountInfo);

    function initializeAccountInfo() {
        dispatch(setEmail(null));
        dispatch(setName(null));
        dispatch(setHeight(null));
        dispatch(setWeight(null));
        dispatch(setAge(null));
        dispatch(setGender(null));
        dispatch(setActivityLevel(null));
    }

    //활동량 수정창으로 이동하는 Action
    function moveToActivityLevelFixScreen() {
        navigation.navigate('ActivityLevelFixScreen');
    }

    //'신체 기본 정보' 수정창으로 이동하는 Action
    function moveToFixBasicDataScreen() {
        navigation.navigate('FixBasicDataScreen');
    }

    //로그인 화면으로 다시 이동하는 Action (로그아웃 시에 사용)
    function moveToLoginScreen() {
        navigation.replace('LoginScreen');
    }

    console.log("MyPage rendering");
    console.log('accountInfo: ', accountInfo);

    let logOutString = null; //logOut 후에 서버로부터 받아오는 정보(string)

    //카카오 로그아웃 수행을 위한 함수
    async function kakaoLogOut() {
        console.log("로그아웃 버튼 눌림");

        //"Possible Unhandled promise rejection" 오류 해결을 위해 try-catch 구문을 사용한다
        try {
            logOutString = await KakaoLogins.logout(); //카카오 로그인 수행
            if (logOutString != null) {
                console.log(logOutString); //받아온 정보 log에 찍어보기
                await EncryptedStorage.removeItem('refreshToken'); //refreshToken 삭제
                await AsyncStorage.removeItem('accessToken'); //accessToken 삭제
                initializeAccountInfo(); //회원 정보 초기화
                moveToLoginScreen(); //로그인 창으로 다시 이동한다
            } else {
                console.log('로그아웃 정상적으로 안됨!')
            }
        } catch (error) {
            console.log(error);
        }
    }

    function ActivityButton() {
        //'평소 활동이 적습니다' 버튼을 출력해야 하는 경우
        if(accountInfo.activityLevel === 'LOW')
        {
            return (
                <View style={[styles.activityLevelButton_inMyPage, {backgroundColor: '#f2fcde', marginTop: 10}]}>
                    <NoExerciseIcon width={48} height={48} fillOpacity={1}/>
                    <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>평소 활동이 적습니다.</Text>
                        <Text style={{fontSize: 12, paddingTop: 8}}>(평균 주 0~1회 운동)</Text>
                    </View>
                </View>
            )
        } else if(accountInfo.activityLevel === 'LIGHT') {
            return (
                <View style={[styles.activityLevelButton_inMyPage, {backgroundColor: '#FFF8D5', marginTop: 10}]}>
                    <LittleExerciseIcon width={48} height={48} fillOpacity={1}/>
                    <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>평소 가볍게 운동합니다.</Text>
                        <Text style={{fontSize: 12, paddingTop: 8}}>(평균 주 2~3회 운동)</Text>
                    </View>
                </View>
            )
        } else if(accountInfo.activityLevel === 'MEDIUM') {
            return (
                <View style={[styles.activityLevelButton_inMyPage, {backgroundColor: '#FFC3A1', marginTop: 10}]}>
                    <ExerciseIcon width={48} height={48} fillOpacity={1}/>
                    <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>활동적인 편입니다.</Text>
                        <Text style={{fontSize: 12, paddingTop: 8}}>(평균 주 4~5회 운동)</Text>
                    </View>
                </View>
            )
        } else if(accountInfo.activityLevel === 'HIGH') {
            return (
                <View style={[styles.activityLevelButton_inMyPage, {backgroundColor: '#FFCED7', marginTop: 10}]}>
                    <MuchExerciseIcon width={48} height={48} fillOpacity={1}/>
                    <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>운동 없으면 못삽니다.</Text>
                        <Text style={{fontSize: 12, paddingTop: 8}}>(평균 주 6~7회 운동)</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={[styles.activityLevelButton_inMyPage, {backgroundColor: '#FFCED7', marginTop: 10}]}>
                    <NoExerciseIcon width={48} height={48} fillOpacity={1}/>
                    <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>살려주세요</Text>
                        <Text style={{fontSize: 12, paddingTop: 8}}>(코딩 그만하고 싶어요 ㅜㅜ)</Text>
                    </View>
                </View>
            )
        }
    }

    return (
        <View style={{marginHorizontal: 20}}>
            {/* 상단 header는 고정한다(ScrollView에 포함시키지 X) */}
            <View style={styles.header}>
                <Text style={styles.titleTextStyle}>마이페이지</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* 마이페이지의 맨 위쪽 프로필 Section */}
                <View style={styles.section_inDetailPage}>
                    <View style={{flexDirection: 'row', alignContent: 'center'}}>
                        <Image 
                            style={styles.profileImageCircle} 
                            source={require('../assets/default_profile.png')}
                            resizeMode={'stretch'} />
                        <View style={{alignContent: 'center', marginLeft: 16, paddingVertical: 12, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold'}}>{accountInfo.name}</Text>
                            <Text style={{fontSize: 16}}>{accountInfo.email}</Text>
                        </View>
                    </View>
                </View>
                
                {/* 마이페이지의 '신체 기본 정보' Section */}
                <View style={styles.section_inDetailPage}>
                    <Text style={{fontSize: 24, fontWeight: 'bold'}}>신체 기본 정보</Text>
                    <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 20}}>
                        <Text>키</Text>
                        <View style={{flexDirection: 'row', alignContent: 'center'}}>
                            <Text>{accountInfo.height}</Text>
                            <Text>cm</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 12}}>
                        <Text>몸무게</Text>
                        <View style={{flexDirection: 'row', alignContent: 'center'}}>
                            <Text>{accountInfo.weight}</Text>
                            <Text>kg</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 12}}>
                        <Text>나이</Text>
                        <View style={{flexDirection: 'row', alignContent: 'center'}}>
                            <Text>{accountInfo.age}</Text>
                            <Text>살</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 12}}>
                        <Text>성별</Text>
                        <View style={{flexDirection: 'row', alignContent: 'center'}}>
                            {
                                accountInfo.gender === 'MALE' ? (
                                    <Text>남</Text>
                                ) : (
                                    <Text>여</Text>
                                )
                            }
                        </View>
                    </View>
                    <TouchableOpacity onPress={moveToFixBasicDataScreen}>
                        <View style={[styles.section_Button_long, {marginTop: 20}]}>
                            <FixBasicInfoIcon width={24} height={24}/>
                            <Text>기본정보 수정하기</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={moveToActivityLevelFixScreen}>
                    <ActivityButton/>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems: 'center'}} onPress={kakaoLogOut}>
                    <View style={[styles.logout_Button, {marginVertical: 10, width: 120}]}>
                        <LogoutIcon width={28} height={28} fillOpacity={1}/>
                        <Text style={{fontSize: 12}}>로그아웃</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
        
        
    );
}

export default MyPageScreen;