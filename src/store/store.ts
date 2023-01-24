import {combineReducers, configureStore} from "@reduxjs/toolkit"
import authSlice from "./reducers/authSlice"





const  rootReduce = combineReducers({
    auth: authSlice,
})

export const store = configureStore({
    reducer: rootReduce,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch