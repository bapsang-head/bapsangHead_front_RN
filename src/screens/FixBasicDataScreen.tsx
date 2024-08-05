//Libarary or styles import
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, CalendarList, LocaleConfig, ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import { styles } from '../styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';

//SVG 파일들 Import
import HeightIcon from '../assets/svg/height.svg';
import WeightIcon from '../assets/svg/scale.svg';
import AgeIcon from '../assets/svg/timer_play.svg';
import GenderIcon from '../assets/svg/wc.svg';
import ManIcon from '../assets/svg/man_4.svg';
import WomanIcon from '../assets/svg/woman_2.svg';

function FixBasicDataScreen({route, navigation, appState}) {

    let [height, setHeight] = useState(''); //키
    let [weight, setWeight] = useState(''); //몸무게
    let [age, setAge] = useState(''); //나이
    let [gender, setGender] = useState(''); //성별

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
            <Text style={{fontSize: 28, fontWeight: 'bold', paddingLeft: 32, paddingTop: 24}}>신체 기본 정보 수정하기</Text>

            {/* 정보 입력 Layout들을 모아 놓은 상단 View */}
            <View style={{paddingLeft: 32, paddingTop: 32, paddingRight: 84}}>
                {/* 키 입력란 */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <HeightIcon width={32} height={32}/>
                    <Text style={{fontSize: 20, marginLeft: 8, fontWeight: 'bold'}}>키</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
                    <TextInput
                        style={[styles.settingInputButton, {flex: 1}]}
                        onChangeText={setHeight}
                        value={height}
                        placeholder="178"
                        placeholderTextColor={'#a8a8a8'}/>
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 8}}>cm</Text>
                </View>

                {/* 몸무게 입력란 */}
                <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
                    <WeightIcon width={32} height={32}/>
                    <Text style={{fontSize: 20, marginLeft: 8, fontWeight: 'bold'}}>몸무게</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
                    <TextInput
                        style={[styles.settingInputButton, {flex: 1}]}
                        onChangeText={setWeight}
                        value={weight}
                        placeholder="72"
                        placeholderTextColor={'#a8a8a8'}/>
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 8}}>kg</Text>
                </View>

                {/* 나이 입력란 */}
                <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
                    <AgeIcon width={32} height={32}/>
                    <Text style={{fontSize: 20, marginLeft: 8, fontWeight: 'bold'}}>나이</Text>
                </View>
                {/* getWidth 함수를 onLayout 옵션으로 넘겨서 width 정보를 받아올 것이다 */}
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
                    <TextInput
                        style={[styles.settingInputButton, {flex: 1}]}
                        onChangeText={setAge}
                        value={age}
                        placeholder="25"
                        placeholderTextColor={'#a8a8a8'}/>
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 8}}>세</Text>
                </View>

                {/* 성별 선택란 */}
                <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
                    <GenderIcon width={32} height={32}/>
                    <Text style={{fontSize: 20, marginLeft: 8, fontWeight: 'bold'}}>성별</Text>
                </View>
                <View style={{flexDirection: 'row', 
                    alignItems: 'center',
                    marginTop: 16, 
                    justifyContent: 'space-between'}}>

                    {/* '남성' 버튼을 누를 경우엔 여성 버튼은 선택 해제시켜야 한다. 그 반대도 마찬가지. */}
                    {
                        gender === '남' ? (
                            <TouchableOpacity 
                                onPress={()=>{ setGender('') }}  
                                style={{flex: 3}}>
                                <View style={[styles.genderSelectButton, {backgroundColor: '#FFE7D1', borderColor: '#FFE7D1'}]}>
                                    <ManIcon width={24} height={24} opacity={1} fill='#FFA858'/>
                                    <Text style={{fontSize: 16, opacity: 1}}>남성</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                                onPress={()=>{ setGender('남') }}  
                                style={{flex: 3}}>
                                <View style={[styles.genderSelectButton]}>
                                    <ManIcon width={24} height={24} opacity={0.3} fill='black'/>
                                    <Text style={{fontSize: 16, opacity: 0.3}}>남성</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    <View style={{flex: 1}}/>{/* 비율 Layout을 위한 빈 View */}
                    {
                        gender === '여' ? (
                            <TouchableOpacity 
                            onPress={()=>{ setGender('') }} 
                            style={{flex: 3}}>
                                <View style={[styles.genderSelectButton, {backgroundColor: '#FFE5E5', borderColor: '#FFE5E5'}]}>
                                    <WomanIcon width={24} height={24} opacity={1} fill='#FFB6B6'/>
                                    <Text style={{fontSize: 16, opacity: 1}}>여성</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity 
                            onPress={()=>{ setGender('여') }} 
                            style={{flex: 3}}>
                                <View style={styles.genderSelectButton}>
                                    <WomanIcon width={24} height={24} opacity={0.3} fill='black'/>
                                    <Text style={{fontSize: 16, opacity: 0.3}}>여성</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        </View>
    )
}

export default FixBasicDataScreen;