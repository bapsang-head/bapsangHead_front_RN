import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {styles} from '../styles/styles';

import RemoveIcon from '../assets/svg/remove.svg'

//1차 분석 중 나오는 UI
function FirstLoadingComponent() {

    let [foodNameInput, setFoodNameInput] = useState('');
    let [countInput, setCountInput] = useState('');
    let [unitInput, setUnitInput] = useState('');

    return (
        <>
        <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 24}}>
            <Text style={{fontSize: 20, fontWeight: 'ultralight'}}>입력내용 분석 결과입니다</Text>
            {/* 추후, 분셕 결과를 불러올 때, 분석한 결과만큼 찍어내야 하는 View */}
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                <TouchableOpacity style={{flex: 0.2}}>
                    <View style={styles.delete_button}>
                        <RemoveIcon height={16} width={16}/>
                    </View>
                </TouchableOpacity>
                <TextInput 
                        style={[styles.textInputStyle, {flex: 0.5, marginRight: 4, height: 36}]}
                        onChangeText={setFoodNameInput}
                        value={foodNameInput}
                        placeholder="삼치간장조림"
                        placeholderTextColor={'#a8a8a8'}/>
                    <TextInput 
                        style={[styles.textInputStyle, {flex: 0.2, marginHorizontal: 4, height: 36}]}
                        onChangeText={setCountInput}
                        value={countInput}
                        placeholder="100"
                        placeholderTextColor={'#a8a8a8'}/>
                    <TextInput 
                        style={[styles.textInputStyle, {flex: 0.1, marginLeft: 4, height: 36}]}
                        onChangeText={setUnitInput}
                        value={unitInput}
                        placeholder="g"
                        placeholderTextColor={'#a8a8a8'}/>
            </View>
            <TouchableOpacity style={{marginTop: 20}}>
                <View style={styles.add_button}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>+</Text>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>입력내용 추가하기</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
        </>
        
    )
}

export default FirstLoadingComponent;