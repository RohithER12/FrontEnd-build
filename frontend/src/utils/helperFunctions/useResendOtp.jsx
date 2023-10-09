import { useState,useEffect } from "react";

export const useResendOtp = ()=>{
    const [seconds, setSeconds] = useState(20); 
    const [timerActive, setTimerActive] = useState(false);
  
    const startTimer = () => {
      setTimerActive(true);
      setSeconds(20); 
    };
  
    useEffect(() => {
      let interval;
  
      if (timerActive) {
        interval = setInterval(() => {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);
      }
  
      if (seconds === 0) {
        clearInterval(interval);
        setTimerActive(false);
      }
  
      return () => clearInterval(interval); 
    }, [timerActive, seconds]);

    return [startTimer,seconds,timerActive]
  
}