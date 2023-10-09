import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import { APP_ID } from "../../../utils/config/config";
import { useEffect, useRef ,useState} from "react";
import { useSelector ,useDispatch} from "react-redux";
import {  useParams ,useNavigate} from 'react-router-dom';
import './LiveContainer.css'
import { Chip, Input } from "@nextui-org/react"
import { CheckIcon } from '../../components/CheckIcon/CheckIcon'
import { Avatar} from "@nextui-org/react";
import { useGetStreamDataByIdMutation,useExitStreamMutation,useStopStreamMutation } from "../../slices/api_slices/usersConferenceApi";
import { CLOUDINARY_FETCH_URL } from "../../../utils/config/config";
import { removeStreamState } from "../../slices/reducers/user_reducers/streamReducer";




const LiveContainer = ()=>{


const userInfo  = useSelector((state) => state.auth.userInfo); 
const streamInfo = useSelector((state) => state.stream.streamState)
const localScreenTracks = useRef(null)
const [streaming,setStreaming] = useState(false)
const [screenSharing,setScreenSharing] = useState(false)
const rtmClient = useRef(null)
const rtcClient = useRef(null)
const localScreenShare = useRef(null)

const { id } = useParams();
const channel = useRef(null);
const [message,setMessage] = useState('')
const [messages,setMessages]=useState([])
const [participant,setParticipants] = useState([])
const [showControls,setShowControls] = useState(false)
const [active,setActive] = useState({
    camera:false,
    screen:false,
    mike:false,
    start:false
})
const [streamData,setStreamData] = useState(null)

const [getStreamById] = useGetStreamDataByIdMutation()
const [stopStream] = useStopStreamMutation()
const [exitStream] = useExitStreamMutation()

const navigate = useNavigate()
const dispatch = useDispatch()




async function getStreamDataHandler(){
    try{
        const res = await getStreamById(id)
        console.log(res,"stream details");
        setStreamData(res.data)
    }catch(error){
        console.log(error);
    }
}

useEffect(()=>{
    if(!streamInfo){
         navigate('/home')
    }else{
        getStreamDataHandler()
        init()
        stream()
    }
},[])



const token = null





//RTM config for messaging 

async function init(){
    try {
        rtmClient.current = await AgoraRTM.createInstance(APP_ID)
       await rtmClient.current.login({uid:userInfo.userName,token})

       channel.current = rtmClient.current.createChannel(id)
       await channel.current.join()


       await getChanneldetails()

   

       channel.current.on('MemberJoined',async (memberId)=>{
         await  handleMemeberJoined(memberId,"joined")
       })

       channel.current.on('MemberLeft',async (memberId)=>{
         await handleMemeberJoined(memberId,"left")
       })

       channel.current.on('ChannelMessage',(msg,memberId)=>{
          const data = JSON.parse(msg.text)
          console.log(data,"message from peer");
        //   console.log(data,memberId,"message from channel");
          sendMessageHandler(data,memberId)
        })
        
    } catch (error) {
        console.log(error);
    }
}

async function getChanneldetails(){
    try {
        let attributes = await rtmClient.current.getChannelAttributesByKeys(id,['room_name','host_id'])
        console.log("attributes",attributes);
        console.log("id in attributes:",id);  
        const host_id = attributes.host_id.value;
        if(host_id === userInfo.userName){
             setShowControls(true)
         }else{
            rtcClient.current.setClientRole('audience')
         }
            
      } catch (error) {
          await rtmClient.current.setChannelAttributes(id,{'room_name':id,'host_id':userInfo.userName})
          getChanneldetails()
        
      }
}

async function handleMemeberJoined(memberId,state){
    // toast.success(`${memberId} ${state} stream`)
    const member = await channel.current.getMembers()
    setParticipants(member)
}

function sendMessageHandler(data,user){
    // console.log(data,user,"oooooooooooooooo");
    console.log(data,"data");
    console.log(user,"user");
    setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message,avatarId:data.avatarId, user: user }
      ]);
      console.log(messages);
}

async function handleSendMessage(e){
  e.preventDefault()
  channel.current.sendMessage({text:JSON.stringify({'message':message,'avatarId':userInfo.avatarId ?userInfo.avatarId:'' })})
  sendMessageHandler({message:message,avatarId:userInfo.avatarId ?userInfo.avatarId:''},userInfo.userName)
  setMessage('')
}

const hangup = async  ()=>{
    try {
      await channel.current.leave();
      await rtmClient.current.logout()
      await rtcClient.current.leave();
      await stopStream({streamID:id})
      dispatch(removeStreamState())
      window.location.assign('/home');
    } catch (error) {
        console.log(error);
    }
}

//RTC config for video streaming
const rtcUid = Math.floor(Math.random() * 10000);
const config ={
    appId:APP_ID,
    token:null,
    uid:rtcUid,
    channel:id
}



async function stream(){
    try {
        rtcClient.current = AgoraRTC.createClient({mode:'live',codec:'vp8'})
       
        await rtcClient.current.join(config.appId,config.channel,config.token,config.uid)

        rtcClient.current.on('user-published',handleUserPublished)

        rtcClient.current.on('user-unpublished',handleUserUnPublished)

        
    } catch (error) {
        console.log(error);
        
    }
}

async function toggleStream(){
    try {
        if(!streaming){
            setActive({
                ...active,
                start:!active.start
            })
            setStreaming(true)
            toggleVideoShare(true)
        }else{
           setStreaming(false)
           setActive({
            ...active,
            start:!active.start
        })
           for(let i = 0 ; i < localScreenTracks.current.length; i++){
            // console.log(localTracks[i],"local tracksss");
            localScreenTracks.current[i].stop()
            localScreenTracks.current[i].close()
           }
           await rtcClient.current.unpublish([localScreenTracks.current[0],localScreenTracks.current[1]])
        }
        
    } catch (error) {
        console.log(error);
    }
}

async function toggleVideoShare(){
    try {
       
       await rtcClient.current.setClientRole('host')
       const track = await AgoraRTC.createMicrophoneAndCameraTracks()
       localScreenTracks.current = track;
       console.log("local screen tracks",localScreenTracks,)
       document.getElementById('video-stream').innerHTML=''

       let player = `<div class="video-container" id="user-container-${rtcUid}">
                        <div class="video-player" id="user-${rtcUid}">
                           
                        </div>
                    </div>`
       document.getElementById('video-stream').insertAdjacentHTML('beforeend',player)
       localScreenTracks.current[1].play(`user-${rtcUid}`)
       await rtcClient.current.publish([localScreenTracks.current[0],localScreenTracks.current[1]])
        
    } catch (error) {

        console.log(error);
        
    }
}

async function handleUserPublished(user,mediaType){
    try {
        console.log("media type in user published",mediaType,);
        await rtcClient.current.subscribe(user,mediaType)
        if(mediaType === 'video'){
            let player = document.getElementById(`user-container-${user.uid}`)
            if(player !== null){
                player.remove()
            }
         player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}">
                           
                        </div>
                    </div>`
         document.getElementById('video-stream').insertAdjacentHTML('beforeend',player)
         user.videoTrack.play(`user-${user.uid}`)
        }
        if(mediaType === 'audio'){
            user.audioTrack.play()
        }
    } catch (error) {
        console.log(error);
    }
}

async function handleUserUnPublished(){
    document.getElementById('video-stream').innerHTML=''

}

async function toggleCamera() {
      
    try {
        setActive({
            ...active,
            camera:!active.camera
        })
        if (localScreenTracks.current[1].muted) {
            localScreenTracks.current[1].setMuted(false);
        } else {
            localScreenTracks.current[1].setMuted(true);
        }
    } catch (error) {
        console.log(error);
    }
}

async function toggleMike() {
    try {
        setActive({
            ...active,
            mike:!active.mike
        })
        if (localScreenTracks.current[0].muted) {
            localScreenTracks.current[0].setMuted(false);
        } else {
            localScreenTracks.current[0].setMuted(true);
        }
    } catch (error) {
        console.log(error);
    }
}


async function toggleScreenShare(){
    try {
       
        if(screenSharing){
            console.log(screenSharing,"screen sharing");
            setScreenSharing(false)
            await rtcClient.current.unpublish([localScreenShare.current])
            toggleVideoShare()
            setActive({
                ...active,
                screen:!active.screen
            })
           
        }else{
            setScreenSharing(true)
            const tracks = await AgoraRTC.createScreenVideoTrack()
            localScreenShare.current = tracks
            document.getElementById('video-stream').innerHTML=''

            let player = document.getElementById(`user-container-${rtcUid}`)
            if(player !== null){
                player.remove()
            }

             player = `<div class="video-container" id="user-container-${rtcUid}">
                        <div class="video-player" id="user-${rtcUid}">
                           
                        </div>
                    </div>`
       document.getElementById('video-stream').insertAdjacentHTML('beforeend',player)
       await rtcClient.current.unpublish([localScreenTracks.current[0],localScreenTracks.current[1]])
       localScreenShare.current.play(`user-${rtcUid}`)
       await rtcClient.current.publish([localScreenShare.current])
            setActive({
                ...active,
                screen:!active.screen
            })
        }
        
    } catch (error) {
        console.log(error);
    }
}

async function leaveStream(){
    try {
        await channel.current.leave();
        await rtmClient.current.logout()
        await rtcClient.current.leave();
        await exitStream({streamID:id})
        navigate('/home')
        dispatch(removeStreamState())
    } catch (error) {
        console.log(error);
    }
}


    return(
        <section className="h-fit m-2">
            <div className="flex  h-[830px]">
                <div className="flex-grow-2 w-3/4 flex flex-col">
                <div
                    className="h-screen bg-cover bg-center container relative"
                    style={{
                    backgroundImage: `url("https://res.cloudinary.com/dcv6mx1nk/image/upload/v1696309614/profile/muqzdndfqgn3zn3mtam5.jpg")`
                    }}
                >
                    <div id='video-stream' className="player-container">
                       
                    </div>
                    <div className="absolute top-0 right-0 mr-2 mt-2"> 
                    <Chip
                        startContent={<CheckIcon size={18} />}
                        variant="faded"
                        color="danger"
                    >
                       {`${participant.length} watching`}
                    </Chip>
                    </div>
                   
                    {showControls ?  
                    <div className="auth">
                    <div className='media-controls'>
                        <button className="call-exit-button"
                        onClick={hangup}
                          >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" fill='white' />
                        </svg>
                        </button>
                        <button  className={active.mike ? 'audio-button' : 'active-button'}
                         onClick={toggleMike}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="svg">
                            <path className="on" d="M38 22h-3.4c0 1.49-.31 2.87-.87 4.1l2.46 2.46C37.33 26.61 38 24.38 38 22zm-8.03.33c0-.11.03-.22.03-.33V10c0-3.32-2.69-6-6-6s-6 2.68-6 6v.37l11.97 11.96zM8.55 6L6 8.55l12.02 12.02v1.44c0 3.31 2.67 6 5.98 6 .45 0 .88-.06 1.3-.15l3.32 3.32c-1.43.66-3 1.03-4.62 1.03-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c1.81-.27 3.53-.9 5.08-1.81L39.45 42 42 39.46 8.55 6z" fill="white"></path>
                            <path className="off" d="M24 28c3.31 0 5.98-2.69 5.98-6L30 10c0-3.32-2.68-6-6-6-3.31 0-6 2.68-6 6v12c0 3.31 2.69 6 6 6zm10.6-6c0 6-5.07 10.2-10.6 10.2-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c6.56-.97 12-6.61 12-13.44h-3.4z" fill="white"></path>
                            </svg>
                        </button>
                        <button  className={ active.camera ? 'video-button' : 'active-button'}
                           onClick={toggleCamera}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="svg">
                            <path className="on" d="M40 8H15.64l8 8H28v4.36l1.13 1.13L36 16v12.36l7.97 7.97L44 36V12c0-2.21-1.79-4-4-4zM4.55 2L2 4.55l4.01 4.01C4.81 9.24 4 10.52 4 12v24c0 2.21 1.79 4 4 4h29.45l4 4L44 41.46 4.55 2zM12 16h1.45L28 30.55V32H12V16z" fill="white"></path>
                            <path className="off" d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zm-4 24l-8-6.4V32H12V16h16v6.4l8-6.4v16z" fill="white"></path>
                            </svg>
                        </button>
                        <button   className={active.screen ? "screen-button" : "active-button"}
                          onClick={toggleScreenShare}
                         >
                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"  fill='white'/>
                            </svg>
                        </button>
                        <button  className={active.start ?"start-button" : "active-button"}
                          onClick={toggleStream}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"  fill='white'/>
                          </svg>
                        </button>
                    </div>      
                </div>
                :
                 <div className="auth">
                    <div className="media-controls">
                    <button className="call-exit-button"
                        onClick={leaveStream}
                          >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" fill="white" />
                        </svg>
                        </button>
                    </div>
                 </div>

                    }
                   
                </div>
                <div className="h-1/3 pt-12 pl-4">
                    <div className="flex">
                    <Avatar name={streamData ? streamData.UserName : ''} className="flex-shrink-0" size="lg" 
                    src={streamData 
                        && streamData.AvatarID
                        ? `${CLOUDINARY_FETCH_URL}/${streamData.AvatarID}`
                        : undefined
                    }
                    />
                    <h1 className="font-bold m-2">{streamData ? streamData.UserName : ''}</h1>
                    </div>
                    <div className="ml-12">
                    <h1 className="ml-2">{streamData ? streamData.Title : ''}</h1>
                    <h1 className="ml-2">{streamData ? streamData.Discription : ''}</h1>

                    </div>
                </div>
                </div>
                <div className="flex-grow w-1/4 border-l border-gray-500">
                <div>
                <div className="text-center my-2">
                    <h1 className="text-xl font-bold">Live Chat</h1>
                </div>
                <div className="overflow-y-scroll h-[700px] ml-6 message_container" >
                <div className="flex gap-2 flex-col">
                    {messages.map((msg,index)=>
                         <div className="flex my-2" key={index}>
                            <Avatar name={msg.user} className="flex-shrink-0" size="sm"  
                      src={
                        msg.avatarId ? `${CLOUDINARY_FETCH_URL}/${msg.avatarId}` : undefined
                      }/>
                            <span className="text-small m-2">{msg.user}</span>
                            <span className="text-small text-default-400 m-2">{msg.message}</span>
                         </div> 
                    )}
                </div>
                </div>
                    <div className="flex ml-4">
                        <Input
                        placeholder="send message"
                        value={message}
                        onChange={(e)=>{
                            setMessage(e.target.value)
                        }}
                        endContent={
                        <button onClick={handleSendMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        </button>
                        }
                        />
                    </div>
                </div>
                </div>
            </div>
        </section>

       
    )
}

export default LiveContainer