import React from 'react';
import './Modal.css' ;
import './../css/mobile/Modal_mob.css';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, message }) => {
  if (!isVisible) return null;

  const twit = () => {
    const twitterUsername1 = 'namada';
    const twitterUrl1 = `https://twitter.com/intent/follow?screen_name=${twitterUsername1}`;
    window.open(twitterUrl1, '_blank');
  };
  const twitSt = () => {
    const twitterUsername2 = 'StakeAndTake';
    const twitterUrl2 = `https://twitter.com/intent/follow?screen_name=${twitterUsername2}`;
    window.open(twitterUrl2, '_blank');
  };



  return (
    <div className = 'ModalContainer'>
      <button className='closeButton' onClick={onClose}> <div className="cross"></div></button>


      <div className = 'modalMessage'>{message}</div>
      <div className='modalButtons'>

    <button className='Twit' onClick={twit}>
      <div className='text'>
        <img className='ref' src="https://stake-take.com/assets/twitter.svg" alt="Stake-Take" height="20" width="20"></img>
       <p>Follow Namada</p> 
      </div>
    </button>
    <button className='TwitSt' onClick={twitSt}>
      <div className='text'>
        <img className='ref' src="https://stake-take.com/assets/twitter.svg" alt="Stake-Take" height="20" width="20"></img>
       <p>Follow Us</p>
      </div>
    </button>
  </div>


      



    </div>
  );
};

export default Modal;
