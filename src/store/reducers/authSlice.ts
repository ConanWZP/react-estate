import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../../firebaseConfig";

export interface AuthSliceState {
    isAuth: boolean,
    loading: boolean
}

const initialState: AuthSliceState = {
    isAuth: false,
    loading: true
}

export const authStateCheck = createAsyncThunk(
    'auth/checkStatus',
    async (_, thunkAPI) => {
        await onAuthStateChanged(auth, (user) => {
            console.log(user)
            if (user) {
                thunkAPI.dispatch(setIsAuth(true))
            }
            thunkAPI.dispatch(setLoading(false))
        })
    }
)


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload
        },
        setLoading(state, action: PayloadAction<boolean>) {

            state.loading = action.payload
        },

    },
    extraReducers: {

    }
})

export const {setIsAuth, setLoading} = authSlice.actions

export default authSlice.reducer