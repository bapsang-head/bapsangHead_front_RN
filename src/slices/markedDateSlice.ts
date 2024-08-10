//우리가 지금까지 썼던 라이브러리는 redux toolkit이다
//redux toolkit은 redux의 개선된 버전, 좀 더 쉽게 사용할 수 있도록 만든 라이브러리
//typescript를 사용할 때에는 Slice와 상태의 타입을 명확히 지정해야 한다.
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

//선택한 날짜 (markedDate)
interface MarkedDateState {
    date: string | null;
}

const initialState: MarkedDateState = {
    date: new Date().toISOString()
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

//action을 export
export const {setMarkedDate} = markedDateSlice.actions;

export default markedDateSlice.reducer;