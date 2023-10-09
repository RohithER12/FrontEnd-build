// import "./Conference.css"

import React, { useState } from 'react';

const Broadcast = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    interest: '',
    chat: false,
    participantlimit: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="private-div">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Interest:</label>
          <input
            type="text"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="chat"
              checked={formData.chat}
              onChange={handleChange}
            />{' '}
            Enable Chat
          </label>
        </div>
        <div>
          <label>Participant Limit:</label>
          <input
            type="number"
            name="participantlimit"
            value={formData.participantlimit}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Start Broadcast</button>
        </div>
      </form>
    </div>
  );
};

export default Broadcast;