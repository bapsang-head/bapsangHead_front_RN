//Libarary or styles import
import React, { useState, useRef, useEffect } from 'react';
import { NavigationContainer, useNavigation, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import moment from 'moment';
import { styles } from './styles/styles';
import { MaterialCommunityIcons as Icon, MaterialCommunityIcons } from '@expo/vector-icons';


//components import
import MainScreen from '@components/MainScreen';
import TextInputScreen from '@components/TextInputScreen';

//SplashScreen을 자동으로 숨기지 않도록 설정
SplashScreen.preventAutoHideAsync();

// Define the type for the navigation stack
type RootStackParamList = {
  TabNavigator: undefined;
  TextInputScreen: undefined;
  Details: undefined;
  MyPage: undefined;
};

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


//Tab으로 오고 갈 수 있는 3가지 화면을 정의한다 (MaterialBottomTabNavigator를 사용)
let Tab = createBottomTabNavigator();

function TabNavigator() {
  console.log("TabNavigator rendering");
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false, //모든 탭의 header를 숨기기 위해서 사용
        tabBarActiveTintColor: '#477C1E', // Active 상태의 아이콘 색상
        tabBarInactiveTintColor: '#000000', // Inactive 상태의 아이콘 색상
        tabBarShowLabel: false, // Label을 보여줄지 여부
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // 전체 배경색 설정
        },
      }}>
      <Tab.Screen 
        name="Main" 
        component={MainScreen}
        options={{
          tabBarLabel: 'Main',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
        />
      <Tab.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{
          tabBarLabel: 'Details',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}/>
      <Tab.Screen 
        name="MyPage" 
        component={MyPageScreen}
        options={{
          tabBarLabel: 'MyPage',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}/>
    </Tab.Navigator>
  );
}

//Stack처럼 쌓이는 화면들을 구현하기 위해 StackNavigator를 정의한다
let Stack = createNativeStackNavigator();

function StackNavigation() {
  let navigation = useNavigation(); //StackNavigator 컴포넌트에서 navigation을 사용하기 위해 useNavigation 훅을 사용한다
  console.log("Stack Navigation Rendering");
  return (
    <Stack.Navigator>
      <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen 
        name="TextInputScreen"
        component={TextInputScreen} 
        options={{ 
          //header를 커스텀으로 설정할 수 있다
          title: '입력',
          // header: (props) =>
          // (
          //   <View style={{height : 80}}>
          //   </View>
          // ), 
          headerStyle: {
            backgroundColor: '#FFFFFF'
          },
          headerLeft: () => (
            <TouchableOpacity onPress={()=>{navigation.goBack()}}>
              <MaterialCommunityIcons name="chevron-left" size={24}/>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={()=>{alert('Done pressed!')}}>
              <Text>완료</Text>
            </TouchableOpacity>
          )
        }} />
    </Stack.Navigator>
  );
}

//NavigationContainer의 theme 속성에 색상 설정을 하여 색을 변경할 수 있다
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
  },
};

//최상위 App Component
function App(props: any) {

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

  {/* SafeAreaView로 감싸서 상단 StatusBar를 고려한다 (아이폰 M자 탈모 대비)*/}
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <NavigationContainer theme={navTheme}>
          <StackNavigation/> 
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;