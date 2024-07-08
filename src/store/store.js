//우리가 지금까지 썼던 라이브러리는 redux toolkit이다
//redux toolkit은 redux의 개선된 버전, 좀 더 쉽게 사용할 수 있도록 만든 라이브러리
import { configureStore, createSlice } from '@reduxjs/toolkit'; 

// let stock = createSlice({
//     name: 'stock',
//     initialState: [10, 11, 12]
// })

//user.actions 이런 식으로 쓰면, state 변경함수들 남음
//오른쪽 자료를 변수로 빼는 문법일 뿐 (destructuring 문법)
// export let { incrementCount, decrementCount, addCart, deleteCart } = cartInfo.actions
// export let { changeName, addAge } = user.actions

export default configureStore({
    reducer: {
        // 여기에 리듀서를 추가할 수 있습니다.
       
    }
});