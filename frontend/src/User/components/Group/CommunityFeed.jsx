import React, { useRef } from 'react';
import FeedItem from './CommunityFeedItem'; 

const CommunityFeed = ({ groups }) => {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200;
    }
  };

  return (
    <div className="community-feed">
      <button className="scroll-button" onClick={scrollLeft}>
        &lt;
      </button>
      <div className="feed-container" ref={containerRef}>
        {groups.map((group, index) => (
          <FeedItem key={index} group={group} />
        ))}
      </div>
      <button className="scroll-button" onClick={scrollRight}>
        &gt;
      </button>
    </div>
  );
};

export default CommunityFeed;
