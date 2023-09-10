import { useEffect, useRef, useState } from 'react';
import { useRoundInfo } from 'hooks/useRoundInfo';
import { addSeconds, intervalToDuration } from 'date-fns';

const add0 = (n?: number) => {
  if (!n) return '00';
  if (n < 10) return `0${n}`;
  return n;
};

const partsToText = ({ days, hours, minutes, seconds }: any) => {
	return `${days} Days ${add0(hours)}:${add0(minutes)}:${add0(seconds)}`
}

const renderTime = (start: number, delaySeconds: number) => {
  const end = addSeconds(start, delaySeconds);
  if (Date.now() > end.getTime()) return '0 Days 00:00:00';
  const interval = { start: Date.now(), end: end };
  const parts = intervalToDuration(interval);
  return partsToText(parts);
};

const useCounter = () => {
  const { startDelay, stats } = useRoundInfo();
  const timestamp = stats?.deployTimestamp || 0;
  const isEnded = Date.now() - timestamp > startDelay * 1000;
  const [remaining, setRemaining] = useState(renderTime(timestamp, startDelay));
  const ref = useRef<any>(undefined);
	
  useEffect(() => {
    if (ref.current) clearInterval(ref.current);
		if (!isEnded) {
			ref.current = setInterval(() => {
				setRemaining(renderTime(timestamp, startDelay));
			}, 1000);
		}
  }, [timestamp, isEnded]);
	
  useEffect(() => {
    return () => clearInterval(ref.current);
  }, []);

  return {
    remaining,
    isEnded
  };
};

export default useCounter;
