import "./Conference.css"
import { useNavigate } from "react-router-dom";
import Join from "../../components/Conference/Join";
import Private from "../../components/Conference/Private"
import  { useState } from 'react';

const Conference =()=>{
  
    const [activeTab, setActiveTab] = useState('join'); 
  
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };
        return (
            <>
              <section className="h-full">
          <div className="py-4 px-4 mx-auto max-w-screen-xl lg:py-8">
             <div className=" flex flex-col justify-evenly p-5 md:p-6 mb-">
              <div className="type-container flex justify-center">

              <div
                  className={`flex-item ${activeTab === 'join' ? 'active' : ''} ml-4` }
                  onClick={() => {
                    handleTabClick('join');
                  }}
                >
                  <p>Join A Conference</p>
                </div>

                <div
                  className={`flex-item ${activeTab === 'private' ? 'active' : ''} ml-4`}
                  onClick={() => {
                    handleTabClick('private');
                  }}
                >
                  <p>Start Private Conference</p>
                </div>
              </div>
              <div className={`conference-body ${activeTab === 'join' ? 'active' : ''}`}>
                {activeTab === 'join' && <Join/>}
              </div>
        
              <div className={`conference-body ${activeTab === 'private' ? 'active' : ''}`}>
                {activeTab === 'private' && <Private/>}
              </div>
              </div>
              </div>
              </section>
            </>
        );
   
}

export default Conference;