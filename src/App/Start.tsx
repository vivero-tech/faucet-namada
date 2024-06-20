import React, { useState, useEffect } from 'react';
import WindowComponent from "./Window";
import Loader from "./Loader";
import './Loader.css';


interface LoaderProps {
    onLoad: () => void;
  }
  

  const Start: React.FC = () => {
    const [showContent, setShowContent] = useState<boolean>(false);
  
    const handleLoad = (): void => {
      setShowContent(true);
    };
  
    return (
      <div className="Start">
        <Loader onLoad={handleLoad} />
        {showContent && <WindowComponent />}
      </div>
    );
  };

  export default Start;