import { apiSlice } from "../../../utils/apiSlice/apiSlice";
const CONFERENCE_URL = '/api/conference'


const createApiMutation = (builder,endpoint,url,method)=>{
  return builder.mutation({
    query:(data)=>({
      url:`${CONFERENCE_URL}/${url}`,
      method:method,
      body:data
    })
  })
}

const createApiGetQuery = (builder, endpoint, url) => {
  return builder.mutation({
    query: (data) => ({
      url: `${CONFERENCE_URL}/${url}`,
      method: 'GET',
      params: `?id=${data}`,
    }),
  });
};

export const userConferenceApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
      startPrivateConference:createApiMutation(builder,'startPrivateConference','start-private-conference','POST'),
      joinPrivateConference:createApiMutation(builder,'joinPrivateConference','join-private-conference','PATCH'),
      scheduleConference:createApiMutation(builder,'scheduleConference','schedule-private-conference','POST'),
      startStream:createApiMutation(builder,'startStream','start-stream','POST'),
      joinStream:createApiMutation(builder,'joinStream','join-stream','POST'),
      exitStream:createApiMutation(builder,'exitStream','leave-stream','PATCH'),
      stopStream:createApiMutation(builder,'stopStream','stop-stream','PATCH'),
      scheduledConference:createApiMutation(builder,'scheduledConference','scheduled-conference','GET'),
      getStreamDataById:createApiGetQuery(builder,'getStreamDataById','get-stream-by-id','GET'),
      getLiveStreamsData:createApiMutation(builder,' getLiveStreamsData','get-stream','GET'),
      getCompletedConference:createApiMutation(builder,'getCompletedConference','completed-schedules','GET')
    })
})

export const {
  useStartPrivateConferenceMutation,
  useJoinPrivateConferenceMutation,
  useScheduleConferenceMutation,
  useScheduledConferenceMutation,
  useStartStreamMutation,
  useJoinStreamMutation,
  useExitStreamMutation,
  useStopStreamMutation,
  useGetStreamDataByIdMutation,
  useGetLiveStreamsDataMutation,
  useGetCompletedConferenceMutation
} = userConferenceApiSlice