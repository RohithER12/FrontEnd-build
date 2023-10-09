const RecentFeed =()=>{
    const recordedVideosData = [
        {
          videoUrl: 'cosmic.mp4',
          description: 'This is the first recorded video.',
        },
        {
          videoUrl: 'cosmic.mp4',
          description: 'Here is the second recorded video with a longer description.',
        },
        {
            videoUrl: 'cosmic.mp4',
            description: 'Here is the second recorded video with a longer description.',
        },
        {
            videoUrl: 'cosmic.mp4',
            description: 'Here is the second recorded video with a longer description.',
        },
        {
            videoUrl: 'cosmic.mp4',
            description: 'Here is the second recorded video with a longer description.',
        },
        {
            videoUrl: 'cosmic.mp4',
            description: 'Here is the second recorded video with a longer description.',
        },
      ];
    
    return(

    <div className="recorded-videos">
      <div className="grid gap-4 grid-cols-4">
        {recordedVideosData.map((video, index) => (
          <div key={index} className="max-w-[400px]">
            <div className="video-container">
              <video controls width={400} height={225}>
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="description">
              <p>{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentFeed;