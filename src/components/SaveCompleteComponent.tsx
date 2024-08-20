import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {styles} from '../styles/styles';
import SaveCompleteIcon from '../assets/svg/add_task.svg'


//2차 분석 완료 후 '식단 저장이 완료되었습니다' 화면 Component
function LoadingComponent(props) {
    return (
        <View style={{marginTop: 160, justifyContent: 'center', alignItems: 'center'}}>
            <SaveCompleteIcon height={48} width={48}/>
            <Text style={{marginTop: 12, fontSize: 20, fontWeight: 'bold'}}>식단 저장이 완료되었습니다.</Text>
        </View>
    )
}

export default LoadingComponent;