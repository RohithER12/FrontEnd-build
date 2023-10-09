import {fetchBaseQuery,createApi}  from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({baseUrl: '',
    prepareHeaders:(headers,{getState})=>{
    
        const token = getState().token.token
        if(token){
            headers.set('authorization', `Bearer ${token}`)
        }
    }})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User','Admin'],
    endpoints: (builder) => ({}),
})


