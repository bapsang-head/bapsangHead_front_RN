//Libarary or styles import
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from '../styles/styles';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

import { RootState } from '../store';

import { 
    format,
    subWeeks,
    getDay,
    addDays,
    getMonth,
    getDate
    } from 'date-fns'; //달력을 직접 만들기 위한 date-fns 라이브러리 import!

import {
    LineChart,
  } from "react-native-chart-kit";

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


//'데이터 분석' 페이지
function DetailScreen() {
    console.log("Detail rendering");

    let [currentDate, setCurrentDate] = useState(new Date()); // 초기값 현재 달 (state는 Date 객체로 관리 후, 필요한 곳에 적절히 활용 예정)
    let [parentWidth, setParentWidth] = useState(0); //부모 컴포넌트의 너비를 받아오기 위한 State      

    let [dayOfAllInputs, setDayOfAllInputs] = useState(0); //모두 입력한 날
    let [dayOfSomeInputs, setDayOfSomeInputs] = useState(0); //일부만 입력한 날
    let [dayOfNothingInputs, setDayOfNothingInputs] = useState(0); //아무것도 입력하지 않은 날

    //특정한 월의 식단 입력 데이터만 가져온다
    const monthlyMealData: MealData[] = useSelector(
        (state: RootState) => state.mealInput.data[format(currentDate, 'yyyy-MM')] || []
    ); //redux 저장소에 있는 정보를 불러올 것이다

    //monthlyMealData 값이 바뀔 때마다 해당 구문을 수행한다
    useEffect(() => {

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

    }, [monthlyMealData])

    

    let dayList = makeDayList(); //7일 전까지의 날짜를 배열로 만든다

    // 입력 현황을 퍼센트로 계산, NaN일 경우 0으로 설정
    let statusForPercent = dayOfAllInputs + dayOfNothingInputs + dayOfSomeInputs > 0 
        ? Math.round((dayOfAllInputs / (dayOfAllInputs + dayOfNothingInputs + dayOfSomeInputs)) * 100) 
        : 0;
    
    //Bar 차트 데이터 설정
    let data = {
        labels: dayList,
        datasets: [
            {
                data: [2000, 2000, 1300, 3000, 3200, 2000, 2500]
            }
        ]
    };

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
                            data={data}
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
                            <Text>{3250}kcal</Text>    
                        </View>
                        <View style={styles.rowInDetailPage}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={[styles.circleStyleInInputStatus, {backgroundColor: '#6495ED'}]}/>
                                <Text>평균 섭취 칼로리</Text>
                            </View>
                            <Text>{2240}kcal</Text>    
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
        
        
    );
}

export default DetailScreen;