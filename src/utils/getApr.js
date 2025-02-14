import BigNumber from "bignumber.js";
import { YEAR_BN } from "config";
import { nFormatter } from "utils";
/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice,
  rewardTokenPrice,
  totalStaked,
  tokenPerBlock
) => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice)
    .times(tokenPerBlock)
    .times(YEAR_BN);
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(
    totalStaked
  );
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100);
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber();
};

export const getFarmApr = (
  poolWeight,
  snowPriceUsd,
  poolLiquidityUsd,
  tokenPerBlock,
  isNFTPool
) => {
  const snowPerYear = YEAR_BN.times(Number(tokenPerBlock));
  const yearlySNOWRewardAllocation = snowPerYear.times(poolWeight);
  const snowRewardsApr = yearlySNOWRewardAllocation
    .times(snowPriceUsd)
    .div(poolLiquidityUsd)
    .times(100);
  if (snowRewardsApr.isNaN() || !snowRewardsApr.isFinite()) {
    return null;
  }
  const combinedApr = snowRewardsApr;
  return nFormatter(combinedApr.toNumber(), 3);
};

export default null;
