import  { useState, useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
const Public = () => {
  const userInfo = useSelector(state => state.auth.userInfo)
  const userName = userInfo.userName;
  const messageHistoryRef = useRef(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socket = new WebSocket(`ws://localhost:5053/ws/public`);

  useEffect(()=>{
    socket.addEventListener('message', handleReceivedMessage);
  },[chatHistory])

  const handleReceivedMessage = (event) => {
    if (event.data.startsWith('{')) {
      const receivedMessage = JSON.parse(event.data);
      console.log(receivedMessage,"recieved message");
        setChatHistory((prevHistory) => [
            ...prevHistory,
            {
                user: receivedMessage.user,
                text: receivedMessage.text,
            },
        ]);
        scrollToBottom();
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
    };
    socket.send(JSON.stringify(messageObject));
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { user:userInfo.userName, text: message },
    ]);
    setMessage('');
    scrollToBottom();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const insertEmoji = (emoji) => {
    setMessage(message + emoji.native);
  };

  const scrollToBottom = () => {
    if (messageHistoryRef.current) {
      messageHistoryRef.current.scrollTop = messageHistoryRef.current.scrollHeight;
    }
  };

  return (
    <div className="public-chat-container">
      <div className='public-chat-head'>
        <div className="emoji-picker-container-public">
          {showEmojiPicker && <Picker data={data} onEmojiSelect={insertEmoji} />}
        </div>
        <p>Let's Chat to the world</p>
      </div>
      <div className="public-chat-box" onClick={() =>setShowEmojiPicker(false)} ref={messageHistoryRef}>
        {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`message-bubble ${message.user === userInfo.userName ? 'sent-bubble' : 'received-bubble'} bg-slate-900`}
        > 
          {message.user !== userInfo.userName && (<div className="message-user">{message.user}</div>)}
          <div className="message-text">{message.text}</div>
        </div>
        ))}
      </div>
      <div className="public-message-input">
        <button className="add-icon-button"onClick={() =>setShowEmojiPicker(!showEmojiPicker)}><FontAwesomeIcon icon={faSmile} /></button>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onClick={() =>setShowEmojiPicker(false)}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Public;
