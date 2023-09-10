import { filterAccountInfo } from 'types/contract.type';
import { toAddress, useEthereumConfig } from 'utils/eth.utils';
import { useContractRead } from 'wagmi';
import { useAddress } from './useAddress';

export const useAccountInfo = () => {
  const { address } = useAddress();
  const cfg = useEthereumConfig();
  const { data, isLoading, error, refetch } = useContractRead({
    ...cfg,
    functionName: 'players',
    args: address ? [toAddress(address)] : undefined,
    select: (data) => filterAccountInfo(data),
    watch: true
  });
  return {
    accountInfo: data,
    isLoading,
    error,
    refresh: refetch
  };
};
