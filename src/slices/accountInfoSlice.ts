//redux-toolkit 사용할 것임
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//회원가입 정보
interface accountInfo {
    height: number | null,
    weight: number | null,
    age: number | null,
    gender: string | null,
    activityLevel: string | null;
}

const accountInitialState: accountInfo = {
    height: null,
    weight: null,
    age: null,
    gender: null,
    activityLevel: null
}

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
export const {
    setHeight,
    setWeight,
    setAge,
    setGender,
    setActivityLevel
} = accountInfoSlice.actions;

export default accountInfoSlice.reducer;