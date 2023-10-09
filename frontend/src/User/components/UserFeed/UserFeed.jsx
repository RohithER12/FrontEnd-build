import {useEffect,useState} from 'react';
import { GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import { BUCKET_NAME } from '../../../utils/config/config';
import { useGetUserVideosMutation ,useManageVideoMutation} from '../../slices/api_slices/videoStreamApiSlice';
import { useSelector } from 'react-redux';
import { RingLoader } from 'react-spinners';
import { Card,Button } from '@nextui-org/react';
import { CLOUDINARY_FETCH_URL } from '../../../utils/config/config';
import s3 from '../../../utils/s3SetUp/bucket'





function RecordedVideos() {

  const [videos,setVideos] = useState([])
  const [getUserVideos] =  useGetUserVideosMutation()
  const [manageVideo,{isLoading:manageLoading}] = useManageVideoMutation()
  const userInfo  = useSelector((state) => state.auth.userInfo); 
  const [urlVideos,setUrlVideos] = useState([])
  const [loading ,setLoading] = useState(true)
  const [status,setStatus] = useState(false)


 useEffect(()=>{
   async function getVideosHandler(){
    try {
      const res = await getUserVideos(userInfo.userName).unwrap()
     
      if(res.videos){
        const videosWithUrl = res.videos.map((video) => ({
        ...video,
        url: '', 
      }));
        setVideos(videosWithUrl,"user videos")
        setLoading(true);
       
      }
      
      
    } catch (error) {
      console.log(error);
    }
   }
   getVideosHandler()
 },[status])

  useEffect(()=>{
    async function init(){
      try {
      const videosWithSignedUrls = await Promise.all(
        videos.map(async (video) => {
          const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: video.S3Path });
          const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 });
          return {
            ...video,
            url,
          };
        })
      );
      setUrlVideos(videosWithSignedUrls);
      setLoading(false); 
      
      } catch (error) {
        console.log(error);
      }
    }

   init()
  },[videos]) 

 
  async function manageVideoHandler(id){
    try {

      const res = await manageVideo({videoId:id})
      console.log(res);
      setStatus(!status)
      
    } catch (error) {
      console.log(error);
    }
  }




  return (
      loading ? <div className="w-full flex justify-center h-full">
    <div className="py-52">
      <RingLoader color="#1bacbf"/>
    </div>
  </div> :
   
        urlVideos.map((video, index) => (
          <div key={index} className='m-4'>
           <Card isFooterBlurred className="w-[350px] h-[300px]  mt-4 ">
          <div className="max-w-[400px] ">
            <div className="video-container rounded overflow-hidden hover:shadow-lg">
              <video poster={`${CLOUDINARY_FETCH_URL}/${video.thumbnailId}`} controls width={400} height={225} autoPlay muted id='videoPlayer'>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
              <div className='flex justify-between'>
                <p className=' text-white/60 ml-4'>Title:{video.title}</p>
                <div className='flex'>
                <p>
                  {video.starred}
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                </div>
                <div className='flex'>
                <p>
                  {video.views}
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" fill='black' />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" fill='black'/>
                </svg>
                </div>
               
               

                <Button className='mr-4'
                 isLoading={manageLoading}
                onClick={()=>{
                  manageVideoHandler(video.VideoId.toString())
                }}
                >
                  {video?.archived ? "UnArchive" : "Archive"}
                </Button>
              </div> 
          </div>
          </Card>
          </div>
         ))
  );
}

export default RecordedVideos;
