![](https://github.com/TwistedMinda/web3-ponzi-button/blob/main/launch.png)

## Hardhat Project

Run tests

```shell
yarn
yarn test
```

## Algorithm

#### Buy

Buy a new Tap

```solidity
function buy() _gameStarted public payable;
```

- User pays 100 FTM
- User receives a "Tap"

#### Get rewards

Get number of rewards currently available for a given user

```solidity
function getRewards(address player) view public;
```

- Calculate rewards for a single tap: `100 FTM / (X - 1)`
- Iterate "X" from last claimed tap until last tap and sum up the results

#### Claim

```solidity
function claim() public;
```

- User claims their available rewards
