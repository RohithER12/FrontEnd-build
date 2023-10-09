import { useState , useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import "./Chat.css"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { useGetGroupMutation, useCreateGroupChatMutation,useGetGroupChatMutation,} from '../../slices/api_slices/chatApiSlice';
import { CLOUDINARY_FETCH_URL } from '../../../utils/config/config';
import { RingLoader } from 'react-spinners';
const Group = () => {
  const userInfo = useSelector(state => state.auth.userInfo)
  const [userName] = useState(userInfo.userName)
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null); 
  const [message, setMessage] = useState(''); 
  const [chatHistory, setChatHistory] = useState([]); 
  const [socket, setSocket] = useState(null); 
  const [getGroup,{isLoading}] = useGetGroupMutation();
  const [createGroupChat] = useCreateGroupChatMutation();
  const [getGroupChat] = useGetGroupChatMutation();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const divRef = useRef()
 
  
  useEffect(()=>{
    getGroupHandler()
  },[])

  useEffect(()=>{
    if(!selectedGroup && groups.length > 0){
      handleGroupClick(groups[0])
      console.log(groups,"groups data");
    }
  },[groups])

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory,message]);

  
  const getGroupHandler = async ()=>{
    try{
      const getGroupReq={
        UserID :userName,
      }
     const groupRes = await getGroup(getGroupReq)
     setGroups(groupRes.data)
    }catch(error){
      console.log(error)
    }
  }

  
  const createGroupChatHandler = async (createChatReq)=>{
    try{
      const res = await createGroupChat(createChatReq)
      console.log(res)
    }catch(error){
      console.log(error)
    }
  } 

  const getGroupChatHandler = async(createChatReq)=>{
    try{
     const res = await getGroupChat(createChatReq)
      console.log(res)
      const mappedMessages = res.data.map((message) => ({
        sender: message.UserName,
        text: message.Text,
      }));
      setChatHistory([]);
      setChatHistory((prevHistory) => [...prevHistory, ...mappedMessages]);
      // scrollToBottom();
    }catch(error){
      console.log(error)
    }
  }

  function  handleGroupClick(Group){
    const getChatReq={
      UserID  :userName,
      GroupID :Group.GroupID
    }
    const createChatReq={
      UserName: userName,
      GroupID : Group.GroupID,    
	    GroupName : Group.GroupName,   
	    GroupAvatarID: Group.GroupAvatarID
    }
    setChatHistory([]);
    createGroupChatHandler(createChatReq)
    getGroupChatHandler(getChatReq)
    setSelectedGroup(Group);
    connectWebSocket(Group.GroupID);
  }

  const handleReceivedMessage = (data)=>{
    
    const message = JSON.parse(data)
    console.log(message);
  }

  const handleSendMessage = () => {
    if (message.trim() === '') {
      return; 
    }
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { Group: selectedGroup.GroupID, text: message},
    ]);
    const messageObject = {
      text: message,
      sender: userName, 
      groupId: selectedGroup.GroupID, 
      groupName:selectedGroup.GroupName
    };
    socket.send(JSON.stringify(messageObject));
    setMessage('');
  };

  const connectWebSocket = (groupName) => {
    const ws = new WebSocket(`ws://localhost:5053/ws/group?groupName=${groupName}&userName=${userName}`);
    setSocket(ws); 
    ws.onopen = () => {
      console.log(`WebSocket connection established for group: ${groupName}`);
    };
    ws.onclose = () => {
      console.log(`WebSocket connection closed for group: ${groupName}`);
    };
    ws.onerror = (error) => {
      console.error(`WebSocket error for group: ${groupName}`, error);
    };
    ws.onmessage = (event) => {
      handleReceivedMessage(event.data)
      console.log(`Received message for group: ${groupName}`, event.data);
    };
  };

  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const toggleGroupList = () => {
    setIsUserListOpen(!isUserListOpen);
  };
  const insertEmoji = (emoji) => {
    console.log(emoji,"emoji")
    setMessage(message + emoji.native);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };


  return (
    isLoading ? <div className="w-full flex justify-center h-full">
    <div className="py-52">
      <RingLoader color="#1bacbf"/>
    </div>
    </div>:
    <div className="chat-container fixed w-screen pr-28 overflow-hidden">
        <div className="users-list">  
        <div className='users-list-head flex items-center justify-center'>
          <button className="toggle-button text-center" onClick={toggleGroupList}>Group List</button>
        </div>
        {groups.length < 0 
        ?
        <h6 style={{ color: 'grey' }}>No communities to show</h6> 
        :
        <ul>
          {groups !== null && groups.map((Group, index) => (
            <li
              key={index}
              onClick={() => handleGroupClick(Group)}
              className={selectedGroup && selectedGroup.GroupID === Group.GroupID ? 'active' : ''}
            >
              <div className="userlist-container" onClick={() =>setShowEmojiPicker(false)}>
                  <div className="user-avatar">
                    <img src={Group?.AvaterID ?`${CLOUDINARY_FETCH_URL}/${Group.AvaterID}` : ''} alt={`avatar`} />
                  </div>
                  <div className="user-info">
                    <span className="user-name">{Group.GroupName}</span>
                    <span className="last-seen">{Group.lastSeen}</span>
                    {Group.unseenMessages > 0 && (
                    <span className="unseen-messages">{Group.unseenMessages} New</span>
                    )}
                  </div>
              </div>
            </li>
          ))}
          </ul>
          }
        </div>
    
      <div className="chat-box">
        {selectedGroup ? (
          <div className='selected-chat-box'>
            <div className='chat-box-head'>
            <div className="user-avatar">
                    <img src={selectedGroup?.AvaterID ? `${CLOUDINARY_FETCH_URL}/${selectedGroup.AvaterID}`:''} alt={`avatar`} />
            </div>
            <div>
            {selectedGroup.GroupName}
            <h6 style={{ color: 'grey' }}>group chat</h6>
            </div>              
            </div>

            <div className="message-history"  onClick={() =>setShowEmojiPicker(false)}>
            {chatHistory.map((message, index) => (
              
              <div
                key={index}
                ref={divRef}
                className={`message-bubble ${message.sender === userInfo.userName ? 'sent-bubble' : 'received-bubble'} bg-slate-900`}
              >
                {message.text}
              </div>
              
            ))}
            </div>
            <div className="message-input">
               <button className="add-icon-button"onClick={() =>setShowEmojiPicker(!showEmojiPicker)}><FontAwesomeIcon icon={faSmile} /></button>
               <div className="emoji-picker-container">
                  {showEmojiPicker && <Picker data={data} onEmojiSelect={insertEmoji} />}
               </div>
               <input className='message-input-field'
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
               />
               <button className="message-send-button"onClick={handleSendMessage}>Send</button>
            </div>           
          </div>
        ) : (
          <div className="no-Group-selected flex items-center justify-center">
            <p>Select a Group to start a chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Group;
