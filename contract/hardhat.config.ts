import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    fantomTestnet: {
      url: process.env.DEV_FANTOM_URL,
      accounts: [process.env.PRIVATE_KEY || ''],
      gas: 2100000,
      gasPrice: 8000000000
    },
    fantom: {
      url: process.env.PROD_FANTOM_URL,
      accounts: [process.env.PRIVATE_KEY || '']
    }
  },
  etherscan: {
    apiKey: {
      opera: process.env.PROD_FANTOM_SCAN_KEY || '',
      ftmTestnet: process.env.DEV_FANTOM_SCAN_KEY || ''
    }
  },
  mocha: {
    timeout: 100000000
  }
};

export default config;
