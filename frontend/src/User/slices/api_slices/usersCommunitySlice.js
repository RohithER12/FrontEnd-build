import { apiSlice } from "../../../utils/apiSlice/apiSlice";
const USERS_URL = '/api/user'

const createApiMutation = (builder,endpoint,url,method)=>{
    return builder.mutation({
      query:(data)=>({
        url:`${USERS_URL}/${url}`,
        method:method,
        body:data
      })
    })
  }

 const createApiGetQuery = (builder, endpoint, url,params) => {
    return builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${url}`,
        method: 'GET',
        params: `${params}${data}`,
      }),
    });
  };

  export const userCommunitySlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        createCommunity:createApiMutation(builder,'createCommunity','create-community','POST'),
        getAllActiveCommunity:createApiMutation(builder,'getAllActiveCommunity','get-active-community','GET'),
        searchUser:createApiGetQuery(builder,'searchUser','get-user-by-name','?userName='),
        getUserJoinedCommunity:createApiMutation(builder,'getUserJoinedCommunity','get-joined-community','GET'),
        joinCommunity:createApiMutation(builder,'joinCommunity','join-community','PATCH'),
        leaveCommunity:createApiMutation(builder,'leaveCommunity','leave-community','PATCH'),
        searchCommunity:createApiGetQuery(builder,'searchCommunity','search-community','?communityName='),
        getCommunityDetail:createApiGetQuery(builder,'getCommunityDetail','get-community-by-id','?communityId='),
        removeMember:createApiMutation(builder,'removeMember','remove-member','PATCH'),
        addMember:createApiMutation(builder,'addMember','add-member','POST'),
        deleteCommunity:createApiMutation(builder,'deleteCommunity','delete-community','PATCH')

    })
    
  })

  export const {
    useCreateCommunityMutation,
    useGetAllActiveCommunityMutation,
    useSearchUserMutation,
    useGetUserJoinedCommunityMutation,
    useJoinCommunityMutation,
    useLeaveCommunityMutation,
    useSearchCommunityMutation,
    useGetCommunityDetailMutation,
    useRemoveMemberMutation,
    useAddMemberMutation,
    useDeleteCommunityMutation
} = userCommunitySlice
