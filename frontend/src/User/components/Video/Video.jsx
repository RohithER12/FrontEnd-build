

 const Video = ()=>{
    return(
        <video autoPlay loop muted style={{ width: "100%", height: "100vh" }}>
            <source src={"https://res.cloudinary.com/dcv6mx1nk/video/upload/v1696306578/profile/goj4stikjyygtyr9q8p2.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
    )
}
export default Video;