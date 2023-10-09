import { useState,useEffect } from 'react'
import './StreamedVideos.css'
import { Card,Image,CardFooter} from '@nextui-org/react'
import { CLOUDINARY_FETCH_URL } from '../../../utils/config/config'
import { useGetStreamedVideosMutation } from '../../slices/api_slices/videoStreamApiSlice'
import { GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import { BUCKET_NAME } from '../../../utils/config/config';
import { RingLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom'
import s3 from '../../../utils/s3SetUp/bucket'

const StreamedVideos = ()=>{

   
    const [videos,setVideos] = useState([])
    const [loading ,setLoading] = useState(true)
    const [urlVideos,setUrlVideos] = useState([])

    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate()
    

  const handleMouseEnter = (idx) => {
    setIsHovered(idx);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };


    const [getStreams] = useGetStreamedVideosMutation()
    

    useEffect(()=>{
       getStreamsDataHandler()
    },[])

    async function getStreamsDataHandler(){
      try {
        const res = await getStreams().unwrap()
        const videosWithUrl = res.videos.map((video) => ({
          ...video,
          url: '', // Initialize the 'url' field
        }));
        setVideos(videosWithUrl)
        setLoading(true);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }

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
        console.log(urlVideos,"url videos");
        
        } catch (error) {
          console.log(error);
        }
      }
  
     init()
    },[videos]) 



    const VideoStreams = ()=>{
          return(
            loading ? <div className="w-full flex justify-center h-full">
            <div className="py-52">
              <RingLoader color="#1bacbf"/>
            </div>
          </div>
          :
        urlVideos.map((video,idx)=>
        <div key={idx} className='ml-4'
        onMouseEnter={()=>handleMouseEnter(idx)}
        onMouseLeave={handleMouseLeave}
        onClick={()=>{
          navigate(`/video/${video.VideoId}`)
        }}
        >
        <Card isFooterBlurred className="w-[350px] h-[300px] col-span-12 sm:col-span-7">
        <video
          className={`z-0 object-fit ${isHovered === idx ? 'hovered' : ''}`}
          poster={`${CLOUDINARY_FETCH_URL}/${video.thumbnailId}`}
          autoPlay={isHovered === idx}
          muted
          loop
  
        >
          <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
          
        </video>
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex flex-grow gap-2 justify-between">
            <div className='flex items-center gap-2'>
            <Image
             
             name={video.userName}
             className="rounded-full w-10 h-11 bg-black object-cover"
             src={video.avatarId? `${CLOUDINARY_FETCH_URL}/${video.avatarId}`: undefined }
           />
           <div className="flex flex-col">
             <p className="text-tiny text-white/60">{video.userName}</p>
             <p className="text-tiny text-white/60">{video.title}</p>
             

           </div>
            </div>
           
            <div className='flex flex-end '>
              <div className='flex m-2'>
                  <p>
                    {video.starred}
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
              </div>
              <div className='flex m-2'>
                  <p>
                    {video.views}
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" fill='black' />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" fill='black'/>
                  </svg>
              </div>
            </div>
           
          </div>
        </CardFooter>
      </Card>
      </div>
      
        )
        
      )
    }
    return(
        <>
        <section className="h-fit">
       <div className="m-4">
         <div className="card_header">
          <h1 className="card_title">Streamed videos</h1>
         </div>
         {urlVideos.length > 0
        ? 
        <div className="flex px-8 overflow-y-auto stream_container">
        <VideoStreams/>
        </div>
        :
        <div className="flex justify-center">
           <h1 className="font-semibold text-2xl m-12">No Streamed Videos</h1>
        </div>
       }
        </div>
        </section>
         </>
    )
}

export default StreamedVideos;