import React, { useState ,useEffect} from 'react';
import './Group.css';
import { useGetAllActiveCommunityMutation 
        ,useGetUserJoinedCommunityMutation,
      } from '../../slices/api_slices/usersCommunitySlice';
import {toast} from 'react-toastify'
import { Button } from '@nextui-org/react';
import CommunityCard from '../CommunityCard/CommunityCard';
import { useSelector } from 'react-redux';
import { RingLoader } from 'react-spinners';


const Groups = () => {
  const [communities, setCommunities] = useState([]); 
  const [joinedCommunities,setJoinedCommunities] = useState([])
  const [getCommunity,{isLoading:activeLoading}] = useGetAllActiveCommunityMutation();
  const [joinedCommunity,{isLoading:joinedLoading}] = useGetUserJoinedCommunityMutation();
  const [loading,setLoading] = useState(true)

  const [status,setStatus] = useState(false)
  const userInfo = useSelector((state)=> state.auth.userInfo)

  useEffect(()=>{
    if(!activeLoading && !joinedLoading){
      setLoading(false)
    }
    getActiveCommunities()
    getUserJoinedCommunities()

  },[status])

  

  const getActiveCommunities = async ()=>{
    try {
     const res = await getCommunity().unwrap();
     if(res.community){
      setCommunities(res.community)
     }else{
      setCommunities([])
     }
    } catch (error) {
      console.log(error);
      toast.error("error in fetching communities")
      
    }
  }
   
  const getUserJoinedCommunities = async ()=>{
    try {
      const res = await joinedCommunity().unwrap()
     console.log(res.community);
      if(res.community){
        setJoinedCommunities(res.community)
      }else{
        setJoinedCommunities([])
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  
  




  return (
   
      <div className='h-fit'>
        {loading ? <div className="w-full flex justify-center h-full">
            <div className="py-52">
              <RingLoader color="#1bacbf"/>
            </div>
          </div>
         :(
          <>
        <div className=''>
       <div className="m-4">
         <div className="card_header">
          <h1 className="card_title">Active Communities</h1>
         </div>
         { communities.length > 0 ?
         <div className="flex px-8 overflow-y-auto stream_container">
         <CommunityCard communities={communities} setStatus={setStatus} status={status} choice={"join"}/>
         </div>
         :
         <div className="flex justify-center">
         <h1 className="font-semibold text-2xl m-12">No Active Communities</h1>
         </div>
         }
        </div>
        </div>
        <div className=''>
       <div className="m-4">
         <div className="card_header">
          <h1 className="card_title">Joined Communities</h1>
         </div>
         { joinedCommunities.length > 0 ?
         <div className="flex px-8 overflow-y-auto stream_container">
         <CommunityCard communities={joinedCommunities} setStatus={setStatus} status={status} choice={"leave"}/>
         </div>
         :
         <div className="flex justify-center">
         <h1 className="font-semibold text-2xl m-12">No Joined Communities</h1>
         </div>
         }
        </div>
        </div>
        </>
         )
}
       
      </div>
    
   
  );
};

export default Groups;
