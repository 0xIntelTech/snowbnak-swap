// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { getWethAddress } from "./addressHelpers";
import { NATIVE_COIN_SYMBOL } from "config";
const getLiquidityUrlPathParts = ({ quoteTokenAddress, tokenAddress }) => {
  const wPLSAddressString = getWethAddress();
  const quoteTokenAddressString = quoteTokenAddress ? quoteTokenAddress : null;
  const tokenAddressString = tokenAddress ? tokenAddress : null;
  const firstPart =
    !quoteTokenAddressString || quoteTokenAddressString === wPLSAddressString
      ? "wPLS"
      : quoteTokenAddressString;
  const secondPart =
    !tokenAddressString || tokenAddressString === wPLSAddressString
      ? NATIVE_COIN_SYMBOL
      : tokenAddressString;
  return `${firstPart}/${secondPart}`;
};

export default getLiquidityUrlPathParts;
