import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../utils/apiSlice/apiSlice';
import authSlice from '../User/slices/reducers/user_reducers/authSlice'
import adminAuthReducer from '../Admin/slices/reducers/adminAuthSlice';
import streamReducer from '../User/slices/reducers/user_reducers/streamReducer';
import conferenceReducer from '../User/slices/reducers/user_reducers/conferenceReducer';
import authReducer from '../utils/apiSlice/authReducer';


const store = configureStore({
  reducer: {
    auth:authSlice,
    admin:adminAuthReducer,
    stream:streamReducer,
    conference:conferenceReducer,
    token:authReducer,
    [apiSlice.reducerPath]:apiSlice.reducer,
    },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
 
export default store;