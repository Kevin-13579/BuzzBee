import React, { useEffect } from "react";
 import { useNavigate } from "react-router-dom"; 
 import "./SplashScreen.css"; 
 function SplashScreen() { 
    const navigate = useNavigate(); 
    useEffect(() => {
         const timer = setTimeout(() => { 
            navigate("/home");
    }, 3000);
 return () => clearTimeout(timer);
 }, [navigate]);
  return ( 
  <div className="splash-container"> 
  <img 
  src="/logo.jpg" // put your logo image inside public/ folder as logo.png
   alt="App Logo"
    className="splash-logo" /> 
    <h1 className="splash-title">Buzz Bee</h1> 
    </div> 
    ); 
}
export default SplashScreen;