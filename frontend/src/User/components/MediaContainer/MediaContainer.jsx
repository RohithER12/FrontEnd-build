import { useEffect, useRef ,useState} from "react"
import './MediaContainer.css'
import AgoraRTM from 'agora-rtm-sdk'
import {  useParams } from 'react-router-dom';
import MediaController from "../MediaController/MediaController";
import {toast} from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { useSelector ,useDispatch} from 'react-redux';
import { APP_ID } from "../../../utils/config/config";
import { removeConferenceState } from "../../slices/reducers/user_reducers/conferenceReducer";







const MediaContainer = ()=>{
    const localStreamRef = useRef(null)
    const remoteStreamRef = useRef(null)
    const pc = useRef(null)
    const channel = useRef(null);
    const client = useRef(null);
    const { id } = useParams();
    const senders = useRef([])
    const [video,setVideo] = useState(true);
    const [audio,setAudio] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const conferenceInfo = useSelector((state)=> state.conference.conferenceState)


   

    const token = null;
    const uid = String(Math.floor(Math.random() * 10000));
    

  

    const servers = {
        iceServers:[
            {
                urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
            }
        ]
    }


    let constraints ={
        video:{
            width:{min:640, ideal:1920, max:1920},
            height:{min:480, ideal:1080, max:1080}
            
        },
        audio:true
    }

    useEffect(()=>{
        if(!conferenceInfo){
            navigate('/home')
        }else{
            init();
        }

    },[])
  

    async function init(){
        try {
            client.current = await AgoraRTM.createInstance(APP_ID)
            await client.current.login({ uid, token });

            channel.current = client.current.createChannel(id)
            await channel.current.join()

            channel.current.on('MemberJoined',handleUserJoined)

            channel.current.on('MemberLeft',handleUserLeft)

            client.current.on('MessageFromPeer',handleMessageFromPeer)

            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            localStreamRef.current.srcObject = stream
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const handleUserLeft = (MemberId)=>{
        console.log(MemberId);
        remoteStreamRef.current.style.display = 'none'
        toast.success(`user left meeting`)
    }


    const handleMessageFromPeer = async (message,MemberId)=>{
        message = JSON.parse(message.text)
        // console.log('Message:',message);

        if(message.type === 'offer'){
            await createAnswer(MemberId,message.offer)
        }
        if(message.type === 'answer'){
           await  addAnswer(message.answer)
        }
        if(message.type === 'candidate'){
            console.log(message.candidate,"candidateee msg");
            if(pc.current){
              await pc.current.addIceCandidate(message.candidate)
            }
        }

    }

    const handleUserJoined = async (MemberId)=>{
        toast.success(`${MemberId}`)
        await createOffer(MemberId)
        // console.log('a new user joined the channel',MemberId);

    }

    const createPeerConnection = async (MemberId)=>{
        try {

            pc.current = new RTCPeerConnection(servers);

            const remoteStream = new MediaStream()
            remoteStreamRef.current.srcObject = remoteStream;
            remoteStreamRef.current.style.display = 'block';

            localStreamRef.current.classList.add('smallFrame')

            if(!localStreamRef.current.srcObject){
                const stream = await navigator.mediaDevices.getUserMedia(constraints)
                localStreamRef.current.srcObject = stream
            }

            localStreamRef.current.srcObject.getTracks().forEach(track => {
                // console.log(track,"trackkkkkk");
                senders.current.push(
                pc.current.addTrack(track,localStreamRef.current.srcObject)   
                )
            });

            pc.current.ontrack = (event)=>{
                event.streams[0].getTracks().forEach(track=>remoteStream.addTrack(track) )
            }

            pc.current.onicecandidate = (event)=>{
               if(event.candidate){
                // console.log('new ice candidate ',event.candidate);
                client.current.sendMessageToPeer({text:JSON.stringify({'type':'candidate','candidate':event.candidate})},MemberId)

               }
            }
            
        } catch (error) {
            console.log(error);
            
        }

    }

    const createOffer = async (MemberId)=>{
        try {

            await createPeerConnection(MemberId)

            const offer = await pc.current.createOffer()
            await pc.current.setLocalDescription(offer)

            // console.log(offer,"oferrrrrrrrrr");

            client.current.sendMessageToPeer({text:JSON.stringify({'type':'offer','offer':offer})},MemberId) 
        } catch (error) {
            console.log(error);
            
        }
    }

    


    const createAnswer = async (MemberId,offer)=>{
        try {

            await createPeerConnection(MemberId)

            await pc.current.setRemoteDescription(offer);

            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer)
            // console.log(answer,"eeeeeeeeeeee");

            client.current.sendMessageToPeer({text:JSON.stringify({'type':'answer','answer':answer})},MemberId)
            
        } catch (error) {
            console.log(error);
            
        }

    }

    const addAnswer = async (answer)=>{
        try {
            if(!pc.current.currentRemoteDescription){
                // console.log(answer,"oppppppuuuuuuu");
               await pc.current.setRemoteDescription(answer)
            }
            
        } catch (error) {
            console.log(error); 
        }

    }
    // window.addEventListener('beforeunload',leaveChannel)
    const toggleVideo =()=>{
        localStreamRef.current.srcObject.getVideoTracks()[0].enabled = !video;
        setVideo(!video);
    }

    const toggleAudio =()=>{
        localStreamRef.current.srcObject.getAudioTracks()[0].enabled= !audio;
        setAudio(!audio);
    }

    const hangup = async  ()=>{
        try {
          await channel.current.leave();
          localStreamRef.current.srcObject = null
          await client.current.logout()
          dispatch(removeConferenceState())
          window.location.assign('/home');
        } catch (error) {
            console.log(error);
        }
    }

    async function screenShare() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({cursor:true})
            const streamTrack = stream.getTracks()[0];
            console.log(streamTrack);
            senders.current.find(sender => sender.track.kind === 'video' ).replaceTrack(streamTrack);
            streamTrack.onended = ()=>{
                senders.current.find(sender => sender.track.kind === 'video').replaceTrack(localStreamRef.current.srcObject.getTracks()[1])
            }
          
        } catch (error) {
            console.log("Error occurred", error);
        }
    }

    



    return(
     <>
     <div id="videos">
        <video  ref={localStreamRef} className="media-player" id="user-1" autoPlay playsInline ></video>
        <video  ref={remoteStreamRef} className="media-player" id="user-2" autoPlay playsInline ></video>
        <MediaController toggleVideo={toggleVideo} toggleAudio={toggleAudio} hangup={hangup} screenShare={screenShare}/>
      </div>
     
    </>
    )
}

export default MediaContainer