import { ethers } from "ethers";
import { erc20ABI } from "wagmi";
import { getRouterAddress } from "./addressHelpers";
import { toReadableAmount } from "./customHelpers";
import lpTokenAbi from "config/abis/lpToken.json";
export function fromReadableAmount(amount, decimals) {
  if (!amount) return 0;
  return ethers.utils.parseUnits(amount.toString(), decimals).toString();
}

export const getValidPair = async (tokenA, tokenB, contract) => {
  try {
    const pair = await contract.getPair(tokenA, tokenB);
    if (pair !== "0x0000000000000000000000000000000000000000") {
      return pair;
    } else {
      return "";
    }
  } catch (e) {
    console.log(e.reason);
  }
};

export const getAllowance = async (
  address,
  token,
  router_address,
  provider
) => {
  if (address && token && provider) {
    try {
      if (token.isTokenOnly) {
        const contract = new ethers.Contract(
          token.lpAddresses,
          erc20ABI,
          provider
        );
        const amount = (
          await contract.allowance(address, router_address)
        ).toString();
        return amount;
      } else {
        const contract = new ethers.Contract(
          token.lpAddresses,
          lpTokenAbi,
          provider
        );
        const amount = (
          await contract.allowance(address, router_address)
        ).toString();
        return amount;
      }
    } catch (e) {
      console.log(e);
      return 0;
    }
  }
};

export const getPrice = async (tokenA, tokenB, amount, where, contract) => {
  const amount_in = fromReadableAmount(amount, tokenA.decimals);
  try {
    const amount_out = await contract.getAmountsOut(amount_in, [
      tokenA?.address,
      tokenB?.address,
    ]);
    return toReadableAmount(amount_out[1], tokenA.decimals);
  } catch (e) {
    console.log(e);
    return "unkown";
  }
};

export const approveHandler = async (token, amount_in, signer) => {
  const router_address = getRouterAddress();
  const amount = fromReadableAmount(amount_in, token.decimals);
  try {
    const token_contract = new ethers.Contract(token.address, erc20ABI, signer);
    await token_contract.approve(router_address, amount);
    return amount;
  } catch (e) {
    console.log(e);
  }
};

export const createPair = async (addressA, addressB, contract) => {
  try {
    const newPair = await contract.createPair(addressA, addressB);
    return newPair;
  } catch (e) {
    console.log(e);
    return false;
  }
};
/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param snowPriceUsd SNOW price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const nFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup.findLast((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol)
    : num;
};
