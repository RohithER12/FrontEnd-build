import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    conferenceState:localStorage.getItem('conferenceState')
    ? JSON.parse(localStorage.getItem('conferenceState'))
    : null
}

const conferenceSlice = createSlice({
    name:'conference',
    initialState,
    reducers:{
      setConferenceState: (state, action) => {
        state.conferenceState = action.payload;
        localStorage.setItem('conferenceState', JSON.stringify(action.payload));
       },
       removeConferenceState: (state, action) => {
        state.conferenceState = null;
        localStorage.removeItem('conferenceState');
      },
    }
})

export const {setConferenceState,removeConferenceState} = conferenceSlice.actions;

export default conferenceSlice.reducer;