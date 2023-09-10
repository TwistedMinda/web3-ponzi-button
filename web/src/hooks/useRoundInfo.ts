import { filterStats } from 'types/contract.type';
import { toAddress, toEther, useEthereumConfig } from 'utils/eth.utils';
import { useContractRead } from 'wagmi';
import { useAddress } from './useAddress';

export const useRoundInfo = () => {
  const { address } = useAddress();
  const cfg = useEthereumConfig();
  const {
    data: stats,
    isLoading,
    error,
    refetch: refetchStats
  } = useContractRead({
    ...cfg,
    functionName: 'stats',
    select: (data) => filterStats(data),
    watch: true
  });
  const { data: rewards } = useContractRead({
    ...cfg,
    functionName: 'getRewards',
    args: address ? [toAddress(address)] : undefined,
    select: (data) => toEther(data),
    watch: true,
    enabled: !!address
  });
  const { data: started } = useContractRead({
    ...cfg,
    functionName: 'hasGameStarted',
    watch: true,
    enabled: !!address
  });
  const { data: entryPrice } = useContractRead({
    ...cfg,
    functionName: 'entryPrice',
    select: (data) => toEther(data),
  });
  const { data: startDelay } = useContractRead({
    ...cfg,
    select: (data) => data.toNumber(),
    functionName: 'startDelay',
  });

	return {
    stats,
		entryPrice: entryPrice || 0,
		startDelay: startDelay || 0,
    rewards: rewards || 0,
		started: started || false,
    isLoading,
    error,
    refresh: () => {
      refetchStats();
    }
  };
};
