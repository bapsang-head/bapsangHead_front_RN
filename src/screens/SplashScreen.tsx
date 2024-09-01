import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

//redux-toolkit을 사용하기 위한 import
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from '../store'
import { setHeight, setWeight, setAge, setGender, setActivityLevel, setName, setEmail } from "../slices/accountInfoSlice";


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

            console.log('accessToken: ', accessToken);
            console.log('get 요청 날라온 응답: ', response);

            //response로 넘어온 정보 redux에 저장
            dispatch(setName(response.data.name));
            dispatch(setEmail(response.data.email));
            dispatch(setAge(response.data.age));
            dispatch(setGender(response.data.gender));
            dispatch(setActivityLevel(response.data.activityLevel));
            dispatch(setWeight(response.data.weight));
            dispatch(setHeight(response.data.height));

        }
    } catch (error) {
        console.error('get 요청 중 에러 발생: ', error)
    }
}



//accessToken 유효기간 체킹
async function checkAccessToken(navigation, dispatch: AppDispatch) {

    try {
        const accessToken = await AsyncStorage.getItem('accessToken');

        //accessToken이 AsyncStorage에 존재한다면
        if(accessToken) {
            const decodedAccessToken = jwtDecode(accessToken);

            const currentTime = Date.now() / 1000; //현재 시간을 초 단위로 변환

            if(decodedAccessToken.exp < currentTime) {
                console.log('AccessToken이 만료되었습니다.');
                checkRefreshToken(navigation);
            } else {
                console.log('AccessToken이 유효합니다. 로그인을 진행합니다.');
                fetchUserProfile(accessToken, dispatch);
                
                navigation.replace("TabNavigator"); //로그인을 바로 진행합니다
            }
        } else {
            console.log('accessToken이 asyncStorage에 존재하지 않습니다.');
            navigation.replace("LoginScreen");
        }
        
    } catch (error) {
        console.error('AccessToken 확인하던 도중에 에러 발생함: ', error);
    }
}

//refreshToken을 이용한 체킹 (유효할 시에 이를 이용하여 accessToken 재발급(로그인 수행), 유효하지 않으면 로그인 창으로 이동)
async function checkRefreshToken(navigation) {
    try {
        //백엔드 쪽에서 아직 refreshToken을 이용한 accessToken 재발급 endpoint 제공 X / 우선 재로그인 시도하도록 함
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        if(refreshToken) {
            const decodedRefreshToken = jwtDecode(refreshToken);
            // const currentTime = Date.now() / 1000;

            // if(decodedRefreshToken.exp < currentTime) {
            //     console.log('Refresh Token이 만료되었습니다.');
            //     navigation.replace("LoginScreen");
            // } else {
            //     console.log('Refresh Token이 유효합니다.');
            // }
        } else {
            console.log('refreshToken이 encryptedStorage에 존재하지 않습니다.');
        }
        console.log('내부에 저장된 RefreshToken: ', refreshToken);
        navigation.replace("LoginScreen");
    } catch (error) {
        console.error('RefreshToken 확인하던 도중에 에러 발생함: ', error);
    }
}

function SplashScreen() {
    const navigation = useNavigation(); //navigation 기능 사용을 위한 useNavigation() 훅 사용

     //accountInfo를 초기화하기 위한 코드
     const dispatch: AppDispatch = useDispatch();

    async function loadResourcesAndNavigate() {
        try {
            //리소스 로딩 수행
            await new Promise(resolve => setTimeout(resolve, 2000)); //예시로 1초 대기

            //리소스 로딩 완료 후 적절한 화면으로 전환 (토큰 검사)
            checkAccessToken(navigation, dispatch);
        } catch (error) {
            console.error('리소스 로드 실패', error);
        }
    }

    useEffect(()=>{
        loadResourcesAndNavigate();
    },[navigation]);


    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )

}

export default SplashScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });