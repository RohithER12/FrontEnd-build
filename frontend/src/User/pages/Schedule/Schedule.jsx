import "./Schedule.css"
import { useNavigate } from "react-router-dom";
import NewSchedule from "../../components/Shedule/NewSchedule";
import Scheduled from "../../components/Shedule/Scheduled";
import Completed from "../../components/Shedule/Completed";
import React, { useState } from 'react';

const Schedule = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedule'); 

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
    <div className="h-fit">
      <div className="type-container">
        <div
          className={`flex-item ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => {
            handleTabClick('schedule');
          }}
        >
          <p>Schedule New Conference</p>
        </div>
        <div
          className={`flex-item ${activeTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => {
            handleTabClick('scheduled');
          }}
        >
          <p>Scheduled Conferences</p>
        </div>
        <div
          className={`flex-item ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => {
            handleTabClick('completed');
          }}
        >
          <p>Completed Schedules</p>
        </div>
      </div>

      <div className={`schedule-body ${activeTab === 'schedule' ? 'active' : ''}`}>
        {activeTab === 'schedule' && <NewSchedule />}
      </div>

      <div className={`scheduled-body ${activeTab === 'scheduled' ? 'active' : ''}`}>
        {activeTab === 'scheduled' && <Scheduled />}
      </div>

      <div className={`completed-body ${activeTab === 'completed' ? 'active' : ''}`}>
        {activeTab === 'completed' && <Completed />}
      </div>
    </div>
    </>
  );
};

export default Schedule;
