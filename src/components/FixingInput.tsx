import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'

import {styles} from '../styles/styles';

import RemoveIcon from '../assets/svg/remove.svg'

//1차 분석 후 나오는 UI
function FixingInput(props) {

    //props로 넘어온 1차 분석 결과를 data의 초기 값으로 설정한다
    let [data, setData] = useState(props.analysisResult_First);

    //식단 정보를 최종적으로 내부 저장소에 저장하는 saveDietData 함수
    const saveDietData = async (date, dietData) => {
        try {
            //AsyncStorage는 단순한 문자열 데이터를 저장
            //객체를 저장하기 위해선 JSON 형식으로 serialize(직렬화)하고, 데이터를 가져올 때는 다시 parse(파싱)해야 함
            const jsonValue = JSON.stringify(dietData);
            await AsyncStorage.setItem(`diet_${date}`, jsonValue);
            console.log(`AsyncStorage에 ${date} 일자에 대해 식단 Data가 정상적으로 저장되었습니다.`)
        } catch (e) {
            console.error('AsyncStorage에 식단 Data를 저장하는 데에 실패했습니다.')
        }
    }

    //AsyncStorage에 저장된 식단 정보를 불러오는 함수
    const loadDietData = async (date) => {
        try {
        const jsonValue = await AsyncStorage.getItem(`diet_${date}`);
        return jsonValue != null ? JSON.parse(jsonValue) : null; //불러온 정보가 null이 아니면, parsing하여 돌려주고, 아니면 null을 돌려준다.
        } catch (e) {
        console.error('AsyncStorage로부터 식단 Data를 불러오는 데 실패했습니다.');
        }
    };

    //AsyncStorage에 저장된 식단 정보를 업데이트 하는 updateDietData 함수 (영양정보 분석을 해야 하므로, 추후 axios 요청이 필요할 것임)
    const updateDietData = async (date, updatedMealData, updatedMealTime) => {
        try {
            let existingData = await loadDietData(date);
            if(existingData) {
                //updatedMealTime은 아침(morning), 점심(lunch), 저녁(dinner) 중 해당하는 하나의 값이 넘어올 것임
                existingData.updatedMealTime = updatedMealData;
                await saveDietData(date, existingData);
                console.log(`${updatedMealTime}의 식단 업데이트가 완료되었습니다!`);
            } else {
                console.log('업데이트할 데이터가 저장소에 존재하지 않습니다.');
            }
        } catch (e) {
            console.error('Data를 업데이트 하는데에 실패했습니다');
        }
    }

    //사용자가 data를 수정 시 업데이트하기 위한 updateDataElement 함수
    const updateDataElement = (index, option: keyof typeof data[0], value) => {
        const newData = [...data];
        newData[index][option] = value;
        setData(newData)
    }

    //입력내용 추가하기 버튼을 눌렀을 때 수행하는 method
    const addDataElement = () => {
        const newData = [...data];

        //빈 데이터들로 구성되어 있는 배열 하나 newData에 push
        newData.push({'food': '', 'quantity': '', 'unit': ''}); 
        setData(newData);
    }

    //삭제 버튼을 눌렀을 때 수행하는 method (삭제할 index를 인자로 넘겨준다)
    const deleteDataElement = (index) => {
        const newData = [...data];
        newData.splice(index, 1); //해당하는 index 위치의 원소를 삭제한다
        setData(newData);
    }

    let [textInput, setTextInput] = useState([]);

    useEffect(()=> {
        const result = data.map((ele, i) => {
            return (
                <View key={i} style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                    <TouchableOpacity style={{flex: 0.2}} onPress={()=>deleteDataElement(i)}>
                        <View style={styles.delete_button}>
                            <RemoveIcon height={16} width={16}/>
                        </View>
                    </TouchableOpacity>
                    <TextInput 
                        style={[styles.textInputStyle, {flex: 0.5, marginRight: 4, height: 36}]}
                        onChangeText={(text) => updateDataElement(i, 'food', text)} //첫 번째 요소(음식명)을 업데이트
                        value={ele.food}
                        placeholder="음식명"
                        placeholderTextColor={'#a8a8a8'}/>
                    <TextInput 
                        style={[styles.textInputStyle, {flex: 0.2, marginHorizontal: 4, height: 36}]}
                        onChangeText={(text) => updateDataElement(i, 'quantity', text)} //두 번째 요소(수량)을 업데이트
                        value={ele.quantity}
                        placeholder="숫자"
                        placeholderTextColor={'#a8a8a8'}
                        keyboardType="numeric"  // 숫자 키보드만 팝업되도록 설정
                        />
                    <TextInput 
                        style={[styles.textInputStyle, {flex: 0.1, marginLeft: 4, height: 36}]}
                        onChangeText={(text) => updateDataElement(i, 'unit', text)} //세 번째 요소(단위)를 업데이트
                        value={ele.unit}
                        placeholder="단위"
                        placeholderTextColor={'#a8a8a8'}/>
                </View>
            );
        });
        setTextInput(result);
    }, [data]);

    return (
        <>
        <ScrollView showsVerticalScrollIndicator={false}>
            {/* 추후, 분셕 결과를 불러올 때, 분석한 결과만큼 찍어내야 하는 View */}
            { textInput }
            <TouchableOpacity style={{marginTop: 20}} onPress={addDataElement}>
                <View style={styles.add_button}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>+</Text>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>입력내용 추가하기</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
        </>
        
    )
}

export default FixingInput;
