import Video from "../../components/Video/Video"

import "./Body.css"
import "./Body.scss"

const Body = () => {
  
  return (
  <>
    <div className="overlay-container w-full">
      <Video />
      <div className="text-overlay">
        <h1 className="scroll-text"> 
          <span>
            <span>Connect</span>
            <span>Collaborate</span>
            <span>Conquer</span>
          </span>
        </h1>
          <p></p>
        <h2>Elevate Your Connections with Seamless</h2>
          <p></p>
        <h2>Video Conferencing</h2>
      </div> 

      <div>
        <div className="content">
          <h2 className="title">Rean Connect - Where Connection Meets Collaboration
            <div className="aurora">
              <div className="aurora__item"></div>
              <div className="aurora__item"></div>
              <div className="aurora__item"></div>
              <div className="aurora__item"></div>
            </div>
          </h2>
        </div>
        
        <div className="intro-text">
          <div className="image-container">
             <img src="https://res.cloudinary.com/dcv6mx1nk/image/upload/v1696308922/profile/fwbb1xkkfqwrp1bpqd9p.jpg" alt="img" />
          </div>
          <div className="text-container">
            <p>Are you ready to experience a new era of online communication? Look no further! Rean Connect is your gateway to seamless video conferencing, dynamic group interactions, and a hub for like-minded individuals to connect.</p>
          </div>
        </div>

        
        {/* <div className="why-choose">
            <h2>Why Choose Rean?</h2>
            <ul>
              <li className="feature">
                <div className="feature-image">
                  <img src="background-image-1.jpg" alt="Feature Image 1" />
                </div>
                <div className="feature-text">
                  <span>🌐 Create Your Account:</span> Sign up in a breeze and unlock a world of possibilities. Your journey begins with a personalized profile.
                </div>
              </li>
            
              <li className="feature">
                <div className="feature-image">
                  <img src="background-image-2.jpg" alt="Feature Image 2" />
                </div>
                <div className="feature-text">
                  <span>💬 Private & Group Chat:</span> Instantly connect with friends or make new ones. Engage in private conversations or create vibrant groups centered around your interests.
                </div>
              </li>
              
              
              <li className="feature">
                <div className="feature-text">
                  <span>🎥 Video Conferencing:</span> Take your conversations to the next level with high-quality, private video conferences. Share moments, ideas, and insights face-to-face from anywhere in the world.
                </div>
              </li>
              
              <li className="feature">
                <div className="feature-image">
                  <img src="background-image-4.jpg" alt="Feature Image 4" />
                </div>
                <div className="feature-text">
                  <span>🤝 Join Public Gatherings:</span> Explore a wide array of public conferences and discussions hosted by fellow users. Expand your horizons, learn, and connect with a diverse community.
                </div>
              </li>
              
              <li className="feature">
                <div className="feature-image">
                  <img src="background-image-5.jpg" alt="Feature Image 5" />
                </div>
                <div className="feature-text">
                  <span>📽️ Record & Store:</span> Never miss a moment! Record your video conferences, store them securely in your profile, and revisit them whenever you want.
                </div>
              </li>
            </ul>
          </div>


        <div className="why-right-choice">
          <h2>Why Rean is the Right Choice:</h2>
          <ul>
            <li>
            <span>✨ User-Centric Design:</span> Our platform is built with you in mind. Enjoy an intuitive and seamless experience every step of the way.
            </li>
            <li>
            <span>🔒 Privacy & Security:</span> Your data's safety is our priority. We employ robust security measures to ensure your online interactions remain private.
            </li>
            <li>
            <span>🌟 Endless Possibilities:</span> From one-on-one connections to large group discussions, [Your Website Name] offers a platform where you can thrive.
            </li>
          </ul>
        </div>


      
          
      
        <div className="get-started">
        <p className="get-started-text">Join our vibrant community today and experience a new dimension of online communication. Connect, collaborate, and create memories with REAN CONNECT. Your journey to meaningful connections starts here.</p>
          <button className="sign-up-button">Sign Up Now</button>
          <button className="learn-more-button">Learn More</button>
        </div> */}
      </div>

    </div>
     
  </>
     
  );
};
  
export default Body;