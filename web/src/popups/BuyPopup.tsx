import { useEffect, useState } from 'react';
import { useBuy } from 'hooks/useBuy';
import { useBalance } from 'hooks/useBalance';
import { useRoundInfo } from 'hooks/useRoundInfo';
import { FaHandPointer, FaStar, FaTimes } from 'react-icons/fa';
import { useFinishCallback } from 'hooks/useFinishCallback';
import { BUY_POPUP, FINISH_POPUP } from 'stores/popup-store';
import Card from 'components/Card';
import usePopup from 'hooks/usePopup';
import Popup from 'reactjs-popup';
import './BuyPopup.scss';
import { useTools } from 'hooks/useTools';

export const BuyPopup = () => {
  const { showAmount } = useTools();
  const [loading, setLoading] = useState(false);
  const { entryPrice } = useRoundInfo();
  const { join, isLoading: enrolling } = useBuy();
  const { balance } = useBalance();
  const { shown, hide: hidePlay } = usePopup(BUY_POPUP);
  const { show: showFinish } = usePopup(FINISH_POPUP);

  const insufficientBalance = !balance || balance < entryPrice;

  useFinishCallback(() => {
    hidePlay();
    showFinish({});
  });

  useEffect(() => {
    if (shown) setLoading(false);
  }, [shown]);

  const pay = async () => {
    setLoading(true);
    try {
      await join();
    } catch (err: any) {
      setLoading(false);
    }
  };

  return (
    <Popup open={shown} onClose={hidePlay}>
      <div className="slider">
        <div className="box-section-title popup-title">Feed the Ponzi</div>
        <div className="box-row">
          <div className="box-title">Entry price</div>
          <div className="fail">{showAmount(-entryPrice)}</div>
        </div>

        <div className="box-row aligned">
          <div className="box-title">What you get</div>
          <div className="align-right success">
            +1 <FaHandPointer className="text-icon" />
          </div>
        </div>

        <Card
          className="top-space"
          disabled={loading || enrolling || insufficientBalance}
          onClick={pay}
        >
          {insufficientBalance ? (
            'Insufficient balance'
          ) : enrolling ? (
            'Confirm transaction'
          ) : loading ? (
            'Saving your tap...'
          ) : (
            <div>
              {'Gimme lifetime rewards'} <FaStar />
            </div>
          )}
        </Card>
      </div>
      <div className="popup-close" onClick={hidePlay}>
        <FaTimes />
      </div>
    </Popup>
  );
};
