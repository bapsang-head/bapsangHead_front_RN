import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import * as Progress from 'react-native-progress';

//Bottom Sheet 내부에 들어가는 BottomSheetModal 컴포넌트
function BottomSheetModal(props) {
  console.log("BottomSheetModal rendering");
  const [parentWidth, setParentWidth] = useState(0); //부모 컴포넌트의 너비를 받아오기 위한 State

  return (
      <View style={styles.modalContainer} onLayout={(event) => {
        const {width} = event.nativeEvent.layout;
        const adjustedWidth = width - 20;
        setParentWidth(adjustedWidth); //너비 불러온 후 부모 너비 관련 state 업데이트
      }}>
          <View style={styles.row}>
            <Text style={styles.modalTitle} testID="behaviorText">나의 활동대사량</Text>
            <Text style={styles.modalTitle} testID="behaviorText">{props.MyActivity}kcal</Text>
          </View>

          {/* Progress Bar 추가 (react-native-progress 라이브러리 활용) */}
          <Progress.Bar 
            progress={props.TodayEatenCalories/props.MyActivity} 
            width={parentWidth} 
            height={10}
            animationConfig={{bounciness: 20}} 
            borderWidth={0}//테두리 없애기
            unfilledColor='lightgrey'//안 채워진 곳에 대한 색상 설정
            color={'green'}
            borderRadius={10}/>
            <View style={styles.row}>
              <Text style={styles.modalBottom}>현재 남은 섭취 칼로리</Text>
              <Text style={styles.modalBottom}>{(props.MyActivity)-(props.TodayEatenCalories)}kcal</Text>
            </View>
          
      </View>
  );
}

const styles = StyleSheet.create({
    modalContainer: {
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      margin: 20,
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    modalTitle: {
      alignItems: 'flex-start',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    modalBottom: {
      alignItems: 'flex-start',
      fontSize: 12,
      fontWeight: 'light',
      marginTop: 4,
    }
  });

export default BottomSheetModal;