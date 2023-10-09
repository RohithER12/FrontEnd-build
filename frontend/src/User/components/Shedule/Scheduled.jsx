import {Card, CardHeader, CardBody, CardFooter, Divider,  Button} from "@nextui-org/react";
import { useState,useEffect } from "react";
import { useScheduledConferenceMutation } from "../../slices/api_slices/usersConferenceApi";
import {toast} from 'react-toastify'
import moment from "moment"
import { RingLoader } from "react-spinners";
import {setConferenceState} from "../../slices/reducers/user_reducers/conferenceReducer"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";



const Scheduled =()=>{

  const [scheduledData,setScheduledData] = useState([])
  const [scheduledConference,{isLoading}] = useScheduledConferenceMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()


  useEffect(()=>{
    scheduledDataHandler();
  },[])
  
  async function scheduledDataHandler(){
    try {
      const data = await scheduledConference().unwrap();
      
      setScheduledData(data.ScheduledConference)
      console.log(scheduledData);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error?.message)
    }

  }

  const joinConference = (id)=>{
    if(id){
      dispatch(setConferenceState({status:true}))
      navigate(`/media-container/${id}`)
    }
  }
    return(
      isLoading ? <div className="w-full flex justify-center h-full">
      <div className="py-52">
        <RingLoader color="#1bacbf"/>
      </div>
    </div>:
      <div>
      {scheduledData && scheduledData.length > 0 ? (
        <div className="scheduled">
          <div className="grid gap-4 grid-cols-4">
            {scheduledData.map((data, index) => (
              <Card className="max-w-[400px]" key={index}>
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md">{data?.Title}</p>
                    <p className="text-small text-defaudata?.Time lt-500">{data?.Description}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p>Type :Private</p>
                  <p>Interest: {data?.Interest}</p>
                  <p>Partcipant Limit: {data?.Participantlimit}</p>
                  <p>ScheduleID  : {data?.ScheduleID}</p>
                  <p>Duration : {`${data?.Durations} mins`}</p>
                  <p>Time : {data?.Time ? moment(data?.Time ).format('MMM Do YYYY') : "invalid date"}</p>
                </CardBody>
                <Divider />
                <CardFooter className="justify-center">
                  <Button color="primary" variant="bordered" onClick={()=>joinConference(data?.ScheduleID)}>
                    Start Conference
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center m-4">
          <h2 className="text-5xl">No scheduled conferences</h2>
        </div>
      )}
    </div>
    )
}

export default Scheduled;