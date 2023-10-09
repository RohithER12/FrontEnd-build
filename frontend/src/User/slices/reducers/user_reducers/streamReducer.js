import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    streamState:localStorage.getItem('streamState')
    ? JSON.parse(localStorage.getItem('streamState'))
    : null
}

const streamSlice = createSlice({
    name:'stream',
    initialState,
    reducers:{
      setStreamState: (state, action) => {
        state.streamState = action.payload;
        localStorage.setItem('streamState', JSON.stringify(action.payload));
       },
       removeStreamState: (state, action) => {
        state.streamState = null;
        localStorage.removeItem('streamState');
      },
    }
})

export const {setStreamState,removeStreamState} = streamSlice.actions;

export default streamSlice.reducer;