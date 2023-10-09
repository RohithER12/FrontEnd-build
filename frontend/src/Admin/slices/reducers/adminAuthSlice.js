import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    adminInfo:localStorage.getItem('adminInfo')
    ? JSON.parse(localStorage.getItem('adminInfo'))
    :null
}

const adminAuthSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.adminInfo = action.payload;
            localStorage.setItem('adminInfo',JSON.stringify(action.payload))
        },
        removeCredentials:(state,action)=>{
            state.adminInfo = null;
            localStorage.removeItem('adminInfo')
        }
    }
})

export const {setCredentials,removeCredentials} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;