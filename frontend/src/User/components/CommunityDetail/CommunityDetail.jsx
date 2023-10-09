import {  useParams } from 'react-router-dom';
import { useGetCommunityDetailMutation,useRemoveMemberMutation ,useDeleteCommunityMutation} from '../../slices/api_slices/usersCommunitySlice';
import { useEffect,useState } from 'react';
import { RingLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { CLOUDINARY_FETCH_URL } from '../../../utils/config/config';
import { Avatar ,Button,Input} from '@nextui-org/react';
import { SearchIcon } from '../SearchIcon/SearchIcon';
import { useSearchUserMutation,useAddMemberMutation } from '../../slices/api_slices/usersCommunitySlice';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';





const CommunityDetail = ()=>{

 const [community,setCommunity] = useState(null)
 const [members,setMembers] = useState([])
 const [loading,setLoading] = useState(false)
 const [isAdmin,setIsAdmin] = useState(false);
 const { id } = useParams();

 const [communityDetail] = useGetCommunityDetailMutation()
 const [addMember] = useAddMemberMutation()
 const [removeMember] = useRemoveMemberMutation()
 const [deleteCommunity,{isLoading}] = useDeleteCommunityMutation()

 const navigate = useNavigate()

 const [searchValue,setSearchValue] = useState('')
 const [users,setUsers] = useState([])
 const userInfo = useSelector((state)=> state.auth.userInfo)


 const [searchUser] = useSearchUserMutation()

 useEffect(()=>{
    async function getCommunityDetailHandler(){
        setLoading(true)
        try {
            const res = await communityDetail(id).unwrap()
            console.log(res);
            if(res.community.communityAdmin === userInfo.userName){
                setIsAdmin(true)
            }
            setCommunity(res.community)
            if(res.members){
                setMembers(res.members)
            }
            console.log(community);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }
    getCommunityDetailHandler()
 },[])

 async function removeMemberHandler(userId){
    try {
        const data={
            communityId:community.id,
            userId:userId
        }
         await removeMember(data).unwrap()
        const filteredMembers = members.filter(member=> member.userId !== userId)
        setMembers(filteredMembers)
        
    } catch (error) {
        console.log(error);
    }
 }
 
 async function searchUserHandler() {
    setUsers([]);
   
  
    const trimmedSearchValue = searchValue.trim();
    if (trimmedSearchValue === '') {
      return;
    } 
    
      try {
        const res = await searchUser(trimmedSearchValue).unwrap();
        console.log(res, "search user response");
        if (res.users) {
          setUsers(res.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        setUsers([]);
        console.log(error);
      }
   
  }

  async function addMemberHandler({id,userName,avatarId}){
    try {
      const data={
        communityId:community.id,
        userId:id
      }
      console.log(data,"im sending");
      const member={
        userId:id,
        userName:userName,
        avatarId:avatarId
      }
      const res = await addMember(data).unwrap()
      setMembers((prevMembers) => [...prevMembers, member]);
      setUsers([])
      toast.success(res.message)
      console.log(res);
    } catch (error) {
       setUsers([])
       console.log(error);
       toast.error(error.data.error)
    }
  }

  async function deleteCommunityHandler(){
    try {

      const res = await deleteCommunity({communityId:community.id}).unwrap()
      toast.success(res.message)
      navigate('/group')
    } catch (error) {
      console.log(error);
      toast.error(error.data.error)
    }
  }
    return (
        <div className='h-screen'>
        {loading ? <div className="w-full flex justify-center h-full">
            <div className="py-52">
              <RingLoader color="#1bacbf"/>
            </div>
          </div>
         :(
        community && 
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
        <div className=" flex bg-slate-950 justify-evenly  p-10 md:p-12 mb-8 ">
            <div className='w-1/4 bg-slate-950'>
                <div className="flex items-center ">
                    <div className="w-full text-center opacity-50 font-bold m-4">
                            MEMBERS
                    </div>
                </div>
                <div className="overflow-y-scroll h-[25rem]" style={{overflowY:'hidden'}}> 
                {members.length > 0 ? members.map((member)=>
                    <div className="flex gap-2 items-center  m-2 bg-[#27272a] h-10 rounded" key={member.userId}>
                    <Avatar alt={member.userName} className="flex-shrink-0 m-2" size="sm"  src={member.avatarId ?`${CLOUDINARY_FETCH_URL}/${member?.avatarId}` : undefined}/>
                    <div className='flex w-full relative'>
                      <span className="text-small">{member.userName}</span>
                      {isAdmin && 
                      <div className='absolute right-0 mr-2'>
                        <button 
                        onClick={()=>removeMemberHandler(member.userId)}
                        style={{all:'unset'}}>
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#7f1d1d" className="w-6 h-6">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                         </svg>
                     </button>
                     </div>
                      
                           }
                    </div>
                    </div>
                ):
                <div className='flex text-center justify-center items-center'>
                  <h4 className='font-bold'>No Members</h4>
                </div>
                
                }   
                </div>
            </div>
            <div className='w-3/4'>
                <div className='relative'>
                <img
                    className="w-full max-h-[25rem] overflow-hidden object-fit"
                    src={community?.communityAvatar ?`${CLOUDINARY_FETCH_URL}/${community?.communityAvatar}` : undefined}
                    alt=""
                />
                 <div className='absolute bottom-0 right-0 bg-transparent' >
                 <div className="w-full flex text-end font-extrabold  pr-4">
                 <div className='flex flex-col justify-end '> 
                    {isAdmin && 
                    <div className=''>
                      <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-sm font-semibold text-green-500 bg-blue-100 rounded-full dark:bg-gray-700 dark:text-blue-400">
                            <svg
                              className="w-3 h-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill="currentColor"
                                d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z"
                              />
                              <path
                                fill="#fff"
                                d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z"
                              />
                            </svg>
                            <span className="sr-only">Admin</span>
                          </span>
                      </div>
                   
                        }
                      
                      
                          <h1 className='opacity-50' style={{mixBlendMode:'difference'}}> 
                        {community.communityName.toUpperCase()}
                        </h1>
                        <h2 className='opacity-50 font-extrabold' style={{mixBlendMode:'difference'}}>
                            {community.communityDescription}
                        </h2>
                      </div>
                    
                            
                </div>
     
                </div>
               
                </div>
                <div className="grid lg:grid-cols-2 items-center ">
                <div className="py-5 px-2 max-h-[45rem]">
                    <div className="rounded hover:shadow-lg mt-6 ">
                        {isAdmin && 
                        <div className='flex w-full justify-between'>
                        <div className=" flex flex-col ms-2 px-1">
                        <Input
                        placeholder="search user..."
                        label="Add Member"
                        value={searchValue}
                        onChange={(e)=>setSearchValue(e.target.value)}
                        endContent={
                        <div style={{cursor:'pointer'}}>
                            <button style={{all:'unset'}}
                            onClick={searchUserHandler}
                            >
                            <SearchIcon width={15}/>
                            </button>
                        </div>
                       
                        }
                        />
                        {users.length > 0 &&
                        <div className="overflow-x-scroll h-[10rem]" style={{overflowX:'hidden'}}> 
                          
                        {users.map((user)=>
                     
                        < div className="w-full m-1 max-w-xs min-h-unit-12 py-2 bg-[#27272a] rounded-lg  h-10 " key={user.id}>
                        <div className="flex gap-2 items-center">
                          <Avatar alt={user.userName} className="flex-shrink-0 m-1" size="sm" src={user.avatarId ? `${CLOUDINARY_FETCH_URL}/${user.avatarId}` : undefined}/>
                            <div>
                            <span className="text-small">{user.userName}</span>
                            </div>
                           <div style={{cursor:'pointer'}}>
                           <button style={{all:'unset'}}
                           onClick={()=>addMemberHandler(user)}
                           >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
              
                            </button>
                            </div>
                           
                          </div>
                       
                      </div>
                         )}
                         </div>
                        }    
                        </div>
                        <div className='flex flex-end'>
                          <Button isLoading={isLoading} color="danger" variant="bordered"onClick={deleteCommunityHandler} >
                            Delete Community
                          </Button>
                        </div>
                        </div>
                      }
                    </div>
                </div>
                
            
            </div>

            </div>

           
        </div>
    </div>
             
         )}
         </div>
    )
}

export default CommunityDetail