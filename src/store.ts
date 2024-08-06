//우리가 지금까지 썼던 라이브러리는 redux toolkit이다
//redux toolkit은 redux의 개선된 버전, 좀 더 쉽게 사용할 수 있도록 만든 라이브러리
//typescript를 사용할 때에는 Slice와 상태의 타입을 명확히 지정해야 한다.
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

//선택한 날짜 (markedDate)
interface MarkedDateState {
    date: string | null;
}

//회원가입 정보
interface accountInfo {
    height: number | null,
    weight: number | null,
    age: number | null,
    gender: string | null,
    activityLevel: string | null;
}

const initialState: MarkedDateState = {
    date: new Date().toISOString()
}

const accountInitialState: accountInfo = {
    height: null,
    weight: null,
    age: null,
    gender: null,
    activityLevel: null
}

//markedDate slice 정의
let markedDateSlice = createSlice({
    name: 'markedDate',
    initialState,
    reducers : {
        setMarkedDate: (state, action: PayloadAction<string>) => {
            state.date = action.payload;
        }
    }
});

let accountInfoSlice = createSlice({
    name: 'accountInfo',
    initialState: accountInitialState,
    reducers: {
        setHeight: (state, action: PayloadAction<number | null>) => {
            state.height = action.payload;
        },
        setWeight: (state, action: PayloadAction<number | null>) => {
            state.weight = action.payload;
        },
        setAge: (state, action: PayloadAction<number | null>) => {
            state.age = action.payload;
        },
        setGender: (state, action: PayloadAction<string | null>) => {
            state.gender = action.payload;
        },
        setActivityLevel: (state, action: PayloadAction<string | null>) => {
            state.activityLevel = action.payload;
        }
    }

})

//action을 export
export const {setMarkedDate} = markedDateSlice.actions;

//action을 export
export const {
    setHeight,
    setWeight,
    setAge,
    setGender,
    setActivityLevel
} = accountInfoSlice.actions;

//configureStore 함수는 Redux store를 설정한다.
//reducer 필드에 markedDateSlice.reducer를 설정하여 'markedDate' 상태를 관리한다
const store = configureStore({
    reducer: {
        markedDate: markedDateSlice.reducer,
        accountInfo: accountInfoSlice.reducer
    }
});

//RootState 타입은 store.getState의 반환 타입을 기반으로 정의된다. 이 타입은 Application의 전체 상태 구조를 나타낸다
//AppDispatch 타입은 store.dispatch 타입을 가져와 정의된다. 이 타입은 dispatch할 수 있는 액션의 타입을 나타낸다.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//Store 내보내기
export default store;

