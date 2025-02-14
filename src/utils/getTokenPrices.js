import { getLpContract } from "./contractHelpers";
import { toReadableAmount } from "./customHelpers";
import httpProvider from "./providerHelpers";
export const getTokenPrice = async (token) => {
  if (token.symbol === "DAI") return 1;
  try {
    const returned = await (
      await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${token.lpAddresses}`
      )
    ).json();

    if (returned && returned.pairs) {
      const correctPair = returned.pairs.filter(
        (pair) => pair.chainId === "pulsechain" && pair.dexId === "pulsex"
      );
      return correctPair[0]?.priceUsd;
    }
  } catch (e) {
    console.log(e);
  }
};
export const getLpTokenPrice = async (token) => {
  try {
    const lpContract = getLpContract(token.lpAddresses, httpProvider);
    const lpBalance = await lpContract.totalSupply();
    const totalSupply = toReadableAmount(lpBalance, 18, 4);
    const returned = await (
      await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${token.lpAddresses}`
      )
    ).json();

    if (returned && returned.pairs) {
      const correctPair = returned.pairs[0];
      const lpPrice = Number(
        Number(correctPair?.marketCap) / Number(totalSupply)
      ).toFixed(5);
      return lpPrice;
    }
  } catch (e) {
    console.log(e);
  }
};
