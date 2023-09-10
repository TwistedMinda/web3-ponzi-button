import useCounter from 'hooks/useCounter';
import './Countdown.scss';

const Countdown = () => {
	const { remaining, isEnded } = useCounter()
	if (isEnded) return (null)
  return (
		<div className='countdown'>
			<div className='subtitle'>Game starts in</div>
			<div>{remaining}</div>
		</div>
  );
};

export default Countdown;
