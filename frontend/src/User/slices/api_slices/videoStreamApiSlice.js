import { apiSlice } from "../../../utils/apiSlice/apiSlice";
const STREAM_URL = '/api/video'




const createApiMutation = (builder,endpoint,url,method)=>{
    return builder.mutation({
      query:(data)=>({
        url:`${STREAM_URL}/${url}`,
        method:method,
        body:data,
      })
    })
  }

  const createApiGetQuery = (builder, endpoint, url) => {
    return builder.mutation({
      query: (data) => ({
        url: `${STREAM_URL}/${url}`,
        method: 'GET',
        params: `?userName=${data}`,
      }),
    });
  };

  const createApiQueryForId =(builder, endpoint, url) => {
    return builder.mutation({
      query: ({id,userName}) => ({
        url: `${STREAM_URL}/${url}`,
        method: 'GET',
        params: `?id=${id}&userName=${userName}`,
      }),
    });
  };
  export const streamApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
     uploadVideo:createApiMutation(builder,'uploadVideo','upload','POST'),
     getUserVideos:createApiGetQuery(builder,'getUserVideos','user-videos','GET'),
     getStreamedVideos:createApiMutation(builder,'getStreamedVideos','list-all','GET'),
     manageVideo:createApiMutation(builder,'manageVideo','archive-video','POST'),
     getVideoDetailsById:createApiQueryForId(builder,'getVideoDetailsById','get-by-id','GET'),
     toggleStar:createApiMutation(builder,'toggleStar','star','PATCH'),
     reportVideo:createApiMutation(builder,'reportVideo','report-video','PUT'),
     blockVideo:createApiMutation(builder,'blockVideo','block-video','PATCH'),
     getReportedVideos:createApiMutation(builder,'getReportedVideos','get-reported-videos','GET'),
     getExclusiveVideos:createApiMutation(builder,'getExclusiveVideos','exclusive-content','GET'),
    })
  }) 

  export const {
    useUploadVideoMutation,
    useGetUserVideosMutation,
    useGetStreamedVideosMutation,
    useManageVideoMutation,
    useGetVideoDetailsByIdMutation,
    useToggleStarMutation,
    useReportVideoMutation,
    useBlockVideoMutation,
    useGetReportedVideosMutation,
    useGetExclusiveVideosMutation
  } = streamApiSlice
