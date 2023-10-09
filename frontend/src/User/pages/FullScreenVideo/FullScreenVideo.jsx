import { useGetVideoDetailsByIdMutation,useToggleStarMutation } from "../../slices/api_slices/videoStreamApiSlice"
import {useEffect,useState} from 'react';
import { GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import {BUCKET_NAME } from "../../../utils/config/config";
import { RingLoader } from 'react-spinners';
import { CLOUDINARY_FETCH_URL } from "../../../utils/config/config";
import {  useParams ,useNavigate} from 'react-router-dom';
import { Avatar } from "@nextui-org/react";
import { useSelector } from "react-redux";
import Report from "./ReportMenu";
import s3 from "../../../utils/s3SetUp/bucket";
import {Card,CardFooter,Image} from "@nextui-org/react"
import { BsCoin } from "react-icons/bs";


const FullScreenVideo = ()=>{

    const [videos,setVideos] = useState({})
    const [urlVideos,setUrlVideos] = useState({})
    const [loading,setLoading] = useState(false)
    const { id } = useParams();
    const userInfo = useSelector((state)=> state.auth.userInfo)
    const userName = userInfo.userName
    const [isStarred,setIsStarred] = useState(false)
    const [showReport,setShowReport] = useState(false)
    const [suggestions,setSuggestions] = useState([])
    const [urlSuggestions,setUrlSuggestions] = useState([])
    const [isHovered, setIsHovered] = useState(-1);
    const navigate = useNavigate()


    const [getVideoDetails] = useGetVideoDetailsByIdMutation();
   
    const [toggleStar] = useToggleStarMutation()
    
    useEffect(()=>{
        async function getVideosHandler(){
         try {
           const res = await getVideoDetails({id,userName}).unwrap()
           console.log(res,"responseeeeeeeeeeeeeeeeeeeeeeeeee");

           setLoading(true)
           if(res.Suggestions){
            const videosWithUrl = res.Suggestions.map((video) => ({
              ...video,
              url: '', // Initialize the 'url' field
            }));
            setSuggestions(videosWithUrl)
           }
           setVideos({
            ...res,
            url:''
           })
           setUrlVideos({
            ...res,
            url:''
           })

         } catch (error) {
           console.log(error);
         }
        }
        getVideosHandler()
        
      },[])

      useEffect(()=>{
        init()
      },[urlVideos])

    
        async function init(){
          try {
          if(videos.S3Path){
            const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key:videos.S3Path});
            const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 });
               
                setVideos({
                  ...videos,
                  url
                })
                if(videos.isStarred){
                  setIsStarred(videos.isStarred)
                }
                
               
          }
          const videosWithSignedUrls = await Promise.all(
            suggestions.map(async (video) => {
              const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: video.S3Path });
              const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 });
              return {
                ...video,
                url,
              };
            })
          );
           
          setUrlSuggestions(videosWithSignedUrls)

          setLoading(false)
          } catch (error) {
            console.log(error);
          }
        }

        async function toggleStarHandler(){
          try {
            const data = {
              starred:videos.isStarred ? false : true,
              userName:userInfo.userName,
              videoId:videos.VideoId.toString()
            }
  
             await toggleStar(data).unwrap()
            setIsStarred(!isStarred)
          } catch (error) {
            console.log(error);
          }
        }
    
        const handleMouseEnter = (idx) => {
          setIsHovered(idx);
        };
      
        const handleMouseLeave = () => {
          setIsHovered(-1);
        };




    return(
      loading ? <div className="w-full flex justify-center h-full">
      <div className="py-52">
        <RingLoader color="#1bacbf"/>
      </div>
    </div>:
        <section className="h-screen w-full">
          
          <div className="m-4 bg-gray-950 flex flex-col">
            <div className="flex bg-gray-950">
            <div className="w-3/4 h-[700px]">
              <div className="=w-full h-[650px]">
              <video
              className="z-0 w-full h-full object-cover "
              muted
              loop
              controls
              >

          <source src={videos.url} type="video/mp4" />
                Your browser does not support the video tag.
          
        </video>
              </div>
              <div>
              <div className="flex" >
            <div className="w-full h-[200px] ">
           <div className="flex gap-5 mt-6 ml-4">
            <Avatar isBordered radius="full" size="md"
             src={
              videos.avatarId 
              ?`${CLOUDINARY_FETCH_URL}/${videos.avatarId}`
              : `${CLOUDINARY_FETCH_URL}/ecmoviuvqqedrfymjxad.webp`}/>
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">{videos.userName}</h4>
            </div>
           </div>
           
           <div className="flex gap-5 mt-6 ml-4">
           <div className="flex flex-col gap-1 items-start justify-center">
           <h4 className="text-small font-semibold leading-none text-default-600">{videos.title}</h4>
           <h4 className="text-small font-semibold leading-none text-default-600">{videos.description}</h4>
           </div>
           </div>
           </div>
           <div className='flex mt-4 items-start justify-center '>
              <div className='flex m-2 '>
                  <p>
                    {videos.starred}
                  </p>
                  <button  
                   onClick={toggleStarHandler} 
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" fill={isStarred ? "white" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={ "white"} className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
               
                  </button>
                 
              </div>
              <div className='flex m-2'>
                  <p>
                    {videos.views}
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" fill='black' />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" fill='black'/>
                  </svg>
              </div>
              <div className='flex m-2 relative'>
            
                  {showReport &&  <Report id={id} setShowReport={setShowReport}/>}
                   
               <button onClick={()=> setShowReport(!showReport)} >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
               </button>
             
               
              </div>
            </div>
            </div>
              </div>
             
            </div>
            <div className="w-1/4 " >
              <div className="items-center justify-center flex flex-col gap-3">
                    <div className="m-2">
                      <h1 className="font-semibold">YOU MIGHT ALSO LIKE</h1>
                    </div>
                    {urlSuggestions.map((video,idx)=>
                    <div 
                     className="w-full h-56 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 items-center justify-center" 
                     key={idx}
                     onMouseEnter={()=>handleMouseEnter(idx)}
                     onMouseLeave={handleMouseLeave}
                     onClick={()=> navigate(`/video/${video.VideoId}`)}
                    style={{cursor:'pointer'}}
                     >
                     <Card  isFooterBlurred className=" items-center h-full justify-center col-span-12 sm:col-span-7">
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
                                  <div className='flex items-center justify-center'>
                                  <p className='p-1'>
                                      {video?.coin_for_watch && video.coin_for_watch}
                                    </p>
                                    <BsCoin color="#e27b05"/>
                                  </div>
                                  
                                </div>
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
                    )}
              </div>
            </div>
            </div>
 
          </div>
        </section>
    )
}

export default FullScreenVideo