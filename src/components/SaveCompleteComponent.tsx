import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SaveCompleteIcon from '../assets/svg/add_task.svg'
import DetailBottomSheetModal from './DetailBottomSheetModal';


//2차 분석 완료 후 '식단 저장이 완료되었습니다' 화면 Component
function SaveCompleteComponent(props) {

    // let [openMealInfoDetail, setOpenMealInfoDetail] = useState(false); //식단 세부 정보를 확인할 수 있어야 한다
    let [detailInfos, setDetailInfos] = useState([]);

    //의존성 배열을 비워 둠으로서 컴포넌트가 렌더링 되는 최초 시기에만 렌더링 될 수 있도록 함
    useEffect(()=>{
        props.setCompleteBtnAvailable(true);
    },[])

    //props로 넘어온 mealInfoDetail이 변경 되었는지 하위 컴포넌트에서도 추적할 수 있다
    useEffect(() => {
        if(props.mealInfoDetail) {
            setDetailInfos(props.mealInfoDetail); //state 업데이트 (state 변경 함수는 비동기적으로 처리됨, 따라서 조건부 렌더링 필요)
        }
    }, [props.mealInfoDetail])

    //글씨를 눌렀을 때 표시
    // const handleTextPress = () => {
    //     setOpenMealInfoDetail(!openMealInfoDetail);
    // }
    
    return (
        <View style={{marginTop: 160, justifyContent: 'center', alignItems: 'center'}}>
            <SaveCompleteIcon height={48} width={48}/>
            <Text style={{marginTop: 12, fontSize: 20, fontWeight: 'bold'}}>식단 저장이 완료되었습니다.</Text>
            {/* <TouchableOpacity onPress={handleTextPress}>
                <Text style={{marginTop: 32, fontSize: 16, fontWeight: 'medium'}}>이번 식단 정보 세부 분석법 보기</Text>
            </TouchableOpacity> */}
            {
                (detailInfos && detailInfos.length > 0) ? (
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        style={styles.modalContainer}
                        contentContainerStyle={{ paddingBottom: 380}}> 
                        {/* 분석했던 방법을 표시해주는 박스 */}
                        <View style={styles.detailContainer}>
                            {/* transformedResult 값을 바탕으로 세부 칼로리 정보를 찍어낸다 */}
                            {detailInfos.map((item, index) => (
                                <View key={index} style={{justifyContent: 'center', marginBottom: 12}}>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.name}: 1{item.unit} 당 {item.gram}g으로 계산</Text>
                                    <Text style={{marginTop: 8}}>1{item.unit}당 칼로리는 {item.calories}kcal</Text>
                                    <Text>1{item.unit}당 탄수화물은 {item.carbohydrates}g</Text>
                                    <Text>1{item.unit}당 단백질은 {item.protein}g</Text>
                                    <Text>1{item.unit}당 지방은 {item.fat}g</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                ) : (
                    null
                )
            }
        </View>
    )
}

//해당 modal에서 사용되는 StyleSheet
const styles = StyleSheet.create({
    modalContainer: {
        marginTop: 32,
        backgroundColor: '#fff',
    },
    detailContainer: {
        backgroundColor: '#fffbd4',
        paddingHorizontal: 32,
        paddingVertical: 16,
        marginTop: 8,
        borderRadius: 12,
    }
  });

export default SaveCompleteComponent;