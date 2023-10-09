import { useState } from "react";
import { useSelector } from "react-redux";
import {Avatar} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useChangeAvatarMutation,useDeleteAvatarMutation } from "../../slices/api_slices/usersApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/reducers/user_reducers/authSlice";
const Profile = ()=>{
    const [selectedImage, setSelectedImage] = useState(null);
    const [changeAvatar,{isLoading}] = useChangeAvatarMutation()
    const [deleteAvatar,{isLoading:deleteLoading}]=useDeleteAvatarMutation()
    const dispatch = useDispatch()
 
     const userInfo  = useSelector((state) => state.auth.userInfo); 

     const addProfileImageHandler = async ()=>{
        try {
            const formData = new FormData();
           formData.append("file",selectedImage);
           formData.append("upload_preset","reanconnect");
           const cloudRes = await axios.post("https://api.cloudinary.com/v1_1/dcv6mx1nk/image/upload",formData)
           console.log(cloudRes.data['public_id']);
           const res = await changeAvatar({avatarId:cloudRes.data['public_id']}).unwrap()
            console.log(res);
            const data = {
                userName:res.username,
                email:res.email,
                phoneNumber:res.phoneNumber,
                avatarId:res?.avatarId
              }
              dispatch(setCredentials({ ...data }));
            toast.success(res.message)    
        } catch (error) {
            toast.error(error?.message || error?.data?.message)
        }
      }

      const removeAvatarHandler = async ()=>{
        try {
           const res = await deleteAvatar().unwrap()
            console.log(res);
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
            <div className="md:flex justify-center items-center">
                <div className="md:shrink-0 relative mt-3">
                <label className="cursor-pointer">
                    <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                        <Avatar name={userInfo.userName} src={
                                selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : userInfo.avatarId
                                ? `https://res.cloudinary.com/dcv6mx1nk/image/upload/v1693938021/${userInfo.avatarId}`
                                : undefined 
                            } className="w-20 h-20 text-large"
                        />
                </label>    
                </div> 
            </div>
             <div className="flex justify-center">
                <Button color="#01c8ef" onClick={()=>{
                   addProfileImageHandler()
                }} variant="flat" style={{ color: "#01c8ef" }} isLoading={isLoading}>save</Button>

                <Button color="#db2777" onClick={()=>{
                    removeAvatarHandler()
                }}  variant="flat" style={{ color: "#db2777" }} isLoading={deleteLoading}>delete</Button>
            </div>
        </> 
    )
}

export default Profile