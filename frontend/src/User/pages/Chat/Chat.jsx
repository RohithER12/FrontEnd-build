import "./Chat.css"
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Group from "../../components/Chat/Group";
import Personal from "../../components/Chat/Personal";
import Public from "../../components/Chat/Public";

const Chat =()=>{
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal'); 
  
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

    return (
        <>
        <section className="w-full ">
          <div className="type-container relative">

          <div
              className={`flex-item ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => {
                handleTabClick('personal');
              }}
            >
              <p>Personal Chats</p>
            </div>

            <div
              className={`flex-item ${activeTab === 'group' ? 'active' : ''}`}
              onClick={() => {
                handleTabClick('group');
              }}
            >
              <p>Group Chats</p>
            </div>

            <div
              className={`flex-item ${activeTab === 'public' ? 'active' : ''}`}
              onClick={() => {
                handleTabClick('public');
              }}
            >
              <p>Public Chats</p>
            </div>

            
          </div>
    
          <div className={`chat-body ${activeTab === 'personal' ? 'active' : ''}`}>
            {activeTab === 'personal' && <Personal/>}
          </div>

          <div className={`chat-body ${activeTab === 'group' ? 'active' : ''}`}>
            {activeTab === 'group' && <Group/>}
          </div>

          <div className={`chat-body ${activeTab === 'public' ? 'active' : ''}`}>
            {activeTab === 'public' && <Public/>}
          </div>
          </section>
        </>
    );
}

export default Chat;