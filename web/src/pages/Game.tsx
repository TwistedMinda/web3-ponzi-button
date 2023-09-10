import Button from 'components/Button';
import Card from 'components/Card';
import Countdown from 'components/Countdown';
import Footer from 'components/Footer';
import { useAccountInfo } from 'hooks/useAccountInfo';
import { useClaim } from 'hooks/useClaim';
import usePopup from 'hooks/usePopup';
import { useRoundInfo } from 'hooks/useRoundInfo';
import { useTools } from 'hooks/useTools';
import { FaHandPointer, FaStar } from 'react-icons/fa';
import { BUY_POPUP, SELL_POPUP } from 'stores/popup-store';
import { useNetwork } from 'wagmi';
import { fantomTestnet } from 'wagmi/chains';
import './Game.scss';

export default function GamePage() {
  const { showAmount } = useTools();
  const { show: showBuy } = usePopup(BUY_POPUP);
  const { show: _showSell } = usePopup(SELL_POPUP);
  const { chain: currentChain } = useNetwork();

	const isTestnet = currentChain?.id === fantomTestnet.id

  const { entryPrice, stats, rewards, started } = useRoundInfo();
  const { accountInfo } = useAccountInfo();
  const { sell } = useClaim(rewards > 0);

  const totalTaps = stats?.totalTaps || 0;
  const userTaps = accountInfo?.taps || 0;
  const userClaimed = accountInfo?.claimed || 0;
  const userNextRewards =
    totalTaps > 0 ? (entryPrice / totalTaps) * userTaps : 0;

  const trophyValue = totalTaps > 0 ? entryPrice / totalTaps : 0;
	
  return (
		<div className="game-wrapper">
			<div className="main-box">
				<div className="col center">
					{!started &&
						<Countdown />
					}

					<div className="subtitle">Taps issued</div>
					<div className="taps">
						<FaHandPointer className="text-icon" /> {totalTaps}
					</div>

					<Card
						walletHandlerIfNeeded
						disabled={!started}
						className={'play-btn btn-animated'}
						onClick={showBuy}
					>
						<div className="fail bold">{isTestnet ? 'Test' : 'Ponzi'} Button</div>

						<div className="play-subtitle">
							<FaStar className="text-icon" />
							{' Get rewards for next taps '}
							<FaStar className="text-icon" />
						</div>

						<Button className="play-sub-button">
							Earn your <FaHandPointer className="text-icon" /> now
						</Button>
					</Card>
				</div>

				<div className="subtitle">
					<div>Next rewards</div>
					<span className="yellow light">
						{showAmount(trophyValue)} / <FaHandPointer className="text-icon" />
					</span>
				</div>

				<div className="claim-btn col center">
					<div
						className={['link', rewards == 0 ? 'disabled' : ''].join(' ')}
						onClick={rewards > 0 ? sell : undefined}
					>
						<FaStar className="text-icon" />{' '}
						<span className="underline">
							{'Claim '}
							{rewards > 0 ? showAmount(rewards) : 'rewards'}
						</span>{' '}
						<FaStar className="text-icon" />
					</div>
				</div>

				<div className="table">
					<div className="table-left">
						<div className="text">Next rewards:</div>
						<div className="text">You claimed:</div>
						<div className="text">Your taps:</div>
					</div>
					<div className="table-right">
						<div className="text">
							<b className="light">{showAmount(userNextRewards)}</b>
						</div>
						<div className="text">
							<b className="light">{showAmount(userClaimed)}</b>
						</div>
						<div className="text">
							<b className="light">
								{userTaps} <FaHandPointer className="text-icon" />
							</b>
						</div>
					</div>
				</div>

				<Footer />
			</div>
		</div>
  );
}
