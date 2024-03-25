import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId: null,
    userName: null,
    isLogIn: false,
    userToken: null
}

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        LoginWithLocalData: (state, action) => {
           const {userId, userName, isLogIn, userToken} = action.payload
           state.userId = userId
           state.userName = userName
           state.isLogIn = isLogIn
           state.userToken = userToken
        },
        Login: (state, action) => {
            let user_id
            if ('uid' in action.payload) {
                user_id = action.payload.uid
            } else {
                user_id = action.payload.localId
            }
            const { email } = action.payload;
            state.userId = user_id;
            state.userName = email;
            state.isLogIn = true;
            state.userToken = action.payload.stsTokenManager.accessToken
        },
        LoginEmailPassword: (state, action) => {
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
            state.userToken = action.payload.idToken
        },
        Logout: (state) => {
            state.userId = null;
            state.userName = null;
            state.isLogIn = false;
            state.userToken = null;
        }
    }
})
export const {
    Login,
    Logout,
    LoginEmailPassword,
    LoginWithLocalData
} = userSlice.actions
export default userSlice.reducer