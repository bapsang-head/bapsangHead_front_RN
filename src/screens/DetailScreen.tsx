//Libarary or styles import
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from '../styles/styles';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

import { RootState } from '../store';

import { useIsFocused, CommonActions, useNavigation } from '@react-navigation/native'; //해당 화면이 포커스 되었을 때를 감지하기 위한 훅 useIsFocused

import { 
    format,
    subWeeks,
    subDays,
    addDays,
    getMonth,
    getDate
    } from 'date-fns'; //달력을 직접 만들기 위한 date-fns 라이브러리 import!

import {
    LineChart,
  } from "react-native-chart-kit";

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'

//해당 화면에선 로그아웃을 위해 필요한 import들
import EncryptedStorage from 'react-native-encrypted-storage';
import * as KakaoLogins from "@react-native-seoul/kakao-login";

//7일 전까지의 날짜를 배열로 만든다
function makeDayList()
{
    let lastDay = new Date(); //오늘 날짜 정보를 가져온다
    let firstDay = addDays(subWeeks(lastDay, 1), 1); //한 주를 빼고, 거기에 하루를 더해서 첫 날을 가져온다

    let dayList = [];

    let i = 0;

    //firstDay와 lastDay가 다를 동안만 해당 while문을 반복한다
    //Date 객체는 참조 타입(reference type), firstDay 값을 push할 때는 실제로는 firstDay 객체의 참조를 dayList 배열에 추가하는 것!
    //따라서, 이후에 firstDay 객체의 값이 변경되면, dayList의 모든 요소가 같은 값을 참조하게 됨.
    //'date-fns' 라이브러리의 'addDays' 함수는 원본 'Date' 객체를 변경하지 않고 새로운 'Date' 객체를 반환한다. 따라서, 반환값을 사용하면 됨.
    while(i<=6)
    {
        dayList.push(getDate(firstDay));
        firstDay = addDays(firstDay, 1);
        i++;
    }
    
    return dayList;
}

//불러온 해당 월(currentMonth)의 식단 정보 형태를 MealData로 정의한다
interface MealData {
    date: string;
    식단입력여부: string;
}

//accessToken 만료로 인한 오류 발생 시 자동 로그아웃 수행을 위한 autoLogOut 함수
async function autoLogOut(navigation) {
    // 로그아웃이 필요할 때 alert 창을 띄워 알림
    alert("accessToken이 만료되어 로그아웃을 수행합니다");
  
    // "Possible Unhandled promise rejection" 오류 해결을 위해 try-catch 구문을 사용한다
    try {
        const logOutString = await KakaoLogins.logout(); // 카카오 로그아웃 수행
        if (logOutString != null) {
            console.log(logOutString); // 받아온 정보 log에 찍어보기
            await EncryptedStorage.removeItem('refreshToken'); // refreshToken 삭제
            await AsyncStorage.removeItem('accessToken'); // accessToken 삭제
            navigation.dispatch(
              CommonActions.reset({
                index: 0, //Navigation Stack에 'LoginScreen'만 남도록 설정
                routes: [
                  {name: 'LoginScreen'}
                ]
              })
            );
        } else {
            console.log('로그아웃 정상적으로 안됨!');
        }
    } catch (error) {
        console.log(error);
    }
}

// 총 칼로리만 계산하는 함수
function calculateTotalCalories(mealInfo: any) {
    const totalCalories = mealInfo.reduce((total: number, item: any) => {
        const calorie = Math.round(item.calorie * (item.gram / 100) * item.count);
        return total + calorie;
    }, 0);

    return totalCalories;
}


//'데이터 분석' 페이지
function DetailScreen() {
    console.log("Detail rendering");

    const isFocused = useIsFocused(); //여기로 왔을 경우.. 포커싱
    let navigation = useNavigation(); //자동 로그아웃을 위한.. navigation 객체 하나 선언

    let [currentDate, setCurrentDate] = useState(new Date()); // 초기값 현재 달 (state는 Date 객체로 관리 후, 필요한 곳에 적절히 활용 예정)
    let [parentWidth, setParentWidth] = useState(0); //부모 컴포넌트의 너비를 받아오기 위한 State      

    let [dayOfAllInputs, setDayOfAllInputs] = useState(0); //모두 입력한 날
    let [dayOfSomeInputs, setDayOfSomeInputs] = useState(0); //일부만 입력한 날
    let [dayOfNothingInputs, setDayOfNothingInputs] = useState(0); //아무것도 입력하지 않은 날

    let [dayList, setDayList] = useState(makeDayList());
    let [caloriesChartData, setCaloriesChartData] = useState({ //기본값을 우선 지정은 해 놓는다
        labels: dayList,
        datasets: [
            {
                data: [1000, 1000, 1000, 1000, 1000, 1000, 1000]
            }
        ]
    });

    let activityMetabolism = Math.round(useSelector((state: RootState) => state.accountInfo.activityMetabolism)); //redux 저장소에 저장되어 있는 활동대사량 값 가져오기
    let [averageEatenCaloriesOfWeek, setAverageEatenCaloriesOfWeek] = useState(0); //평균 섭취 칼로리
    
    //특정한 월의 식단 입력 데이터만 가져온다
    const monthlyMealData: MealData[] = useSelector(
        (state: RootState) => state.mealInput.data[format(currentDate, 'yyyy-MM')] || []
    ); //redux 저장소에 있는 정보를 불러올 것이다

    //오늘 먹은 칼로리를 계산하는 메소드 calculateTodayEatenCalories()
    async function calculateTodayEatenCalories(date: string): Promise<number> {
        const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];
        let totalTodayEatenCalories = 0;

        try {
            const accessToken = await AsyncStorage.getItem('accessToken'); //accessToken을 우선 가져온다
            if(!accessToken) //accessToken이 존재하지 않다면
            {
                console.error('Access Token이 존재하지 않습니다');
                return null;
            }

            //mealTypes 배열을 순회하며 요청을 지속해서 날린다
            for(const mealType of mealTypes) {
                const url = `http://ec2-15-164-110-7.ap-northeast-2.compute.amazonaws.com:8080/api/v1/foods/records/date/${date}/type/${mealType}`;
                const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${accessToken}`,
                },
                });

                if (Array.isArray(response.data) && response.data.length === 0) { //응답 배열이 비어 있다면..
                    console.log(`날짜 ${date}, 식사 타입 ${mealType}에 대한 응답 배열이 비어 있습니다.`);
                    continue;
                }

                totalTodayEatenCalories += calculateTotalCalories(response.data); //총 칼로리 계산
            }

        } catch(error) {
            if(error.response?.status === 401) {
                console.log("인증 에러: 401 - 자동 로그아웃 수행");
                await autoLogOut(navigation); //자동 로그아웃 함수 호출
                return null;  // 자동 로그아웃 이후 null 반환
            } else {
                console.error('오늘의 칼로리를 계산하는 중 에러가 발생했습니다:', error);
                return null;
            }
        }

        return totalTodayEatenCalories;
    }

    //calculateTodayEatenCalories()를 이용해서 주별로 먹은 칼로리를 계산하는 메소드 calculateWeekEatenCalories()
    async function calculateWeekEatenCalories(endDate: string): Promise<number[] | null> {
        let caloriesValueArray: number[] = []; // 각 요일별 칼로리를 저장할 배열
        let totalCalories = 0; //평균을 계산하기 위해 모든 요일의 칼로리를 합산
    
        for (let i = 0; i < 7; i++) {
            const date = format(subDays(new Date(endDate), i), 'yyyy-MM-dd');
            const dailyCalories = await calculateTodayEatenCalories(date);
            
            if (dailyCalories !== null) {
                caloriesValueArray.push(dailyCalories);
                totalCalories += dailyCalories; //평균을 내기 위해 우선은 각 요일별 섭취 칼로리를 다 더한다
            } else {
                caloriesValueArray.push(0); // dailyCalories가 null인 경우 0으로 설정
            }
        }

        // 평균 계산 후 상태 업데이트(정수로 반올림하기 위해 Math.round 함수 사용)
        const averageCalories = Math.round(totalCalories / 7);
        setAverageEatenCaloriesOfWeek(averageCalories);
    
        return caloriesValueArray.reverse(); // 배열을 반대로 하여 시작 날짜부터 순서대로 반환
    }

    //해당 화면이 포커싱될 때마다 수행한다 (isFocused 훅 사용)
    useEffect(() => {
        if(isFocused) //useEffect 내부에서 isFocused가 true일 때만 로직을 실행하도록 조건 추가 / 해당 화면이 실제로 focus될 때만 아래의 구문을 수행하도록 함
        {
            async function fetchWeekCaloriesInfo() {
                try {
                    // 각 요일별 칼로리 총합을 계산하고 상태로 저장
                    const responseArray = await calculateWeekEatenCalories('2024-11-15'); // endDate를 원하는 날짜로 설정 (현재는 하드코딩 해놓음, 추후 format(currentDate, 'yyyy-MM-dd')로 바꿀 것임)
                    setCaloriesChartData({labels: dayList, datasets: [{data: responseArray}]})
    
    
                } catch (error) {
                    console.error("요일별 칼로리 계산 중 오류 발생: ", error);
                }
            }
    
            let countOf_NONE = 0;
            let countOf_ENTERING = 0;
            let countOf_COMPLETE = 0;
    
            //map 함수를 이용해서 불러온 식단 입력 정보(monthlyMealData)를 순회하며 값 확인
            monthlyMealData.map((meal) => {
                if(meal.식단입력여부 === 'NONE'){
                    countOf_NONE = countOf_NONE + 1;
                } else if(meal.식단입력여부 === 'ENTERING') {
                    countOf_ENTERING = countOf_ENTERING + 1;
                } else if(meal.식단입력여부 === 'COMPLETE') {
                    countOf_COMPLETE = countOf_COMPLETE + 1;
                }
            })
    
            console.log("세팅한 값: ", countOf_NONE, countOf_ENTERING, countOf_COMPLETE);
    
            //해당하는 값들로 set
            setDayOfNothingInputs(countOf_NONE);
            setDayOfSomeInputs(countOf_ENTERING);
            setDayOfAllInputs(countOf_COMPLETE);
    
            // 비동기 함수 호출
            fetchWeekCaloriesInfo();
        }
    }, [isFocused])

    

    

    // 입력 현황을 퍼센트로 계산, NaN일 경우 0으로 설정
    let statusForPercent = dayOfAllInputs + dayOfNothingInputs + dayOfSomeInputs > 0 
        ? Math.round((dayOfAllInputs / (dayOfAllInputs + dayOfNothingInputs + dayOfSomeInputs)) * 100) 
        : 0;
    
    

    //차트 Config 설정 값 chartConfig 구성
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0,

        //BarChart 투명도 조절을 위한 옵션들
        fillShadowGradientFrom: 'rgba(67, 167, 67, 1)',
        fillShadowGradientTo: 'rgba(67, 167, 67, 0)',
        fillShadowGradientOpacity: 1,

        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        color: (opacity = 1) => `rgba(67, 167, 67, ${opacity})`,
        strokeWidth: 3, // optional, default 3
    };
    
    const graphStyle = {
        marginVertical: 12,
        borderRadius: 16
    };


    return (
        <View style={{marginHorizontal: 20}}>

            {/* 상단 header는 고정한다(ScrollView에 포함시키지 X) */}
            <View style={styles.header}>
                <Text style={styles.titleTextStyle}>데이터 분석</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* 월 입력 현황에 관한 Section(상단 Section) */}
                <View style={styles.section_inDetailPage}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name="calendar-edit" size={36} color="black"/>
                        <Text style={styles.sectionTitle}>{getMonth(currentDate)+1}월 입력 현황</Text>
                    </View>
                    
                    {/* Progress Bar 추가 (react-native-progress 라이브러리 활용) */}
                    <View style={styles.statusBarWrapper} onLayout={(event) => {
                        const {width} = event.nativeEvent.layout;
                        setParentWidth(width);
                        }}>
                        
                        <View style={styles.rowInDetailPage}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={[styles.circleStyleInInputStatus, {backgroundColor: 'green'}]}/>
                                <Text>모두 입력한 날</Text>
                            </View>
                            <Text>{dayOfAllInputs}일</Text>    
                        </View>
                        <View style={styles.rowInDetailPage}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={[styles.circleStyleInInputStatus, {backgroundColor: 'orange'}]}/>
                                <Text>일부만 입력한 날</Text>
                            </View>
                            <Text>{dayOfSomeInputs}일</Text>    
                        </View>
                        <View style={[styles.rowInDetailPage, {marginBottom: 10}]}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={[styles.circleStyleInInputStatus, {backgroundColor: 'lightgray'}]}/>
                                <Text>아무것도 입력하지 않은 날</Text>
                            </View>
                            <Text>{dayOfNothingInputs}일</Text>    
                        </View>

                        
                        <Progress.Bar 
                            progress={!isNaN(statusForPercent) ? statusForPercent / 100 : 0}  
                            width={parentWidth}//부모 너비를 받아와서 너비 설정
                            height={12}
                            animationConfig={{bounciness: 20}}
                            color={'green'}
                            borderWidth={0}//테두리 없애기
                            unfilledColor='#ECECEC'//안 채워진 곳에 대한 색상 설정
                            borderRadius={10}/>
                        
                        <View style={styles.row}>
                            <Text style={styles.modalBottom}>입력 현황</Text>
                            <Text style={styles.modalBottom}>{statusForPercent}%</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.section_inDetailPage, {backgroundColor: '#ECECEC'}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name="chart-areaspline" size={36} color="black"/>
                        <Text style={styles.sectionTitle}>일별 섭취 칼로리 추이</Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <LineChart
                            style={graphStyle}
                            data={caloriesChartData}
                            width={parentWidth}
                            height={200}
                            yAxisLabel=""
                            yAxisSuffix="kcal"
                            formatYLabel={(yValue) => parseInt(yValue).toString()}// y축 레이블을 정수로 포맷
                            chartConfig={chartConfig}
                            verticalLabelRotation={0}
                            bezier
                            />
                        {/* 추후 redux-toolkit를 통해 나의 활동대사량, 평균 섭취 칼로리 값을 관리할 것임 */}
                        <View style={styles.rowInDetailPage}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={[styles.circleStyleInInputStatus, {backgroundColor: '#FFA07A'}]}/>
                                <Text>나의 활동대사량</Text>
                            </View>
                            <Text>{activityMetabolism}kcal</Text>    
                        </View>
                        <View style={styles.rowInDetailPage}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={[styles.circleStyleInInputStatus, {backgroundColor: '#6495ED'}]}/>
                                <Text>평균 섭취 칼로리</Text>
                            </View>
                            <Text>{averageEatenCaloriesOfWeek}kcal</Text>    
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
        
        
    );
}

export default DetailScreen;