import { useState,useEffect ,lazy,Suspense} from "react";
import { useSelector } from "react-redux";
import {Avatar} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import UserNameModal from "../ChangeUserNameModal/UserNameModal";
import UserEmailModal from "../ChangeEmailModal/ChangeEmailModal";
import UserNumberModal from "../ChangeNumberModal/ChangeNumberModal";
import UserPasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import axios from "axios";
import { useChangeAvatarMutation,useDeleteAvatarMutation } from "../../slices/api_slices/usersApiSlice";
import {  toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/reducers/user_reducers/authSlice";
import {Spinner} from "@nextui-org/react";
import { CLOUDINARY_FETCH_URL,CLOUDINARY_UPLOAD_URL } from "../../../utils/config/config";
import HomeSkeleton from "../../components/ShimmerForHome/HomeSkeleton";
import { useNavigate } from "react-router-dom";
import { useGetUserDetailsMutation } from "../../slices/api_slices/usersApiSlice";



const Profile = ()=>{
    const [selectedImage, setSelectedImage] = useState(null);
    const userInfo  = useSelector((state) => state.auth.userInfo); 
    const RecordedVideos = lazy(()=> import("../../components/UserFeed/UserFeed"))
    const [loading,setLoading] = useState(false)
    


    
    const navigate = useNavigate()


    const [changeAvatar,{isLoading}] = useChangeAvatarMutation()
    const [deleteAvatar]=useDeleteAvatarMutation()
    const [getUserDetails] = useGetUserDetailsMutation()
  
    const dispatch = useDispatch()


    useEffect(()=>{

        async function getUserDetailsHandler(){
            try {
                const res = await getUserDetails().unwrap()
                console.log(res,"user details");
            } catch (error) {
                console.log(error);
            }
        }

        getUserDetailsHandler()

    },[])


   
    useEffect(()=>{

    },[selectedImage])
 

     const addProfileImageHandler = async ()=>{
        try {
            setLoading(true)
            const formData = new FormData();
           formData.append("file",selectedImage);
           formData.append("upload_preset","reanconnect");
           const cloudRes = await axios.post(CLOUDINARY_UPLOAD_URL,formData)
           const res = await changeAvatar({avatarId:cloudRes.data['public_id']}).unwrap()
            const data = {
                userName:res.username,
                email:res.email,
                phoneNumber:res.phoneNumber,
                avatarId:res?.avatarId
              }
            dispatch(setCredentials({ ...data }));
            setSelectedImage(null)
            toast.success(res.message)   
            setLoading(false) 
        } catch (error) {
            toast.error(error?.message || error?.data?.message)
        }
      }

     

      
      const removeAvatarHandler = async ()=>{
        try {
           const res = await deleteAvatar().unwrap()
            const data = {
                userName:res.username,
                email:res.email,
                phoneNumber:res.phoneNumber,
                avatarId:null
              }
            dispatch(setCredentials({ ...data }));
            toast.success(res.message)    
        } catch (error) {
            console.log(error);
            toast.error(error?.message || error?.data?.message)
        }
    }

   
    return (
     <>
     <section className="min-h-screen w-full h-full">
        <div className="bg-gray-800 bg-opacity-10 m-12" >
        <div className="max-w-md mx-auto  rounded-xl shadow-md overflow-hidden md:max-w-max mt-12 ">
            <div className="md:flex flex-col justify-center items-center">
                <div className="md:shrink-0 relative mt-3">
                <label className="cursor-pointer">
                    <input
                    type="file"
                    accept=".jpg, .jpeg, .png, .webp"
                    className="hidden"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                        <Avatar name={userInfo.userName} src={
                                selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : userInfo.avatarId
                                ? `${CLOUDINARY_FETCH_URL}/${userInfo.avatarId}`
                                : undefined 
                            } className="w-20 h-20 text-large"
                        />
                </label>    
                </div> 
                <div className="justify-center">
                {selectedImage &&
                <>
                <Button color="#01c8ef" onClick={()=>{
                   addProfileImageHandler()
                }} variant="flat" style={{ color: "#01c8ef" }}
                isLoading={ loading ? <Spinner /> : false}
                >save</Button>

                <Button color="#db2777" onClick={()=>{
                    console.log(selectedImage);
                    setSelectedImage(null)
                }}  variant="flat" style={{ color: "#db2777" }}>cancel</Button>
                </>

               }
                {userInfo?.avatarId &&
                <Button color="#db2777" onClick={()=>{
                    removeAvatarHandler()
                }}  variant="flat" style={{ color: "#db2777" }}
                isLoading={ loading ? <Spinner /> : false}
                >delete</Button>
                 }
                </div>
            </div>

                
            <div className="pt-8 flex items-center ">
                <p className="m-1">User Name:</p>
                <p className="text-lg font-semibold">{userInfo?.userName}</p>
                <UserNameModal />
            </div>
            <div className="flex items-center">
                <p className="m-1">Email:</p>
                <p className="text-lg font-semibold">{userInfo?.email}</p>
                {!userInfo.isGooleLogin &&
                <UserEmailModal/>
                }
            </div>
            {!userInfo.isGooleLogin &&
            <>
            <div className="flex items-center">
                <p className="m-1">Phone Number:</p>
                <p className="text-lg font-semibold">{userInfo?.phoneNumber}</p>
                <UserNumberModal/>
            </div>
            <div className="flex items-center justify-center">
                <UserPasswordModal/>
            </div>
            </>
            }
        </div>
        <Button className="m-1" color="primary" variant="bordered" onClick={()=>navigate('/upload')}>
            Upload Video
        </Button>
    </div>
    <div className=" flex px-8 overflow-y-auto stream_container">
        <Suspense fallback={<HomeSkeleton/>}>
             <RecordedVideos/> 
        </Suspense>
    
    </div>
    </section>
    </>
    )
  
}

export default Profile