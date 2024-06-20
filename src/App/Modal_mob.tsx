import React from 'react';
import './../css/mobile/Modal_mob.css' ;
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
    <div className = 'ModalContainer-mob'>
      <button className='closeButton-mob' onClick={onClose}> <div className="cross"></div></button>


      <div className = 'modalMessage-mob'>{message}</div>
      <div className='modalButtons'>

    <button className='Twit-mob' onClick={twit}>
      <div className='text-mob'>
        <img className='ref-mob' src="https://stake-take.com/assets/twitter.svg" alt="Stake-Take" height="20" width="20"></img>
       <p>Follow Namada</p> 
      </div>
    </button>
    <button className='TwitSt-mob' onClick={twitSt}>
      <div className='text-mob'>
        <img className='ref-mob' src="https://stake-take.com/assets/twitter.svg" alt="Stake-Take" height="20" width="20"></img>
       <p>Follow Us</p>
      </div>
    </button>
  </div>


      



    </div>
  );
};

export default Modal;
