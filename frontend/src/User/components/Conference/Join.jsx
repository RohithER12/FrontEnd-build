import React, { useState } from 'react';
// import "./Conference.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import {toast} from 'react-toastify'
import { Input ,Button} from '@nextui-org/react';
import { setConferenceState } from '../../slices/reducers/user_reducers/conferenceReducer';

import { useJoinPrivateConferenceMutation } from '../../slices/api_slices/usersConferenceApi';


const Join = () => {
  const [conferenceId, setConferenceId] = useState('');
  const [joinConference] = useJoinPrivateConferenceMutation()
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleInputChange = (e) => {
    setConferenceId(e.target.value);
  };

  const handleJoinConference = async() => {
   try {
    const res = await joinConference({conferenceID:conferenceId}).unwrap();
    console.log(res);
    dispatch(setConferenceState({status:true}))
    navigate(`/media-container/${conferenceId}`)
    
   } catch (error) {
    console.log(error);
    toast.error('invalid token id')
   }
    

  };

  return (
    
    <div className='flex flex-col items-center m-4'>
       
    <div className="m-4">
      <p>Enter the Conference ID to join:</p>
      <Input className='m-2' name='description' isRequired type="text"  placeholder="Conference ID"
            value={conferenceId}
            onChange={handleInputChange}
          />
    </div>
    <div className='m-4'>
       <Button variant="bordered"
            color="primary" onClick={handleJoinConference}>
           join conference
   </Button>
    </div>
    </div>

  );
}

export default Join;
