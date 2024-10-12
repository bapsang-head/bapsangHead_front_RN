//우리가 지금까지 썼던 라이브러리는 redux toolkit이다
//redux toolkit은 redux의 개선된 버전, 좀 더 쉽게 사용할 수 있도록 만든 라이브러리
//typescript를 사용할 때에는 Slice와 상태의 타입을 명확히 지정해야 한다.
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import accountInfoReducer from './slices/accountInfoSlice'
import markedDateReducer from './slices/markedDateSlice';
import mealInputReducer from './slices/mealInputSlice';


//configureStore 함수는 Redux store를 설정한다.
//reducer 필드에 markedDateSlice.reducer를 설정하여 'markedDate' 상태를 관리한다
const store = configureStore({
    reducer: {
        markedDate: markedDateReducer,
        accountInfo: accountInfoReducer,
        mealInput: mealInputReducer
    }
});

//RootState 타입은 store.getState의 반환 타입을 기반으로 정의된다. 이 타입은 Application의 전체 상태 구조를 나타낸다
//AppDispatch 타입은 store.dispatch 타입을 가져와 정의된다. 이 타입은 dispatch할 수 있는 액션의 타입을 나타낸다.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//Store 내보내기
export default store;

