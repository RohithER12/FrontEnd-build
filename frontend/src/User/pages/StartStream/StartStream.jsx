import { Input,Button ,Textarea,Select,SelectItem,Image} from "@nextui-org/react"
import { useState,useEffect } from "react"
import { useUserGetInterestsMutation } from "../../slices/api_slices/usersApiSlice";
import { useStartStreamMutation } from "../../slices/api_slices/usersConferenceApi";
import {toast} from 'react-toastify'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { setStreamState } from "../../slices/reducers/user_reducers/streamReducer";




const StartStream = ()=>{

    const [interest,setInterest] = useState([])
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading,setLoading] = useState(false)
    const userInfo  = useSelector((state) => state.auth.userInfo); 
    console.log(userInfo,"user info")
    const [streamData,setStreamData] = useState({
        title:'',
        description:'',
        interest:'',
        thumbnail:'',
        avatarId:userInfo.avatarId ? userInfo.avatarId : '',
        userName:userInfo.userName
    })
   
    const navigate = useNavigate()
    const dispatch = useDispatch()
  

    const [getInterest] = useUserGetInterestsMutation()
    const [streamStart] = useStartStreamMutation()

    
   
    useEffect(()=>{
        getInterestHandler()
      },[])

      const getInterestHandler = async ()=>{
        try {
          const res = await getInterest().unwrap();
          console.log(res,"interesttssa");
          setInterest(res.Interests)
        } catch (error) {
          toast.error(error.data.message || error.message)
          
        }
      }

      const addThumbnailHandler = async ()=>{
        try {
            const formData = new FormData();
           formData.append("file",selectedImage);
           formData.append("upload_preset","reanconnect");
           const cloudRes = await axios.post("https://api.cloudinary.com/v1_1/dcv6mx1nk/image/upload",formData)
           console.log(cloudRes.data['public_id']);
           setStreamData({
            ...streamData,
            thumbnail:cloudRes.data['public_id']
           })
           return cloudRes.data['public_id']
        } catch (error) {
            toast.error(error?.message || error?.data?.message)
        }
      }

      async function streamHandler(){
        try {
            if(!streamData.title || !streamData.description || !streamData.interest) throw new Error("fill all fields")
            if(!selectedImage) throw new Error("please select a thumbnail for your stream")
           const thumbnail = await addThumbnailHandler()
           const data = {
            title:streamData.title,
            description:streamData.description,
            interest:streamData.interest,
            thumbnail:thumbnail,
            avatarId:streamData.avatarId,
            userName:streamData.userName
           }
           console.log(data,"data of streams");
           const res = await streamStart(data).unwrap()
           console.log(res,"response from stream backend"); 
           dispatch(setStreamState({status:true}))
           navigate(`/live/${res.StreamID}`)
        } catch (error) {
            console.log(error);
            toast.error(error?.message || error?.data?.message)
        }
      }



    return (
        <section className="h-full">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
             <div className=" flex flex-col justify-evenly p-10 md:p-12 mb-8">
             <h2 className="text-center text-gray-900 dark:text-white text-xl md:text-4xl font-extrabold mb-2">
            Go Live With <span className="text-blue-800">Reanconnect </span>
          </h2>
            <div className="flex flex-col items-center  m-12">
            <div className="items-center justify-center ">
             <div className="m-2 ">
                <label>Title:</label>
                    <Input
                        placeholder='enter a title for your stream'
                        type="text"
                        name="title"
                        classNames="w-full"
                        isRequired
                        value={streamData.title}
                        onChange={(e)=>{
                            setStreamData({
                                ...streamData,
                                title:e.target.value
                            })
                        }}
                    />
             </div>
             <div className="m-2 ">
                <label>Description:</label>
                <Textarea
                    placeholder='enter a description for your stream'
                    name="description"
                    isRequired
                    value={streamData.description}
                    onChange={(e)=>{
                        setStreamData({
                            ...streamData,
                            description:e.target.value
                        })
                    }}
                />
             </div>
             <div className="m-2 ">
                <label>Interest:</label>
                <Select
                    isRequired
                    label='interests'
                    placeholder='select an interest'
                    classNames="w-full"
                    onChange={(e)=>{
                        setStreamData({
                            ...streamData,
                            interest:e.target.value
                        })
                    }}
                    name='interest'
                    >
                        {interest.map((value) => (
                        <SelectItem key={value.interest}  value={value.interest} className="w-fit">
                            {value.interest}
                        </SelectItem>
                        ))}
                    </Select>
              </div>
              <div className="m-2">
              <label className="cursor-pointer">
                 select a thumbnail :
                 </label>  
                    <Input
                    type="file"
                    accept=".jpg, .jpeg, .png, .webp"
                    classNames="w-full"
                    placeholder="select a thumbnail"
                    name="thumbnail"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                     <Image
                            width={200}
                            alt="thumbnail"
                            name={'thumbnail'} src={
                                selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : undefined 
                            }
                            />
               
              </div>
              <div className="m-2 flex justify-center">
                <Button 
                variant="bordered"
                color="primary"
                onClick={streamHandler}
                >
                    submit
                </Button>

              </div>
              </div>
           </div>
           </div>
           </div>
        </section>
    )

}

export default StartStream