import React, { useState, useEffect } from 'react';
import './../css/windows.css';
import { App } from './App';
import './../css/button.css';

const WindowComponent: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);



  useEffect(() => {
    const image = new Image();
    image.src = "https://stake-take.com/assets/Namada.png";
    image.onload = () => {
      setImageLoaded(true);
      document.getElementById('loader')!.style.display = 'none'; 
    };
  }, []);

  useEffect(() => {
 
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = imageLoaded ? 'none' : 'block';
    }
  }, [imageLoaded]);

  return (
    <div className="content-wrapper">
    <div className="frame">
      <div className="title-section">
      <a  href="https://namada.net/" target='blank' >
  <img className="logo" src="https://stake-take.com/assets/Namada.png" alt="Namada Logo" width="130px" />
</a>
          <div className="title-app">
            <div className = 'mobl'><span className = 'stroke'>FAUCET</span>  Namada Shielded Expedition</div>
          </div>
          <div  className="title-app" >
            <div className = 'mobl'>shielded-expedition.88f17d1d14 <span className = 'stroke'>Testnet</span></div>
          </div>
          <div className="button_container">
            <App />
          </div>
          <div className="footer">
            <div  className='title-st'>  <a  href="https://stake-take.com" target='blank' >Built by Stake-Take <img className='Stake-Take-logo' src="https://stake-take.com/img/logo.svg" alt="Stake-Take" height="40" width="40" /></a></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WindowComponent;
