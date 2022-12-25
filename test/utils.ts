import { Game } from '../typechain-types';
import { ethers, run } from 'hardhat';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

export type Stats = Awaited<ReturnType<Game['stats']>>;
export type PlayerState = Awaited<ReturnType<Game['players']>>;

export type PlayerInfo = {
  address: string;
  player: PlayerState;
  playerBalance: BigNumber;
  playerRewards: BigNumber;
};
export type Info = {
  stats: Stats;
  balance: BigNumber;
  started: boolean;
  players: PlayerInfo[];
};
type GetInfoCallback = (info: Info) => Promise<any> | any;

export const sleep = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));
export const verify = async (address: string, args: any[]) => {
  try {
    await run('verify:verify', {
      address: address,
      constructorArguments: args
    });
    console.log(`✅ ${address} verified`);
  } catch (err) {
    console.warn(err);
  }
};

const safeRun = async (promise: Promise<any>, defaultValue: any = 0) => {
  try {
    return await promise;
  } catch (err: any) {
    if (err.method) console.log('Error on: ', err.method);
    else console.log(err);
  }
  return defaultValue;
};

export const execute = async (
  accounts: SignerWithAddress[],
  game: Game,
  callback?: (info: Info) => Promise<void>,
  log = false
) => {
  await getInfo(accounts, game, async (res) => {
    const { stats, balance, players, started } = res;
    if (log) {
      console.table([
        {
          'Game started': started,
          TVL: showAmount(balance),
          'All Tappers': stats.totalTaps.toNumber(),
          'Last reward (/ tappers)':
            ENTRY_PRICE / (stats.totalTaps - 1) + ' FTM',
          'Dust collected': stats.dustCollected
        }
      ]);
      const table = [];
      for (const p of players) {
        const { address, player, playerRewards } = p;
        table.push({
          Address: address,
          Rewards: showAmount(playerRewards),
          LastClaim: player.lastClaimId.toNumber(),
          Trophies: player.taps.toNumber(),
          Claimed: showAmount(player.claimed)
        });
      }
      console.table(table);
    }
    if (callback) await callback(res);
  });
};

export const getInfo = async (
  accounts: SignerWithAddress[],
  game: Game,
  callback: GetInfoCallback
) => {
  const players: PlayerInfo[] = [];
  for (const account of accounts) {
    players.push({
      address: account.address,
      player: await safeRun(game.players(account.address), {}),
      playerRewards: await safeRun(game.getRewards(account.address)),
      playerBalance: await safeRun(getBalance(game, account.address))
    });
  }

  return await callback({
    stats: await safeRun(game.stats(), {}),
    started: await safeRun(game.hasGameStarted(), false),
    balance: await safeRun(getBalance(game, game.address)),
    players: players
  });
};

export const toEther = (wei: string | BigNumber) => {
  const str = typeof wei === 'string' ? wei : wei.toString();
  return Number(ethers.utils.formatEther(str));
};

export const getBalance = (game: Game, address: string) => {
  return game.provider.getBalance(address);
};

export const showAmount = (value: BigNumber) => {
  return `${toEther(value).toFixed(18)} FTM`;
};

export const buy = async (
  account: SignerWithAddress,
  game: Game,
  log = false
) => {
  const amount = await game.entryPrice();
  if (log) console.log('> Buying...');
  const res = await game.connect(account).buy({
    from: account.address,
    value: amount
  });
  return res;
};
export const claim = async (
  account: SignerWithAddress,
  game: Game,
  log = false
) => {
  if (log) console.log('> Claiming...');
  const res = await game.connect(account).claim();
  return res;
};

type DeployConfig = any;
export const deploy = async (_config?: DeployConfig) => {
  const [owner, otherAccount] = await ethers.getSigners();

  // Initialize contract
  const Game = await ethers.getContractFactory('Game');
  const game = await Game.deploy();

  return { game, owner, otherAccount };
};

export const calculateEarnings = async (
  nbShares: number,
  startAt: number,
  endAt: number,
  game: Game
) => {
  let result = 0;
  let finish = false;
  let count = 0;
  const ENTRY_PRICE = toEther(await game.entryPrice());
  for (let i = startAt + 1; i < endAt; ++i) {
    result += (ENTRY_PRICE / (i - 1)) * nbShares;
    if (!finish && result >= ENTRY_PRICE) {
      finish = true;
      console.log('Need ' + count + ' taps for break-even');
    }
    count += 1;
  }
  console.log('Will earn in total: ' + result.toFixed(6) + ' FTM');
};
