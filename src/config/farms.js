import tokens from "./tokens";

export const zapList = [
  {
    pid: 0,
    lpSymbol: tokens.snow.symbol,
    symbol: "TEST2",
    isTokenOnly: true,
    lpAddresses: tokens.usdc.address,
    decimals: 18,
    logoA: tokens.snow.logo,
  },
  {
    pid: 0,
    lpSymbol: tokens.pls.symbol,
    symbol: "WPLS",
    isTokenOnly: true,
    lpAddresses: tokens.pls.address,
    decimals: 18,
    logoA: tokens.pls.logo,
  },
  {
    pid: 0,
    lpSymbol: tokens.wpls.symbol,
    symbol: "WPLS",
    isTokenOnly: true,
    lpAddresses: tokens.wpls.address,
    decimals: 18,
    logoA: tokens.wpls.logo,
  },
  {
    pid: 0,
    lpSymbol: tokens.dai.symbol,
    symbol: "DAI",
    isTokenOnly: true,
    lpAddresses: tokens.dai.address,
    decimals: 18,
    logoA: tokens.dai.logo,
  },
  {
    pid: 1,
    lpSymbol: tokens.bill.symbol,
    symbol: "TEST1",
    isTokenOnly: true,
    lpAddresses: tokens.usdc.address,
    decimals: 18,
    logoA: tokens.bill.logo,
  },
];

export default zapList;
