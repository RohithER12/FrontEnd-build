import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { useReportVideoMutation } from "../../slices/api_slices/videoStreamApiSlice";



function Report({id,setShowReport}) {

    const [reportVideo] = useReportVideoMutation()

    async function reportVideoHandler(reason){
        try {
            const data={
                videoId:id,
                reason:reason,
            }
             await reportVideo(data).unwrap()
            setShowReport(false)
        } catch (error) {
            setShowReport(false)
            console.log(error);
        }
    }

    const data = [
       "Sexual Content" ,
       "Copyright issues",
       "Harrassment",
       "Abusive content",
       "Violent Content"
    ]
    return (
        <div className="absolute bottom-80 right-40">

        <Dropdown>
        <DropdownMenu aria-label="Static Actions">
            {data.map((el,idx)=><DropdownItem  onClick={()=>reportVideoHandler(el)} key={idx}>{el}</DropdownItem>)}
        </DropdownMenu>
    </Dropdown>
        
     </div>
    )
  }

  export default Report
