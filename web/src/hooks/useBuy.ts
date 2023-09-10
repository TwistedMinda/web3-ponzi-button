import {
  EthereumAddress,
  parseEther,
  useEthereumConfig
} from 'utils/eth.utils';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useAddress } from './useAddress';
import { useRoundInfo } from './useRoundInfo';

export const useBuy = () => {
  const { entryPrice, started } = useRoundInfo();
  const { address } = useAddress();
  const cfg = useEthereumConfig();
  const { config } = usePrepareContractWrite({
    ...cfg,
    functionName: 'buy',
    overrides: {
      from: address as EthereumAddress,
      value: parseEther(entryPrice.toString())
    },
		enabled: started,
  });
  const { writeAsync, isLoading } = useContractWrite(config);
  const join = async () => writeAsync?.();
  return {
    join,
    isLoading
  };
};
