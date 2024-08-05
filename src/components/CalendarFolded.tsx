import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {View, Text, FlatList, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import * as Progress from 'react-native-progress';
import {styles} from '../styles/styles'

import { useSelector, useDispatch } from "react-redux"
import { RootState, setMarkedDate, AppDispatch } from "../store";

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

const windowWidth = Dimensions.get('window').width;
const marginHorizontal = 20;
const contentWidth = windowWidth - marginHorizontal * 2;

//한 주 달력에 들어갈 내용((날짜(Date))들의 배열을 만든다.
function makeWeekCalendarDays(currentDate: Date) {

    const weekStartDate = startOfWeek(currentDate); //markedDate가 포함되어 있는 주의 시작 날짜
    const weekEndDate = endOfWeek(currentDate); //markedDate가 포함되어 있는 주의 끝 날짜

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
function renderWeekCalendar(currentDate: Date, setCurrentDate: Function, markedDate: string | null, updateMarkedDate: Function) {

    let weekCalendarDays = makeWeekCalendarDays(currentDate);

    //받아온 한 주치 날짜를 바탕으로 주 캘린더를 찍어낸다
    return (
        <View style={{flex: 1, flexDirection: 'row', width: contentWidth, justifyContent: 'space-between'}}>
            {
                weekCalendarDays.map((day, index) => {
                    let style;
                    //해당 달이 아닌 경우엔 회색으로 표시해야 한다
                    if(getMonth(day) !== getMonth(currentDate))
                    {
                        style={color: "gray"};
                    } else {
                        style={color: "black"};
                    }

                    //결과적으로 화면에 뿌려줄 것이다
                    return (
                        //각 날짜는 터치가 가능하도록 설계
                        <TouchableOpacity
                            onPress={() => {
                                updateMarkedDate(day.toISOString());
                                setCurrentDate(day); //달력이 넘어가도록 해야 하므로, currentDate도 바꾼다
                            }}
                            key={index}
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
                })
            }
        </View>
    )
}

//접힌 캘린더 또한, UI적으로 라이브러리로는 내가 원하는 Calendar를 구현할 수 없음, 직접 구현할 것이다
function CalendarFolded(props: any) {   

    let weekMarking = ["일", "월", "화", "수", "목", "금", "토"]; //요일을 표시하기 위한 데이터
    const flatListRef = useRef(null);
    const scrollEnabledRef = useRef(true); //scroll 이벤트의 빈번한 발생을 방지하기 위해 스크롤 가능 여부 제어 (불필요한 재렌더링 방지를 위해 state가 아닌 Ref 사용)

    //실험용 코드 (redux-toolkit으로 markedDate를 전역적으로 관리하고 있음)
    let markedDate = useSelector((state: RootState) => state.markedDate.date);
    console.log(markedDate)

    //초기에 해당 컴포넌트가 Mount될 때에만 markedDate를 currentDate로 설정
    useEffect(() => {
        if (markedDate) {
            props.setCurrentDate(new Date(markedDate));
        }
    }, []);

    //markedDate를 업데이트하기 위한 코드
    const dispatch: AppDispatch = useDispatch();
    const updateMarkedDate = (date: string) => {
        dispatch(setMarkedDate(date));
    }

    //좌우로 Scroll 하는 것에 관한 함수 (useCallback으로 Memoization한다.)
    const handleScroll = useCallback((event) => {

        if(!scrollEnabledRef.current) //scrollEnabledRef가 false인 경우, handleScroll 이벤트를 중단시킨다
        {
            return;
        }

        const offsetX = event.nativeEvent.contentOffset.x;

        //Math.round로 계산하여 스크롤 위치에 따라 더 정확한 페이지 index를 얻도록 한다
        const pageIndex = Math.round(offsetX / contentWidth);

        //pageIndex===0, 그리고 pageIndex===2 조건을 사용하여 첫 번째 페이지 이전과 세번째 페이지 이후를 감지한다
        //setCurrentDate() 함수를 호출할 때, 이전 상태를 참조하여 연속 스크롤에도 올바르게 날짜를 설정한다
        if(pageIndex === 0) {
            scrollEnabledRef.current = false; //우선은 ScrollEnabledRef를 False로 둔다
            props.setCurrentDate(prevDate => {
                const newDate = subWeeks(prevDate, 1);
                setTimeout(() => {scrollEnabledRef.current = true;}, 300); //스크롤 재활성화 시간 조정(300ms)
                return newDate;
            });
        } else if(pageIndex === 2) {
            scrollEnabledRef.current = false; //우선은 ScrollEnabledRef를 False로 둔다
            props.setCurrentDate(prevDate => {
                const newDate = addWeeks(prevDate, 1);
                setTimeout(() => {scrollEnabledRef.current = true;}, 300); //스크롤 재활성화 시간 조정(300ms)
                return newDate;
            });
        }
    },[props.setCurrentDate]);

    //넘긴 달력을 항상 current 상태(index: 1)로 맞춰준다. 이는, currentDate가 변할 때마다 실행한다
    useEffect(()=> {
        if(flatListRef.current) {
            flatListRef.current.scrollToIndex({index:1, animated: false});
        }
    }, [props.currentDate]);

    //이전, 현재, 다음 주의 데이터를 준비하여 'FlatList'의 data로 사용할 것이다.
    const weekData = [
        {key: 'prev', date: subWeeks(props.currentDate, 1)},
        {key: 'current', date: props.currentDate},
        {key: 'next', date: addWeeks(props.currentDate, 1)},
    ]

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
                    style={{marginTop: 8}}
                    ref={flatListRef}
                    data={weekData}
                    renderItem={({item}) => renderWeekCalendar(item.date, props.setCurrentDate, markedDate, updateMarkedDate)}
                    keyExtractor={(item) => item.key} 
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll} //스크롤이 끝날 때의 이벤트를 처리한다
                    initialScrollIndex={1} //해당 값을 1로 넘겨 주어서 초기에는 현재 달이 가운데에 오도록 처리
                    getItemLayout={(data, index) => (
                        { length: contentWidth, offset: contentWidth * index, index}
                    )}
                    />
            </View>
        </View>
    )
}

export default CalendarFolded