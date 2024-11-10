import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler'
import * as Progress from 'react-native-progress';


//세부 영양정보를 계산해서 return하는 함수
function calculateIngredientsDetail(mealInfo: any) {

    const transformedResult = mealInfo.map(item => ({
        //name, unit, count 값은 mealInfo에서 받아온 그대로 유지, 각 영양성분(칼로리, 탄수화물, 단백질, 지방)에 대해선 weigh_value를 이용해서 계산식 적용
        name: item.name,
        unit: item.unit, 
        count: item.count,
        //필요한 경우 소수점 둘째 자리까지 반올림하여 계산
        calorie: Math.round((item.calorie) * ((item.gram) / 100) * item.count),
        carbohydrate: Math.round((item.carbohydrate) * ((item.gram) / 100) * item.count),
        protein: Math.round((item.protein) * ((item.gram) / 100) * item.count),
        fat: Math.round((item.fat) * ((item.gram) / 100) * item.count)
    }));

    //총 칼로리, 탄수화물, 단백질, 지방 값을 계산한다(reduce 함수 활용)
    const total = transformedResult.reduce((result, item) => {
        result.calorie += item.calorie;
        result.carbohydrate += item.carbohydrate;
        result.protein += item.protein;
        result.fat += item.fat;
        return result;
    }, {calorie: 0, carbohydrate: 0, protein: 0, fat: 0});

    return{ transformedResult, total };
}

//'세부 영양성분' 내부에 들어가는 DetailBottomSheetModal 컴포넌트
function DetailBottomSheetModal({mealInfoDetail}) {

    console.log("DetailBottomSheetModal rendering");
    
    const { transformedResult, total } = calculateIngredientsDetail(mealInfoDetail); //세부 영양정보 표시에 맞도록 영양성분 객체를 계산해서 만들어주는 함수 호출

    return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.modalContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 8, textAlign: 'center', marginBottom: 16}}>세부 영양성분</Text>
        {/* 세부 칼로리 표시 해주는 박스 */}
        <Text style={{fontSize: 14, fontWeight: 'light'}}>세부 칼로리</Text>
        <View style={styles.detailContainer}>
            {/* transformedResult 값을 바탕으로 세부 칼로리 정보를 찍어낸다 */}
            {transformedResult.map((item, index) => (
                <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <Text>{item.name} {item.count}{item.unit}</Text>
                    <Text>{item.calorie}kcal</Text>
                </View>
            ))}
            
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: 'bold'}}>총 칼로리</Text>
                <Text>{total.calorie}kcal</Text>
            </View>
        </View>

        {/* 탄수화물 표시해주는 박스 */}
        <Text style={{fontSize: 14, fontWeight: 'light', marginTop: 16}}>탄수화물 함량</Text>
        <View style={styles.detailContainer}>
            {transformedResult.map((item, index) => (
                <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <Text>{item.name} {item.count}{item.unit}</Text>
                    <Text>{item.carbohydrate}g</Text>
                </View>
            ))}
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: 'bold'}}>총 탄수화물</Text>
                <Text>{total.carbohydrate}g</Text>
            </View>
        </View>

        {/* 단백질 표시해주는 박스 */}
        <Text style={{fontSize: 14, fontWeight: 'light', marginTop: 16}}>단백질 함량</Text>
        <View style={styles.detailContainer}>
            {transformedResult.map((item, index) => (
                <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <Text>{item.name} {item.count}{item.unit}</Text>
                    <Text>{item.protein}g</Text>
                </View>
            ))}
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: 'bold'}}>총 탄수화물</Text>
                <Text>{total.protein}g</Text>
            </View>
        </View>

        {/* 지방 표시해주는 박스 */}
        <Text style={{fontSize: 14, fontWeight: 'light', marginTop: 16}}>지방 함량</Text>
        <View style={styles.detailContainer}>
            {transformedResult.map((item, index) => (
                <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <Text>{item.name} {item.count}{item.unit}</Text>
                    <Text>{item.fat}g</Text>
                </View>
            ))}
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: 'bold'}}>총 지방</Text>
                <Text>{total.fat}g</Text>
            </View>
        </View>
    </ScrollView> 
    );
}

//해당 modal에서 사용되는 StyleSheet
const styles = StyleSheet.create({
    modalContainer: {
        marginHorizontal: 20,
        marginBottom: 52,
        backgroundColor: '#fff',
    },
    detailContainer: {
        backgroundColor: '#fffbd4',
        padding: 16,
        marginTop: 8,
        borderRadius: 12,
        marginBottom: 12,
    }
  });

export default DetailBottomSheetModal;