import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// function CustomHeader({navigation, route, options, back})
// {
//     return (
//         <View style = {{ 
//             flexDirection: 'row', 
//             height: 60, 
//             alignItems: 'center', 
//             justifyContent: 'space-between', 
//             paddingHorizontal: 10, 
//             backgroundColor: 'white', 
//             borderBottomWidth: 1, 
//             borderBottomColor: 'white'}}>
//             {back ? (
//                 <TouchableOpacity onPress = {navigation.goBack} style={{ padding: 10 }}>
//                     <Text>Back</Text>
//                 </TouchableOpacity>
//             ) : null}
//             <Text style={{ fontSize: 20 }}>{options.title}</Text>
//             <TouchableOpacity onPress={() => alert('Done pressed!')} style={{ padding: 10 }}>
//                 <Text>Done</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }


function TextInputScreen({route, navigation, appState}){
    console.log("TextInputScreen Rendering");
    return (
        <View>
            <Text>음식을 입력해주세요</Text>
        </View>
    );
}

export default TextInputScreen;