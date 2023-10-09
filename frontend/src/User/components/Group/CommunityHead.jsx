import "./Community.css"
import React from "react";
import {Button} from "@nextui-org/react";


const CommunityHead =()=>{

    return(
        <>
        <div className="community-head-container  gap-40" >
          <div className="create-community-container gap-10">
              <span className="community-text">Community is key to conquering together !</span>
              <span></span>
              <Button className="create-button" style={{ backgroundColor: 'transparent'}}>
                  Create Your Community Now
              </Button>
          </div>
        </div>
      </>
    )
  
}

export default CommunityHead;