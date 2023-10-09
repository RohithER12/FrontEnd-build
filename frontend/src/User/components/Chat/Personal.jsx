import  { useState,useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import { useGetChatMutation,useCreateChatMutation,useGetChatHistoryMutation} from '../../slices/api_slices/chatApiSlice';
import {CLOUDINARY_FETCH_URL} from '../../../utils/config/config'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { Cookies } from "react-cookie";
import { RingLoader } from 'react-spinners';




const Personal = () => {
  const cookie = new Cookies()
  const authCookie = cookie.get("user-auth")
  const userInfo = useSelector(state => state.auth.userInfo)
  const [userName] = useState(userInfo.userName)
  const socket = new WebSocket(`ws://localhost:5053/ws`);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [message, setMessage] = useState(''); 
  const [chatHistory, setChatHistory] = useState([]); 
  const [getChat] = useGetChatMutation()
  const [createChat] = useCreateChatMutation()
  const [getChatHistory] = useGetChatHistoryMutation()
  const [users, setUser] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading,setLoading] = useState(false)
  const divRef = useRef()
  
  

  useEffect(()=>{
    getChatHandler(authCookie)
  },[])


  
  useEffect(()=>{
    socket.addEventListener('message', handleReceivedMessage);
  },[chatHistory])

  useEffect(()=>{
    console.log(users,"users");
    if(!selectedUser && users.length > 0){

      handleUserClick(users[0])
      setLoading(false)
    }
    
  },[users])

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory,message]);

  

  
  
  const getChatHandler = async (userAuthCookie)=>{
     try {
      setLoading(true)
      const chatRes = await getChat(userAuthCookie)
      setUser(chatRes.data)
    } catch (error) {
      console.log(error);
    }
  }

  const createChatHandler = async (chatreq) => { 
    try {
       await createChat(chatreq); 
    } catch (error) {
      console.log(error);
    }
  };

  const getChatHistoryHandler = async (chatreq)=>{
    try{
      const res = await getChatHistory(chatreq)
      const mappedMessages = res.data.messages.map((message) => ({
        user: message.UserName,
        text: message.Text,
      }));
      setChatHistory([]);
      setChatHistory((prevHistory) => [...prevHistory, ...mappedMessages]);
      
    }catch (error){
      console.log(error)
    }
  }
  

  function handleUserClick(user){
   
    const chatreq={
      UserName : userName,
      RecipientID: user.RecipientID
    }
    setChatHistory([]);
    createChatHandler(chatreq)
    getChatHistoryHandler(chatreq)
    setSelectedUser(user);
   
    
  }

  

  const [online, setOnline] = useState(false);

  

  const handleReceivedMessage = (event) => {
   
    if (event.data.startsWith('{')) {
      const receivedMessage = JSON.parse(event.data);
      console.log(receivedMessage,"recieved message");
      
      if (receivedMessage.type === "onlineStatus") {
        const isOnline = receivedMessage.online;
        setOnline(isOnline)
      }else{
        setChatHistory((prevHistory) => [
            ...prevHistory,
            {
                user: receivedMessage.user,
                text: receivedMessage.text,
            },
        ]);
        // setOnline(true)
        
      }
      
    } else {
      console.log("Received plain text message:", event.data);
    }
  };


  const handleSendMessage = () => {
    if (message.trim() === '') {
      return; 
    }
    
    const messageObject = {
      user: userName,
      text: message,
      recipient: selectedUser?.RecipientID, 
    };

  
    socket.send(JSON.stringify(messageObject));
    
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { user: userName, text: message},
    ]);

    const updatedUsers = users.filter((user) => user.RecipientID !== selectedUser?.RecipientID);
    setUser([users.find((user) => user.RecipientID === selectedUser?.RecipientID), ...updatedUsers]);
    setMessage('');
  };

  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const toggleUserList = () => {
    setIsUserListOpen(!isUserListOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const insertEmoji = (emoji) => {
    console.log(emoji,"emoji")
    setMessage(message + emoji.native);
  };

 


  return (
    loading ? <div className="w-full flex justify-center h-full">
    <div className="py-52">
      <RingLoader color="#1bacbf"/>
    </div>
    </div> :
    <div className=" chat-container fixed w-screen pr-28 overflow-hidden">
      
      <div className="users-list" onClick={() =>setShowEmojiPicker(false)}>
          <div className='users-list-head flex items-center justify-center'>
          <button className="toggle-button " onClick={toggleUserList}>User List</button>
          </div>
   
          <ul className={isUserListOpen ? 'open' : ''}>
            {users !== null && users.map((user, index) => (
              <li
                key={index}
                onClick={() => handleUserClick(user)}
                className={selectedUser?.RecipientName === user?.RecipientName  ? 'active' : ''}
              >
                <div className="userlist-container " onClick={() =>setShowEmojiPicker(false)}>
                  <div className="user-avatar">
                    <img src={user?.AvatarID ? `${CLOUDINARY_FETCH_URL}/${user.AvatarID}`: `${CLOUDINARY_FETCH_URL}/ecmoviuvqqedrfymjxad.webp` } alt={`avatar`} />
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.RecipientName}</span>
                    <span className="last-seen">{user.lastSeen}</span>
                    {user.unseenMessages > 0 && (
                      <span className="unseen-messages">{user.unseenMessages} New</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

    
      <div className="chat-box">
        {selectedUser?.RecipientName ? (
        
          <div className='selected-chat-box'>
            <div className='chat-box-head'>
            <div className="user-avatar">
                    <img src={selectedUser?.AvatarID ? `${CLOUDINARY_FETCH_URL}/${selectedUser.AvatarID}`: `${CLOUDINARY_FETCH_URL}/ecmoviuvqqedrfymjxad.webp`} alt={`avatar`} />
            </div>
            <div>
            {selectedUser?.RecipientName}
            <h6 style={{ color: 'grey' }}>{online ? "Online" : "Offline"}</h6>
            </div>
              
            </div>

            <div className="message-history " onClick={() =>setShowEmojiPicker(false)}>
             
            {chatHistory.map((message, index) => (      
              <div
                
                key={index}
                ref={divRef}
                className={`message-bubble ${message.user === userName ? 'sent-bubble' : 'received-bubble'} bg-slate-900 `}
              >
                {message.text}
              </div>
              
            ))}
            </div>
            <div className="message-input bg-slate-900">
              <button className="add-icon-button"onClick={() =>setShowEmojiPicker(!showEmojiPicker)}><FontAwesomeIcon icon={faSmile} /></button>
              <div className="emoji-picker-container">
                  {showEmojiPicker && <Picker data={data} onEmojiSelect={insertEmoji} />}
              </div>
              <input className='message-input-field'
                type="text"
                placeholder="Type your message..."
                value={message}
                onClick={() =>setShowEmojiPicker(false)}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="message-send-button"onClick={handleSendMessage}>Send</button>
            </div>
            
          </div>
        ) : (
          <div className="no-user-selected">
            <p>Select a user to start a chat.</p>
          </div>
        )}
      </div>
    </div>    
  );
};

export default Personal;
