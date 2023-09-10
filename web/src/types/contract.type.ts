import { fromBigNumber, toEther } from 'utils/eth.utils';

export type Stats = {
  totalTaps: number;
  deployTimestamp: number;
};

export type PlayerState = {
  taps: number;
  claimed: number;
  lastClaimId: number;
};

export const filterAccountInfo = <ContractInput>(
  item: ContractInput
): PlayerState => {
  const accountInfo = item as any;
  return {
    claimed: toEther(accountInfo.claimed),
    taps: fromBigNumber(accountInfo.taps),
    lastClaimId: fromBigNumber(accountInfo.lastClaimId)
  };
};

export const filterStats = <ContractInput>(item: ContractInput): Stats => {
  const stats = item as any;
  return {
    totalTaps: fromBigNumber(stats.totalTaps),
    deployTimestamp: stats.deployTimestamp * 1000
  };
};
