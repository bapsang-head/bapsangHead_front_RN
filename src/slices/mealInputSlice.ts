import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MealInputState {
    data: {
        [key: string]: { //각 월에 대한 데이터를 key로 관리 (ex. '2024-10' 같은 key)
            date: string;
            식단입력여부: string;
        }[];
    };
    lastUpdated: string | null;
}

const initialState: MealInputState = {
    data: {}, // 각 월별 데이터를 여기에 저장
    lastUpdated: null, // 마지막으로 데이터가 업데이트된 시간
};

//식단 입력 여부(mealInput) slice 정의
const mealInputSlice = createSlice({
    name: 'mealInput',
    initialState,
    reducers: { //데이터를 업데이트 하는 액션을 정의
      setMealInput: (
        state,
        action: PayloadAction<{ month: string; mealData: { date: string; 식단입력여부: string }[] }>
      ) => {
        // month: '2024-09', '2024-10', '2024-11' 같은 형식으로 데이터를 저장
        state.data[action.payload.month] = action.payload.mealData;
        state.lastUpdated = new Date().toISOString(); // 마지막 업데이트 시간을 현재 시간으로 설정
      },
    },
  });
  
  //action(setMealData)을 export
  export const { setMealInput } = mealInputSlice.actions;

  export default mealInputSlice.reducer;