import React, { useEffect, useState } from 'react';
import './Loader.css';

// Определение типов для props
interface LoaderProps {
  onLoad: () => void; 
}

const Loader: React.FC<LoaderProps> = ({ onLoad }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      onLoad();
    }, 2000);

    return () => clearTimeout(timer); 
  }, [onLoad]);

  return loading ? (
    <div id="loader" className="loader">
      <div className="loading-text">
      <div className="coin"></div>
      </div>
    </div>
  ) : null;
};

export default Loader;
