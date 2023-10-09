import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    token:null
}

const authReducer = createSlice({
    name:"token",
    initialState,
    reducers:{
        setToken:(state,action)=>{
            state.token = action.payload
          },
        removeToken:(state)=>{
            state.token = null
        }
    }
})

export const {setToken,removeToken} = authReducer.actions
export default authReducer.reducer