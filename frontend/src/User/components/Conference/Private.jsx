// import "./Conference.css"

import{useState ,useRef,useEffect} from 'react';
import { useStartPrivateConferenceMutation } from "../../slices/api_slices/usersConferenceApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button ,Select,SelectItem,Input,Textarea,Checkbox} from "@nextui-org/react";
import { useUserGetInterestsMutation } from "../../slices/api_slices/usersApiSlice";
import { toast } from "react-toastify";
import { setConferenceState } from '../../slices/reducers/user_reducers/conferenceReducer';



const Private = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    interest: '',
    chat: false,
    participantlimit: 0,
  });
  const [conferenceID,setConferenceId] = useState('')

  const [startPrivateConference,{isLoading}] = useStartPrivateConferenceMutation();
  const navigate = useNavigate()
  const [getInterest] = useUserGetInterestsMutation()
  const [interest,setInterest] = useState([])
  const dispatch = useDispatch()

  useEffect(()=>{
    getInterestHandler()
  },[])



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };
  const handleSubmit =async (e) => {
    try {
      e.preventDefault();
      if(!formData.title || !formData.description || !formData.interest || !formData.participantlimit){
        throw new Error('please enter all fileds')
      }
      if(formData.participantlimit < 2){
        throw new Error('participant limit must be greater that 1')
      }
      const data = {
        title:formData.title,
        description:formData.description,
        interest:formData.interest,
        chat:formData.chat,
        participantlimit:formData.participantlimit,
      }
      const res = await startPrivateConference(data).unwrap();
      setConferenceId(res.conferenceID)      
    } catch (error) {
      toast.error(error?.data?.message || error.message  )
      
    }
   
  };

  const joinConference = ()=>{
    if(conferenceID){
      dispatch(setConferenceState({status:true}))
      navigate(`/media-container/${conferenceID}`)
    }
  }

  const getInterestHandler = async ()=>{
    try {
      const res = await getInterest().unwrap();
      setInterest(res.Interests)
    } catch (error) {
      toast.error(error.data.message || error.message)
      
    }
  }

  

  return (
    <div className="flex flex-col items-center m-4">
      {!conferenceID ?
      <>
      <form onSubmit={handleSubmit}>
        <div className="items-center">
        <div className="m-4 ">
          <label>Title:</label>
          <Input
            placeholder='enter a title'
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            isRequired
          />
        </div>
        <div className="m-4 ">
          <label>Description:</label>
          <Textarea
            placeholder='enter a description'
            name="description"
            value={formData.description}
            onChange={handleChange}
            isRequired
          />
        </div>
        <div className="m-4 ">
          <label>Interest:</label>
          <Select
            isRequired
            label='interests'
            placeholder='select an interest'
            className="w-full"
            onChange={handleChange}
            name='interest'
              >
                {interest.map((value) => (
                  <SelectItem key={value.interest}  value={value.interest} className="w-fit">
                    {value.interest}
                  </SelectItem>
                ))}
              </Select>
        </div>
        <div className="m-4 " hidden>
          <label>
            <Checkbox
              type="checkbox"
              name="chat"
              checked={formData.chat}
              onChange={handleChange}
            />
            Enable Chat
          </label>
        </div>
        <div className="m-4 ">
          <label>Participant Limit:</label>
          <Input
            placeholder='enter participant limit'
            type="number"
            name="participantlimit"
            value={formData.participantlimit}
            onChange={handleChange}
            isRequired
          />
        </div>
        <div className="m-4 mx-14">
          <Button  isLoading={isLoading}
            variant="bordered"
            color="primary" type="submit">Start Private Conference</Button>
        </div>
        </div>
      </form>
      </>
     
      :
      <>

          <div>
             <label>share this id to join conference</label>
            <Input
            disabled
            type="text"
            name="conferenceId"
            value={conferenceID}
            required
          />

          </div>
          <div className="m-4">
            <Button 
            variant="bordered"
            color="primary"
            onClick={joinConference}>
              join conference
            </Button>
          </div>

      </>
      }
      
    </div>
  );
};

export default Private;
