import { configureStore, createSelector } from '@reduxjs/toolkit'
import { useSelector } from "react-redux"
import userSlice from './UserSlice.js'
export const store = configureStore({
    reducer: {
        userStore: userSlice
    }
})

export function GetStores() {
    const reduxStores = useSelector(
        createSelector(
            (state) => { return state },
            (stores) => {
                return { stores }
            }
        )
    )
    return reduxStores.stores
}