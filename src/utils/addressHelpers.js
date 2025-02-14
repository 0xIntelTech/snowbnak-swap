import contractAddresses from "constants/addresses";
import tokens from "config/tokens";

export const getRouterAddress = () => {
  return contractAddresses.router;
};
export const getFactoryAddress = () => {
  return contractAddresses.factory;
};

export const getSNOWAddress = () => {
  return tokens.snow.address;
};
export const getSnowConfigAddress = () => {
  return contractAddresses.snowConfig;
};
export const getMasterChefAddress = () => {
  return contractAddresses.masterChef;
};
export const getWethAddress = () => {
  return tokens.wpls.address;
};
export const getNFTAddress = () => {
  return contractAddresses.nft;
};
export const getZapAddress = () => {
  return contractAddresses.zap;
};
export const getOracleAddress = () => {
  return contractAddresses.oracle;
};
export const getBILLAddress = () => {
  return tokens.bill.address;
};

export const getDAIAddress = () => {
  return contractAddresses.dai;
};
