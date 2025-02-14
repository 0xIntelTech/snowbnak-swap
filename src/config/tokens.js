import addresses from "constants/addresses";
import { NATIVE_COIN_SYMBOL } from "config";

const tokens = {
  pls: {
    symbol: NATIVE_COIN_SYMBOL,
    address: addresses.wpls,
    decimals: 18,
    logo: "/assets/tokens/pls.png",
  },
  snow: {
    symbol: "SNOW",
    address: addresses.snow,
    decimals: 18,
    logo: "/assets/tokens/snow.png",
    projectLink: "https://snowbank.io/", // todo:
  },
  bill: {
    symbol: "BILL",
    address: addresses.bill,
    decimals: 18,
    logo: "/assets/tokens/bill.png",
    projectLink: "https://snowbank.io/", // todo:
  },
  wpls: {
    symbol: "WPLS",
    logo: "/assets/tokens/pls.svg",
    address: addresses.wpls,
    decimals: 18,
  },
  usdc: {
    symbol: "USDC",
    address: addresses.usdc,
    decimals: 6,
    logo: "/assets/tokens/usdc.svg",
  },
  dai: {
    symbol: "DAI",
    address: addresses.dai,
    decimals: 18,
    logo: "/assets/tokens/dai.svg",
  },
  mim: {
    symbol: "MIM",
    address: addresses.mim,
    decimals: 18,
    logo: "/assets/tokens/mim.svg",
  },
  nft: {
    symbol: "SNOW NFT",
    address: addresses.nft,
    decimals: 18,
    logo: "/assets/tokens/nft.png",
  },
};

export default tokens;
