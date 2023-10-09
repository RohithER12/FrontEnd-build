import React from 'react';

const FeedItem = ({ group }) => {
  return (
    <div className="communityfeed-item">
      <img src={group.thumbnail} alt={group.name} />
      <h3>{group.name}</h3>
      <span>{group.members} Members </span>
      <span>{group.coins} Coins</span>
      <p>{group.rank} rank</p>
      <link>{group.joinlink}</link>
    </div>
  );
};

export default FeedItem;
