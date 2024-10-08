import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {styles} from '../styles/styles';


//1차 분석 후 나오는 UI
function LoadingComponent(props) {

    console.log(props.comment)

    //1차, 2차 분석 관련하여 comment로 구분하여 각각의 함수를 수행하고 있다.
    useEffect(()=> {
        //1차 분석 진행해야 할 때(axios 요청 취소를 위한 abortController도 넘어온 경우)
        if(props.comment === '입력내용 분석중입니다' && props.abortControllerRef.current)
        {   
            props.userInputAnalysis_First(0, props.abortControllerRef.current);
        } 
        else if(props.comment === '영양성분 분석/저장중입니다' && props.abortControllerRef.current)
        {
            props.userInputAnalysis_Second(0, props.abortControllerRef.current);
        }
    }, [props.comment])
    
    return (
        <View style={{marginTop: 160, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="black"/>
            <Text style={{marginTop: 12, fontSize: 20, fontWeight: 'bold'}}>{props.comment}</Text>
        </View>
            
    )
}

export default LoadingComponent;