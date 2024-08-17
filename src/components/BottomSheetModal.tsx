import React, {useState, useMemo} from 'react';
import {View, Text, Button, StyleSheet, Dimensions} from 'react-native';
import * as Progress from 'react-native-progress';

//barWidth를 state로 관리하게 되면, 불필요하게 재렌더링이 여러 번 발생, 아래와 같이 관리하는 것이 효율적일 것으로 판단.
const barWidth = Dimensions.get("screen").width;
const modifiedBarWidth = barWidth - 80;

//Bottom Sheet 내부에 들어가는 BottomSheetModal 컴포넌트
function BottomSheetModal(props) {
  console.log("BottomSheetModal rendering");

  return (
      <View style={styles.modalContainer}>
          <View style={styles.row}>
            <Text style={styles.modalTitle} testID="behaviorText">나의 활동대사량</Text>
            <Text style={styles.modalTitle} testID="behaviorText">{props.MyActivity}kcal</Text>
          </View>
          <View style={styles.progressContainer}>
            {/* Progress Bar 추가 (react-native-progress 라이브러리 활용) */}
            <Progress.Bar 
              progress={props.TodayEatenCalories/props.MyActivity} 
              width={modifiedBarWidth}
              height={10}
              
              animationConfig={{bounciness: 20}} 
              borderWidth={0}//테두리 없애기
              unfilledColor='lightgrey'//안 채워진 곳에 대한 색상 설정
              color={'green'}
              borderRadius={10}/>
          </View>
          <View style={styles.row}>
            <Text style={styles.modalBottom}>현재 남은 섭취 칼로리</Text>
            <Text style={styles.modalBottom}>{(props.MyActivity)-(props.TodayEatenCalories)}kcal</Text>
          </View>
      </View>
  );
}


const styles = StyleSheet.create({
    modalContainer: {
      flexDirection: 'column',
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingHorizontal: 40,
      paddingVertical: 20,
      alignItems: 'center',
    },
    progressContainer: {
      width: '100%', //부모 요소의 너비를 100%로 설정
      marginHorizontal: 0,
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