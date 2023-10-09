import { useState ,useEffect} from 'react';
import "./NewSchedule.css"
import {Input,Button,Select,SelectItem} from "@nextui-org/react";
import {Switch, cn} from "@nextui-org/react";
import Options from '../Options/Options';
import {timeData,duration} from '../Options/data'
import { useScheduleConferenceMutation } from '../../slices/api_slices/usersConferenceApi';
import {toast} from 'react-toastify'
import { useUserGetInterestsMutation } from "../../slices/api_slices/usersApiSlice";


const NewSchedule = () => {

  const [interest,setInterest] = useState([])


  const [sheduleConference] = useScheduleConferenceMutation()
  const [getInterest] = useUserGetInterestsMutation()

  useEffect(()=>{
    getInterestHandler()
  },[])



  const [meetingData, setMeetingData] = useState({
    type: 'private',
    title: '',
    description: '',
    interest: '',
    recording: false,
    chat: false,
    broadcast: false,
    participantlimit: 0,
    date: '',
    time:'',
    duration:'',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setMeetingData({ ...meetingData, [name]: newValue });
  };

  const handleChatInput = (e)=>{
    setMeetingData({
      ...meetingData,
      chat:!meetingData.chat
    })
  }

  const getInterestHandler = async ()=>{
    try {
      const res = await getInterest().unwrap();
      setInterest(res.Interests)
    } catch (error) {
      toast.error(error.data.message || error.message)
      
    }
  }

   const handleSubmit = async () => {
    try {
     
      const data ={
        title :meetingData.title,
        description:meetingData.description,
        interest:meetingData.interest,
        recording:meetingData.recording,
        chat :meetingData.chat,
        participantlimit:meetingData.participantlimit,
        time: meetingData.date + " " + meetingData.time,
        duration:meetingData.duration.replace("minutes", "").trim()
      }
      if(meetingData.participantlimit< 2){
        throw new Error('participant limit must be greater that 1')
      }
      const res = await sheduleConference(data).unwrap()
      toast.success('conference scheduled successfully');
      setMeetingData({
        type: 'private',
        title: '',
        description: '',
        interest: '',
        recording: false,
        chat: false,
        broadcast: false,
        participantlimit: 0,
        date: '',
        time:'',
        duration:'',
      })
    } catch (error) {
      console.log(meetingData);
      toast.error(error?.data?.message || error?.message)
      console.log(error);
      
    }
  }
  return (
    <div className="flex flex-col items-center m-4">
      <form onSubmit={handleSubmit}>
        <div className='items-center'>
        <label className='type-options' hidden>
          <Options label={"type"} placeholder={"Select a type"} data={[{type:"public"},{type:"group"},{type:"private"},{type:"broadcast"}]} handlechange={handleInputChange}/>
        </label>
        <div className="m-4 ">
        <label>
          <Input name='title' isRequired type="string" label="Title" placeholder="Enter an Exciting Conference Title" 
            value={meetingData.title}
            onChange={handleInputChange} 
          />
        </label>
        </div>
        <div className="m-4 ">
        <label>
         <Input name='description' isRequired type="string" label="Discription" placeholder="Describe your conference" 
            value={meetingData.description}
            onChange={handleInputChange} 
          />
        </label>
        </div>
        <div className="m-4">
        <label>
        <Select
            isRequired
            label='interests'
            placeholder='select an interest'
            className="w-full"
            onChange={handleInputChange}
            name='interest'
              >
                {interest.map((value) => (
                  <SelectItem key={value.interest}  value={value.interest} className="w-fit">
                    {value.interest}
                  </SelectItem>
                ))}
              </Select>
        </label>
        </div>

        <label hidden>
          <Switch
              onChange={handleChatInput}
              isSelected={meetingData.chat}
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse w-full max-w-ml bg-content1 hover:bg-content2 items-center",
                  "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-transparent",
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn("w-6 h-6 border-2 shadow-lg",
                  "group-data-[hover=true]:border-transparent",    
                  "group-data-[selected=true]:ml-6",
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ml-4",
                ),
              }}
            >
              <div className="flex flex-col gap-1">
                <p className="text-medium">Enable chat</p>
                <p className="text-tiny text-default-400">
                Enhance your conference with chats
                </p>
              </div>
          </Switch>
        </label>

        <div className='flex m-2'>
        <label className='m-2 mb-3'>
          <Input size='md' type="number" name='participantlimit' label="Participant Limit" placeholder="Enter the number of participants" 
            value={meetingData.participantlimit}
            onChange={handleInputChange} 
          />
        </label>
         
        <label className='m-2 mb-3'>
          <Input size='md' type="date" name='date' label="Date" placeholder="Enter when your conference happens" 
            value={meetingData.date}
            onChange={handleInputChange}
          />
        </label>
        </div>
        <div className='flex justify-center m-2'>
          <div className='w-full'>
          <label className='m-2 mb-3'>
          <Options label={"time"} placeholder={"Select a time"} data={timeData} handlechange={handleInputChange}/>
        </label>
          </div>
        <div className='w-full'>
        <label className='m-2 mb-3'>
          <Options label={"duration"} placeholder={"Select the duration"} data={duration} handlechange={handleInputChange}/>
        </label>
        </div>
       
        </div>
       
       
       <div className='flex justify-center'>
             <Button 
                type='submit'
                variant="bordered"
                color="primary"
                onClick={handleSubmit}
                
                >
                    Schedule
                </Button>
       </div>
       
        </div>
      </form>
    </div>
  );

};

export default NewSchedule;
