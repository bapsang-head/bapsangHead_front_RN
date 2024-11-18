import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';

import {styles} from '../styles/styles';

import RemoveIcon from '../assets/svg/remove.svg'
import NoticeIcon from '../assets/svg/campaign.svg'

//1차 분석 후 나오는 UI
function FixingInput(props) {

    //props로 넘어온 1차 분석 결과를 data의 초기 값으로 설정한다
    let [data, setData] = useState(props.analysisResult);

    // console.log('데이타: ', data);

    //상위 컴포넌트(TextInputScreen)에서 '완료' 버튼이 눌렸을 때만 상위 컴포넌트의 analysisResult를 업데이트 (의존성 배열 확인)
    useEffect(() => {
        //'완료' 버튼이 눌렸다는 signal이 상위 컴포넌트로부터 true로 받아 왔을 경우
        if(props.isFixingCompleted)
        {
            props.setAnalysisResult(data); //상위 컴포넌트의 analysisResult 값을 data로 업데이트
        }
    }, [props.isFixingCompleted, data, props.setAnalysisResult])
    

    //'완료' 버튼 활성화 여부 checking하는 함수 (data라는 값의 type을 명시적으로 표시함)
    function checkFixingInputState(data: {food: string, unit: string, quantity: string}[]) {

        //data의 길이가 0이라면 (빈 배열이라면)
        if(data.length === 0)
        {
            return false;
        }

        //유효하지 않은 입력이 있는지 확인한다
        for(let i = 0; i < data.length; i++) {
            const item = data[i];

            //string 타입의 'food'와 'unit'이 null 또는 빈 string인지 체크
            if(!item.food || !item.unit) {
                return false; //유효하지 않은 입력이 있을 경우 false 반환
            }

            //'quantity'가 0 또는 null인지 체크(TextInput의 특성 때문에 우선 string으로 처리한다)
            if(item.quantity === '0' || !item.quantity) {
                return false; //quantity가 0이면 false 반환
            }
        }

        //모든 입력을 확인했을 때 유효하면 true 반환
        return true;
    }

    //data가 변할 시에만 checkFixingInputState 함수를 호출해서 '완료' 버튼 활성화 여부 checking, 이에 대한 결과로 값 설정
    useEffect(() => {
        const checkValue = checkFixingInputState(data);
        //checkFixingInputState가 동일한 값을 반환하면 state 변경을 하지 않도록 해서 불필요한 렌더링 방지
        if(checkValue !== props.completeBtnAvailable)
        {
            props.setCompleteBtnAvailable(checkFixingInputState(data));
        }
    }, [data]);
    

    //사용자가 data를 수정 시 업데이트하기 위한 updateDataElement 함수
    const updateDataElement = (index, option: keyof typeof data[0], value) => {
        setData((prevData) => {
            const newData = [...prevData];
            newData[index] = { ...newData[index], [option]: value }; // 개별 객체만 업데이트
            return newData;
        });
    };

    //입력내용 추가하기 버튼을 눌렀을 때 수행하는 method
    const addDataElement = () => {
        const newData = [...data];

        //빈 데이터들로 구성되어 있는 배열 하나 newData에 push
        newData.push({'food': '', 'quantity': 0, 'unit': ''}); 
        setData(newData);
    }

    //삭제 버튼을 눌렀을 때 수행하는 method (삭제할 index를 인자로 넘겨준다)
    const deleteDataElement = (index) => {
        const newData = [...data];
        newData.splice(index, 1); //해당하는 index 위치의 원소를 삭제한다
        setData(newData);
    }

    return (
        <>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 360 }}>
            {/* 추후, 분셕 결과를 불러올 때, 분석한 결과만큼 찍어내야 하는 View */}
            {data.map((ele, i) => (
                <View
                    key={i}
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                >
                    {/* 삭제 버튼 */}
                    <TouchableOpacity style={{ flex: 0.2 }} onPress={() => deleteDataElement(i)}>
                        <View style={styles.delete_button}>
                            <RemoveIcon height={16} width={16} />
                        </View>
                    </TouchableOpacity>

                    {/* 음식명 입력 */}
                    <TextInput
                        style={[styles.textInputStyle, { flex: 0.5, marginRight: 4, height: 36 }]}
                        onChangeText={(text) => updateDataElement(i, 'food', text)}
                        value={ele.food}
                        placeholder="음식명"
                        placeholderTextColor="#a8a8a8"
                        multiline={false}
                        autoCorrect={false}
                        keyboardType="default"
                        importantForAutofill="no"
                        textBreakStrategy="highQuality"
                    />

                    {/* 수량 입력 */}
                    <TextInput
                        style={[styles.textInputStyle, { flex: 0.2, marginHorizontal: 4, height: 36 }]}
                        onChangeText={(text) =>
                            updateDataElement(i, 'quantity', parseInt(text) || 0)
                        }
                        value={String(ele.quantity)}
                        placeholder="숫자"
                        placeholderTextColor="#a8a8a8"
                        keyboardType="numeric"
                        multiline={false}
                        textBreakStrategy="simple"
                    />

                    {/* 단위 입력 */}
                    <TextInput
                        style={[styles.textInputStyle, { flex: 0.1, marginLeft: 4, height: 36 }]}
                        onChangeText={(text) => updateDataElement(i, 'unit', text)}
                        value={ele.unit}
                        placeholder="단위"
                        placeholderTextColor="#a8a8a8"
                        multiline={false}
                        textBreakStrategy="highQuality"
                        keyboardType="default"
                        autoCorrect={false}
                        importantForAutofill="no"
                    />
                </View>
            ))}
            <TouchableOpacity style={{marginTop: 20}} onPress={addDataElement}>
                <View style={styles.add_button}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>+</Text>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>입력내용 추가하기</Text>
                </View>
            </TouchableOpacity>
            <View style={{alignItems: 'flex-start', backgroundColor: '#f0ffd4', borderRadius: 10, paddingVertical: 16, paddingHorizontal: 16, marginTop: 16}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                    <NoticeIcon height={28} width={28}/>
                    <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 4}}>참고사항!</Text>
                </View>
                <Text style={{fontSize: 14, lineHeight: 20}}>
                    입력내용 분석 결과가 정확하지 않을 수 있어요.{"\n"}
                    정확하지 않은 경우, 결과를 수정해 주세요.{"\n"}
                    최종 내용을 바탕으로 영양성분 분석을 진행할게요.
                </Text>
            </View>
        </ScrollView>
        </>
    )
}

export default FixingInput;
