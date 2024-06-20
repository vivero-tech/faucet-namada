import React, { useEffect, useState, FC } from 'react';
import './../css/Loader.css';


interface LoaderProps {
  onLoad: () => void;
}

const Loading: FC<LoaderProps> = ({ onLoad }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      onLoad();
    }, 20000);
    return () => clearTimeout(timer); 
  }, [onLoad]);

  return loading ? (
    <div id="loader" className="loader">
      <div className="loading-text">
        <span className="loading-text-words">L</span>
        <span className="loading-text-words">O</span>
        <span className="loading-text-words">A</span>
        <span className="loading-text-words">D</span>
        <span className="loading-text-words">I</span>
        <span className="loading-text-words">N</span>
        <span className="loading-text-words">G</span>
      </div>
    </div>
  ) : null;
};

export default Loading;
