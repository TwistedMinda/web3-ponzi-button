import Card from 'components/Card';
import { useAccountInfo } from 'hooks/useAccountInfo';
import usePopup from 'hooks/usePopup';
import { FaHandPointer, FaHeart, FaTimes } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { FINISH_POPUP } from 'stores/popup-store';

export const FinishPopup = () => {
  const { shown, hide } = usePopup(FINISH_POPUP);
  const { accountInfo } = useAccountInfo();

  const userTaps = accountInfo?.taps || 0;

  return (
    <Popup open={shown} onClose={hide}>
      <div className="box-section-title">
        <FaHandPointer className="text-icon" /> Tap Acquired!
      </div>

      <div className="box-row aligned">
        <div className="box-title">What you earned</div>
        <div className="success">
          +1 <FaHandPointer className="text-icon" />
        </div>
      </div>

      <div className="box-row aligned">
        <div className="box-title">Enjoy your lifetime rewards!</div>
        <div className="box-title">
          {userTaps} <FaHandPointer className="text-icon" />
        </div>
      </div>

      <Card className="top-space" onClick={hide}>
        {'Enjoy my rewards '}
        <FaHeart className="text-icon" />
      </Card>
      <div className="popup-close" onClick={hide}>
        <FaTimes />
      </div>
    </Popup>
  );
};
