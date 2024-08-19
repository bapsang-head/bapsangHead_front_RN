import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {styles} from '../styles/styles';

import RemoveIcon from '../assets/svg/remove.svg'

//1차 분석 후 나오는 UI
function FixingInput(props) {

    let [data, setData] = useState([['삼치간장조림', '100', 'g'], ['엄마는외계인', '2', '숟가락'], ['동원고추참치', '2', '캔']]);

    //사용자가 data를 수정 시 업데이트하기 위한 updateDataElement 함수
    const updateDataElement = (index, index_2, value) => {
        const newData = [...data];
        newData[index][index_2] = value;
        setData(newData)
    }

    //입력내용 추가하기 버튼을 눌렀을 때 수행하는 method
    const addDataElement = () => {
        const newData = [...data];
        newData.push(['', '', '']); //빈 데이터들로 구성되어 있는 배열 하나 newData에 push
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
                        onChangeText={(text) => updateDataElement(i, 0, text)} //첫 번째 요소(음식명)을 업데이트
                        value={ele[0]}
                        placeholder="삼치간장조림"
                        placeholderTextColor={'#a8a8a8'}/>
                    <TextInput 
                        style={[styles.textInputStyle, {flex: 0.2, marginHorizontal: 4, height: 36}]}
                        onChangeText={(text) => updateDataElement(i, 1, text)} //두 번째 요소(수량)을 업데이트
                        value={ele[1]}
                        placeholder="100"
                        placeholderTextColor={'#a8a8a8'}/>
                    <TextInput 
                        style={[styles.textInputStyle, {flex: 0.1, marginLeft: 4, height: 36}]}
                        onChangeText={(text) => updateDataElement(i, 2, text)} //세 번째 요소(단위)를 업데이트
                        value={ele[2]}
                        placeholder="g"
                        placeholderTextColor={'#a8a8a8'}/>
                </View>
            );
        });
        setTextInput(result);
    }, [data]);

    return (
        <>
        <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 24}}>
            <Text style={{fontSize: 20, fontWeight: 'ultralight'}}>입력내용 분석 결과입니다</Text>
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
