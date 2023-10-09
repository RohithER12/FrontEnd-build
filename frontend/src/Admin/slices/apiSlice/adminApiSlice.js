import { apiSlice } from "../../../utils/apiSlice/apiSlice";
const ADMIN_URL = '/api/admin';


const createApiMutation= (builder,endpoint,url,method)=>{
    return builder.mutation({
        query:(data)=>({
            url:`${ADMIN_URL}/${url}`,
            method:method,
            body:data
        })
    })
}

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        adminLogin:createApiMutation(builder,'adminLogin','login','POST'),
        adminLogout:createApiMutation(builder,'adminLogout','logout','POST'),
        manageUser:createApiMutation(builder,'manageUser','manage-users','PATCH'),
        manageInterest:createApiMutation(builder,'manageInterest','manage-inetrest','PATCH'),
        addInterest:createApiMutation(builder,'addInterest','add-interest','POST'),
        getUsers:createApiMutation(builder,'getUsers','get-users','GET'),
        getInterests:createApiMutation(builder,'getInterests','get-interest','GET'),
        getAllCommunities:createApiMutation(builder,'getAllCommunities','get-all-community','GET'),
        manageCommunity:createApiMutation(builder,'manageCommunity','manage-community','POST'),
    })
})

export const 
{useAdminLoginMutation,
useAdminLogoutMutation,
useManageUserMutation,
useGetUsersMutation,
useGetInterestsMutation,
useManageInterestMutation,
useManageCommunityMutation,
useAddInterestMutation,
useGetAllCommunitiesMutation,
} = adminApiSlice



