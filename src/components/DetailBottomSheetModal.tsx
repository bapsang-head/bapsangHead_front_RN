import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler'
import * as Progress from 'react-native-progress';

//'세부 영양성분' 내부에 들어가는 DetailBottomSheetModal 컴포넌트
function DetailBottomSheetModal(props) {
  console.log("DetailBottomSheetModal rendering");
  const [parentWidth, setParentWidth] = useState(0); //부모 컴포넌트의 너비를 받아오기 위한 State

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.modalContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 8, textAlign: 'center', marginBottom: 16}}>세부 영양성분</Text>
        {/* 세부 칼로리 표시해주는 박스 */}
        <Text style={{fontSize: 14, fontWeight: 'light'}}>세부 칼로리</Text>
        <View style={styles.detailContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                <Text>삼겹살 1조각</Text>
                <Text>100kcal</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: 'bold'}}>총 칼로리</Text>
                <Text>100kcal</Text>
            </View>
        </View>

        {/* 탄수화물 표시해주는 박스 */}
        <Text style={{fontSize: 14, fontWeight: 'light', marginTop: 16}}>탄수화물 함량</Text>
        <View style={styles.detailContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                <Text>삼겹살 1조각</Text>
                <Text>3g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: 'bold'}}>총 탄수화물</Text>
                <Text>3g</Text>
            </View>
        </View>

        {/* 단백질 표시해주는 박스 */}
        <Text style={{fontSize: 14, fontWeight: 'light', marginTop: 16}}>단백질 함량</Text>
        <View style={styles.detailContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                <Text>삼겹살 1조각</Text>
                <Text>15g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: 'bold'}}>총 탄수화물</Text>
                <Text>15g</Text>
            </View>
        </View>

        {/* 포화지방 표시해주는 박스 */}
        <Text style={{fontSize: 14, fontWeight: 'light', marginTop: 16}}>포화지방 함량</Text>
        <View style={styles.detailContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                <Text>삼겹살 1조각</Text>
                <Text>30g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: 'bold'}}>총 포화지방</Text>
                <Text>30g</Text>
            </View>
        </View>

        {/* 불포화지방 표시해주는 박스 */}
        <Text style={{fontSize: 14, fontWeight: 'light', marginTop: 16}}>불포화지방 함량</Text>
        <View style={styles.detailContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                <Text>삼겹살 1조각</Text>
                <Text>5g</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: 'bold'}}>총 불포화지방</Text>
                <Text>5g</Text>
            </View>
        </View>
    </ScrollView> 
  );
}

//해당 modal에서 사용되는 StyleSheet
const styles = StyleSheet.create({
    modalContainer: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
    },
    detailContainer: {
        backgroundColor: '#fffbd4',
        padding: 16,
        marginTop: 8,
        borderRadius: 12
    }
  });

export default DetailBottomSheetModal;