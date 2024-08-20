import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {styles} from '../styles/styles';


//1차 분석 후 나오는 UI
function LoadingComponent(props) {
    console.log(props.comment)

    //지금은 Data를 받아오는 것이 없기 때문에, 대충 2초 세고 다음 sub 컴포넌트로 넘어가도록 설계되어 있다
    useEffect(()=> {
        setTimeout(()=>{
            props.setSubComponentPageNum(prevNum=>prevNum+1);
        },2000)
    }, [props.setSubComponentPageNum])
    
    return (
        <View style={{marginTop: 160, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="black"/>
            <Text style={{marginTop: 12, fontSize: 20, fontWeight: 'bold'}}>{props.comment}</Text>
        </View>
            
    )
}

export default LoadingComponent;