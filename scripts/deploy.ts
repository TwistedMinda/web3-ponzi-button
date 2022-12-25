import { ethers } from 'hardhat';
import { verify } from '../test/utils';
import { VERIFICATION_BLOCK_CONFIRMATIONS } from '../test/networks.config';

async function main() {
  const Game = await ethers.getContractFactory('Game');
  const game = await Game.deploy();
  await game.deployed();
  await game.deployTransaction.wait(VERIFICATION_BLOCK_CONFIRMATIONS);
  await verify(game.address, []);
  console.log(`✅ Game deployed: ${game.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
