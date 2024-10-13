import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {styles} from '../styles/styles';
import SaveCompleteIcon from '../assets/svg/add_task.svg'


//2차 분석 완료 후 '식단 저장이 완료되었습니다' 화면 Component
function SaveCompleteComponent(props) {

    //의존성 배열을 비워 둠으로서 컴포넌트가 렌더링 되는 최초 시기에만 렌더링 될 수 있도록 함
    useEffect(()=>{
        props.setCompleteBtnAvailable(true);
    },[])
    
    return (
        <View style={{marginTop: 160, justifyContent: 'center', alignItems: 'center'}}>
            <SaveCompleteIcon height={48} width={48}/>
            <Text style={{marginTop: 12, fontSize: 20, fontWeight: 'bold'}}>식단 저장이 완료되었습니다.</Text>
        </View>
    )
}

export default SaveCompleteComponent;