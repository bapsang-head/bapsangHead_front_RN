//Libarary or styles import
import React, { useState, useRef, useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import { styles } from "./styles/styles";
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context"; //iOS M자 탈모 대비

//Redux 라이브러리를 사용하기 위해 최상위 컴포넌트에 연결해야 한다. <Provider>와 store.js를 import한다.
import { Provider } from "react-redux";
import store from "./store";

import { setNavigationRef } from "./apis/customAxios"; // customAxios.tsx에서 가져온 navigation 설정 함수

//components(Screen들이라고 생각하면 됩니다) import
import SplashScreen from "@screens/SplashScreen";
import MainScreen from "@screens/MainScreen";
import TextInputScreen from "@screens/TextInputScreen";
import DetailScreen from "@screens/DetailScreen";
import MyPageScreen from "@screens/MyPageScreen";
import LoginScreen from "@screens/LoginScreen";
import SettingScreen from "@screens/SettingScreen";
import ActivityLevelFixScreen from "@screens/ActivityLevelFixScreen";
import FixBasicDataScreen from "@screens/FixBasicDataScreen";
import FixTextInputScreen from "@screens/FixTextInputScreen";

//Tab으로 오고 갈 수 있는 3가지 화면을 정의한다 (MaterialBottomTabNavigator를 사용)
let Tab = createBottomTabNavigator();

function TabNavigator() {
  console.log("TabNavigator rendering");
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false, //모든 탭의 header를 숨기기 위해서 사용
        tabBarActiveTintColor: "#477C1E", // Active 상태의 아이콘 색상
        tabBarInactiveTintColor: "#000000", // Inactive 상태의 아이콘 색상
        tabBarShowLabel: false, // Label을 보여줄지 여부
        tabBarStyle: {
          height: 76,
          backgroundColor: "#FFFFFF", // 전체 배경색 설정
          elevation: 0, //안드로이드에서 TabBar의 그림자 제거
          shadowOpacity: 0, //iOS에서 TabBar의 그림자 제거
        },
      }}
    >
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          tabBarLabel: "Main",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={36} />,
        }}
      />
      <Tab.Screen
        name="Details"
        component={DetailScreen}
        options={{
          tabBarLabel: "Details",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-box-outline" color={color} size={36} />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: "MyPage",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={36} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

//Stack처럼 쌓이는 화면들을 구현하기 위해 StackNavigator를 정의한다
let Stack = createNativeStackNavigator();

function StackNavigation() {
  console.log("Stack Navigation Rendering");

  return (
    <Stack.Navigator>
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="TextInputScreen" component={TextInputScreen} />
      <Stack.Screen name="ActivityLevelFixScreen" component={ActivityLevelFixScreen} />
      <Stack.Screen name="FixBasicDataScreen" component={FixBasicDataScreen} />
      <Stack.Screen name="FixTextInputScreen" component={FixTextInputScreen} />
    </Stack.Navigator>
  );
}

//NavigationContainer의 theme 속성에 색상 설정을 하여 색을 변경할 수 있다
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF", //흰색으로 설정한다
  },
};

//최상위 App Component
function App(props: any) {
  const navigationRef = useNavigationContainerRef(); //Navigation 참조 생성

  //렌더링 시 최초 1회만 설정
  useEffect(() => {
    if (navigationRef) {
      setNavigationRef(navigationRef);
      console.log("navigationRef 초기화 완료:", navigationRef);
    }
  }, [navigationRef]);

  {
    /* SafeAreaView로 감싸서 상단 StatusBar를 고려한다 (아이폰 M자 탈모 대비)*/
  }
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* SafeAreaProvider로 감싸줌*/}
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <NavigationContainer theme={navTheme}>
              <StackNavigation />
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
