import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { parseEther } from 'ethers/lib/utils';
import { buy, calculateEarnings, claim, deploy, execute } from './utils';

describe('Game', function () {
  it('Calculator', async () => {
    const { game } = await loadFixture(deploy);
    await calculateEarnings(12, 1250, 10000, game);
  });

  it('Security', async () => {
    const { owner, game } = await loadFixture(deploy);
    await expect(
      game.buy({
        from: owner.address,
        value: parseEther('32')
      })
    ).to.be.revertedWith('Game has not started yet');

    await time.increase(await game.startDelay());

    await expect(
      game.buy({
        from: owner.address,
        value: parseEther('32')
      })
    ).to.be.revertedWith('Entry price not respected');
  });

  it('Small Play', async () => {
    const { owner, otherAccount, game } = await loadFixture(deploy);
    await time.increase(await game.startDelay());

    await buy(owner, game);
    await buy(owner, game);
    await buy(otherAccount, game);
    await claim(owner, game);

    await expect(claim(otherAccount, game)).to.be.revertedWith(
      'Nothing to claim'
    );
    await execute([owner, otherAccount], game, async ({ balance }) => {
      expect(balance).equal(0);
    });
  });

  it('Big Play', async () => {
    const { owner, otherAccount, game } = await loadFixture(deploy);
    await time.increase(await game.startDelay());

    await buy(owner, game);
    for (let i = 0; i < 100; ++i) {
      await buy(otherAccount, game);
      await buy(owner, game);
    }

    await claim(owner, game);
    await claim(otherAccount, game);

    await execute([owner, otherAccount], game, async ({ balance }) => {
      expect(balance).equal(0);
    });
  });
});
