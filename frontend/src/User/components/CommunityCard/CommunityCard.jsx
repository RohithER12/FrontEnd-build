import React, { useState } from "react";
import { 
  useJoinCommunityMutation,
  useLeaveCommunityMutation
} from '../../slices/api_slices/usersCommunitySlice';
import {Card, CardHeader, Chip, CardFooter, Avatar, Button} from "@nextui-org/react";
import { CLOUDINARY_FETCH_URL } from "../../../utils/config/config";
import { useSelector } from 'react-redux';
import {toast} from "react-toastify"
import { RingLoader } from 'react-spinners';
import { useNavigate } from "react-router-dom";



export default function CommunityCard({communities,setStatus,status,choice}) {
  

  const [joinCommunity,{isLoading:joinLoading}] = useJoinCommunityMutation();
  const [leaveCommunity,{isLoading:leaveLoading}] = useLeaveCommunityMutation()
  const userInfo = useSelector((state)=> state.auth.userInfo)

  const navigate = useNavigate()

  
  const joinCommunityHandler = async (id)=>{
    try {
      const data = {
        communityId:id,
        message:`Hi I'm ${userInfo.userName}`
      }
      const res = await joinCommunity(data).unwrap()
      setStatus(!status)
      toast.success(res.message)
      
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  const leaveCommunityHandler = async (id)=>{
    try {
      const data = {
        communityId:id,
      }
      const res = await leaveCommunity(data).unwrap()
      setStatus(!status)
      toast.success(res.message)
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <>
      {joinLoading||leaveLoading ? <div className="w-full flex justify-center h-200ox">
            <div className="">
              <RingLoader color="#1bacbf"/>
            </div>
          </div>
         :(
    communities.map((community,idx)=>
    <>  
       <div key={community.id}
       style={{cursor:'pointer'}}
       onClick={()=>{
        navigate(`/community/${community.id}`)
        }}
       >
        <Card className="max-w-[340px] m-2" >
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar isBordered radius="full" name={community.communityName} size="md" 
                src={
                    community?.communityAvatar 
                    && `${CLOUDINARY_FETCH_URL}/${community?.communityAvatar}` 

                    }/>
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">{community.communityName}</h4>
              <h5 className="text-small tracking-tight text-default-400">{community.communityDescription}</h5>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="gap-3">
          <div className="flex justify-between">
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">{community.memberCount}</p>
            <p className="text-default-400 text-small">Memebers</p>
          </div>
          <div className="flex flex-end ">
              {community?.isAdmin ? 
               <Chip color="success" className="ml-12 sm:ml-4 md:ml-6" variant="bordered">Admin</Chip>
            :
                <Button
                className= "bg-blue-700 text-foreground border-default-200 ml-16"
                color="primary"
                radius="full"
                size="sm"
                variant="bordered"
                onClick={()=>{
                  choice === "join" ? joinCommunityHandler(community.id) : leaveCommunityHandler(community.id)
                }}
              >
                {choice}
              </Button>
              }
                
          </div>
          </div>
         
        </CardFooter>
      </Card>
      </div>

      </>
    )
    )}
    </>
  );
}
