import { useState,useEffect, useRef } from "react";
import AgoraRTM from "agora-rtm-sdk";
import { APP_ID } from "../../../utils/config/config";
import { useSelector } from 'react-redux';
import { useGetLiveStreamsDataMutation,useJoinStreamMutation } from "../../slices/api_slices/usersConferenceApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStreamState } from "../../slices/reducers/user_reducers/streamReducer";
import { CLOUDINARY_FETCH_URL } from "../../../utils/config/config";
import { Card,CardFooter,CardHeader,Button,Image } from "@nextui-org/react";
import './RoomContainer.css'



const RoomContainer = ()=>{

  const [rooms,setRooms] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  

  const [joinStream] = useJoinStreamMutation()

    async function joinStreamHandler(id){
      try {
        const res = await joinStream({streamID:id})
        console.log(res);
        dispatch(setStreamState({status:true}))
        navigate(`/live/${id}`)
      } catch (error) {
        console.log(error);
      }
    }

    const [getStreamsData] = useGetLiveStreamsDataMutation()

    async function getStreamsDataHandler(){
      try {
        const res = await getStreamsData().unwrap()
        console.log(res.Response,"response from streams");
        setRooms(res.Response)
        
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(()=>{
      getStreamsDataHandler()
    },[])


    const RoomCards = ()=>{
      return(
        rooms.map((room,idx)=>
        <div key={idx} className="ml-4">
        <Card isFooterBlurred className="w-[380px] h-[300px] col-span-12 sm:col-span-7 ">
        <Image
          removeWrapper
          alt="Relaxing app background"
          className="z-0 object-fit"
          src={`${CLOUDINARY_FETCH_URL}/${room.ThubnailID}`}
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex flex-grow gap-2 items-center">
            <Image
              alt="Breathing app icon"
              className="rounded-full w-10 h-11 bg-black "
              src={room.AvatarID ?`${CLOUDINARY_FETCH_URL}/${room.AvatarID}` : undefined }
            />
            <div className="flex flex-col">
              <p className="text-tiny text-white/60">{room.UserName}</p>
              <p className="text-tiny text-white/60">{room.Title}</p>
              <p className="text-tiny text-white/60">{room.Discription}</p>

            </div>
          </div>
          <Button 
           onClick={()=>{
             joinStreamHandler(room.StreamID)
           }}
          radius="full" color="" size="sm">Join</Button>
        </CardFooter>
      </Card>
      </div>
        )
        
      )
    }

    return (
        <>
       <section className="h-fit">
      <div className="m-4">
        <div className="card_header">
         <h1 className="card_title">now streaming </h1>
        </div>
        {rooms
        ? 
        <div className="flex px-8 overflow-y-auto stream_container">
        <RoomCards/>  
        </div>
        :
        <div className="flex justify-center">
           <h1 className="font-semibold text-2xl m-12">No Ongoing Streams</h1>
        </div>
       }
      
       </div>
       </section>
        </>
       
    )

}

export default RoomContainer
