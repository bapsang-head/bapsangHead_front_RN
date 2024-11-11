//Libarary or styles import
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import { Calendar, CalendarList, LocaleConfig, ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import BottomSheet from '@gorhom/bottom-sheet';
import moment from 'moment';
import { styles } from '../styles/styles';
import axios, {isCancel, AxiosError} from 'axios';

import * as KakaoLogins from "@react-native-seoul/kakao-login";

//redux-toolkit을 사용하기 위한 import
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from '../store'
import { setName, setEmail, setAge, setGender, setActivityLevel, setHeight, setWeight, calculateBMR, calculateActivityMetabolism } from "../slices/accountInfoSlice";
import { setMealInput } from '../slices/mealInputSlice';

import { format, subMonths, addMonths } from 'date-fns'; //날짜 formatting을 위해 date-fns 함수를 사용할 것임

//내부 encrypted-storage와 async-storage에 접근하기 위해 import
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage'

//유저 정보 서버로부터 불러와서 redux에 저장하는 함수
async function fetchUserProfile(accessToken: any, dispatch: AppDispatch) {

    try {

        const url = `http://ec2-15-164-110-7.ap-northeast-2.compute.amazonaws.com:8080/api/v1/users/profile`; //post 요청에 사용할 url 설정
        if(accessToken) {
            //AsyncStorage에 저장되어 있는 accessToken(매개변수로 넘어올 것임)을 이용해서 회원 정보를 불러온다
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${accessToken}`, //Authorization 헤더 추가
                },
            })

            console.log('get 요청 날라온 응답: ', response.data);

            //response로 넘어온 정보 redux에 저장
            dispatch(setName(response.data.name));
            dispatch(setEmail(response.data.email));
            dispatch(setAge(response.data.age));
            dispatch(setGender(response.data.gender));
            dispatch(setActivityLevel(response.data.activityLevel));
            dispatch(setWeight(response.data.weight));
            dispatch(setHeight(response.data.height));

            //모든 상태가 설정된 후 기초 대사량 및 활동 대사량 계산 후 저장
            dispatch(calculateBMR());
            dispatch(calculateActivityMetabolism());
            
        }
    } catch (error) {
        console.error('get 요청 중 에러 발생: ', error)
    }
}

//월별 식단 입력 정보 데이터를 서버로부터 불러와서 redux에 저장하는 함수
async function fetchMealInput(accessToken: any, dispatch: AppDispatch) {

    try {
        let currentMonth = format(new Date(), 'yyyy-MM'); //현재 날짜를 YYYY-MM 형식으로 formatting
        let previousMonth = format(subMonths(new Date(), 1), 'yyyy-MM'); //currentMonth 기준 이전 달 값 가져오기
        let nextMonth = format(addMonths(new Date(), 1), 'yyyy-MM'); //currentMonth 기준 다음 달 값 가져오기

        //요청할 url들을 배열로 묶어서 추후 map 함수를 이용해서 한 번에 처리할 것이다
        const urls = [
            `http://ec2-15-164-110-7.ap-northeast-2.compute.amazonaws.com:8080/api/v1/foods/records/year-month/${previousMonth}`,
            `http://ec2-15-164-110-7.ap-northeast-2.compute.amazonaws.com:8080/api/v1/foods/records/year-month/${currentMonth}`,
            `http://ec2-15-164-110-7.ap-northeast-2.compute.amazonaws.com:8080/api/v1/foods/records/year-month/${nextMonth}`,
        ];

        if(accessToken) {
            //AsyncStorage에 저장되어 있는 accessToken(매개변수로 넘어올 것임)을 이용해서 회원 정보를 불러온다 (3번 요청하므로, map 함수 사용)
            const [prevData, currentData, nextData] = await Promise.all(
                urls.map(url => axios.get(url, {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                }))
            );

            // 받아온 데이터를 redux에 각각 저장
            dispatch(setMealInput({ month: previousMonth, mealData: prevData.data }));
            dispatch(setMealInput({ month: currentMonth, mealData: currentData.data }));
            dispatch(setMealInput({ month: nextMonth, mealData: nextData.data }));
            console.log(currentMonth, '기준으로 잘 불러옴!');
        }
    } catch (error) {
        console.error('Meal Input 데이터 불러오는 중 에러 발생: ', error);
    }
}

//로그인 화면!
function LoginScreen({navigation})
{
    let [kakaoLoginResponse, setKakaoLoginResponse] = useState(null); //카카오 로그인을 최초로 하면 여기에 부가 정보들을 받아올 것이다

    //accountInfo를 초기화하기 위한 코드
    const dispatch: AppDispatch = useDispatch();

    const accountInfo = useSelector((state: RootState) => state.accountInfo);

    //카카오 로그인이 성공적으로 되었는데, 회원가입이 안되어 있는 경우(isRegistered===false)이면, 세팅 화면으로 가야 한다
    function moveToSettingScreen(){
        navigation.replace('SettingScreen');
    }

    //카카오 로그인이 성공적으로 되었는데, 회원가입이 되어 있는 경우(isRegistered===true)이면, 메인으로 바로 가야 한다
    function moveToMainScreen(){
        navigation.replace('TabNavigator');
    }


    //카카오 로그인 수행을 위한 함수 (async 함수)
    async function loginWithKakao() {
        console.log("버튼 눌림");

        let provider = 'kakao'; //oAuth 제공자 이름(provider)를 설정한다
        const url = `http://ec2-15-164-110-7.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/login/${provider}`; //post 요청에 사용할 url 설정


        //"Possible Unhandled promise rejection" 오류 해결을 위해 try-catch 구문을 사용한다
        try {
            kakaoLoginResponse = await KakaoLogins.login(); //카카오 로그인 수행
            if (kakaoLoginResponse != null) {

                //request body에 포함될 데이터 정의
                const data = {
                    tokenType: 'Bearer',
                    accessToken: kakaoLoginResponse.accessToken
                };
                
                console.log(kakaoLoginResponse);
                console.log(data);

                //axios를 이용한 post 요청에 관하여 시도하는 try-catch 구문
                try {
                    const response = await axios.post(url, data, {
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                        },
                    })
                    
                    //응답 데이터에서 "isRegistered", "name" 속성을 추출하여 로그에 출력
                    console.log('가입됨? => ', response.data.isRegistered);
                    console.log('이름이 뭐임? => ', response.data.name);

                    //내부 저장소에 accessToken 저장
                    await AsyncStorage.setItem(
                        'accessToken',
                        response.data.accessToken
                    )

                    //내부 '보안' 저장소에 refreshToken 저장
                    await EncryptedStorage.setItem(
                        'refreshToken',
                        response.data.refreshToken
                    )

                    //가입 여부에 따라 이동하는 Screen이 달라져야 한다 
                    if(response.data.isRegistered)
                    {
                        fetchUserProfile(response.data.accessToken, dispatch);
                        fetchMealInput(response.data.accessToken, dispatch);

                        console.log('저장된 계정 정보: ', accountInfo);
                        moveToMainScreen(); //메인 화면으로 간다
                    } else {
                        moveToSettingScreen(); //Setting 스크린으로 간다
                    }
                    
                } catch (error) {
                    if(error.response) {
                        console.error('Response error: ', error.response.data);
                    } else if(error.request) {
                        console.error('Request error: ', error. request);
                    } else {
                        console.error('Error: ', error.message);
                    }
                }
            }
             
        } catch (error) {
            console.error('kakao login error: ', error.message);
        }
    }


    return (
        <>
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center'}}>
            <View>
                <Image source={require("../assets/app_Logo.png")} style={{width: 160, height: 160}}/>
                <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>밥상머리</Text>
            </View>
            <TouchableOpacity style={{marginTop: 80}} onPress={()=>{loginWithKakao()}}> 
                <Image source={require("../assets/kakao_login_medium_wide.png")} style={{width: 300, height: 45}}/>
            </TouchableOpacity>
        </View>
        </>
    )

}

export default LoginScreen;