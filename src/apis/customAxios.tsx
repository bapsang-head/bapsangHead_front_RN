import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as KakaoLogins from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage'

let navigationRef: any; // Navigation 컨텍스트를 저장할 변수

// 네비게이션 객체 설정 함수
export const setNavigationRef = (navigation: any): void => {
  navigationRef = navigation;
};

//카카오 자동 로그아웃 함수 (공통 처리)
const autoLogOut = async (): Promise<void> => {
    // "Possible Unhandled promise rejection" 오류 해결을 위해 try-catch 구문을 사용한다
    try {
      const logOutString = await KakaoLogins.logout(); // 카카오 로그아웃 수행
      if (logOutString) {
        console.log('카카오 로그아웃 완료:', logOutString);
        // 네트워크 오류 처리
        Alert.alert(
            '자동 로그아웃',
            '카카오 로그인을 위한 AccessToken이 만료되었습니다. 재로그인을 진행해 주세요.',
            [
            {
                text: '확인',
                onPress: () => {
                if (navigationRef) {
                    // 스택 초기화 및 LoginScreen으로 이동
                    navigationRef.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'LoginScreen' }], // 초기화 후 이동할 화면
                    })
                    );
                }
                },
            },
            ]
        );
        await EncryptedStorage.removeItem('refreshToken'); // RefreshToken 삭제
        await AsyncStorage.removeItem('accessToken'); // AccessToken 삭제
  
        // 스택 초기화 후 로그인 화면으로 이동
        if (navigationRef) {
          navigationRef.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
          );
        }
      } else {
        console.error('로그아웃 실패: logOutString이 비어 있음');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
};

// Axios 인스턴스 생성
const customAxios: AxiosInstance = axios.create({
  baseURL: 'http://ec2-15-164-110-7.ap-northeast-2.compute.amazonaws.com:8080',
  timeout: 30000, // 기본 타임아웃 설정 (30초), 추후에 오버라이드 가능
});

// Axios 응답 및 에러 처리
customAxios.interceptors.response.use(
    (response) => response, // 성공적인 응답은 그대로 반환
    async (error) => {

        //요청이 취소된 경우
        if (axios.isCancel(error)) {
            console.warn('bapsanghead: 요청이 취소되었습니다:', error.message);
            return Promise.reject(error);
        }

        // 네트워크 오류인 경우 (서버 응답 없음)
        if (!error.response) {
            console.error('bapsanghead: 네트워크 오류 발생:', error.message);
            Alert.alert(
                '네트워크 오류',
                '네트워크 연결 상태를 확인해주세요.',
                [
                    {
                        text: '확인',
                        onPress: () => {
                            if (navigationRef) {
                                navigationRef.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'LoginScreen' }],
                                    })
                                );
                            }
                        },
                    },
                ]
            );
            return Promise.reject(error); // 네트워크 오류인 경우 요청을 중단
        }

        // 401 에러 처리
        if (error.response.status === 401) {
            console.warn('401 에러 발생: 자동 로그아웃 수행');
            await autoLogOut();
        }

        // 그 외의 서버 응답 에러
        console.error('서버 응답 에러:', error.response?.data);
        return Promise.reject(error);
    }
  );

export default customAxios;