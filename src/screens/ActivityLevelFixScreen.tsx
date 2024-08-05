//Libarary or styles import
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, CalendarList, LocaleConfig, ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import { styles } from '../styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

import NoExerciseIcon from '../assets/svg/airline_seat_individual_suite.svg';
import LittleExerciseIcon from '../assets/svg/accessibility_new.svg';
import ExerciseIcon from '../assets/svg/directions_run.svg';
import MuchExerciseIcon from '../assets/svg/exercise.svg';

//세 번째 설정 화면
function ActivityLevelFixScreen({route, navigation, appState}) {

    let [selectedActivityLevel, setSelectedActivityLevel] = useState('');

    const nav = useNavigation(); //네비게이션 사용을 위해 useNavigation() 가져오기

    //'완료' 버튼을 눌렀을 때의 동작 수행
    const handleDonePress = () => {
        alert('Done pressed!');
    }

    //useLayoutEffect()를 통해서 header 설정을 TextInputScreen 내부에서 수행한다
    useLayoutEffect(() => {
        nav.setOptions({
          title: '입력',
          headerTitle: () => <></>,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => nav.goBack()}>
              <MaterialCommunityIcons name="chevron-left" size={32} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleDonePress}>
              <Text>완료</Text>
            </TouchableOpacity>
          ),
        });
      }, [nav, handleDonePress]);
    
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 28, fontWeight: 'bold', paddingLeft: 32, paddingTop: 24}}>평소 활동량이 변했나요?</Text>
            {/* 활동량 표시 버튼을 나열할 것입니다 */}
            <View style={{alignItems: 'center', marginTop: 42}}>
            
            {/* selectedActivityLevel state 값에 맞게 Rendering을 진행할 것임 (조건문 삽입) */}
            
            {/* '평소 활동이 적습니다' 버튼 */}
            {
                selectedActivityLevel === 'light' ? (
                    <TouchableOpacity onPress={()=>{setSelectedActivityLevel('')}}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#f2fcde'}]}>
                            <NoExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>평소 활동이 적습니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 0~1회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={()=>{setSelectedActivityLevel('light')}}>
                        <View style={styles.activityLevelButton}>
                            <NoExerciseIcon width={40} height={40} fillOpacity={0.3}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 0.3}}>
                                <Text style={{fontSize: 16}}>평소 활동이 적습니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 0~1회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }

            {/* '평소 가볍게 운동합니다' 버튼 */}
            {
                selectedActivityLevel === 'lightActive' ? (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('')}}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#FFF8D5'}]}>
                            <LittleExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>평소 가볍게 운동합니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 2~3회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('lightActive')}}>
                        <View style={styles.activityLevelButton}>
                            <LittleExerciseIcon width={40} height={40} fillOpacity={0.3}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 0.3}}>
                                <Text style={{fontSize: 16}}>평소 가볍게 운동합니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 2~3회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }

            {/* '활동적인 편입니다' 버튼 */}
            {
                selectedActivityLevel === 'active' ? (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('')}}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#FFC3A1'}]}>
                            <ExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>활동적인 편입니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 4~5회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('active')}}>
                        <View style={styles.activityLevelButton}>
                            <ExerciseIcon width={40} height={40} fillOpacity={0.3}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 0.3}}>
                                <Text style={{fontSize: 16}}>활동적인 편입니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 4~5회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }

            {/* '운동 없으면 못삽니다.' 버튼 */}
            {
                selectedActivityLevel === 'veryActive' ? (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('')}}>
                        <View style={[styles.activityLevelButton, {backgroundColor: '#FFCED7'}]}>
                            <MuchExerciseIcon width={40} height={40} fillOpacity={1}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 1}}>
                                <Text style={{fontSize: 16}}>운동 없으면 못삽니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 6~7회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{marginTop: 24}} onPress={()=>{setSelectedActivityLevel('veryActive')}}>
                        <View style={styles.activityLevelButton}>
                            <MuchExerciseIcon width={40} height={40} fillOpacity={0.3}/>
                            <View style={{justifyContent: 'center', marginLeft: 28, opacity: 0.3}}>
                                <Text style={{fontSize: 16}}>운동 없으면 못삽니다.</Text>
                                <Text style={{fontSize: 12, paddingTop: 4}}>(평균 주 6~7회 운동)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }
            </View>
        </View>
    )
}

export default ActivityLevelFixScreen;