
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import { useState ,useEffect} from "react";
import { RingLoader } from "react-spinners";
import { useGetCompletedConferenceMutation } from "../../slices/api_slices/usersConferenceApi";
import moment from "moment";

const Completed =()=>{


  const [completedData,setCompletedData] = useState([])
  const [completedConference,{isLoading}] = useGetCompletedConferenceMutation() 

  useEffect(()=>{

    async function completedConferenceHandler(){
      try {
        const res = await completedConference().unwrap();
        setCompletedData(res.ScheduledConferenc)
      } catch (error) {
        console.log(error);
      }
    }

    completedConferenceHandler()

  },[])
    return(
      isLoading ? <div className="w-full flex justify-center h-full">
      <div className="py-52">
        <RingLoader color="#1bacbf"/>
      </div>
      </div>:
      <div>
      {completedData && completedData.length > 0 ? (
        <div className="scheduled">
          <div className="grid gap-4 grid-cols-4">
          {completedData.map((data, index) => (
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
                <CardFooter>
                  <Link color="primary" to={`/media-container/${data?.ScheduleID}`}>
                    Start Conference
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center m-4">
          <h2 className="text-5xl">No completed conferences</h2>
        </div>
      )}
    </div>
    )
    
}

export default Completed;