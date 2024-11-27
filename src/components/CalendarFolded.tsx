import React, { useState, useCallback, useMemo, useEffect, useRef, MutableRefObject } from 'react';
import {View, Text, FlatList, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import { styles } from '../styles/styles'

import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../store";
import { setMarkedDate } from '../slices/markedDateSlice'


import { 
    format,
    startOfWeek,
    endOfWeek,
    addDays,
    addWeeks,
    subWeeks,
    getMonth,
    getDate
    } from 'date-fns'; //달력을 직접 만들기 위한 date-fns 라이브러리 import!

import AsyncStorage from '@react-native-async-storage/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import KakaoLogins from '@react-native-seoul/kakao-login';

import { useNavigation, CommonActions } from '@react-navigation/native'
import axios from 'axios'
import customAxios from '../apis/customAxios';

const windowWidth = Dimensions.get('window').width;
const marginHorizontal = 20;
const contentWidth = windowWidth - marginHorizontal * 2;

//서버에 저장되어 있는 mealInputSlice 값을 이용해서 달력에 마킹을 해주어야 한다
function makeMealInputMarking(mealDataForDate: any) {

    //해당하는 것에 따라 컴포넌트를 return 한다
    //걍 이 경우에도 white로 마커 처리한다
    if (!mealDataForDate) {
        return <View style={[styles.calendarInputStatusMarker, {backgroundColor: 'white'}]}/>
    }

    //해당하는 것에 따라 컴포넌트를 return 한다
    if(mealDataForDate.식단입력여부 === "NONE") {
        return <View style={[styles.calendarInputStatusMarker, {backgroundColor: 'white'}]}/>
    }
    else if(mealDataForDate.식단입력여부 === "ENTERING") {
        return <View style={[styles.calendarInputStatusMarker, {backgroundColor: '#FFA500'}]}/>
    }
    else if(mealDataForDate.식단입력여부 === "COMPLETE") {
        return <View style={[styles.calendarInputStatusMarker, {backgroundColor: '#008000'}]}/>
    }
}

//한 주 달력에 들어갈 내용((날짜(Date))들의 배열을 만든다.
function makeWeekCalendarDays(pointDate: Date) {

    const weekStartDate = startOfWeek(pointDate); //markedDate가 포함되어 있는 주의 시작 날짜
    const weekEndDate = endOfWeek(pointDate); //markedDate가 포함되어 있는 주의 끝 날짜

    let weekCalendarDays = [];
    let start = weekStartDate;

    while(start <= weekEndDate) //start가 weekEndDate보다 작거나 같은 동안엔 반복문을 지속한다
    {
        weekCalendarDays.push(start); //weekCalendarDays 배열의 끝에 start 값 추가
        start = addDays(start, 1); //날짜를 하루 더해준다(이것을 통해 start를 업데이트 한다)
    }
    return weekCalendarDays;
}

//한 주치 Calendar를 렌더링 해주는 함수
function renderWeekCalendar(
    weekCalendarDays: Date[], 
    setPointDate: Function, 
    markedDate: string | null, 
    updateMarkedDate: Function,
    mealDataByDate: any[]) 
    {

    //받아온 한 주치 날짜를 바탕으로 주 캘린더를 찍어낸다
    return (
        <View style={{flex: 1, flexDirection: 'row', width: contentWidth, justifyContent: 'space-between'}}>
            {
                weekCalendarDays.map((day, index) => {
                    let style;
                    let markerStyle;

                    //달력에 표시해 주어야 할 날짜의 여부에 따라, marker의 backgroundColor가 달라진다
                    if(format(day, 'yyyy-MM-dd') === format(new Date(markedDate), 'yyyy-MM-dd'))
                    {
                        markerStyle={backgroundColor: '#bbf3be'}
                    } else {
                        markerStyle={backgroundColor: '#00000000'} //완전 투명함(색없음)
                    }

                    //해당 경우엔 모든 날짜를 검은 색으로 표시
                    style={color: "black"};

                    const mealDataForDate = mealDataByDate[index]; //날짜별로 입력 현황 마커를 찍기 위한 mealDataForDate

                    //결과적으로 화면에 뿌려줄 것이다
                    return (
                        //각 날짜는 터치가 가능하도록 설계
                        <TouchableOpacity
                            onPress={() => {
                                updateMarkedDate(day.toISOString());
                                setPointDate(day);
                            }}
                            key={index}
                            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            {
                                //선택한 날짜인 경우(전역적으로 관리 중인 markedDate인 경우) 마커를 표시하고, 아니면 그냥 text만 표시
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={[styles.calendarMarker, markerStyle]}>
                                        <Text style={[style, {fontSize: 24}]}>{getDate(day)}</Text>
                                    </View>
                                    {makeMealInputMarking(mealDataForDate)}
                                </View>
                            }
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

// 날짜별 meal input 데이터를 서버에서 가져오는 함수
//주간 달력에서는 구분이 애매하므로, 주간 달력에 나와있는 날짜들의 month 값을 일일이 갖고 와서 마킹할 수 있도록 해야 한다
//해당 구역에서는, 로직의 애매함으로 인해 모두 서버에서 데이터를 가져와서 뿌리는 식으로 진행할 것이다 (월간 달력에서는 redux에 저장할 예정)
async function fetchMealDataForWeek(weekCalendarDays: Date[], navigation, hasLoggedOutRef: MutableRefObject<boolean>) {
    //Promise 객체와 map 함수를 이용해서 지속 요청을 진행할 것임
    const dataPromises = weekCalendarDays.map(async (day) => {
        const month = format(day, 'yyyy-MM');
        const dayFormatted = format(day, 'yyyy-MM-dd');

        const accessToken = await AsyncStorage.getItem('accessToken');
        try {
            const response = await customAxios.get(`/api/v1/foods/records/year-month/${month}`, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            console.log("bapsanghead: ",dayFormatted," 관련해서 식단 입력정보 내가 갖고 왔거든?", response.data.find((meal: any) => meal.date === dayFormatted));

            // 가져온 데이터를 day에 맞춰 필터링하여 바로 반환
            return response.data.find((meal: any) => meal.date === dayFormatted);
        } catch (error) {
            console.error('데이터를 가져오는 중 에러 발생: ', error);
            return null;
        }
    });

    return Promise.all(dataPromises);
}

//접힌 캘린더 또한, UI적으로 라이브러리로는 내가 원하는 Calendar를 구현할 수 없음, 직접 구현할 것이다
function CalendarFolded(props: any) {   

    const navigation = useNavigation();
    const hasLoggedOutRef = useRef(false); //로그아웃 상태를 추적하기 위한 useRef

    let weekMarking = ["일", "월", "화", "수", "목", "금", "토"]; //요일을 표시하기 위한 데이터

    const flatListRef = useRef(null);
    const scrollEnabledRef = useRef(true); //scroll 이벤트의 빈번한 발생을 방지하기 위해 스크롤 가능 여부 제어 (불필요한 재렌더링 방지를 위해 state가 아닌 Ref 사용)
    const prevOffsetX = useRef(null); //스크롤 방향 감지를 위한 Ref 선언 (이전 스크롤 위치를 저장할 것임)

    const MAX_COUNT_OF_WEEKS = 1000; // 매우 많은 주들을 미리 준비
    const INITIAL_INDEX = Math.floor(MAX_COUNT_OF_WEEKS / 2); // 중간에 위치한 현재 주차 인덱스

    //redux-toolkit으로 markedDate를 전역적으로 관리하고 있음
    let markedDate = useSelector((state: RootState) => state.markedDate.date);

    console.log('bapsanghead: CalendarFolded 렌더링: ', props.pointDate);

    //Release 모드에서는 더 엄격한 최적화로 인해 로컬 state를 따로 만들어서 사용하는 것을 권장
    const [localPointDate, setLocalPointDate] = useState(() => new Date(props.pointDate || markedDate)); //props.pointDate 값이 넘어오지 않았다면 초기엔 markedDate로 초기화

    //props.pointDate가 업데이트될 때마다 localPointDate가 업데이트 되어야 한다
    useEffect(() => {
        if (props.pointDate.toISOString() !== localPointDate.toISOString()) {
            setLocalPointDate(new Date(props.pointDate));
            console.log('bapsanghead: localPointDate 바뀜!')
        }
    }, [props.pointDate]);

    //markedDate를 업데이트하기 위한 코드
    const dispatch: AppDispatch = useDispatch();

    const updateMarkedDate = (date: string) => {
        dispatch(setMarkedDate(date));
    }

    //weekData를 useRef로 초기화하여 고정 값으로 설정
    const weekDataRef = useRef(
        Array.from({ length: MAX_COUNT_OF_WEEKS }, (_, i) => {
            const diff = i - INITIAL_INDEX;
            return { key: `week-${i}`, date: addWeeks(props.pointDate, diff) };
        })
    );

    const [mealDataByDate, setMealDataByDate] = useState<any[]>([]);
    const [weekCalendarDays, setWeekCalendarDays] = useState<Date[]>([]);


    // 주간 캘린더 데이터를 불러오는 useEffect
    useEffect(() => {
        //한 주치 날짜를 만들고, 입력 현황을 불러오는 역할을 하는 함수 fetchWeekData
        const fetchWeekData = async () => {
            const days = makeWeekCalendarDays(props.pointDate); //달력에 들어간 주간 달력 날짜들을 만든다(pointDate 기준)
            setWeekCalendarDays(days);

            const mealData = await fetchMealDataForWeek(days, navigation, hasLoggedOutRef); //한 주간 관련해서 입력 현황을 불러온다(필요시 서버 요청도 함)
            setMealDataByDate(mealData);
        };

        fetchWeekData();
        console.log("bapsanghead: CalendarFolded에서 fetchWeekData() 메소드가 수행됨");
    }, [localPointDate]);

    // //테스트용 코드
    // useEffect(() => {
    //     console.log("bapsanghead: useEffect triggered with pointDate:", props.pointDate);
    // }, [props.setPointDate]);


    useEffect(() => {
        //initialScrollIndex에 맞는 초기 offsetX를 설정
        //initialScrollIndex를 사용하여 FlatList가 중간 인덱스에서 시작하도록 했으므로,
        //'onLayout' 이벤트 대신 'FlatList'가 처음 렌더링될 때 초기 'offsetX' 값을 정확히 설정해야 한다.
        prevOffsetX.current = contentWidth * INITIAL_INDEX;

    }, []); //빈 배열을 dependency로 전달하여 한 번만 실행

    //좌우로 Scroll 하는 것에 관한 함수 (useCallback으로 Memoization한다.)
    const handleScroll = useCallback((event) => {

        const offsetX = event.nativeEvent.contentOffset.x;

        console.log("bapsanghead: scrollEnabled 활성화 됐냐?:", scrollEnabledRef.current); // 스크롤 이벤트가 트리거되었는지 확인

        if(!scrollEnabledRef.current) //scrollEnabledRef가 false인 경우, handleScroll 이벤트를 중단시킨다
        {
            return;
        }

        const movementThreshold = contentWidth / 2; //이동이 실제로 발생했는지 판단하기 위한 Threshold

        //왼쪽으로 스크롤했을 경우
        if (offsetX < prevOffsetX.current - movementThreshold) {
            scrollEnabledRef.current = false;
            props.setPointDate((prevDate) => {
                const newDate = new Date(subWeeks(prevDate, 1));
                setTimeout(() => (scrollEnabledRef.current = true), 50); //변경될 타이밍 보장
                return newDate;
            });
        //오른쪽으로 스크롤했을 경우
        } else if (offsetX > prevOffsetX.current + movementThreshold) {
            scrollEnabledRef.current = false;
            props.setPointDate((prevDate) => {
                const newDate = new Date(addWeeks(prevDate, 1));
                setTimeout(() => (scrollEnabledRef.current = true), 50); //변경될 타이밍 보장
                return newDate;
            });
        } else {
            console.log("bapsanghead: 스크롤 이벤트 발생하지 않음");
        }

        prevOffsetX.current = offsetX; // 현재 offsetX를 저장하여 다음 스크롤 이벤트에서 비교

    },[contentWidth]);


    //calendarContainer의 높이 값은 고정값을 가져야 할 것 같다.
    return (
        <View style={styles.calendarContainerFolded}>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    {/* day는 weekMarking 배열 요소들('일,월' 같은 것들!), i는 key의 역할을 한다 */}
                    {
                        weekMarking.map((day, i) => {
                            let style;
                            //일요일과 토요일인 경우에는 각각 빨간색과 파란색으로 표시
                            if(i==0) {
                                style={color: "red"};
                            } else if(i==6) {
                                style={color: "blue"};
                            }
                            
                            //결과적으로 표시
                            return (
                                <Text key={`day${i}`} style={[style, {fontSize: 16}]}>{day}</Text>
                            );
                        })}
                </View>
                {/* FlatList를 이용해서 날짜 무한 스크롤을 구현한다, UI 디자인 보기 좋게 하기 위해서.. 'marginTop: 8, height: 44' 옵션 추가.. */}
                {/* 해당 구역에선 flex로 비율값을 맞추기 보단, 고정적인 dp 값으로 layout 구성이 옳다고 판단 */}


                <FlatList
                    style={{ marginTop: 8 }}
                    ref={flatListRef}
                    data={weekDataRef.current}
                    extraData={[mealDataByDate, props.pointDate]} // mealDataByDate가 변경될 때 FlatList가 리렌더링됨
                    renderItem={({ item }) =>
                        renderWeekCalendar(
                            makeWeekCalendarDays(item.date), //각 주차별 날짜 배열을 생성하여 렌더링
                            props.setPointDate, 
                            markedDate, 
                            updateMarkedDate, 
                            mealDataByDate)
                    }
                    keyExtractor={(item) => `${item.key}-${props.pointDate}`} //고유 key 보장
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll}
                    initialScrollIndex={INITIAL_INDEX}
                    getItemLayout={(data, index) => ({ length: contentWidth, offset: contentWidth * index, index })}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                />
            </View>
        </View>
    )
}

export default CalendarFolded;