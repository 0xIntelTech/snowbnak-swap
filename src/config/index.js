import { BIG_TEN } from "utils/bigNumber";
import BigNumber from "bignumber.js";
import { IoBook } from "react-icons/io5";
import { FaDiscord } from "react-icons/fa6";
import { FaGithub, FaYoutube } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

export const BASE_URL = "https://snowbank.io";
export const ALCHEMY_ID = "86wTK178jC4XNO9sh-iVI7P5fV1tg_Dx";

export const CHAIN_ID = 369;
export const TESTNET_CHAIN_ID = 943;

export const TREASURY = "0xF5F3b513b77182D83010dbe49C90EBDfF60e9964";

export const DEFAULT_GAS_LIMIT = 2000000;
export const DEFAULT_GAS_PRICE = 2;
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);
export const NUMBER_OF_FARMS_VISIBLE = 12;
export const snowWethFarmPid = 0;
export const wplsUsdcFarmPid = 1;
export const YEAR = 60 * 60 * 24 * 365;
export const YEAR_BN = new BigNumber(YEAR);

export const NFT_PRICE = 0.3;
export const SALE_PRICE = 60;
export const LAUNCH_PRICE = 70;
export const MAX_PER_USER = 80000;
export const HARD_CAP = 50;
export const SOFT_CAP = 10;
// export const MAX_PER_USER = 300;

export const mainTokenSymbol = "TEST111";
export const NATIVE_COIN_SYMBOL = "PLS";

export const DOCS_URL = "https://snowbank.gitbook.io/snow-bank";

export const BASE_EXCHANGE_URL_BY_CHAIN = {
  56: "https://pancakeswap.finance",
  369: "https://pulsex.mypinata.cloud/ipfs/bafybeift2yakeymqmjmonkzlx2zyc4tty7clkwvg37suffn5bncjx4e6xq/#/", //"https://otter.pulsechain.com",
};

export const BASE_EXCHANGE_URL = BASE_EXCHANGE_URL_BY_CHAIN[CHAIN_ID];

export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/liquidity`;
export const BASE_SWAP_URL = `${BASE_EXCHANGE_URL}/swap`;
export const ARCHIVED_NODE = "https://rpc.pulsechain.com/";

// export const YEAR = 60 * 60 * 24 * 365
// export const YEAR_BN = new BigNumber(YEAR)

export const privateSNOWPrice = 12;
export const BASE_EXPLORER = "https://otter.pulsechain.com/";

export const socials = [
  {
    icon: () => <IoBook />,
    name: "",
    href: "https://snowbank.gitbook.io",
  },
  {
    icon: () => <FaDiscord />,
    name: "",
    href: "https://discord.gg/cxX7dwEfgX",
  },
  {
    icon: () => <FaGithub />,
    name: "",
    href: "#",
  },
  // {
  //   icon: () => <FaYoutube />,
  //   name: "",
  //   href: "https://youtube.com/@lodgecapital",
  // },
  {
    icon: () => <FaTwitter />,
    name: "",
    href: "https://x.com/snowbankio",
  },
  {
    icon: () => <FaTelegramPlane />,
    name: "",
    href: "https://t.me/snowbankio",
  },
];

export const routes = [
  {
    name: "SWAP",
    url: "/",
  },
];