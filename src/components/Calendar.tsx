import React, { useState, useCallback, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import {View, Text, FlatList, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import * as Progress from 'react-native-progress';
import {styles} from '../styles/styles'

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { setMarkedDate } from '../slices/markedDateSlice';

import { 
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    getMonth,
    getDate
    } from 'date-fns'; //달력을 직접 만들기 위한 date-fns 라이브러리 import!

const windowWidth = Dimensions.get('window').width;
const marginHorizontal = 20;
const contentWidth = windowWidth - marginHorizontal * 2;


//한 달 달력에 들어갈 내용(날짜(Date))들의 배열을 만든다.
function makeCalendarDays(pointDate: Date) {

    const monthStart = startOfMonth(pointDate); //현재 달의 시작 날짜
    const monthEnd = endOfMonth(pointDate); //현재 달의 마지막 날짜
    const startDate = startOfWeek(monthStart); //현재 달의 시작 날짜가 포함된 주의 시작 날짜(그니까, 전 달의 날짜가 나올수도 있음!)
    const endDate = endOfWeek(monthEnd); //현재 달의 마지막 날짜가 포함된 주의 끝 날짜(그니까, 다음 달의 날짜가 나올수도 있음!)

    let calendarDays = [];
    let start = startDate;

    while(start <= endDate) //start가 endDate보다 작거나 같은 동안엔 반복문을 지속한다
    {
        calendarDays.push(start); //calendarDays 배열의 끝에 start 값 추가
        start = addDays(start, 1); //날짜를 하루 더해준다(이것을 통해 start를 업데이트 한다)

    }
    return calendarDays;
}

//한 달치 Calendar를 렌더링 해주는 함수
function renderCalendar(pointDate: Date, 
    setPointDate: Function, 
    markedDate: string | null, 
    updateMarkedDate: Function, 
    flatListRef: any, 
    pageIndex: number, 
    prevOffsetX: any) {

    let calendarDaysList = makeCalendarDays(pointDate);
    let weeks = [];
    let week = [];

    calendarDaysList.forEach(day => {
        if(week.length < 7) {
            week.push(day);
        } else {
            weeks.push(week);
            week = [day];
        }
    });

    if(week.length > 0) {
        weeks.push(week);
    }

    //날짜를 터치할 때 발생하는 이벤트를 처리하는 handlePress 함수
    const handlePress = (day: Date, isPrevMonth: boolean, isNextMonth: boolean) => {
        if (!flatListRef.current) return; //존재하지 않는 ref라면, 그냥 return한다

        if (!isPrevMonth && !isNextMonth) {
            // 현재 월의 날짜를 터치한 경우
            setPointDate(day);
            updateMarkedDate(day.toISOString());

        } else {
            // 이전/다음 달의 날짜를 터치한 경우
            const newPageIndex = isPrevMonth ? pageIndex - 1 : pageIndex + 1;

            // 강제 스크롤 후 상태 업데이트 (애니메이션 true)
            flatListRef.current.scrollToIndex({ index: newPageIndex, animated: true });

            //강제로 스크롤한 후 offsetX를 초기화해야 함 (해당 코드가 없으면 특정 상황에서 prevOffsetX가 업데이트 되지 않는 상황이 발생)
            const offsetX = newPageIndex * contentWidth;
            prevOffsetX.current = offsetX; //새로운 위치에 대한 offsetX 설정

            setPointDate(day);
            updateMarkedDate(day.toISOString());
        }
    };
    
    return (
        <View style={{flex: 1, width: contentWidth, justifyContent: 'space-between'}}>
            {/* calendarDaysList 2차원 배열 같은 걸 이용해서 캘린더를 찍어낸다(map 함수를 중첩하여 쓴다) */}
            {
                weeks.map((week, index) => (
                    <View key={index} style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                        {week.map((day: any, subIndex: React.Key) => {
                            let style;

                            //해당 상태들에 대한 값
                            const isCurrentMonth = (getMonth(day) === getMonth(pointDate));
                            const isPrevMonth = getMonth(day) < getMonth(pointDate);
                            const isNextMonth = getMonth(day) > getMonth(pointDate);

                            //해당 달이 아닌 경우엔 회색으로 표시해야 한다
                            if(!isCurrentMonth)
                            {
                                style={color: "gray"};
                            } else {
                                style={color: "black"};
                            }

                            //결과적으로 화면에 뿌려줄 것이다
                            return (
                                //각 날짜는 터치가 가능하도록 설계
                                <TouchableOpacity 
                                    onPress={() => handlePress(day, isPrevMonth, isNextMonth)}
                                    key={subIndex}
                                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    {
                                        //선택한 날짜인 경우(전역적으로 관리 중인 markedDate인 경우) 마커를 표시하고, 아니면 그냥 text만 표시
                                        //day와 markedDate를 직접적으로 비교하게 되면, 시간에서 미세하게 차이가 발생하므로, 아래와 같이 비교해야 함
                                        (format(day, 'yyyy-MM-dd') === format(new Date(markedDate), 'yyyy-MM-dd')) ? (
                                            <View style={styles.calendarMarker}>
                                                <Text style={[style, {fontSize: 20}]}>{getDate(day)}</Text>
                                            </View>
                                        ) : (
                                            <Text style={[style, {fontSize: 20}]}>{getDate(day)}</Text>
                                        )
                                    }
                                    
                                </TouchableOpacity>
                            )
                        }
                        )}
                    </View>
                ))
            }
        </View>
    )
}


//UI적으로 라이브러리로는 내가 원하는 Calendar를 구현할 수 없으므로,직접 구현할 것이다
function Calendar(props: any) {

    let weekMarking = ["일", "월", "화", "수", "목", "금", "토"]; //요일을 표시하기 위한 데이터

    const flatListRef = useRef(null);
    const scrollEnabledRef = useRef(true); //scroll 이벤트의 빈번한 발생을 방지하기 위해 스크롤 가능 여부 제어 (불필요한 재렌더링 방지를 위해 state가 아닌 Ref 사용)
    const prevOffsetX = useRef(null); //스크롤 방향 감지를 위한 Ref 선언 (이전 스크롤 위치를 저장할 것임)

    const MAX_COUNT_OF_MONTHS = 1000; // 매우 많은 달을 미리 준비
    const INITIAL_INDEX = Math.floor(MAX_COUNT_OF_MONTHS / 2); // 중간에 위치한 현재 월 인덱스

    //실험용 코드 (redux-toolkit으로 markedDate를 전역적으로 관리하고 있음)
    let markedDate = useSelector((state: RootState) => state.markedDate.date);

    console.log(props.pointDate);

    //markedDate를 업데이트하기 위한 코드
    const dispatch: AppDispatch = useDispatch();
    const updateMarkedDate = (date: string) => {
        dispatch(setMarkedDate(date));
    }

    //monthData를 useRef로 초기화하여 고정 값으로 설정
    const monthDataRef = useRef(
        Array.from({ length: MAX_COUNT_OF_MONTHS }, (_, i) => {
            const diff = i - INITIAL_INDEX;
            return { key: `month-${i}`, date: addMonths(props.pointDate, diff) };
        })
    );
    

    useEffect(() => {
        //initialScrollIndex에 맞는 초기 offsetX를 설정
        //initialScrollIndex를 사용하여 FlatList가 중간 인덱스에서 시작하도록 했으므로,
        //'onLayout' 이벤트 대신 'FlatList'가 처음 렌더링될 때 초기 'offsetX' 값을 정확히 설정해야 한다.
        prevOffsetX.current = contentWidth * INITIAL_INDEX;
    }, []); //빈 배열을 dependency로 전달하여 한 번만 실행


    //좌우로 Scroll 하는 것에 관한 함수 (useCallback으로 Memoization한다.)
    const handleScroll = useCallback((event) => {

        const offsetX = event.nativeEvent.contentOffset.x; 

        console.log("Scroll Event Triggered", prevOffsetX.current); // 스크롤 이벤트가 트리거되었는지 확인
        console.log("Scroll Event Triggered", offsetX); // 스크롤 이벤트가 트리거되었는지 확인

        if(!scrollEnabledRef.current) //scrollEnabledRef가 false인 경우, handleScroll 이벤트를 중단시킨다
        {
            return;
        }

        const movementThreshold = contentWidth / 2; //이동이 실제로 발생했는지 판단하기 위한 Threshold

        //왼쪽으로 스크롤했을 경우
        if(offsetX < prevOffsetX.current && Math.abs(offsetX - prevOffsetX.current) > movementThreshold) {
            scrollEnabledRef.current = false; //우선은 ScrollEnabledRef를 False로 둔다 (과도한 스크롤 방지)
            props.setPointDate((prevDate)=>{ return subMonths(prevDate, 1)});
            scrollEnabledRef.current = true;
            
        //오른쪽으로 스크롤했을 경우
        } else if(offsetX > prevOffsetX.current && Math.abs(offsetX - prevOffsetX.current) > movementThreshold) {
            scrollEnabledRef.current = false; //우선은 ScrollEnabledRef를 False로 둔다 (과도한 스크롤 방지)
            props.setPointDate((prevDate)=>{ return addMonths(prevDate, 1)});
            scrollEnabledRef.current = true;
        } else {
            console.log("스크롤 이벤트 발생하지 않음");
        }

        prevOffsetX.current = offsetX; // 현재 offsetX를 저장하여 다음 스크롤 이벤트에서 비교

    },[props.setPointDate]);


    return (
        <View style={styles.calendarContainer}>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', flex: 0.04}}>
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
                {/* FlatList를 이용해서 날짜 무한 스크롤을 구현한다 */}
                <FlatList
                    style={{flex: 0.96}}
                    ref={flatListRef}
                    data={monthDataRef.current}
                    renderItem={({item, index}) => renderCalendar(item.date, props.setPointDate, markedDate, updateMarkedDate, flatListRef, index, prevOffsetX)}
                    keyExtractor={(item) => item.key} 
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll} //스크롤이 끝날 때의 이벤트를 처리한다
                    initialScrollIndex={INITIAL_INDEX} //해당 값을 INITIAL_INDEX로 넘겨 주어서 초기에는 현재 달이 가운데에 오도록 처리
                    getItemLayout={(data, index) => (
                        { length: contentWidth, offset: contentWidth * index, index}
                    )}

                    //렌더링 성능 최적화를 위한 props (initialNumToRender, maxToRenderPerBatch, windowSize)
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={5} // 현재 화면 크기의 5배에 해당하는 항목을 렌더링
                    />
            </View>
        </View>
    )
}


export default Calendar;
