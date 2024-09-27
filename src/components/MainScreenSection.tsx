//Libarary or styles import
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, ScrollView, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import moment from 'moment';
import { styles } from '../styles/styles';

//svg Icon들 import!
import ArrowUpIcon from '../assets/svg/arrow_drop_up.svg'
import ArrowDownIcon from '../assets/svg/arrow_drop_down.svg'
import MorningIcon from '../assets/svg/morning.svg'
import LunchIcon from '../assets/svg/lunch.svg'
import DinnerIcon from '../assets/svg/dinner.svg'
import PenIcon from '../assets/svg/pen.svg'
import SlimArrowDownIcon from '../assets/svg/slimArrow_Down.svg'
import SlimArrowUpIcon from '../assets/svg/slimArrow_Up.svg'
import WatchDetailsIcon from '../assets/svg/watch_detail.svg'
import FixDietIcon from '../assets/svg/fix_diet.svg'

import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../store";
import { setMarkedDate } from '../slices/markedDateSlice'


import AsyncStorage from '@react-native-async-storage/async-storage'

function returnIcon(eatingTime: String) {
    if(eatingTime === '아침 식사')
    {
        return (<MorningIcon height={32} width={32} opacity={1}/>);
    } 
    else if(eatingTime === '점심 식사')
    {
        return (<LunchIcon height={32} width={32} opacity={1}/>);
    }
    else if(eatingTime === '저녁 식사')
    {
        return (<DinnerIcon height={32} width={32} opacity={1}/>);
    } else {
        return null; //해당하지 않는 경우 null 반환
    }
}

function MainScreenSection({eatingTime, navigation}) {

    let [isSectionFolded, setIsSectionFolded] = useState(true); //section을 접었다 폈다 하는 state

    //navigation 이동 관련 함수 moveToTextInputScreen, moveToFixTextInputScreen
    function moveToTextInputScreen() {
        navigation.navigate('TextInputScreen');
    }

    function moveToFixTextInputScreen() {
        navigation.navigate('FixTextInputScreen');
    }

    return (
        <View style={SectionStyles.section}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                {/* 각 상황에 맞게 렌더링 */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* returnIcon 함수 호출 */}
                    {returnIcon(eatingTime)}
                    <Text style={styles.sectionTitle}>{eatingTime}</Text>
                </View>
                {/* 우측에 붙어있는 화살표 */}
                <TouchableOpacity onPress={()=>{setIsSectionFolded(!isSectionFolded)}}>
                {
                  isSectionFolded ? (
                    <SlimArrowDownIcon height={32} width={32} opacity={1}/>
                  ) : (
                    <SlimArrowUpIcon height={32} width={32} opacity={1}/>
                  )
                }
                </TouchableOpacity>
            </View>
            {/* section이 접혀있는지 아닌지에 따라서 다른 결과를 렌더링한다 */}
            {
                isSectionFolded ? (
                    null
                ) : (
                    <>
                    <View style={SectionStyles.section_contents}>
                        <Text style={{fontSize: 16, fontWeight: 'light'}}>아직 추가된 식단이 없어요!</Text>
                    </View>
                    <TouchableOpacity onPress={moveToTextInputScreen}>
                        <View style={styles.section_Button_long}>
                        <PenIcon height={24} width={24} opacity={1}/>
                        <Text>텍스트로 기록하기</Text>
                        </View>
                    </TouchableOpacity>
                    </>
                )
            }
        </View>
    );
}

//Section에 관해 사용할 StyleSheet
const SectionStyles = StyleSheet.create({
    //section 박스 스타일
    section: {
        backgroundColor: '#f0ffd4',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
    },
    //한 Section 안에 들어가는 sectionTitle 글꼴 스타일(아침 식사 등..)
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 8
    },
    //Main 화면의 section 안에 들어가는 구성요소들 style
    section_contents: {
        paddingVertical: 20, //margin 추가
        justifyContent: 'center',
        alignItems: 'center'
    },
    //Main 화면의 section 안에 들어가는 버튼 style (짧은 버전)
    section_Button_short: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
        backgroundColor: '#bbf3be',
    },
    //Main 화면의 section 안에 들어가는 버튼 style (긴 버전)
    section_Button_long: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 76,
        height: 48,
        borderRadius: 18,
        backgroundColor: '#bbf3be',
    },
});

export default MainScreenSection;