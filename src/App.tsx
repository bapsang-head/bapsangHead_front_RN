//Libarary or styles import
import React, { useState, useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import moment from 'moment';
import { styles } from './styles/styles';

//svg import
// import MainIcon from './assets/MainIcon';

//components import
import MainScreen from '@components/MainScreen';

//SplashScreen을 자동으로 숨기지 않도록 설정
SplashScreen.preventAutoHideAsync();

// Define the type for the navigation stack
type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

//Stack navigator를 만들기 위한 변수 Stack과 Tab을 만든다
let Stack = createNativeStackNavigator<RootStackParamList>();
let Tab = createBottomTabNavigator();


//상세 화면 component
function DetailsScreen() {
  console.log("Detail rendering");
  return (
    <SafeAreaView style={styles.container}>
      <Text>Details Screen</Text>
    </SafeAreaView>
  );
}

//MyPage 화면 component
function MyPageScreen() {
  console.log("MyPage rendering");
  return (
    <SafeAreaView style={styles.container}>
      <Text>MyPage Screen</Text>
    </SafeAreaView>
  );
}


//하단 Tab Navigator Component
function TabNavigator() {
  console.log("TabNavigator rendering");
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Main" 
        component={MainScreen} 
        options={{ 
          tabBarLabel: '메인',
          // tabBarIcon: ({ color, size }) => (
          //   <MainIcon darkMode={false} size={32} color={'red'}/>
          // ),
          }} />
      <Tab.Screen name="Details" component={DetailsScreen} options={{ tabBarLabel: '상세' }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ 
        tabBarLabel: '마이페이지',
        // tabBarIcon: ({ color, size }) => (
        //   <MyPageIcon darkMode={false} size={24} color={"green"} />
        // ),
        }} />
    </Tab.Navigator>
  );
}

//최상위 App Component
function App() {

  useEffect(() => {
    async function prepare() //prepare 함수를 정의한다
    {
      try {
        //내가 필요한 리소스를 가져오는 동안 splash screen을 보여준다 (여기에 리소스 가져오는 코드를 집어 넣는다)
        //아래 코드는 인위적으로 2초를 기다리는 코드이다
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      } catch (e) {
        console.warn(e);
      } finally {
        //Resource 로드가 완료 되면, SplashScreen을 숨긴다
        await SplashScreen.hideAsync();
      }
    }
    
    prepare() //prepare 함수 실행
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <TabNavigator/> 
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;