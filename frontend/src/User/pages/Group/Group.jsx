import "./Group.css"
// import CommunityHead from "../../components/Group/CommunityHead";
// import CommunityFeed from "../../components/Group/CommunityFeed";
// import ActiveCommunity from "../../components/Group/ActiveCommunity";
// import RecentFeed from "../../components/Group/RecentConferences";
import Groups from "../../components/Group/Groups";
import Create from "../../components/Group/Create";
import {useNavigate} from "react-router-dom"
import { useState } from "react";

const Group =()=>{
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('communities'); 
  
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

    return (
        <>
        <div className="h-screen">
         <div className="type-container justify-center ">
          <div   className={`flex-item ${activeTab === 'communities' ? 'active' : ''} mx-12`}
                 style={{cursor:'pointer'}}
                  onClick={() => {
                    handleTabClick('communities');
                  }}>
              <p>Communities</p>
          </div >

          <div className={`flex-item ${activeTab === 'create' ? 'active' : ''} mx-12`}
                 style={{cursor:'pointer'}}
                  onClick={() => {
                    handleTabClick('create');
                  }}>
              <p>Create</p>
          </div>
            
         </div>
         <div className={`conference-body ${activeTab === 'communities' ? 'active' : ''}`}>
                {activeTab === 'communities' && <Groups/>}
              </div>
        
              <div className={`conference-body ${activeTab === 'create' ? 'active' : ''}`}>
                {activeTab === 'create' && <Create/>}
              </div>
        </div>
         
        </> 
    );
   
}

export default Group;