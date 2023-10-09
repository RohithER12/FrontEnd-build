
import {Navbar, NavbarBrand, NavbarContent, Input,NavbarItem,NavbarMenu,NavbarMenuItem,NavbarMenuToggle, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar,Link, Button} from "@nextui-org/react";
import { SearchIcon } from "../SearchIcon/SearchIcon";
import { NavLink ,useNavigate} from "react-router-dom";
import "./HomeNavbar.css"
import React,{useState,useEffect} from "react";
import { CLOUDINARY_FETCH_URL } from "../../../utils/config/config";
import { useSearchUserMutation,useSearchCommunityMutation} from "../../slices/api_slices/usersCommunitySlice";
import { useCreateChatMutation,useCreateGroupChatMutation } from "../../slices/api_slices/chatApiSlice";
import {BsCoin} from "react-icons/bs"



export default function HomeNavbar({userInfo,logoutHandler,coins}) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchValue,setSearchValue] = useState('')
  const [searchUser] = useSearchUserMutation()
  const [searchCommunity] = useSearchCommunityMutation()

  const [users,setUsers] = useState([])
  const [communities,setCommunities] = useState([])
  const [userName] = useState(userInfo.userName)


 
  


  const [createChat] = useCreateChatMutation()
  const [groupChat] = useCreateGroupChatMutation()
  
  const menuItems = [
    "Profile",
    "Conference",
    "Schedule",
    "Community",
    "Messages",
    "Wallet",
    "stream",
    "Log Out",
  ];

 

async function searchHandler(){
  try {
    await searchUserHandler()
    await searchCommunityHandler()
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

async function searchCommunityHandler() {
  setCommunities([]);

  const trimmedSearchValue = searchValue.trim();
  if (trimmedSearchValue === '') {
    return;
  } 
    try {
      const res = await searchCommunity(trimmedSearchValue).unwrap();
      console.log(res, "search user response");
      if (res.community) {
        setCommunities(res.community);
      } else {
        setCommunities([]);
      }
    } catch (error) {
      setCommunities([]);
      console.log(error);
    }
 
}



  async function createChatHandler(userId){
    try {
      const res = await createChat({UserName :userName,RecipientID:userId})
        setUsers([])
        navigate('/messages')

        console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  async function createGroupChatHandler(communityId){
    try {
      console.log(communityId,userName,"community id for ");
      const res = await groupChat({UserName:userName,GroupID:communityId}).unwrap()
      console.log(res,"response for group chat");
        setCommunities([])
        navigate('/messages')
    } catch (error) {
      console.log(error);
    }
  }




  const UsersCard = ()=>{
    return(
     (users.length > 0  || communities.length >0) &&
      <div className="absolute left-1/3 top-14  w-[calc(33.3vw)]  overflow-auto bg-black mt-2 pb-10 py-2 rounded-[4px] z-30 border border-[#262626]">
         {users.length > 0 &&  <div>
            <h4 className="ml-4 text-small">
              USERS
            </h4>
          </div>
          }
          {users.map((user)=>
            <div className="flex items-center justify-between  m-2"key={user.id}>
              <div className="flex">
              <Avatar alt={user.userName} className="flex-shrink-0" size="md" src={user.avatarId ?`${CLOUDINARY_FETCH_URL}/${user.avatarId}` : undefined} />
            <div className="flex items-center">
              <span className="text-small ml-2">{user.userName}</span>
            </div>
              </div>
           
            <div className="flex items-center">
              <button onClick={()=>{
                 createChatHandler(user.id)
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              </button>
           
            </div>
          </div>
          )}
           {communities.length > 0 &&  <div>
            <h4 className="ml-4 text-small">
              COMMUNITIES
            </h4>
          </div>
          }
          {communities.map((community)=>
            <div className="flex items-center justify-between  m-2"key={community.id}>
              <div className="flex">
              <Avatar alt={community.communityName} className="flex-shrink-0" size="md" src={community.communityAvatar ?`${CLOUDINARY_FETCH_URL}/${community.communityAvatar}` : undefined} />
            <div className="flex items-center">
              <span className="text-small ml-2">{community.communityName}</span>
            </div>
              </div>
           
            <div className="flex items-center">
              <button onClick={()=>{
                 createGroupChatHandler(community.id)
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              </button>
           
            </div>
          </div>
          )}
      </div>
    )
  }




  return (
  
    <Navbar className="home-navbar" isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
     
      
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="md:hidden pr-3" justify="center">
        <NavbarBrand justify="center">
        <p className="font-bold text-inherit" style={{ color: "#01c8ef" }}>REAN</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-10" justify="center" style={{ maxWidth: 'fit-content' }}>
        <NavbarBrand style={{cursor:'pointer'}} className="mr-4" onClick={()=>{
          navigate('/home')
        }}>
        <p className="font-bold text-inherit" style={{ color: "#01c8ef" }}>REAN C</p>
        <img src="https://res.cloudinary.com/dcv6mx1nk/image/upload/v1696310384/profile/qhckavjubdpau8qfxi7x.png" alt="connect" width="13" height="13" />
        <p className="font-bold text-inherit" style={{ color: "#01c8ef" }}>NNECT</p>
        </NavbarBrand>
        <NavbarItem className="navbar-links">
          <NavLink color="foreground" to={'/conference'} >
            Conference
          </NavLink>
        </NavbarItem>

        <NavbarItem className="navbar-links">
        <NavLink color="foreground" to={'/schedule'} >
            Schedules
            </NavLink>
        </NavbarItem>
        <NavbarItem className="navbar-links">
        <NavLink color="foreground" to={'/group'} >
            Community
            </NavLink>
        </NavbarItem>
        <NavbarItem className="navbar-links">
        <NavLink color="foreground" to={'/messages'} >
            Messages
            </NavLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent>
       <Input
          classNames={{
            base: "max-w-full sm:max-w-[20rem] h-10 mx-auto",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          value={searchValue}
          onChange={(e)=>{
            setSearchValue(e.target.value)
          }}
          onKeyUp={()=>{
            searchHandler()
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={15} />}
          type="search"
        />
      </NavbarContent>
      

      <NavbarContent className="hidden md:flex items-center gap-12" as="div" justify="center"> 
      <NavbarItem>
        <Button color="primary" variant="bordered" onClick={()=>{
          navigate('/stream')
        }}>
          Stream Now
        </Button> 
        </NavbarItem>   
        
        <Button className="wallet-button" style={{ backgroundColor: 'transparent'}} onClick={()=>navigate('/wallet')}>
          <p>Wallet</p>
          <BsCoin color="#e27b05"/>
          <p>{coins}</p>

        </Button>
          
        <Dropdown placement="bottom-end" className="dark text-foreground bg-background">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="#01c8ef"
              name={userInfo?.userName}
              size="sm"
              src={userInfo?.avatarId && `${CLOUDINARY_FETCH_URL}/${userInfo.avatarId}`}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2" textValue={userInfo}>
              <p className="font-semibold" >{userInfo?.userName}</p>
              <p className="font-semibold">{userInfo?.email}</p>
              <p className="font-semibold">{userInfo?.phoneNumber}</p>
            </DropdownItem>
           
            <DropdownItem key="myprofile" color="primary" textValue="profile" onPress={()=>{
                navigate('/profile')
            }}>
                Profile
            </DropdownItem>           
            <DropdownItem key="logout" color="danger" onPress={logoutHandler} textValue="logout ">
                Log Out 
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
     
     <UsersCard/>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              to="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar> 
  );
}
