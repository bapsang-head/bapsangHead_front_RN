//Libarary or styles import
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import { Calendar, CalendarList, LocaleConfig, ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import BottomSheet from '@gorhom/bottom-sheet';
import moment from 'moment';
import { styles } from '../styles/styles';

import * as KakaoLogins from "@react-native-seoul/kakao-login";

import FixBasicInfoIcon from '../assets/svg/build.svg';

import NoExerciseIcon from '../assets/svg/airline_seat_individual_suite.svg';
import LittleExerciseIcon from '../assets/svg/accessibility_new.svg';
import ExerciseIcon from '../assets/svg/directions_run.svg';
import MuchExerciseIcon from '../assets/svg/exercise.svg';
import LogoutIcon from '../assets/svg/logout.svg';


function MyPageScreen({route, navigation}) {

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
        navigation.navigate('LoginScreen');
    }

    console.log("MyPage rendering");

    let [isLogOut, setIsLogOut] = useState(false); //로그아웃이 되었는지 확인한다
    let [logOutString, setLogOutString] = useState(null); 

    let [name, setName] = useState('허준호'); //이름 state
    let [email, setEmail] = useState('gichul@kakao.com'); //이메일 state

    //카카오 로그아웃 수행을 위한 함수
    async function kakaoLogOut() {
        console.log("로그아웃 버튼 눌림");

        //"Possible Unhandled promise rejection" 오류 해결을 위해 try-catch 구문을 사용한다
        try {
            logOutString = await KakaoLogins.logout(); //카카오 로그인 수행
            if (logOutString != null) {
                setIsLogOut(true); //로그인 여부를 true로 변경
                console.log(logOutString); //받아온 정보 log에 찍어보기
                moveToLoginScreen(); //로그인 창으로 다시 이동한다
            } else {
                console.log('로그아웃 정상적으로 안됨!')
            }
        } catch (error) {
            console.log(error);
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
                            source={require('../assets/profile.png')}
                            resizeMode={'stretch'} />
                        <View style={{alignContent: 'center', marginLeft: 16, paddingVertical: 12, justifyContent: 'space-around'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold'}}>{name}</Text>
                            <Text style={{fontSize: 16}}>{email}</Text>
                        </View>
                    </View>
                </View>
                
                {/* 마이페이지의 '신체 기본 정보' Section */}
                <View style={styles.section_inDetailPage}>
                    <Text style={{fontSize: 24, fontWeight: 'bold'}}>신체 기본 정보</Text>
                    <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 20}}>
                        <Text>키</Text>
                        <View style={{flexDirection: 'row', alignContent: 'center'}}>
                            <Text>178</Text>
                            <Text>cm</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 12}}>
                        <Text>몸무게</Text>
                        <View style={{flexDirection: 'row', alignContent: 'center'}}>
                            <Text>74</Text>
                            <Text>kg</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 12}}>
                        <Text>나이</Text>
                        <View style={{flexDirection: 'row', alignContent: 'center'}}>
                            <Text>25</Text>
                            <Text>살</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 12}}>
                        <Text>성별</Text>
                        <View style={{flexDirection: 'row', alignContent: 'center'}}>
                            <Text>남</Text>
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
                    <View style={[styles.activityLevelButton_inMyPage, {backgroundColor: '#FFCED7', marginTop: 10}]}>
                        <MuchExerciseIcon width={48} height={48} fillOpacity={1}/>
                        <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>운동 없으면 못삽니다.</Text>
                            <Text style={{fontSize: 12, paddingTop: 8}}>(평균 주 6~7회 운동)</Text>
                        </View>
                    </View>
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