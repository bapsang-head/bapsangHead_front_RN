//redux-toolkit 사용할 것임
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//회원가입 정보
interface accountInfo {
  email: string | null;
  name: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  gender: string | null;
  activityLevel: string | null; //LOW, LIGHT, MEDIUM, HIGH중 하나
  bmr: number | null; //기초대사량(BMR)
  activityMetabolism: number | null; //활동대사량
}

const accountInitialState: accountInfo = {
  email: null,
  name: null,
  height: null,
  weight: null,
  age: null,
  gender: null,
  activityLevel: null,
  bmr: null,
  activityMetabolism: null,
};

let accountInfoSlice = createSlice({
  name: "accountInfo",
  initialState: accountInitialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    setName: (state, action: PayloadAction<string | null>) => {
      state.name = action.payload;
    },
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
    },
    calculateBMR: (state) => {
      if (state.height && state.weight && state.age && state.gender) {
        if (state.gender === "MALE") {
          state.bmr = 88.362 + 13.397 * state.weight + 4.799 * state.height - 5.677 * state.age;
        } else if (state.gender === "FEMALE") {
          state.bmr = 447.593 + 9.247 * state.weight + 3.098 * state.height - 4.33 * state.age;
        }
      }
    },
    calculateActivityMetabolism: (state) => {
      if (state.bmr && state.activityLevel) {
        let activityFactor = 1;
        switch (state.activityLevel) {
          case "LOW":
            activityFactor = 1.2;
            break;
          case "LIGHT":
            activityFactor = 1.375;
            break;
          case "MEDIUM":
            activityFactor = 1.725;
            break;
          case "HIGH":
            activityFactor = 1.9;
            break;
        }
        state.activityMetabolism = state.bmr * activityFactor;
      }
    },
  },
});

//action을 export
export const {
  setEmail,
  setName,
  setHeight,
  setWeight,
  setAge,
  setGender,
  setActivityLevel,
  calculateBMR,
  calculateActivityMetabolism,
} = accountInfoSlice.actions;

export default accountInfoSlice.reducer;
