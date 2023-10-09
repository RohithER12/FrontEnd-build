import { apiSlice } from "../../../utils/apiSlice/apiSlice";
const CHAT_URL = '/chat'

const createApiMutation = (builder,endpoint,url,method)=>{
  return builder.mutation({
    query:(data)=>({
      url:`${CHAT_URL}/${url}`,
      method:method,
      body:data
    })
  })
}

const createApiQuery = (builder,endpoint,url,method)=>{
  return builder.mutation({
    query:(data)=>({
      url:`${CHAT_URL}/${url}`,
      method:method,
      body:data
    })
  })
}



export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints:(builder)=>({
   getChat:createApiQuery(builder,'getChat','get-chatlist','POST'),
   createChat:createApiMutation(builder,'createChat','create-chat','POST'),
   getChatHistory:createApiMutation(builder,'getChatHistory','get-chat','POST'),

   getGroup:createApiMutation(builder,'getGroupChat','get-group','POST'),
   createGroupChat:createApiMutation(builder,'createGroupChat','create-group-chat','POST'),
   getGroupChat:createApiMutation(builder,'getGroupChat','get-group-chat','POST')
  })
}) 

export const {
  useGetChatMutation,
  useCreateChatMutation,
  useGetChatHistoryMutation,

  useGetGroupMutation,
  useCreateGroupChatMutation,
  useGetGroupChatMutation,
} = chatApiSlice



