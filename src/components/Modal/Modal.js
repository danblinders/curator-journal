import { useState } from 'react';
import './Modal.scss';

const Modal = ({showState = false, message}) => {
  const [isShown, setIsShown] = useState(showState);
  return (
    <div className={`modal ${isShown ? 'modal_opened' : null}`}>
      <div className={`modal__container ${isShown ? 'modal__container_shown' : null}`}>
        <div className="modal__close" onClick={() => setIsShown(false)}>Закрыть</div>
        <div className="modal__content">
          {message}
        </div>
      </div>
    </div>
  )
}

export default Modal