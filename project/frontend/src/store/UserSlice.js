import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId: null,
    userName: null,
    isLogIn: false
}

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        Login: (state, action) => {
            let user_id
            if('uid' in action.payload){
                user_id = action.payload.uid
            }else{
                user_id = action.payload.localId
            }
            const { email} =  action.payload;
            state.userId = user_id;
            state.userName = email;
            state.isLogIn = true;
        },
        Logout : (state) => {
            state.userId = null;
            state.userName = null;
            state.isLogIn = false;
        }
    }
})
export const {
    Login,
    Logout
} = userSlice.actions
export default userSlice.reducer