//Libarary or styles import
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, CalendarList, LocaleConfig, ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import { styles } from '../styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

import customAxios from "../apis/customAxios" //커스텀 Axios 호출

//redux-toolkit을 사용하기 위한 import
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from '../store'
import { setHeight, setWeight, setAge, setGender, setActivityLevel, setName, setEmail, calculateActivityMetabolism, calculateBMR } from "../slices/accountInfoSlice";

//내부 encrypted-storage와 async-storage에 접근하기 위해 import
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage'

//SVG 파일들 Import
import HeightIcon from '../assets/svg/height.svg';
import WeightIcon from '../assets/svg/scale.svg';
import AgeIcon from '../assets/svg/timer_play.svg';
import GenderIcon from '../assets/svg/wc.svg';
import ManIcon from '../assets/svg/man_4.svg';
import WomanIcon from '../assets/svg/woman_2.svg';

import NoExerciseIcon from '../assets/svg/airline_seat_individual_suite.svg';
import LittleExerciseIcon from '../assets/svg/accessibility_new.svg';
import ExerciseIcon from '../assets/svg/directions_run.svg';
import MuchExerciseIcon from '../assets/svg/exercise.svg';


//첫 번째 설정 화면 (표지)
function SettingScreen_Page1() {
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center'}}>
            <Text style={{fontSize: 28, fontWeight: 'bold'}}>여러분의 건강관리를 위해</Text>
            <Text style={{fontSize: 28, fontWeight: 'bold'}}>기본 정보가 필요해요!</Text>
        </View>
    )
}

//두 번째 설정 화면
function SettingScreen_Page2() { 
    
    let [manPressed, setManPressed] = useState(false); //남자 버튼이 눌렸을 때
    let [womanPressed, setWomanPressed] = useState(false); //여자 버튼이 눌렸을 때

    //실험용 코드 (redux-toolkit으로 accountInfo를 전역적으로 관리하고 있음)
    let accountInfo = useSelector((state: RootState) => state.accountInfo);

    console.log(accountInfo);

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


    return (
        <View style={styles.container}>
            <Text style={{fontSize: 28, fontWeight: 'bold', paddingLeft: 32, paddingTop: 24}}>기본 정보가 궁금해요!</Text>

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
                        placeholderTextColor={'#a8a8a8'}
                        keyboardType="numeric"/>
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
                        placeholderTextColor={'#a8a8a8'}
                        keyboardType="numeric"/>
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
                        placeholderTextColor={'#a8a8a8'}
                        keyboardType="numeric"/>
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


//세 번째 설정 화면
function SettingScreen_Page3() {

    let [selectedActivityLevel, setSelectedActivityLevel] = useState('');

    //accountInfo를 업데이트하기 위한 코드
    const dispatch: AppDispatch = useDispatch();
    
    
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 28, fontWeight: 'bold', paddingLeft: 32, paddingTop: 24}}>평소의 활동량이 궁금해요!</Text>
            {/* 활동량 표시 버튼을 나열할 것입니다 */}
            <View style={{alignItems: 'center', marginTop: 42}}>

            {/* selectedActivityLevel state 값에 맞게 Rendering을 진행할 것임 (조건문 삽입) */}
            
            {/* '평소 활동이 적습니다' 버튼 */}
            {
                selectedActivityLevel === 'light' ? (
                    <TouchableOpacity onPress={()=>{
                        setSelectedActivityLevel(''); 
                        dispatch(setActivityLevel(null));
                        }}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#f2fcde'}]}>
                            <NoExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>평소 활동이 적습니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 0~1회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={()=>{
                        setSelectedActivityLevel('light');
                        dispatch(setActivityLevel('LOW'));
                        }}>
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
                selectedActivityLevel === 'lightActive' ? (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel(''); dispatch(setActivityLevel(null)); }}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#FFF8D5'}]}>
                            <LittleExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>평소 가볍게 운동합니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 2~3회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('lightActive'); dispatch(setActivityLevel('LIGHT'));}}>
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
                selectedActivityLevel === 'active' ? (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel(''); dispatch(setActivityLevel(null));}}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#FFC3A1'}]}>
                            <ExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>활동적인 편입니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 4~5회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('active'); dispatch(setActivityLevel('MEDIUM'));}}>
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
                selectedActivityLevel === 'veryActive' ? (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel(''); dispatch(setActivityLevel(null));}}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#FFCED7'}]}>
                            <MuchExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>운동 없으면 못삽니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 6~7회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('veryActive'); dispatch(setActivityLevel('HIGH'));}}>
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

//유저 정보 서버로부터 불러와서 redux에 저장하는 함수 (이거는 회원가입하는 처음에만 해당됨)
async function fetchUserProfile_inSignUp(accessToken: any, dispatch: AppDispatch) {
    
    if (!accessToken) {
        console.error('Access token가 존재하지 않습니다');
        return;
    }

    try {
        const url = `/api/v1/users/profile`; //post 요청에 사용할 url 설정
        if(accessToken) {
            //AsyncStorage에 저장되어 있는 accessToken(매개변수로 넘어올 것임)을 이용해서 회원 정보를 불러온다
            const response = await customAxios.get(url, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${accessToken}`, //Authorization 헤더 추가
                },
            })

            console.log('bapsanghead: accessToken은.. ', accessToken);

            //response로 넘어온 정보 redux에 저장
            dispatch(setName(response.data.name));
            dispatch(setEmail(response.data.email));

            //모든 상태가 설정된 후 기초 대사량 및 활동 대사량 계산 후 저장
            dispatch(calculateBMR());
            dispatch(calculateActivityMetabolism());

        }
    } catch (error) {
        console.error('bapsanghead: get 요청 중 에러 발생: ', error)
    }
}

//여기 안에서 Stack Navigator를 만들어서 사용할 수 있도록 한다
let StackInFirstSettings = createNativeStackNavigator();

//초기 설정 창 (추후 수정 창에 재사용 될 예정)
function SettingScreen({Stack, navigation}) {

    console.log('setting screen rendering');

    //accountInfo를 초기화하기 위한 코드
    const dispatch: AppDispatch = useDispatch();

    //실험용 코드 (redux-toolkit으로 accountInfo를 전역적으로 관리하고 있음)
    let accountInfo = useSelector((state: RootState) => state.accountInfo);

    //받은 정보를 바탕으로 서버에 데이터를 전송하는 function (axios 사용 예정)
    async function registerAccount() {

        // Authorization: Bearer {{accessToken}}
        // accessToken

        const beforeRegisterAccessToken = await AsyncStorage.getItem('accessToken') //내부 저장소의 accessToken을 우선 가져온다
        if (!beforeRegisterAccessToken) {
            console.error('Access token가 유실되었습니다. 회원 가입을 더 이상 진행할 수 없습니다.');
            return;
        }
        
        const url = `/api/v1/auth/register`; //post 요청에 사용할 url 설정

        //request body에 포함될 데이터 정의
        const data = {
            height: accountInfo.height,
            weight: accountInfo.weight,
            age: accountInfo.age,
            gender: accountInfo.gender,
            activityLevel: accountInfo.activityLevel
        };

        console.log(data);

        //"Possible Unhandled promise rejection" 오류 해결을 위해 try-catch 구문을 사용한다
        //axios를 이용한 post 요청에 관하여 시도하는 try-catch 구문
        try {

            const response = await customAxios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${beforeRegisterAccessToken}`, //Authorization 헤더 추가
                },
            })
            
            //응답 데이터에서에서 "isRegistered", "name" 속성을 추출하여 로그에 출력
            console.log('userID가 뭐임? => ', response.data.userId);
            console.log('새로 받아온 accessToken이 뭐임? => ', response.data.accessToken)
            console.log('refreshToken이 뭐임? => ', response.data.refreshToken);

            // 새로 받아온 accessToken을 AsyncStorage에 저장
            try {
                await AsyncStorage.setItem('accessToken', response.data.accessToken);
            } catch (storageError) {
                console.error('AsyncStorage 저장 오류:', storageError);
            }

            //새로 불러온 엑세스 토큰과 dispatch 객체를 이용해서, redux 저장소에 정보 저장
            await fetchUserProfile_inSignUp(response.data.accessToken, dispatch); 

            // TabNavigator 화면으로 이동
            navigation.replace('TabNavigator');


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

    return (
        <StackInFirstSettings.Navigator>
            <StackInFirstSettings.Screen 
                name="Page1" 
                component={SettingScreen_Page1} 
                options={{ 
                    //header를 커스텀으로 설정할 수 있음
                    title: '설정',
                    headerTitle: ()=><></>, //headerTitle을 없애기 위해 빈 컴포넌트를 넣는다
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                    },
                    //하단 border(iOS) 혹은 elevation shadow(Android) 제거
                    headerShadowVisible: false,
                    //Android에서 기본 뒤로가기 버튼을 숨기기 위한 옵션
                    headerBackVisible: false,
                    headerRight: () => (
                      <TouchableOpacity onPress={()=>{navigation.navigate('Page2')}}>
                        <Text style={{fontSize: 20}}>다음</Text>
                      </TouchableOpacity>
                    ) 
             }}/>
            <StackInFirstSettings.Screen 
                name="Page2" 
                component={SettingScreen_Page2} 
                options={{ 
                    //header를 커스텀으로 설정할 수 있음
                    title: '설정',
                    headerTitle: ()=><></>, //headerTitle을 없애기 위해 빈 컴포넌트를 넣는다
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                    },
                    //하단 border와 그림자 제거
                    headerShadowVisible: false,
                    //Android에서 기본 뒤로가기 버튼을 숨기기 위한 옵션
                    headerBackVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={()=>{navigation.navigate('Page1')}}>
                          <MaterialCommunityIcons name="chevron-left" size={32}/>
                        </TouchableOpacity>
                      ),
                    headerRight: () => (
                      <TouchableOpacity onPress={()=>{navigation.navigate('Page3')}}>
                        <Text style={{fontSize: 20}}>완료</Text>
                      </TouchableOpacity>
                    ) 
            }}/>
            <StackInFirstSettings.Screen 
                name="Page3" 
                component={SettingScreen_Page3} 
                options={{ 
                    //header를 커스텀으로 설정할 수 있음
                    title: '설정',
                    headerTitle: ()=><></>, //headerTitle을 없애기 위해 빈 컴포넌트를 넣는다
                    headerStyle: {
                      backgroundColor: '#FFFFFF',
                    },
                    //하단 border와 그림자 제거
                    headerShadowVisible: false,
                    //Android에서 기본 뒤로가기 버튼을 숨기기 위한 옵션
                    headerBackVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={()=>{navigation.navigate('Page2')}}>
                          <MaterialCommunityIcons name="chevron-left" size={32}/>
                        </TouchableOpacity>
                      ),
                    headerRight: () => (
                      <TouchableOpacity onPress={()=>{registerAccount();}}>
                        <Text style={{fontSize: 20}}>완료</Text>
                      </TouchableOpacity>
                    ) 
            }}/>
        </StackInFirstSettings.Navigator>
    )
}


export default SettingScreen;
