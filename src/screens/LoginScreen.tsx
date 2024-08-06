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


function LoginScreen({route, navigation})
{
    let [isLogin, setIsLogin] = useState(false); //카카오 계정 로그인 여부를 관리하는 state
    let [kakaoLoginResponse, setKakaoLoginResponse] = useState(null); //카카오 로그인을 최초로 하면 여기에 부가 정보들을 받아올 것이다
    let [profile, setProfile] = useState(null); //카카오 프로필 정보를 관리하는 state

    //카카오 로그인이 성공적으로 되었는데, 회원가입이 안되어 있는 경우(isRegistered===false)이면, 세팅 화면으로 가야 한다
    function moveToSettingScreen(){
        navigation.navigate('SettingScreen');
    }

    //카카오 로그인이 성공적으로 되었는데, 회원가입이 되어 있는 경우(isRegistered===true)이면, 메인으로 바로 가야 한다
    function moveToMainScreen(){
        navigation.navigate('TabNavigator');
    }

    //'Cannot update a component ('...') while rendering a different component ('...') 문제를 해결하기 위해서 useEffect를 사용한다
    // useEffect(() => {
    //     if(isLogin) { //로그인이 되어 있는 경우
    //         moveToSettingScreen(); //세팅 화면으로 이동한다
    //     }
    // },[isLogin]);


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

                console.log(data);

                //axios를 이용한 post 요청에 관하여 시도하는 try-catch 구문
                try {
                    const response = await axios.post(url, data, {
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                        },
                    })
                    
                    //응답 데이터에서에서 "isRegistered", "name" 속성을 추출하여 로그에 출력
                    console.log('가입됨? => ', response.data.isRegistered);
                    console.log('이름이 뭐임? => ', response.data.name);
                    console.log('액세스 토큰은? =>', response.data.accessToken);

                    //가입 여부에 따라 가는 곳이 나뉘어져야 한다 
                    if(response.data.isRegistered)
                    {
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